#!/usr/bin/env node
/**
 * Scaffold a new scalable service page.
 *
 *   bun run add:service -- --slug=seo --id=seo --title="SEO & Growth"
 *
 * Creates: <slug>.html, src/pages/<slug>/{main.tsx,App.tsx,<Pascal>Page.tsx},
 * src/styles/<slug>.css, registers the slug in pages.config.json
 * (vite entries + clean URLs + prerender + SW + sitemap follow automatically)
 * and appends the service to site.ts `services.items`
 * (home tabs + Services nav dropdown follow automatically).
 *
 * Afterwards: translate gu/hi in site.ts + <slug>.html, replace the
 * starter content with the real page, then `bun run ssg`.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const m = a.match(/^--([^=]+)=(.*)$/)
    return m ? [m[1], m[2]] : [a.replace(/^--/, ''), 'true']
  }),
)

function fail(msg) {
  console.error('add:service: ' + msg)
  console.error('usage: bun run add:service -- --slug=<url-slug> --id=<service-id> --title="<English title>"')
  process.exit(1)
}

const { slug, id, title } = args
if (!slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) fail('bad --slug (lowercase letters, digits, hyphens)')
if (!id || !/^[a-z]+$/.test(id)) fail('bad --id (lowercase letters only)')
if (!title) fail('missing --title')

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const pascal = slug.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join('') + 'Page'

const failIfExists = (p) => {
  if (fs.existsSync(path.join(root, p))) fail(p + ' already exists')
}
failIfExists(slug + '.html')
failIfExists('src/pages/' + slug)
failIfExists('src/styles/' + slug + '.css')

const configPath = path.join(root, 'pages.config.json')
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
if (config.pages.includes('/' + slug)) fail('/' + slug + ' already in pages.config.json')

const sitePath = path.join(root, 'src/data/site.ts')
const siteSrc = fs.readFileSync(sitePath, 'utf8')
if (siteSrc.includes(`id: '${id}'`) || siteSrc.includes(`href: '/${slug}'`)) {
  fail('service id or href already in site.ts')
}
const anchor = "href: '/ux-design' },"
if (!siteSrc.includes(anchor)) fail('site.ts anchor not found (ux item moved?)')

/* 1. Shell HTML from the ai template (targeted replaces only). */
let html = fs.readFileSync(path.join(root, 'ai.html'), 'utf8')
html = html.replaceAll('/ai', '/' + slug)
html = html.replace('ai.css', slug + '.css')
html = html.replace('/src/pages/ai/main.tsx', `/src/pages/${slug}/main.tsx`)
html = html.replace(/<title>.*<\/title>/, `<title>${esc(title)} | Peacock Technotrics</title>`)
html = html.replace(
  /<meta name="description" content="[^"]*">/,
  `<meta name="description" content="${esc(title)} by Peacock Technotrics, Surat.">`,
)
html = html.replace(/var dict = \{[\s\S]*?\n        \};/, `var dict = {\n            gu: {\n              title: '${title} | Peacock Technotrics',\n              desc: '${title} — Peacock Technotrics, Surat.'\n            },\n            hi: {\n              title: '${title} | Peacock Technotrics',\n              desc: '${title} — Peacock Technotrics, Surat.'\n            }\n          };`)
fs.writeFileSync(path.join(root, slug + '.html'), html)

/* 2. Page entry (identical boot path on all pages). */
const dir = path.join(root, 'src/pages', slug)
fs.mkdirSync(dir, { recursive: true })
fs.copyFileSync(path.join(root, 'src/pages/ai/main.tsx'), path.join(dir, 'main.tsx'))

