# DEPLOY — Peacock Technotrics

## Build

- Command: `bun run ssg` (build → sw → prerender → sw → sitemap)
  (or `bun run ssg` — same chain; `generate-sw` runs twice: before prerender so the
  worker file exists, and after so it carries the final precache list)
- Output dir: `dist/` (static, no server needed)
- Requires: Bun (see `bun.lock`). No env vars required (see `.env.example`).

## Publish

- Upload the **`dist/` folder** as-is to any static host (Netlify Drop, Cloudflare Pages, Vercel, cPanel `public_html`, nginx root).
- Previews: `bun run preview --port 4173` serves `dist/` locally.

## Clean URLs + 404 (host-side, mandatory)

`dist/` has one `.html` per slug in `pages.config.json` — URLs must stay clean
(`/about`, never `/about.html`). New service pages add their own slug file;
repeat the same rewrite pattern for it. Add rewrites on the host:

- **nginx:** `rewrite ^/about/?$ /about.html last;` (same for `/ai`, `/mobile-app`, `/ux-design`,
  `/contact`), plus `error_page 404 /404.html;`
- **Netlify:** `_redirects` with `/about /about.html 200` (same for
  `/ai`, `/contact`) + `/404 /404.html 404`
- **Vercel:** `vercel.json` rewrites `/about → /about.html` (same for
  `/ai`, `/contact`)

## Compression + caching (host-side, biggest slow-network win)

JS is ~476KB raw (React vendor 214KB, shared + cached across pages).
Brotli shrinks it to ~1/3 — slow 3G goes from ~10s to ~3s.

- **nginx:**
  ```nginx
  gzip on;
  gzip_types text/css application/javascript application/json image/svg+xml;
  # brotli (ngx_brotli): on; brotli_types same list;
  location ~* \.(js|css|woff2)$ { expires 1y; add_header Cache-Control "public, immutable"; }
  location ~* \.(html)$ { expires 1h; add_header Cache-Control "public, must-revalidate"; }
  ```
- **Netlify / Vercel / Cloudflare Pages:** brotli+gzip + immutable caching are automatic — nothing to do.
- **cPanel:** "Optimize Website" → Compress All Content.

## Before each release

1. `bun run typecheck` — must pass (unused locals/params fail the build on purpose).
2. `bun run launch-check` — build + serve + perf across 4 profiles; red means stop.
3. `bun audit` — zero high/critical.
4. Check `PERF_REPORT.md` AFTER table still within budget.

## Rollback

- Every release is a git commit (`git log --oneline`). Roll back with:
  `git checkout <last-good-sha> -- . && <build+upload again>`
- Service worker: old caches are named `pt-<sha>-<ts>` and purged automatically on activate.
- Host cache purge: Netlify/Cloudflare/Vercel dashboard → Purge cache (path: `/*`).

## Launch-time only (needs live domain)

- Replace `peacocktech.in` (marked TODO_DEPLOY_DOMAIN in `robots.txt`, `sitemap.xml` generator, HTML heads, JSON-LD, `manifest.webmanifest`).
- Enable HTTPS, HTTP→HTTPS redirect, one canonical host.
- Add security headers + compression/cache rules for the chosen host (Phase 8 file).
- Search Console + Bing submit sitemap; request indexing.
- UptimeRobot monitor on `/health` alerting to support@peacocktech.in.
