# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React 19, Vite, TypeScript, Tailwind 4, multi-page (`index.html`, `about.html`, `contact.html`). Dark theme is the baseline. Fonts self-hosted: Bricolage Grotesque (display), Inter (body), Cascadia Code (numerals and data). Hosting and deploy target unknown.

## Users

Primary: the owner or MD of a diamond or jewellery business (manufacturer, trader, retailer), most likely on a phone, often arriving from a WhatsApp link. He decides in seconds whether these people know his trade, then talks to a person.

Quiet secondary: IT and finance heads who vet the vendor. Existing clients count: the marketing track is sold first to people already on the ERP.

Not targeted by the homepage: general SMEs and startups (one quiet link) and job seekers (footer link).

## Product Purpose

Peacock Technotrics (Surat, India) builds software for the diamond and jewellery trade, 20+ years of specialisation (exact figure to confirm). The old site is stale. The redesign must make a trade owner trust the company and message a founder.

Two tracks, equal weight, same confident voice:
1. ERP, design to deploy. One complete enterprise ERP for diamond and jewellery houses, built AI-driven. 3 to 4 medium to large projects stand behind it. Client specifics stay private.
2. Marketing for factories and manufacturers. Posts and reels.

Mobile apps and UX design are how work is delivered, not headline services. Success: a trade owner taps WhatsApp or calls a founder.

## Positioning

20+ years in one trade, with named founders who answer directly. AI is how the team builds. It is never a product feature, never a standalone card, never an "AI-powered" badge on a module.

## Operating Context

Trade hubs such as Surat and Mumbai run on WhatsApp and phone. Owners read English, Gujarati and Hindi. Assumed device: mid-range Android on mobile data (to confirm). Existing live site (peacocktech.in) is a JS app; its nav is Solutions (Diamond Manufacturing ERP, Jewellery Manufacturing ERP, ERP Startups, SMEs & Enterprise), Services (ERP & Software Development, Mobile App Development, AI & Intelligent Systems, UX Design & Branding), About Us, Contact, Request Consultation. Only `/sme-enterprise` was readable; the rest has not been crawled.

## Capabilities and Constraints

- Primary action: talk to a founder on WhatsApp or call, one tap. Fallback: the brief form, visually quiet. `WHATSAPP_NUMBER` in `src/data/site.ts` is empty, so the button falls back to `contact.html` until it is set.
- Public proof allowed: client count and years in business only. No logos, case studies, quotes, speed numbers, uptime or throughput claims (the live SME page makes some; do not carry them over unverified).
- Voice is confident. No "emerging", "pilot", "exploring" or hedge words on any service.
- Languages: English, Gujarati, Hindi. Partly built: `?lang=en|gu|hi` resolved at load in `src/data/site.ts` with the `T(en, gu, hi)` helper; Noto Sans Gujarati and Devanagari load through Fontsource. Untranslated strings fall back to English. Indic text is a draft for a native reviewer. Indic headlines need line-height about 1.3. Human translation only.
- Live demo of the ERP is phase 2. Labelled sample data is allowed.
- Contact form endpoint undecided. The form must keep blocking submission until a real endpoint exists.

Open, to confirm: client count and founded year; WhatsApp and call numbers; who answers and reply time; founder names, roles and photos; trade vocabulary; Gujarati and Hindi reviewer; hosting; brand spelling ("Technotrics" in this project, "Techtronics" in the live site title).

## Brand Commitments

- Name: Peacock Technotrics (confirm spelling against the live site).
- The supplied logo stays intact on its light plate. Not redrawn.
- Feather fan hero is pinned by the owner. Palette: forest, green, lime, yellow, deep ink, pearl.
- Yellow is reserved for the founder CTA. Emphasis words use lime.

## Evidence on Hand

Client count and years only (numbers unconfirmed). Absent, never fabricate: logos, case studies, quotes, speed or time-saved numbers, pricing, named clients, founder bios.

## Product Principles

1. Trust comes from trade fluency and named people, not results.
2. The peacock displays once, then lets the work speak.
3. One action everywhere: talk to a founder.
4. Say what is delivered in exact plain words. Vague growth language reads junior.
5. Method is shown by the site's own craft. It is never claimed.

## Accessibility & Inclusion

Three scripts (Latin, Gujarati, Devanagari), phone-first and touch-first, weak Android and slow connections, reduced motion honoured with a static hero fan, strong contrast for daylight reading.