/* 3. App chrome (shared Header/Footer/MobileMenu, auto prefetch). */
fs.writeFileSync(
  path.join(dir, 'App.tsx'),
  `import ErrorCatcher from '@ui/ErrorCatcher'
import { useState } from 'react'
import { useLangUpgrade } from '@hooks/useLang'
import { useSlowNotice } from '@hooks/useSlowNotice'
import { useSmartPrefetch } from '@hooks/useSmartPrefetch'
import { otherPages } from '@lib/pages'
import { T } from '@data/site'
import Header from '@layout/Header'
import Footer from '@layout/Footer'
import MobileMenu from '@layout/MobileMenu'
import ${pascal} from './${pascal}'

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  useLangUpgrade()
  useSlowNotice()
  useSmartPrefetch(otherPages('/${slug}'))
  return (
    <ErrorCatcher>
      <a className="skip-link" href="#top">{T('Skip to content', 'મુખ્ય સામગ્રી પર જાઓ', 'मुख्य सामग्री पर जाएँ')}</a>
      <Header
        visible={!menuOpen}
        menuOpen={menuOpen}
        onOpenMenu={() => setMenuOpen(true)}
        activeId=""
        linkPrefix="./"
      />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} activeId="" linkPrefix="./" />
      <${pascal} />
      <Footer />
    </ErrorCatcher>
  )
}
`,
)

/* 4. Starter page (valid, prerender-safe; replace with real content). */
fs.writeFileSync(
  path.join(dir, pascal + '.tsx'),
  `import { site, T, withLang } from '@data/site'
import Arrow from '@ui/Arrow'

/** Starter for the ${title} page. Replace sections with real content (keep T() render-time, no window/Date in render). */
export default function ${pascal}() {
  return (
    <main id="top" tabIndex={-1}>
      <section className="sec" aria-labelledby="${id}-title">
        <div className="wrap">
          <h1 className="sec-title" id="${id}-title">
            {T('${title}', '${title}', '${title}')}
          </h1>
          <p className="sec-lede">
            {T(
              'Replace this starter copy with the real ${title} story. Gujarati and Hindi drafts need a native reviewer before ship.',
              'Replace this starter copy with the real ${title} story. Gujarati and Hindi drafts need a native reviewer before ship.',
              'Replace this starter copy with the real ${title} story. Gujarati and Hindi drafts need a native reviewer before ship.',
            )}
          </p>
          <p style={{ marginTop: 28 }}>
            <a className="hero-btn" href={withLang(site.cta.href)}>
              <span>{site.cta.label}</span>
              <Arrow />
            </a>
          </p>
        </div>
      </section>
      <section className="sec" aria-labelledby="${id}-points">
        <div className="wrap">
          <h2 className="sec-title" id="${id}-points">
            {T('What this service covers', 'આ સેવામાં શું આવે છે', 'इस सेवा में क्या आता है')}
          </h2>
          <ul>
            <li>{T('First outcome this service delivers for your floor.', 'First outcome this service delivers for your floor.', 'First outcome this service delivers for your floor.')}</li>
            <li>{T('Second outcome this service delivers for your team.', 'Second outcome this service delivers for your team.', 'Second outcome this service delivers for your team.')}</li>
            <li>{T('Third outcome this service delivers for your trade.', 'Third outcome this service delivers for your trade.', 'Third outcome this service delivers for your trade.')}</li>
          </ul>
        </div>
      </section>
    </main>
  )
}
`,
)

/* 5. Page stylesheet stub (tokens only, no new hex). */
fs.writeFileSync(
  path.join(root, 'src/styles', slug + '.css'),
  `/* ${title} page: Tailwind utilities first; add rules here only where utilities cannot reach. Use site tokens only. */\n`,
)

/* 6. Registry (vite + prerender + SW + sitemap follow automatically). */
config.pages.push('/' + slug)
fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n')

/* 7. Home tabs + Services dropdown (derived from services.items). */
const item = `    { id: '${id}', title: T('${title}', '${title}', '${title}'),
      line: T('TODO service line.', 'TODO service line.', 'TODO service line.'),
      tags: [], href: '/${slug}' },`
const next = siteSrc.replace(anchor, anchor + '\n' + item)
fs.writeFileSync(sitePath, next)

console.log('created ' + slug + '.html, src/pages/' + slug + '/ (main, App, ' + pascal + '), src/styles/' + slug + '.css')
console.log('registered /' + slug + ' in pages.config.json + services.items')
console.log('next: 1) translate gu/hi in site.ts + ' + slug + '.html  2) replace starter content  3) bun run ssg')
