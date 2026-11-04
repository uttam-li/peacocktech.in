import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import pagesConfig from './pages.config.json'

const rootDir = import.meta.dirname

/** All clean-URL slugs minus '/' (which serves index.html directly). */
const slugs: string[] = (pagesConfig.pages as string[]).filter((s) => s !== '/')
const toKey = (slug: string): string =>
  slug.replace(/^\//, '').split('-').map((w, i) => (i === 0 ? w : w[0].toUpperCase() + w.slice(1))).join('')

/** Clean URLs in dev and preview: /about serves about.html, no .html in the bar. */
function cleanUrls(): import('vite').Plugin {
  const map: Record<string, string> = Object.fromEntries(slugs.map((s) => [s, `${s}.html`]))
  map['/404'] = '/404.html'
  const rewrite = (req: { url?: string }): void => {
    if (!req.url) return
    const q = req.url.indexOf('?')
    const path = q < 0 ? req.url : req.url.slice(0, q)
    const rest = q < 0 ? '' : req.url.slice(q)
    if (map[path]) req.url = map[path] + rest
  }
  return {
    name: 'clean-urls',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        rewrite(req)
        next()
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        rewrite(req)
        next()
      })
    },
  }
}

/**
 * Single-page React app. `index.html` is only the Vite shell: metadata, a
 * boot fallback, and the React mount point. All page design and behaviour
 * live in `src/`.
 *
 * Path aliases mirror `tsconfig.json#compilerOptions.paths` so imports stay
 * short and refactor-safe (`@/components/...`).
 */
export default defineConfig({
  // Relative assets keep the build portable at the domain root or under a
  // folder such as /peacock-tech/.
  base: './',
  plugins: [react(), tailwindcss(), cleanUrls()],
  resolve: {
    alias: {
      '@': path.resolve(rootDir, 'src'),
      '@components': path.resolve(rootDir, 'src/components'),
      '@sections': path.resolve(rootDir, 'src/components/sections'),
      '@layout': path.resolve(rootDir, 'src/components/layout'),
      '@ui': path.resolve(rootDir, 'src/components/ui'),
      '@hooks': path.resolve(rootDir, 'src/hooks'),
      '@lib': path.resolve(rootDir, 'src/lib'),
      '@data': path.resolve(rootDir, 'src/data'),
      '@styles': path.resolve(rootDir, 'src/styles'),
      '@constants': path.resolve(rootDir, 'src/constants'),
    },
  },
  server: {
    port: 5173,
    open: false,
  },
  build: {
    assetsDir: 'bundle',
    rollupOptions: {
      input: Object.fromEntries([
        ['main', path.resolve(rootDir, 'index.html')],
        ...slugs.map((s): [string, string] => [toKey(s), path.resolve(rootDir, `${s.slice(1)}.html`)]),
        ['notfound', path.resolve(rootDir, '404.html')],
      ]),
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom/') || id.includes('node_modules/react/') || id.includes('node_modules/scheduler/')) return 'vendor'
        },
      },
    },
  },
})
