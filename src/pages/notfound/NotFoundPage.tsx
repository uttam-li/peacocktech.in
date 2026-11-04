import { useEffect, useReducer, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { lang, setLang, T, withLang } from '@data/site'
import BrandLogo from '@ui/BrandLogo'
import LangSwitch from '@ui/LangSwitch'

interface TracePage {
  n: string
  h: string
  a: string[]
}

const TRACE_PAGES: TracePage[] = [
  { n: 'home', h: '/', a: ['home', 'index', 'main'] },
  { n: 'about', h: '/about', a: ['about', 'about-us', 'aboutus', 'company', 'team'] },
  { n: 'contact', h: '/contact', a: ['contact', 'contact-us', 'contactus', 'support', 'enquiry'] },
]

function lev(x: string, y: string): number {
  const d: number[][] = []
  for (let i = 0; i <= x.length; i++) d[i] = [i]
  for (let j = 1; j <= y.length; j++) d[0][j] = j
  for (let i = 1; i <= x.length; i++)
    for (let j = 1; j <= y.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (x[i - 1] === y[j - 1] ? 0 : 1))
  return d[x.length][y.length]
}

function findPage(word: string): TracePage | null {
  const w = word.toLowerCase().replace(/^\.?\//, '').replace(/\/$/, '').replace(/\.html$/, '')
  for (const p of TRACE_PAGES) if (p.n === w || p.a.indexOf(w) > -1) return p
  return null
}

function pageDesc(n: string): string {
  switch (n) {
    case 'about':
      return T('The studio, the team and the way we work.', 'સ્ટુડિયો, ટીમ અને કામ કરવાની રીત.', 'स्टूडियो, टीम और काम करने का तरीका।')
    case 'contact':
      return T('Start a project or ask a question.', 'પ્રોજેક્ટ શરૂ કરો અથવા પ્રશ્ન પૂછો.', 'प्रोजेक्ट शुरू करें या सवाल पूछें।')
    default:
      return T('Services, work and how we build.', 'સેવાઓ, કામ અને અમારી રીત.', 'सेवाएँ, काम और हमारा तरीका।')
  }
}

interface OutLine {
  t: string
  c?: string
  href?: string
}

function makeRef(): string {
  try {
    const a = new Uint8Array(4)
    crypto.getRandomValues(a)
    let s = ''
    for (let q = 0; q < 4; q++) s += ('0' + a[q].toString(16)).slice(-2)
    return s.toUpperCase()
  } catch {
    return Math.random().toString(16).slice(2, 10).toUpperCase()
  }
}

export default function NotFoundPage() {
  const [, force] = useReducer((x: number) => x + 1, 0)
  const [path, setPath] = useState('/')
  const [host, setHost] = useState('')
  const [time, setTime] = useState('')
  const [suggest, setSuggest] = useState<string | null>(null)
  const [lines, setLines] = useState<OutLine[]>([])
  const [copied, setCopied] = useState(false)
  const [value, setValue] = useState('')
  const histRef = useRef<string[]>([])
  const hiRef = useRef(0)
  const [ref, setRef] = useState('-')
  const inputRef = useRef<HTMLInputElement>(null)
  const outRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setRef(makeRef())
  }, [])

  useEffect(() => {
    const raw = location.pathname
    setPath(raw.replace(/(^|\/)404\.html?$/i, '$1').replace(/\/+$/, '') || '/')
    setHost(location.host || '')
    try {
      const now = new Date()
      setTime(now.toISOString().replace('T', ' ').replace(/\.\d+Z$/, ' UTC'))
    } catch {
      setTime('')
    }
    document.title = T(
      'Page not found | Peacock Technotrics',
      'પેજ મળ્યું નથી | Peacock Technotrics',
      'पेज नहीं मिला | Peacock Technotrics',
    )
    const seg = location.pathname
      .replace(/\/+$/, '')
      .split('/')
      .pop()
      ?.toLowerCase()
      .replace(/\.(html?|php|aspx?)$/, '')
    if (seg) {
      let best: TracePage | null = null
      let bd = 99
      for (const p of TRACE_PAGES)
        for (const al of p.a) {
          let dd = lev(seg, al)
          if (seg.length > 2 && al.indexOf(seg) > -1) dd = Math.min(dd, 1)
          if (dd < bd) {
            bd = dd
            best = p
          }
        }
      if (best && bd <= Math.max(2, Math.floor(seg.length / 3))) setSuggest(best.h)
    }
  }, [])

  useEffect(() => {
    outRef.current?.scrollTo({ top: outRef.current.scrollHeight })
  }, [lines])

  function put(t: string, c?: string, href?: string): void {
    setLines((prev) => [...prev, { t, c, href }])
  }

  function run(raw: string): void {
    const c = raw.trim()
    if (!c) return
    if (c.toLowerCase() !== 'clear') put('$ ' + c, 'c')
    histRef.current.push(c)
    hiRef.current = histRef.current.length
    const parts = c.split(/\s+/)
    const cmd = parts[0].toLowerCase()
    const arg = parts[1]
    if (cmd === 'help') {
      put('ls  open <page>  lang <en|hi|gu>  ref  clear')
    } else if (cmd === 'ls') {
      for (const x of TRACE_PAGES) put('  ' + x.n + '   ' + pageDesc(x.n), undefined, withLang(x.h))
    } else if (cmd === 'open' || cmd === 'cd' || findPage(cmd)) {
      const t = cmd === 'open' || cmd === 'cd' ? (arg ? findPage(arg) : null) : findPage(cmd)
      if (t) {
        put('opening ' + t.h + ' ...', 'ok')
        window.setTimeout(() => location.assign(withLang(t.h)), 350)
      } else put('no such page: ' + (arg || '(missing)'), 'err')
    } else if (cmd === 'lang') {
      if (arg === 'en' || arg === 'hi' || arg === 'gu') {
        try {
          localStorage.setItem('pt-lang', arg)
        } catch {
          /* private mode */
        }
        setLang(arg)
        force()
        put('language: ' + arg, 'ok')
      } else put('usage: lang <en|hi|gu>', 'err')
    } else if (cmd === 'ref') put('ref ' + ref, 'ok')
    else if (cmd === 'whoami') put('visitor@' + (location.host || 'localhost'))
    else if (cmd === 'clear') setLines([])
    else if (cmd === 'sudo') put('nice try. permission denied.', 'err')
    else put(cmd + ': command not found. type help', 'err')
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Enter') {
      run(value)
      setValue('')
    } else if (e.key === 'ArrowUp' && histRef.current.length) {
      hiRef.current = Math.max(0, hiRef.current - 1)
      setValue(histRef.current[hiRef.current] ?? '')
      e.preventDefault()
    } else if (e.key === 'ArrowDown' && histRef.current.length) {
      hiRef.current = Math.min(histRef.current.length, hiRef.current + 1)
      setValue(histRef.current[hiRef.current] ?? '')
      e.preventDefault()
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const parts = value.toLowerCase().split(/\s+/)
      const pool =
        parts.length > 1
          ? TRACE_PAGES.map((x) => x.n)
          : ['help', 'ls', 'open', 'lang', 'ref', 'clear'].concat(TRACE_PAGES.map((x) => x.n))
      const last = parts[parts.length - 1]
      const hit = pool.filter((x) => x.indexOf(last) === 0)[0]
      if (hit) {
        parts[parts.length - 1] = hit
        setValue(parts.join(' ') + (parts.length === 1 && hit === 'open' ? ' ' : ''))
      }
    }
  }

  function copy(): void {
    const txt = `Peacock Technotrics 404\nGET ${path}\nhost ${host}\n${time}\nref ${ref}`
    const done = (): void => {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    }
    try {
      navigator.clipboard.writeText(txt).then(done, done)
    } catch {
      done()
    }
  }

  return (
    <>
      <header className="relative z-10 mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 px-6 pt-6">
        <a className="brand-plate" href={withLang('/')} aria-label={T('Peacock Technotrics — home', 'Peacock Technotrics — હોમ', 'Peacock Technotrics — होम')}>
          <BrandLogo alt="" className="block h-[36px] w-auto" />
        </a>
        <LangSwitch />
      </header>
      <main>
      <svg className="echo fixed right-[-14vmax] top-1/2 z-0 aspect-[64/72] w-[min(78vmax,980px)] -translate-y-1/2 pointer-events-none opacity-30 blur-[2px]" viewBox="0 0 64 72" aria-hidden="true">
        <ellipse cx="32" cy="36" rx="31" ry="35" />
        <ellipse cx="32" cy="36" rx="25" ry="29" />
        <ellipse cx="32" cy="36" rx="19" ry="23" />
        <ellipse cx="32" cy="36" rx="13" ry="17" />
        <ellipse cx="32" cy="36" rx="7" ry="11" />
      </svg>

      <section className="stage">
        <div>
          <p className="numeral" aria-hidden="true">
            <span>4</span>
            <svg viewBox="0 0 64 72">
              <ellipse className="r1" cx="32" cy="36" rx="23" ry="26" />
              <ellipse className="r2" cx="32" cy="36" rx="15" ry="18" />
              <ellipse className="r3" cx="32" cy="36" rx="7.5" ry="10.5" />
            </svg>
            <span>4</span>
          </p>
          <h1 className="m-0 mb-3 max-w-[16ch] text-balance font-serif text-[clamp(2.3rem,5.2vw,4.6rem)] font-semibold leading-[1.05] tracking-[-0.035em]">
            <span className="sr-only">Error 404. </span>
            {lang === 'gu' ? (
              <>
                આ પેજ અમને <em className="not-italic text-lime">મળ્યું નથી</em>.
              </>
            ) : lang === 'hi' ? (
              <>
                यह पेज हमें <em className="not-italic text-lime">नहीं मिला</em>।
              </>
            ) : (
              <>
                We <em className="not-italic text-lime">can&apos;t find</em> that page.
              </>
            )}
          </h1>
          <p className="lede mb-8 max-w-[62ch] text-[clamp(1rem,1.3vw,1.15rem)] leading-[1.55] text-muted">
            {T(
              'The link may be old, mistyped, or the page has moved. Nothing is wrong on your side. Head back home and you are on track.',
              'લિંક જૂની હોઈ શકે, ખોટી ટાઇપ થઈ હોઈ શકે, અથવા પેજ ખસેડાયું હોઈ શકે. તમારી બાજુથી કોઈ ભૂલ નથી. હોમ પર પાછા જાઓ, બધું બરાબર ચાલશે.',
              'लिंक पुराना हो सकता है, गलत टाइप हुआ हो सकता है, या पेज हट चुका है। आपकी तरफ़ कोई गड़बड़ नहीं है। होम पर लौटें, सब ठीक रहेगा।',
            )}
          </p>
          <div className="actions flex flex-wrap gap-3">
            <a className="btn primary" href={withLang('/')}>
              <span>{T('Back to home', 'હોમ પર પાછા જાઓ', 'होम पर वापस जाएँ')}</span>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 8h11M9 4l4 4-4 4" />
              </svg>
            </a>
            <a className="btn ghost" href={withLang('/contact')}>
              {T('Talk to us', 'અમારી સાથે વાત કરો', 'हमसे बात करें')}
            </a>
          </div>
        </div>

        <aside className="trace" aria-label="Request details">
          <header>
            <span>request trace</span>
            <span className="chip">404</span>
          </header>
          <dl className="log">
            <dt>method</dt>
            <dd>GET</dd>
            <dt>path</dt>
            <dd suppressHydrationWarning>{path}</dd>
            <dt>host</dt>
            <dd data-dyn suppressHydrationWarning>
              {host || '-'}
            </dd>
            <dt>status</dt>
            <dd className="bad">404 Not Found</dd>
            <dt>route</dt>
            <dd className="bad">no match in sitemap</dd>
            <dt>time</dt>
            <dd data-dyn suppressHydrationWarning>
              {time || '-'}
            </dd>
            <dt>ref</dt>
            <dd data-dyn suppressHydrationWarning className="ok">
              {ref}
            </dd>
            {suggest && (
              <>
                <dt>suggest</dt>
                <dd>
                  <a href={withLang(suggest)}>{suggest}</a>
                </dd>
              </>
            )}
          </dl>
          <div className="sh">
            <div className="out" ref={outRef} role="log" aria-live="polite">
              {lines.map((l, i) => (
                <div key={i} className={l.c}>
                  {l.href ? <a href={l.href}>{l.t}</a> : l.t}
                </div>
              ))}
            </div>
            <label className="prompt">
              <span className="ps">visitor@peacock:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={value}
                placeholder="help"
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKey}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                aria-label="Command"
                enterKeyHint="go"
              />
            </label>
          </div>
          <footer>
            <span>{T('Quote this ref to support', 'સપોર્ટને આ ref જણાવો', 'सपोर्ट को यह ref बताएँ')}</span>
            <button className="copy" type="button" onClick={copy}>
              {copied
                ? T('Copied', 'કૉપી થઈ ગયું', 'कॉपी हो गया')
                : T('Copy details', 'વિગતો કૉપી કરો', 'विवरण कॉपी करें')}
            </button>
          </footer>
        </aside>
      </section>
      </main>
    </>
  )
}
