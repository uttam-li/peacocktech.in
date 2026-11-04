# PERF_REPORT — Peacock Technotrics launch program

Runner: `scripts/perf-check.mjs` (playwright-core + system Chrome), prod `dist/` via `vite preview`.
Method: fresh profile per page, CDP throttle, FCP from paint entries, usable = first content-rich paint of `#root main`.

## BEFORE (2026-10-30, build pre-Phase-1)

| Profile | Page | FCP | Usable | Reqs | KB | Errors |
|---|---|---|---|---|---|---|
| fast-4g | / | 596ms | ~0.6s | 15 | 385 | 0 |
| fast-4g | /about.html | 516ms | ~0.5s | 12 | 214 | 0 |
| fast-4g | /contact.html | 328ms | ~0.4s | 12 | 318 | 0 |
| fast-4g | /ai-intelligent.html | 388ms | ~0.4s | 13 | 332 | 0 |
| slow-4g | / | 1460ms | ~1.5s | 8 | 189 | 0 |
| slow-4g | /about.html | 1464ms | ~1.5s | 11 | 194 | 0 |
| slow-4g | /contact.html | 1364ms | ~1.4s | 12 | 203 | 0 |
| slow-4g | /ai-intelligent.html | 1484ms | ~1.5s | 12 | 197 | 0 |
| slow-3g | / | 5076ms | ~5.1s | 8 | 189 | 0 |
| slow-3g | /about.html | 5108ms | ~5.2s | 8 | 194 | 0 |
| slow-3g | /contact.html | 4764ms | ~4.8s | 7 | 184 | 0 |
| slow-3g | /ai-intelligent.html | 5240ms | ~5.3s | 9 | 197 | 0 |

Budgets: fast-4g LCP<1.8s OK-ish (measure in P9) · slow-4g FCP<2.0s PASS · slow-3g text<4s FAIL (~5s), usable<8s PASS ·
offline-after-first-visit: SW present, verify in P4/P9 · critical JS gzip/page ~90KB PASS (<=100) ·
first-paint weight no-video: ~190KB PASS (<=400).

## AFTER (Phase 1 SSG + vendor split, 2026-10-30)

SSG: every page ships real markup (`node scripts/prerender.mjs`, hydration verified zero-error on all 4 pages). No-JS shows full content + h1 (about h1 missing — Phase 5).
Vendor split: `vendor-*.js` 219KB raw / 67KB gzip / 58KB brotli (react+react-dom+scheduler, long-cached). Per-page entry 11–38KB raw.
Lazy below-fold: REVERTED — IO-gated render breaks SSG hydration (empty placeholder vs prerendered content = structural mismatch); eager render kept, code stays split via vendor. Retry UI deferred to P3 error boundary.

| Profile | Page | FCP | Usable | Reqs | KB | Errors |
|---|---|---|---|---|---|---|
| slow-3g | / | 2632ms | ~2.6s | — | — | 0 |
| slow-3g | /about.html | 2412ms | ~2.4s | — | — | 0 |
| slow-3g | /contact.html | 2296ms | ~2.3s | — | — | 0 |
| slow-4g | / | 1000ms | ~1.0s | — | — | 0 |
| slow-4g | /about.html | 952ms | ~1.0s | — | — | 0 |
| slow-4g | /contact.html | 852ms | ~0.9s | — | — | 0 |

Budgets: slow-3g text<4s PASS (was ~5s FAIL) · usable<8s PASS · slow-4g FCP<2.0s PASS · critical JS gzip/page ~90KB PASS (vendor 67 + entry ~12) · first-paint no-video ~190KB PASS.
Top offenders: vendor react bundle 219KB raw (unavoidable, cached) · videos 283+312KB H264 (WebM 146+163KB first now) · Noto woff2 180KB total (unicode-range, gu/hi only).
Critical-CSS inline: SKIPPED with reason — shared client.css is render-blocking, 58KB raw / 11KB gzip, cached across pages; critters inlined 37KB+ per page (budget ≤14KB impossible), duplicated bytes per page, and emitted a non-swapping `media=print` link. SSG alone beat the FCP budget.

## AFTER Phase 2 (media + network respect, 2026-10-30)

