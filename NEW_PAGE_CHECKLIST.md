# NEW PAGE CHECKLIST — har naya service page 3 step me

> Registry: `pages.config.json` single source hai — vite entries + clean URLs +
> prerender + SW + sitemap + prefetch lists sab usi se bante hain.
> Home tabs + Services dropdown `site.ts` ke `services.items` se bante hain (+GenericVisual fallback).

## 0. Scaffold (1 command)
- [ ] `bun run add:service -- --slug=<url-slug> --id=<service-id> --title="<English title>"` chalao
- [ ] Ye banata hai: `<slug>.html` shell, `src/pages/<slug>/{main,App,<Pascal>Page}.tsx`, `src/styles/<slug>.css`, registry entry, `services.items` entry
- [ ] Baad me: gu/hi translate karo (`site.ts` + `<slug>.html` dict), starter content ko real page se replace karo, phir `bun run ssg`
- [ ] Manual page (scaffolder ke bina): slug ko `pages.config.json` me dalo + `services.items` me item jodo — baaki (prefetch/nav/prerender/SW/sitemap) automatic

## 1. Theme (5 pages jaisa, zero mistake)
- [ ] Colors: sirf site tokens (`--paper`, `--ink`, `--lime`, `--muted`…) — koi naya hex nahi
- [ ] Fonts: `--font-serif` headings / `--font-sans` body / `--font-mono` labels — site lock size (H1 site-H1, lede 18.4px/1.55 muted, hero-sub 18.4/1.5 bright)
- [ ] Titles/subtitles/cards/buttons/hover-colours: existing pages se match
- [ ] Section gap: top-level sections `80px` top/bottom = **160px** har junction (mobile समेत)
- [ ] Cards + hover: same border/bg/hover-colour/shadow pattern
- [ ] **Hover colour LOCK (site theme only):** hover/active accent sirf `green-deep`/`gd` (`#3fd488`) — kabhi lime ya koi naya colour hover pe mat lagana (static accent lime allowed: H1/H2 `em`, labels). Nav underline: hover + active dono green. Button hover: green-deep bg + forest text. Card/tile hover: green-deep border + lift.
- [ ] Styling: Tailwind utilities first — global CSS me dump nahi; per-page CSS sirf jahan utility se na ho

## 2. i18n (EN/HI/GU)
- [ ] Sara text `T(en, gu, hi)` se — render-time (module scope me nahi)
- [ ] `lang`/`hreflang`, HI/GU switch + reload test

## 3. Hosting + slow network (bina bole, har page me)
- [ ] `useSmartPrefetch([...])` page me + is page ko baki pages ki lists me add
- [ ] Shell `<page>.html` (meta/OG/hreflang/fonts) + `vite.config.ts` clean-URL map + entry
- [ ] `scripts/prerender.mjs` list + `generate-sw.mjs` precache + `generate-sitemap.mjs`
- [ ] Nav dropdown + home link (jahan relevant)

## 4. Hydration safety (React #418 dobara nahi)
- [ ] `0{i+1}` jaisa split-text nahi — single expression `{`0${i+1}`}`
- [ ] Render me `typeof window`/`Date.now()`/random nahi; imported asset URL pe `suppressHydrationWarning` jahan zarurat
- [ ] `bun run ssg` ke baad: 5-second console check — **zero pageerror**

## 5. Ship
- [ ] `bun run ssg` fresh + all 6 pages clean + slow-3G sanity + mobile 390px gap check
