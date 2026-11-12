/**
 * Resolve a file from `public/` against the deployment base path.
 *
 * Vite rewrites bundled asset URLs automatically, but anything referenced
 * from JavaScript (or from an absolute path) needs the base prefix —
 * on GitHub Pages a project site is served from /<repo>/, not /.
 */
const BASE = import.meta.env.BASE_URL || '/'

export function asset(path: string): string {
  const clean = path.replace(/^\/+/, '')
  return `${BASE}${clean}`
}
