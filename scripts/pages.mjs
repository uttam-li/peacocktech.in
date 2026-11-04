import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Single source of truth for build scripts (reads pages.config.json).
 * Add a service slug there once; prerender + SW precache + sitemap
 * all follow automatically.
 */
const root = path.dirname(fileURLToPath(import.meta.url))
const config = JSON.parse(fs.readFileSync(path.join(root, '..', 'pages.config.json'), 'utf8'))

/** Clean-URL slugs, e.g. ['/', '/about', '/ai', ...] */
export const SLUGS = config.pages
/** 404 slug (kept out of nav/prefetch/sitemap, still prerendered + precached). */
export const NOTFOUND = config.notfound
/** Prerender URLs, e.g. ['/', '/about.html', ...] */
export const HTML_PAGES = [...SLUGS.map((s) => (s === '/' ? '/' : `${s}.html`)), `${NOTFOUND}.html`]
/** SW precache HTML entries, relative form. */
export const PRECACHE_HTML = SLUGS.map((s) => (s === '/' ? './' : `.${s}.html`)).concat([
  './index.html',
  `.${NOTFOUND}.html`,
])
/** Sitemap slugs (404 excluded). */
export const SITEMAP_SLUGS = SLUGS
