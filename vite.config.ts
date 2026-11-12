import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// GitHub Pages project sites are served from /<repo>/, user/org sites from /.
// Set VITE_BASE_PATH="/" for a custom domain or a github.io user site.
const base = process.env.VITE_BASE_PATH ?? '/'

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return
          if (id.includes('framer-motion') || id.includes('motion-dom') || id.includes('motion-utils'))
            return 'motion'
          if (id.includes('animejs')) return 'anime'
          if (id.includes('react-dom') || id.includes('/react/') || id.includes('scheduler'))
            return 'react'
          return 'vendor'
        },
      },
    },
  },
  server: {
    host: true,
    port: 5173,
  },
})