- `src/lib/network.ts`: single `isSlowNetwork()/isSaveData()/isFastNetwork()/effectiveType()`; Intro + useReveal read from it.
- Fonts: metric-matched fallbacks (Inter-fb 96.88/24.22, Bricolage-fb 93/27, Cascadia-fb 92.77/23.44 — measured via fontkit) in stacks; gu/hi already unicode-range-gated (zero download on English pages).
- Images: AVIF first (cards 6–15KB vs PNG 30–395KB; posters 5–11KB), WebP q72 second, PNG fallback. srcset skipped with reason (sources max 480px; larger variants would be upscale waste).
- Video: WebM VP9 720p first (146+163KB, both ≤180KB) + H264 1080p fallback; AVIF posters; gate = saveData skip, reduced-motion skip, hidden-tab skip, play after `load` (4s cap), 3s stall guard (owner decision).
- useReveal: slow network / reduced motion fires at first pixel + 400px margin.
- FCP re-measured: slow-3g ~2.4–2.6s, slow-4g ~1s. Hydration still zero-error 4/4.

## AFTER Phase 4 (service worker rewrite, 2026-10-30)

- Version = `pt-<gitsha>-<timestamp>` generated per build; old caches purged on activate.
- Precache (24 entries): 4 HTML + all JS/CSS chunks + 2 latin fonts + favicon + logo + og-cover + offline.html. No videos/images.
- Strategies: navigations network-first 3.5s → cache → offline.html; /bundle/* cache-first; images stale-while-revalidate (max 60); Range/206 never cached; cross-origin untouched.
- Update: no forced reload; toast (Refresh → SKIP_WAITING → reload on controllerchange).
- Register: single `registerSw()` from 4 mains, after load, silent fail, localhost+https only.
- Tests: offline all 4 pages + offline.html serve from cache with styles; second deploy shows toast, old caches deleted, content intact.

## FINAL numbers (2026-10-30, prod build, all pages, 0 errors everywhere)

| Profile | / | /about | /contact | /ai | Budget | Result |
|---|---|---|---|---|---|---|
| fast-4g FCP | 376ms | 368ms | 296ms | 352ms | LCP < 1.8s | PASS |
| slow-4g FCP | 992ms | 924ms | 836ms | 960ms | FCP < 2.0s, LCP < 3.0s | PASS |
| slow-3g FCP | 2828ms | 2760ms | 2536ms | 2788ms | text < 4s, usable < 8s | PASS |
| slow-3g KB | 290 | 246 | 236 | 249 | first paint < 400KB | PASS |
| JS gzip/page | ~90KB | ~89KB | ~83KB | ~88KB | <= 100KB | PASS |

Journey: BEFORE slow-3g ~5.1s blank → AFTER ~2.7s real content. Proof suite: 40/40 PASS.

## Phase 9 pre-hosting proof (2026-10-30, `scripts/proof-local.mjs`)

ALL PASS 40 checks: dist hygiene (no localhost, h1 ×1, canonical, OG, JSON-LD, sitemap 4 urls, versioned SW), hydration 4/4 zero-error, form blocks bad email, gu flips with no tofu, mobile 390px no-overflow + 49px targets.

## Re-verify (2026-11-04, after a11y phases 1–4)

Benchmark re-run twice (8 pages × 3 profiles): 24/24 rows, 0 errors both runs. fast-4g max 380ms, slow-4g max 1144ms, slow-3g 2652–2932ms — all within budget, stable ±100ms across runs.
Heavy traffic: 24 parallel visitors × 2 rounds (mixed en/gu/hi, mobile viewport) — 24/24 H1 ok, 0 failures.

## AFTER font-inline fix (2026-11-04, 8-page benchmark, prod `dist/` via preview)

Bug: `src/styles/mobile-app.css` + `ux-design.css` carried inlined base64 woff2 `@font-face` (~150KB each, gzip-proof). Page CSS was 168/172KB raw, 121/122KB gzip; slow-3G FCP ~8s FAIL, slow-4g ~2.1s FAIL.
Fix: removed inlined blocks (fonts already load properly via `index.css` woff2 files). Page CSS now 13/16KB raw, 3/4KB gzip. No visual change (hero screenshots identical).

| Profile | / | /about | /ai | /erp | /contact | /mobile-app | /ux-design | /404 | Budget | Result |
|---|---|---|---|---|---|---|---|---|---|---|
| fast-4g FCP | 636ms | 352ms | 348ms | 332ms | 304ms | 724ms | 464ms | 292ms | LCP < 1.8s | PASS |
| slow-4g FCP | 996ms | 1112ms | 960ms | 896ms | 888ms | 992ms | 952ms | 864ms | FCP < 2.0s | PASS |
| slow-3g FCP | 2912ms | 2792ms | 2840ms | 2788ms | 2712ms | 2792ms | 2764ms | 2524ms | text < 4s | PASS |
| slow-3g KB | 293 | 248 | 273 | 243 | 240 | 247 | 247 | 214 | < 400KB | PASS |

JS gzip/page ~90KB (vendor 65 + entry 4–12). Errors 0/24. Note: localhost preview has no brotli; live host with brotli will be ~1/3 faster (see DEPLOY.md).
