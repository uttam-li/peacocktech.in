import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITEMAP_SLUGS } from './pages.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(root, '..', 'dist');
const SITE = 'https://peacocktech.in';
const PAGES = SITEMAP_SLUGS;
const today = new Date().toISOString().slice(0, 10);
const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  PAGES.map((p) => `  <url><loc>${SITE}${p === '/' ? '/' : p}</loc><lastmod>${today}</lastmod></url>`).join('\n') +
  '\n</urlset>\n';
fs.writeFileSync(path.join(dist, 'sitemap.xml'), xml);
console.log('sitemap', PAGES.length, 'urls');
