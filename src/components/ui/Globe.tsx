import { useEffect, useRef, useState } from 'react'
import { asset } from '@/lib/assets'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

const TEXTURE = asset('/earth/blue-marble.jpg')

/** The same view ATLAS Earth opens on: India front and centre. */
const INITIAL_YAW = Math.PI + 0.17
const INITIAL_PITCH = -0.314
const FOV = (42 * Math.PI) / 180
const CAMERA_DISTANCE = 3.05
const WARANGAL = { lat: 17.97, lon: 79.59 }
const LON_SEGMENTS = 96
const LAT_SEGMENTS = 64

const VERTEX_SHADER = `
attribute vec3 aPos;
attribute vec2 aUv;
uniform mat4 uMvp;
uniform mat3 uRot;
varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vec3 rp = uRot * aPos;
  vUv = aUv;
  vNormal = normalize(rp);
  gl_Position = uMvp * vec4(rp, 1.0);
}
`

const FRAGMENT_SHADER = `
precision highp float;
uniform sampler2D uTex;
uniform float uTexReady;
varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vec3 n = normalize(vNormal);
  vec3 tex = texture2D(uTex, vUv).rgb;
  vec3 base = mix(vec3(0.055, 0.075, 0.12), tex, uTexReady);
  float diff = clamp(dot(n, normalize(vec3(-0.45, 0.4, 0.8))), 0.0, 1.0);
  vec3 col = base * (0.35 + 0.9 * diff);
  float rim = pow(1.0 - clamp(n.z, 0.0, 1.0), 2.2);
  col += vec3(0.16, 0.42, 0.72) * rim * 0.45;
  gl_FragColor = vec4(col, 1.0);
}
`

function perspective(fovY: number, aspect: number, near: number, far: number) {
  const f = 1 / Math.tan(fovY / 2)
  const nf = 1 / (near - far)
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) * nf, -1,
    0, 0, 2 * far * near * nf, 0,
  ])
}

function rotationX(a: number) {
  const c = Math.cos(a)
  const s = Math.sin(a)
  return new Float32Array([
    1, 0, 0, 0,
    0, c, s, 0,
    0, -s, c, 0,
    0, 0, 0, 1,
  ])
}

function rotationY(a: number) {
  const c = Math.cos(a)
  const s = Math.sin(a)
  return new Float32Array([
    c, 0, -s, 0,
    0, 1, 0, 0,
    s, 0, c, 0,
    0, 0, 0, 1,
  ])
}

function translationZ(z: number) {
  return new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, z, 1,
  ])
}

function multiply(a: Float32Array, b: Float32Array) {
  const out = new Float32Array(16)
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      out[col * 4 + row] =
        a[row] * b[col * 4] +
        a[4 + row] * b[col * 4 + 1] +
        a[8 + row] * b[col * 4 + 2] +
        a[12 + row] * b[col * 4 + 3]
    }
  }
  return out
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

function latLonToVec3(lat: number, lon: number): [number, number, number] {
  const u = (lon + 180) / 360
  const phi = u * Math.PI * 2
  const theta = ((90 - lat) * Math.PI) / 180
  const sinTheta = Math.sin(theta)
  return [-Math.cos(phi) * sinTheta, Math.cos(theta), Math.sin(phi) * sinTheta]
}

function rotatePoint(
  [x, y, z]: [number, number, number],
  yaw: number,
  pitch: number
): [number, number, number] {
  const cp = Math.cos(pitch)
  const sp = Math.sin(pitch)
  const y1 = cp * y - sp * z
  const z1 = sp * y + cp * z
  const cy = Math.cos(yaw)
  const sy = Math.sin(yaw)
  return [cy * x + sy * z1, y1, -sy * x + cy * z1]
}

type Props = {
  className?: string
}

/**
 * Lightweight WebGL globe textured with NASA Blue Marble — the same imagery
 * ATLAS Earth uses on its Globe tab. Drag to turn, auto-spins when idle.
 * No three.js, no network calls after the texture loads.
 */
