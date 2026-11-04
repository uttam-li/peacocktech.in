# Peacock Technotrics — studio site

Multi-page studio site for **Peacock Technotrics**, a software studio in
Surat, Gujarat, India. Built with **React + Vite + Tailwind CSS**.
Pages: `/`, `/about`, `/ai`, `/erp`, `/contact`, `/mobile-app`, `/ux-design`, `/404`
(one shell HTML + React entry per page, see `pages.config.json`).

> Empowering businesses through technology and innovation.

## Run it

```bash
cd /path/to/peacock-technotrics
bun install
bun run dev        # HMR on http://127.0.0.1:5173/
```

Production build + local preview (`dist/` on http://localhost:4173/):

```bash
bun run ssg        # typecheck + build + SW + prerender + sitemap
bun run typecheck
bun run preview
```

`index.html` (plus `about.html`, `ai.html`, …) are the Vite entries. Site structure,
content, and behaviour live in `src/`. Single source of truth: `src/data/site.ts`
(content/nav) and `pages.config.json` (pages, clean URLs, precache).

Assets use a relative base, so `dist/` works at the domain root **and** under a
folder such as `/peacock-tech/`.

## Docs

- `PRODUCT.md` users, positioning, constraints
- `DESIGN.md` system, tokens, locked decisions
- `DEPLOY.md` hosting, rewrites, compression
- `PERF_REPORT.md` budgets + measured numbers
- `SITE_MAP.md` pages and link outcomes

## Implementation

- **Hero** — the approved first hero, exactly one small viewport tall
  (`100svh`), with the four-loop colour field, highlighter, accent stroke, and
  scroll cue. The scroll cue now targets **Services**.
- **Header** — hidden while the hero is on screen, then slides in when Services
  approaches.
  - Desktop: Home, Industries, Services, About Us and Contact from `768px`.
    Industries and Services are disclosure dropdowns generated from the content
    arrays in `src/data/site.ts`.
  - Mobile: the full-screen **Index** menu below `768px`, with the same groups
    and sub-links.
  - Current section exposed with `aria-current="location"`; open dropdowns close
    on outside click and Escape, which returns focus to the trigger.
  - Choosing a sub-link closes the menu and moves focus to the destination
    heading.
- **Services** — section `02`, immediately below the hero. A tabbed showcase
  switches between AI/intelligent systems, ERP/software, mobile, and UX/branding;
  each tab reveals a live animated product sample and a link to the contact
  brief. A dark industries strip follows the panel with diamond manufacturing,
  jewellery manufacturing, ERP startups, and SMEs/enterprise.
  - Hovering or focusing a tab previews it immediately; click/tap still works,
    and Arrow/Home/End keys move selection and focus. After a menu choice,
    hover is briefly ignored so the resting pointer cannot override the chosen
    service while the page scrolls.
  - Tabs use real buttons, `role="tablist"`, and roving `tabIndex`. Inactive
    panels are `inert` and `visibility: hidden`, so they leave the focus order
    while still occupying one shared grid cell. That keeps the showcase at a
    stable height as tabs change.
  - The services and industries are data-driven from `src/data/site.ts`.
    Dropdown sub-links and industry cards are generated from the same arrays.
    A new service without a bespoke visual automatically gets the generic
    capability preview in `Services.tsx`.
  - Service links open dedicated pages (`/ai`, `/erp`, `/mobile-app`,
    `/ux-design`); industry cards go to `#contact`.
- **Sections** — **How we work** (`03`), **About Us** (`04`) and **Contact**
  (`05`), built from data instead of hard-coded markup.
  - How we work is a light, scroll-led line through Map, Build and Hand over.
    On wide screens a large stage number sits beside the stages and a slim
    vertical progress rail stays pinned in the centre gutter at the middle of
    the viewport. It fills continuously as the reader scrolls, and each stage
    lights up as it enters the reading band. Below `960px` the story stacks,
    with the number and a horizontal progress bar above the stage list.
  - About Us pairs a sticky heading with an exclusive animated accordion of
    studio commitments. Each answer expands and fades smoothly, only one stays
    open, and every panel reserves the tallest copy height so switching answers
    cannot move Contact below.
  - Contact is a split brief form with a clearly unconnected submit action.
- **Palette** — every brand colour lives in the `@theme` block at the top of
  `src/index.css`. Tailwind utilities (`bg-paper`, `text-ink`, `border-line`,
  …) and all `var(--color-*)` / `color-mix()` references resolve from those
  tokens. Change a value once and the header, hero, service showcase,
  industries strip, process line, About accordion, contact form and menus
  update together.
  - `index.html` links the global stylesheet, so the boot fallback also uses
    `var(--color-paper)` and `var(--color-ink)` rather than a second palette.
  - The only literal black is the alpha mask on the index-mark SVG. The intro
    samples colours from the video for its fade overlay; that is media colour,
    not brand palette.
- **Loader** — the studio film with portrait/wide cuts and skip,
  autoplay-blocked, media-error, reduced-motion, and 10-second timeout
  fallbacks.
- **Cleanup** — the old static `index.html`, concept pages, `assets/styles.css`,
  and `assets/main.js` have been removed. There is now one implementation:
  the React app.

## Stack

| Layer | Choice |
| --- | --- |
| UI | React 19 |
| Language | TypeScript 5 (strict, `tsc --noEmit` in `bun run build`) |
| Build | Vite 8 |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`) |
| Motion | CSS transitions and keyframes, no animation library |
| Media | Self-hosted MP4/WebP files imported through Vite |

> The original request said “React + vue + tailwind”. React and Vue cannot both
> own the app, so this is implemented as **React + Vite + Tailwind**, not
> Next.js.

## Structure

```text
index.html                   Vite shell: metadata, stylesheet link, fallback, #root
src/
  app/
    App.tsx                  Page composition, intro/menu state, inert handling
    main.tsx                 React mount
  assets/
    fonts/                   Self-hosted WOFF2 files
    logo/                    Supplied logo and source variants
    media/                   Studio films and posters
  components/
    index.ts                 Barrel re-exports (layout + sections + ui)
    layout/
      Header.tsx             Desktop nav with dropdowns + mobile Index trigger
      Footer.tsx
      MobileMenu.tsx         Grouped full-screen Index dialog
      Intro.tsx              Full-screen film loader and fallbacks
    sections/
      Hero.tsx               Hero + loop field
      Services.tsx           Tabbed service showcase + industries strip
      Industries.tsx         Sector cards with brand artwork
      HowWeWork.tsx          Scroll-led Map / Build / Hand over process line
      About.tsx              Sticky heading + commitments accordion
      Contact.tsx            Split brief form
    ui/
      Arrow.tsx              Shared arrow glyph
      Plumage.tsx            Live canvas peacock fan
  constants/
    index.ts                 Shared media-query strings
  data/
    site.ts                  Nav, section ids, services, industries, process, About, contact
  hooks/
    index.ts                 Barrel re-exports
    useActiveSection.ts      Current-section state for the nav
    useHeaderReveal.ts       Shows the header after the hero
    useReveal.ts             Reveal-on-scroll hook
  lib/
    index.ts                 Barrel re-exports
    assets.ts                Central Vite asset imports
    nav.ts                   Service selection event + destination focus
    style.ts                 cssVars() helper for custom-property inline styles
  styles/
    index.css                Tailwind import, global @theme palette, fonts, layout, motion
  vite-env.d.ts              Vite client types + VITE_FORM_ENDPOINT
public/
  favicon.svg
preview/                     Current app captures
```

## Add a service, industry or section

The navigation is generated from `src/data/site.ts`. Services and industries
are the easiest to extend because their menu children come from the same
arrays as the page content.

### Add a service

Append one object to `services.items`:

```js
{
  id: 'data',
  title: 'Data & Reporting',
  line: 'Clear reporting for the decisions your team makes every day.',
  tags: ['Dashboards', 'Reporting'],
  href: '#contact',
}
```

The tab, its number, the desktop Services dropdown and the mobile sub-link are
all created automatically. The new service uses the generic capability preview
unless you add a bespoke visual to the `visuals` map in `Services.tsx`. Tabs and
panels already share a grid cell, so the showcase height stays stable.

### Add an industry

Append one object to the `industries` array at the top of `src/data/site.ts`:

```js
{
  id: 'retail',
  title: 'Retail Operations',
  line: 'Connected stock, billing and reporting for retail teams.',
  href: '#contact',
}
```

The industry card, its anchor id, and the Industries dropdown and mobile
sub-link are generated automatically. The strip uses an auto-fitting grid, so
it reflows from one column to two without CSS changes.

### Add a top-level section

1. Add or remove an entry in `site.nav`:

   ```js
   { id: 'careers', label: 'Careers', href: '#careers' }
   ```

2. Add a section component with the same `id` and render it in `src/app/App.tsx`:

   ```jsx
   <Careers />
   ```

3. Add the id to `site.sectionIds` so active-section tracking includes it.

4. Put the copy in `src/data/site.ts` so content stays out of layout code.

`useActiveSection` sorts section ids by document order, so the menu order can
differ from the page order without breaking `aria-current`. Section numbers are
editorial labels (`02`–`05`) rendered by each section component; update the
labels if you insert or reorder a section. The site is multi-page: one shell
HTML + React entry per page, registry is `pages.config.json`.

## Accessibility

- Skip link, visible focus rings, semantic header/nav/main/section/footer.
- One `h1`; section headings are linked with `aria-labelledby`.
- Nav links expose `aria-current="location"` for the section in view. Dropdown
  triggers use `aria-expanded`/`aria-controls`; closed menus are `inert`, and
  Escape or an outside click closes them. Escape returns focus to the trigger.
- Choosing a desktop dropdown item or a mobile Index item closes the menu and
  moves focus to the destination heading, so focus never remains on a hidden
  link.
- Services use a keyboard-operable tablist; hover/focus previews a tab, only
  the selected tab is in the tab order, and Arrow/Home/End keys move selection
  and focus. Inactive panels are `inert` and `visibility: hidden`, so they
  leave the focus order while retaining their grid cell and the showcase's
  stable height.
- How we work keeps every stage in the document flow as normal list content. The
  sticky number and live progress bar are decorative (`aria-hidden`), while the
  stage in the reading band is exposed with `aria-current="step"`. The visual
  state change has a reduced-motion fallback.
- The About accordion uses real buttons with `aria-expanded` and
  `aria-controls`, so Enter/Space and focus work natively. Only one panel stays
  open; closed panels are `inert` and `aria-hidden`. Their heights are reserved
  so the animated expansion never moves Contact.
- The brief form has explicit labels, autocomplete hints, and a status note
  referenced by `aria-describedby`. Submit posts to FormSubmit ajax with
  3 retries + mailto fallback.
- Services links and industries use real anchor elements with the global
  visible focus outline.
- Mobile Index: `role="dialog"`, `aria-modal`, `aria-expanded`/`aria-controls`,
  focus moved to Close, Tab/Shift+Tab trap, Escape close, focus restore, body
  scroll lock, and `inert` on the page behind it.
- Selecting an index link closes the menu, scrolls to the destination section,
  and moves focus to its heading.
- The intro and the open menu make the page behind them `inert`.
- The header is `inert` while hidden, so offscreen links cannot take focus.
- `prefers-reduced-motion: reduce` removes the title, loop, header, menu, and
  scroll-cue motion and shows the settled state.
- The loader always releases the page on skipped/ended media, blocked
  autoplay, a media error, reduced motion, or a 10-second timeout.
- Anchors respect the fixed header; back-to-top and skip-to-content land at the
  true top.

## Known / next

- **Contact form is wired.** The brief form posts to FormSubmit ajax with
  3 retries + mailto fallback. Needs 1-time FormSubmit activation click
  in the inbox before launch.
- Service pages exist (`/ai`, `/erp`, `/mobile-app`, `/ux-design`).
- Git repository exists, see branch `feat/initial-site`.
- The logo is the supplied artwork; keep it on a light plate.
