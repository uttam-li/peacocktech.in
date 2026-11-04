# Design notes: Peacock Technotrics

Dark, calm studio site. One loud moment (the live canvas peacock fan in the hero); everything after it is quiet so the information can be read.

## Page shape
1. Intro film, then Hero (`Plumage.jsx` canvas fan, headline, one CTA).
2. Services: tabbed showcase — left rail (01–04) + right dark panel with a live animated product sample per service (document flow, production board, field app, design canvas). Hover/focus previews a tab, click/tap selects, Arrow/Home/End keys move. Menu sub-links open the matching tab.
3. Industries: four playbill tickets (diamond, jewellery, ERP startups, SMEs/enterprise), each a two-part card — left title + subtitle + discuss link, right run-of-show stub with sector mark.
4. How we work: three pillar cards, each with an animated 4-node working-flow pipeline, big numeral, title and body.
5. About: sticky heading beside an exclusive animated accordion (one open at a time, tallest height reserved so Contact never shifts).
6. Contact: brief form with validation and sending/sent/error states, footer.

## System
- Tokens live in the `@theme` block of `src/index.css` (dark values). Logo stays on `--color-plate`.
- Type: Bricolage Grotesque (display), Inter (body), Cascadia Code (labels). Self-hosted.
- Motion: `useReveal` sets `data-in`; CSS owns transitions. All gated by `prefers-reduced-motion`.
- Accent: yellow for emphasis words; `--color-green-deep` for links, arrows and every interactive state.
- Hero (aligned to owner decisions): headline names diamond and jewellery ERP, CTA is "Talk to a founder" (WhatsApp, falls back to the brief form until a number is set), proof line carries unconfirmed client count and years, emphasis word is lime, yellow is reserved for the CTA. Feathers fade behind copy via mask; narrow screens use a shorter fan; weak devices render fewer feathers. See `.impeccable/surfaces/index-html.md` for the full direction and alignment checklist.
- Hero CTA: pill-shaped button (rounded-full), yellow background with forest text, `--color-green-deep` fill on hover/focus, arrow icon that nudges right.
- Interaction accent (locked): one hover/focus colour site-wide — `--color-green-deep` (`#3fd488`). Never use lime or yellow for hover/focus. Lime is limited to static decorative art/icons; yellow is limited to emphasis words and the resting CTA surface.
- Surfaces stay flat: no section gradients, no active-row tints, and no hover background tint on cards/rows.
- Titles (locked): H1 `600 clamp(2.7rem, min(7.6vw, 12vh), 6.4rem)/1.02`, tracking `-.035em`; H2 `600 clamp(2.3rem, 5.2vw, 4.6rem)/1.05`, tracking `-.035em`, max `16ch`; card/list titles `400 clamp(1.5rem, 2.4vw, 2.2rem)/1.05`, tracking `-.03em`. Same family, weight and scale on every page.
- Focus ring: `2px solid var(--color-green-deep)` with `4px` offset.
- No invented proof: no clients, metrics, testimonials or contact details until supplied.

## To launch
Set `VITE_FORM_ENDPOINT` (see `.env.example`). Add founders, address and phone when supplied.

## Owner decisions applied (current)
- Services: two tracks (ERP, Marketing). AI is one method line. Industries: diamond and jewellery lead, startups and SMEs quiet. People section holds founder placeholders. Emphasis words are lime; yellow is the founder CTA only. Language switch lives in the hero bar and footer. See `.impeccable/surfaces/index-html.md`.