export function Globe({ className = '' }: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const markerRef = useRef<HTMLDivElement>(null)
  const resetRef = useRef<() => void>(() => {})
  const reduced = usePrefersReducedMotion()
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const host = hostRef.current
    const canvas = canvasRef.current
    if (!host || !canvas) return

    let gl: WebGLRenderingContext | null = null
    try {
      gl = canvas.getContext('webgl', {
        alpha: true,
        antialias: true,
        depth: true,
        powerPreference: 'low-power',
      })
    } catch {
      gl = null
    }
    if (!gl) {
      setFailed(true)
      return
    }

    const compile = (type: number, source: string) => {
      const shader = gl!.createShader(type)
      if (!shader) throw new Error('shader')
      gl!.shaderSource(shader, source)
      gl!.compileShader(shader)
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        throw new Error(gl!.getShaderInfoLog(shader) ?? 'shader compile failed')
      }
      return shader
    }

    let program: WebGLProgram
    try {
      const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER)
      const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
      program = gl.createProgram() as WebGLProgram
      gl.attachShader(program, vs)
      gl.attachShader(program, fs)
      gl.linkProgram(program)
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) ?? 'link failed')
      }
    } catch (error) {
      console.warn('Globe: shader setup failed', error)
      setFailed(true)
      return
    }

    gl.useProgram(program)

    // Sphere geometry: equirectangular UVs, north pole at v = 1.
    const positions: number[] = []
    const uvs: number[] = []
    const indices: number[] = []
    for (let iy = 0; iy <= LAT_SEGMENTS; iy++) {
      const v = iy / LAT_SEGMENTS
      const theta = v * Math.PI
      const sinTheta = Math.sin(theta)
      const cosTheta = Math.cos(theta)
      for (let ix = 0; ix <= LON_SEGMENTS; ix++) {
        const u = ix / LON_SEGMENTS
        const phi = u * Math.PI * 2
        positions.push(-Math.cos(phi) * sinTheta, cosTheta, Math.sin(phi) * sinTheta)
        uvs.push(u, 1 - v)
      }
    }
    for (let iy = 0; iy < LAT_SEGMENTS; iy++) {
      for (let ix = 0; ix < LON_SEGMENTS; ix++) {
        const a = iy * (LON_SEGMENTS + 1) + ix
        const b = a + 1
        const c = a + LON_SEGMENTS + 1
        const d = c + 1
        indices.push(a, c, b, b, c, d)
      }
    }

    const posBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
    const uvBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW)
    const indexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)

    const aPos = gl.getAttribLocation(program, 'aPos')
    const aUv = gl.getAttribLocation(program, 'aUv')
    const uMvp = gl.getUniformLocation(program, 'uMvp')
    const uRot = gl.getUniformLocation(program, 'uRot')
    const uTex = gl.getUniformLocation(program, 'uTex')
    const uTexReady = gl.getUniformLocation(program, 'uTexReady')

    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0)
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer)
    gl.enableVertexAttribArray(aUv)
    gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 0, 0)

    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([8, 14, 28, 255])
    )
    gl.activeTexture(gl.TEXTURE0)
    gl.uniform1i(uTex, 0)

    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)
    gl.enable(gl.CULL_FACE)
    gl.cullFace(gl.BACK)
    gl.frontFace(gl.CCW)
    gl.clearColor(0, 0, 0, 0)

    let textureReady = 0
    let drawing = false
    let yaw = INITIAL_YAW
    let pitch = INITIAL_PITCH
    let dragging = false
    let pointerId = -1
    let lastPointerX = 0
    let lastPointerY = 0
    let lastInteraction = performance.now()
    let width = 1
    let height = 1
    let aspect = 1
    let raf = 0
    let visible = true

    const image = new Image()
    image.decoding = 'async'
    image.onload = () => {
      gl.useProgram(program)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.generateMipmap(gl.TEXTURE_2D)
      textureReady = 1
      draw()
    }
    image.src = TEXTURE

    const markerVector = latLonToVec3(WARANGAL.lat, WARANGAL.lon)

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = Math.max(1, host.clientWidth)
      height = Math.max(1, host.clientHeight)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      gl.viewport(0, 0, canvas.width, canvas.height)
      aspect = width / height
    }

    const updateMarker = () => {
      const marker = markerRef.current
      if (!marker) return
      const [x, y, z] = rotatePoint(markerVector, yaw, pitch)
      const w = CAMERA_DISTANCE - z
      const f = 1 / Math.tan(FOV / 2)
      const ndcX = (x * f) / aspect / w
      const ndcY = (y * f) / w
      const px = (ndcX * 0.5 + 0.5) * width
      const py = (1 - (ndcY * 0.5 + 0.5)) * height
      const front = z > 0.04 && w > 0
      marker.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0)`
      marker.style.opacity = front ? '1' : '0'
    }

    const draw = () => {
      if (!gl || drawing) return
      drawing = true

      const rot = multiply(rotationY(yaw), rotationX(pitch))
      const proj = perspective(FOV, aspect, 0.1, 100)
      const view = translationZ(-CAMERA_DISTANCE)
      const mvp = multiply(proj, view)

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
      gl.useProgram(program)
      gl.uniformMatrix4fv(uMvp, false, mvp)
      gl.uniformMatrix3fv(
        uRot,
        false,
        new Float32Array([
          rot[0], rot[1], rot[2],
          rot[4], rot[5], rot[6],
          rot[8], rot[9], rot[10],
        ])
      )
      gl.uniform1f(uTexReady, textureReady)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0)

      updateMarker()
      drawing = false
    }

    let last = performance.now()
    const frame = (now: number) => {
      raf = 0
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (!dragging && !reduced && now - lastInteraction > 1600) {
        yaw += dt * 0.07
      }
      draw()
      if (visible) raf = requestAnimationFrame(frame)
    }

    const start = () => {
      if (!raf && visible) {
        last = performance.now()
        raf = requestAnimationFrame(frame)
      }
    }

    const onResize = () => {
      resize()
      draw()
    }

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return
      dragging = true
      pointerId = event.pointerId
      lastPointerX = event.clientX
      lastPointerY = event.clientY
      lastInteraction = performance.now()
      canvas.setPointerCapture(event.pointerId)
      canvas.style.cursor = 'grabbing'
      event.preventDefault()
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging || event.pointerId !== pointerId) return
      yaw += (event.clientX - lastPointerX) * 0.0065
      pitch = clamp(pitch + (event.clientY - lastPointerY) * 0.005, -1.1, 1.1)
      lastPointerX = event.clientX
      lastPointerY = event.clientY
      lastInteraction = performance.now()
    }

    const onPointerUp = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return
      dragging = false
      pointerId = -1
      lastInteraction = performance.now()
      canvas.style.cursor = 'grab'
      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId)
      }
    }

    const reset = () => {
      yaw = INITIAL_YAW
      pitch = INITIAL_PITCH
      lastInteraction = performance.now()
    }
    resetRef.current = reset

    resize()
    draw()
    start()

    const resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(host)

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) start()
        else if (raf) {
          cancelAnimationFrame(raf)
          raf = 0
        }
      },
      { threshold: 0.05 }
    )
    intersectionObserver.observe(host)

    const onVisibility = () => {
      visible = document.visibilityState === 'visible'
      if (visible) start()
      else if (raf) {
        cancelAnimationFrame(raf)
        raf = 0
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('pointercancel', onPointerUp)

    return () => {
      if (raf) cancelAnimationFrame(raf)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointercancel', onPointerUp)
      gl.deleteTexture(texture)
      gl.deleteBuffer(posBuffer)
      gl.deleteBuffer(uvBuffer)
      gl.deleteBuffer(indexBuffer)
      gl.deleteProgram(program)
      image.onload = null
    }
  }, [reduced])

  return (
    <div
      ref={hostRef}
      role="group"
      aria-label="Interactive 3D globe of Earth with NASA Blue Marble imagery"
      className={`relative h-full w-full overflow-hidden bg-[#05070f] ${className}`}
    >
      {/* starfield */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'radial-gradient(1px 1px at 22px 34px, #fff, transparent), radial-gradient(1px 1px at 92px 118px, rgba(255,255,255,.8), transparent), radial-gradient(1.5px 1.5px at 148px 58px, #bfe3ff, transparent), radial-gradient(1px 1px at 58px 168px, rgba(255,255,255,.65), transparent), radial-gradient(1px 1px at 190px 146px, rgba(255,255,255,.7), transparent)',
          backgroundSize: '210px 210px, 230px 230px, 260px 260px, 200px 200px, 280px 280px',
        }}
      />
      {/* atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[7%] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.24),rgba(37,99,235,0.12)_55%,transparent_72%)] blur-2xl"
      />

      {failed ? (
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <div className="mx-auto h-40 w-40 rounded-full bg-[radial-gradient(circle_at_35%_30%,#3b82f6_0%,#0b1b3a_45%,#02040a_75%)] shadow-[0_0_60px_rgba(56,189,248,0.25)]" />
            <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.24em] text-white/50">
              WebGL unavailable
            </p>
          </div>
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          aria-hidden
          className="absolute inset-0 h-full w-full cursor-grab touch-none active:cursor-grabbing"
        />
      )}

      {/* Warangal marker */}
      <div
        ref={markerRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-0 w-0 opacity-0 transition-opacity duration-300 will-change-transform"
      >
        <span className="absolute -left-1 -top-1 flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ffd400] opacity-70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ffd400] shadow-[0_0_10px_#ffd400]" />
        </span>
        <span className="absolute left-0 top-2.5 -translate-x-1/2 whitespace-nowrap border border-[#ffd400]/50 bg-black/70 px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-[0.16em] text-[#ffd400] backdrop-blur-sm sm:text-[8px]">
          Warangal
        </span>
      </div>

      {!failed && (
        <button
          type="button"
          onClick={() => resetRef.current()}
          aria-label="Reset globe rotation"
          className="absolute right-2.5 top-2.5 z-10 inline-flex min-h-10 min-w-10 items-center justify-center border border-white/20 bg-black/40 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-white/60 backdrop-blur-sm transition-colors hover:border-[#ffd400]/60 hover:text-[#ffd400]"
        >
          Reset ↺
        </button>
      )}
    </div>
  )
}
