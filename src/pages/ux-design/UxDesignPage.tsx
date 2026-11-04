import { useEffect, useRef, useState } from 'react'
import { T, lang, withLang } from '@data/site'
import { cssVars } from '@lib/style'

const FPALS: [string, string, string][] = [['#3fd488', '#0f2a1f', '#b8d000'], ['#6ea8ff', '#0e1b33', '#9be8ff'], ['#ff9a4a', '#2a160c', '#ffd166'], ['#c58bff', '#1d1230', '#ff8bd1'], ['#ff6b8b', '#2a0f1a', '#ffc2a1'], ['#e8e000', '#202004', '#3fd488']]
const FFN: [string, string][] = [['"Bricolage Grotesque",sans-serif', 'Bricolage Grotesque'], ['Inter,sans-serif', 'Inter'], ['"Cascadia Code",monospace', 'Cascadia Code'], ['Georgia,serif', 'Georgia']]
const FSH: string[] = ['polygon(50% 0,100% 50%,50% 100%,0 50%)', 'circle(50% at 50% 50%)', 'inset(0 round 30%)', 'polygon(25% 5%,75% 5%,100% 50%,75% 95%,25% 95%,0 50%)', 'polygon(30% 0,70% 0,100% 30%,100% 70%,70% 100%,30% 100%,0 70%,0 30%)']
const FTG: string[] = ['Design that stays', 'Built to be remembered', 'Clarity, by design', 'Make it matter', 'Simple. Sharp. Yours.']
const fhash = (s: string): number => {
  let h = 5381
  const t = s.toLowerCase()
  for (let i = 0; i < t.length; i++) h = ((h << 5) + h + t.charCodeAt(i)) >>> 0
  return h
}
interface ForgeOut { mono: string; slug: string; tagline: string; fontCss: string; fontName: string; ac: string; dp: string; hl: string; shape: string; pal: [string, string][] }
const forgeRender = (raw: string, seed: number): ForgeOut => {
  const name = raw.trim() || 'Your brand'
  const h = (fhash(name) + seed * 2654435761) >>> 0
  const p = FPALS[h % 6]
  const f = FFN[(h >>> 3) % 4]
  const w = name.split(/\s+/).filter(Boolean)
  const mono = (w.length > 1 ? w[0][0] + w[1][0] : w[0].slice(0, 1)).toUpperCase()
  return {
    mono,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '') || 'hello',
    tagline: FTG[(h >>> 7) % 5],
    fontCss: f[0],
    fontName: f[1],
    ac: p[0],
    dp: p[1],
    hl: p[2],
    shape: FSH[(h >>> 5) % 5],
    pal: [[p[0], 'Primary'], [p[2], 'Highlight'], [p[1], 'Deep'], ['#f3f1e6', 'Pearl'], ['#0a1510', 'Ink']] as [string, string][],
  }
}
const COL: [string, string][] = [['#3fd488', '#0a1510'], ['#b8d000', '#0a1510'], ['#e8e000', '#264438'], ['#3fd488', '#0a1510'], ['#e8e000', '#264438'], ['#b8d000', '#0a1510']]

interface Bubble { t: string; d: string; l: string[]; a: string }

export default function UxDesignPage() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [sel, setSel] = useState<number | null>(null)
  const [bfName, setBfName] = useState('Peacock Technotrics')
  const [bfSeed, setBfSeed] = useState(0)
  const [bfReady, setBfReady] = useState(false)
  const [doneCount, setDoneCount] = useState(0)
  const [doneAll, setDoneAll] = useState<boolean[]>([false, false, false, false])
  const bfUser = useRef(false)
  const pitRef = useRef<HTMLDivElement | null>(null)
  const bubblesRef = useRef<{ el: HTMLDivElement; x: number; y: number; vx: number; vy: number; r: number; i: number; dg: boolean }[]>([])
  const dtRef = useRef<HTMLDivElement | null>(null)

  const steps = [
    { title: T('Research & Discovery', 'રિસર્ચ અને ડિસ્કવરી', 'रिसर्च और डिस्कवरी'), desc: T('Understand users, business goals, and competitive landscape.', 'યુઝર્સ, વ્યવસાય લક્ષ્યો અને સ્પર્ધાત્મક પરિદૃશ્ય સમજો.', 'यूज़र्स, व्यावसायिक लक्ष्य और प्रतिस्पर्धी परिदृश्य समझें।') },
    { title: T('Ideation & Concepts', 'વિચાર અને કન્સેપ્ટ્સ', 'विचार और कंसेप्ट'), desc: T('Brainstorm solutions and create initial design concepts.', 'ઉકેલો પર વિચાર કરો અને પ્રારંભિક ડિઝાઇન કન્સેપ્ટ્સ બનાવો.', 'समाधानों पर विचार करें और प्रारंभिक डिज़ाइन कंसेप्ट बनाएँ।') },
    { title: T('Design & Prototype', 'ડિઝાઇન અને પ્રોટોટાઇપ', 'डिज़ाइन और प्रोटोटाइप'), desc: T('High-fidelity designs and interactive prototypes.', 'હાઇ-ફિડેલિટી ડિઝાઇન અને ઇન્ટરેક્ટિવ પ્રોટોટાઇપ.', 'हाई-फ़िडेलिटी डिज़ाइन और इंटरैक्टिव प्रोटोटाइप।') },
    { title: T('Test & Iterate', 'ટેસ્ટ અને સુધારો', 'टेस्ट और सुधार'), desc: T('User testing, feedback, and design refinement.', 'યુઝર ટેસ્ટિંગ, ફીડબેક અને ડિઝાઇન સુધારણા.', 'यूज़र टेस्टिंग, फ़ीडबैक और डिज़ाइन परिष्कार।') },
  ]

  const bubbles: Bubble[] = [
    {
      t: T('UX/UI Design', 'UX/UI ડિઝાઇન', 'UX/UI डिज़ाइन'),
      d: T('User-centered interface design that combines aesthetics with usability.', 'સૌંદર્ય અને ઉપયોગિતાને જોડતી યુઝર-કેન્દ્રિત ઇન્ટરફેસ ડિઝાઇન.', 'सौंदर्य और उपयोगिता को जोड़ने वाली यूज़र-केंद्रित इंटरफ़ेस डिज़ाइन।'),
      l: [T('User research & personas', 'યુઝર રિસર્ચ અને પર્સોના', 'यूज़र रिसर्च और पर्सोना'), T('Wireframing & prototyping', 'વાયરફ્રેમિંગ અને પ્રોટોટાઇપિંગ', 'वायरफ़्रेमिंग और प्रोटोटाइपिंग'), T('Interaction design', 'ઇન્ટરેક્શન ડિઝાઇન', 'इंटरैक्शन डिज़ाइन')],
      a: '<rect class="b" x="14" y="12" width="120" height="106" rx="8" opacity=".5"/><rect class="b" x="24" y="22" width="100" height="10" rx="3"/><rect class="b" x="24" y="40" width="100" height="40" rx="5"/><rect class="a" x="24" y="90" width="46" height="18" rx="9"/><path class="c f" d="M142 65h38"/><circle class="a" cx="208" cy="38" r="14"/><rect class="b" x="190" y="60" width="36" height="6" rx="3"/><rect class="b" x="238" y="30" width="48" height="8" rx="4"/><rect class="b" x="238" y="46" width="34" height="8" rx="4"/><rect class="d" x="190" y="84" width="96" height="32" rx="8"/><text class="t" x="238" y="104" text-anchor="middle">PROTOTYPE</text>',
    },
    {
      t: T('Brand Identity', 'બ્રાન્ડ ઓળખ', 'ब्रांड पहचान'),
      d: T('Create distinctive brand identities that resonate with your target audience.', 'તમારા લક્ષ્ય પ્રેક્ષકો સાથે જોડાય તેવી વિશિષ્ટ બ્રાન્ડ ઓળખ બનાવો.', 'ऐसी विशिष्ट ब्रांड पहचान बनाएँ जो आपके लक्षित दर्शकों से जुड़े।'),
      l: [T('Logo & visual identity', 'લોગો અને વિઝ્યુઅલ ઓળખ', 'लोगो और विज़ुअल पहचान'), T('Brand guidelines', 'બ્રાન્ડ માર્ગદર્શિકા', 'ब्रांड दिशानिर्देश'), T('Marketing materials', 'માર્કેટિંગ સામગ્રી', 'मार्केटिंग सामग्री')],
      a: '<path class="a" d="M60 26l22 22-22 22-22-22z"/><path class="c" d="M60 12l36 36-36 36-36-36z" opacity=".55"/><text x="116" y="52" style="font:600 28px var(--serif)" fill="#f3f1e6">Aurum</text><text class="t" x="116" y="70">STUDIO · SAMPLE BRAND</text><circle class="a" cx="40" cy="112" r="9"/><circle class="l" cx="64" cy="112" r="9"/><circle fill="#f3f1e6" cx="88" cy="112" r="9"/><circle class="b" cx="112" cy="112" r="9"/>',
    },
    {
      t: T('Mobile App Design', 'મોબાઇલ એપ ડિઝાઇન', 'मोबाइल ऐप डिज़ाइन'),
      d: T('Native iOS and Android designs following platform-specific guidelines.', 'પ્લેટફોર્મ-વિશિષ્ટ માર્ગદર્શિકા મુજબ નેટિવ iOS અને Android ડિઝાઇન.', 'प्लेटफ़ॉर्म-विशिष्ट दिशानिर्देशों के अनुसार नेटिव iOS और Android डिज़ाइन।'),
      l: [T('iOS & Android design', 'iOS અને Android ડિઝાઇન', 'iOS और Android डिज़ाइन'), T('App icon & splash screens', 'એપ આઇકન અને સ્પ્લેશ સ્ક્રીન', 'ऐप आइकन और स्प्लैश स्क्रीन'), T('Mobile-first approach', 'મોબાઇલ-ફર્સ્ટ અભિગમ', 'मोबाइल-फ़र्स्ट दृष्टिकोण')],
      a: '<rect class="c" x="62" y="6" width="68" height="118" rx="14"/><rect class="a" x="80" y="30" width="32" height="32" rx="9"/><rect class="b" x="74" y="76" width="44" height="6" rx="3"/><rect class="b" x="74" y="88" width="30" height="6" rx="3"/><rect class="c" x="170" y="6" width="68" height="118" rx="14" opacity=".6"/><rect class="b" x="180" y="18" width="48" height="24" rx="6"/><rect class="b" x="180" y="48" width="48" height="14" rx="5"/><rect class="b" x="180" y="68" width="48" height="14" rx="5"/><rect class="a" x="180" y="98" width="48" height="14" rx="7"/>',
    },
    {
      t: T('Design Systems', 'ડિઝાઇન સિસ્ટમ્સ', 'डिज़ाइन सिस्टम'),
      d: T('Scalable design systems for consistent user experiences across products.', 'ઉત્પાદનોમાં સુસંગત અનુભવો માટે સ્કેલેબલ ડિઝાઇન સિસ્ટમ્સ.', 'उत्पादों में सुसंगत अनुभवों के लिए स्केलेबल डिज़ाइन सिस्टम।'),
      l: [T('Component libraries', 'કમ્પોનન્ટ લાઇબ્રેરી', 'कंपोनेंट लाइब्रेरी'), T('Style guides', 'સ્ટાઇલ માર્ગદર્શિકા', 'स्टाइल मार्गदर्शिका'), T('Design tokens', 'ડિઝાઇન ટોકન્સ', 'डिज़ाइन टोकन')],
      a: '<rect class="a" x="16" y="14" width="72" height="26" rx="13"/><text class="k" x="52" y="31" text-anchor="middle">Button</text><rect class="c" x="100" y="14" width="100" height="26" rx="7"/><text class="t" x="110" y="31">Input</text><rect class="b" x="212" y="17" width="48" height="22" rx="11"/><circle class="a" cx="249" cy="28" r="8"/><rect class="b" x="16" y="54" width="52" height="22" rx="11" opacity=".7"/><rect class="d" x="78" y="54" width="52" height="22" rx="11"/><rect class="l" x="140" y="54" width="52" height="22" rx="11"/><circle class="b" cx="222" cy="65" r="11"/><circle class="a" cx="248" cy="65" r="11"/><path class="d" d="M16 94h268"/><text class="t" x="16" y="114">TOKENS · SPACING · TYPE · COLOUR</text>',
    },
    {
      t: T('User Testing', 'યુઝર ટેસ્ટિંગ', 'यूज़र टेस्टिंग'),
      d: T('Validate designs with real users through testing and feedback sessions.', 'ટેસ્ટિંગ અને ફીડબેક સત્રો દ્વારા ખરા યુઝર્સ સાથે ડિઝાઇન ચકાસો.', 'टेस्टिंग और फ़ीडबैक सत्रों से असली यूज़र्स के साथ डिज़ाइन सत्यापित करें।'),
      l: [T('Usability testing', 'ઉપયોગિતા પરીક્ષણ', 'उपयोगिता परीक्षण'), T('A/B testing', 'A/B ટેસ્ટિંગ', 'A/B टेस्टिंग'), T('Feedback analysis', 'ફીડબેક વિશ્લેષણ', 'फ़ीडबैक विश्लेषण')],
      a: '<defs><radialGradient id="hg"><stop offset="0" stop-color="#b8d000" stop-opacity=".95"/><stop offset="1" stop-color="#b8d000" stop-opacity="0"/></radialGradient></defs><rect class="b" x="14" y="10" width="170" height="110" rx="10" opacity=".5"/><circle cx="70" cy="48" r="30" fill="url(#hg)"/><circle cx="140" cy="86" r="24" fill="url(#hg)" opacity=".7"/><rect class="c" x="204" y="14" width="82" height="46" rx="9"/><text class="t" x="245" y="41" text-anchor="middle">VARIANT A</text><rect class="a" x="204" y="70" width="82" height="46" rx="9"/><text class="k" x="245" y="97" text-anchor="middle">VARIANT B</text>',
    },
    {
      t: T('CX Strategy', 'CX વ્યૂહરચના', 'CX रणनीति'),
      d: T('Customer experience strategy and journey mapping for digital transformation.', 'ડિજિટલ પરિવર્તન માટે ગ્રાહક અનુભવ વ્યૂહરચના અને જર્ની મેપિંગ.', 'डिजिटल परिवर्तन के लिए ग्राहक अनुभव रणनीति और जर्नी मैपिंग।'),
      l: [T('Customer journey mapping', 'ગ્રાહક જર્ની મેપિંગ', 'ग्राहक जर्नी मैपिंग'), T('Service design', 'સેવા ડિઝાઇન', 'सेवा डिज़ाइन'), T('Experience roadmaps', 'અનુભવ રોડમેપ્સ', 'अनुभव रोडमैप')],
      a: '<path class="c" d="M14 80C50 20 80 110 120 60S190 20 220 70 270 90 288 40"/><circle class="a" cx="14" cy="80" r="5"/><circle class="a" cx="120" cy="60" r="5"/><circle class="a" cx="220" cy="70" r="5"/><circle class="l" cx="288" cy="40" r="5"/><text class="t" x="14" y="114">AWARE</text><text class="t" x="104" y="114">TRY</text><text class="t" x="204" y="114">BUY</text><text class="t" x="258" y="114">STAY</text>',
    },
  ]

  /* reveal on scroll: three guards so fling-scrolling never lands on
     empty sections — (1) entry trigger, (2) rAF scroll catch-up for fast
     flings, (3) a safety timer so content can never stay hidden.
     (Same system as the about page.) */
  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    const rvEls = Array.from(root.querySelectorAll('[data-io]'))
    let io: IntersectionObserver | null = null
    let raf = 0
    let safety = 0
    let onScroll: (() => void) | null = null
    const reveal = (el: Element, fast = false): void => {
      if (el.classList.contains('in')) return
      if (fast) el.classList.add('fast')
      el.classList.add('in')
      if (io) io.unobserve(el)
    }
    try {
      if (!('IntersectionObserver' in window)) throw new Error('no-io')
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) reveal(e.target)
          }
        },
        { threshold: 0.15, rootMargin: '0px' },
      )
      rvEls.forEach((el) => io?.observe(el))
      const catchUp = (): void => {
        raf = 0
        const limit = window.innerHeight * 0.5
        for (const el of rvEls) {
          if (el.getBoundingClientRect().top < limit) reveal(el, true)
        }
      }
      onScroll = (): void => {
        if (!raf) raf = window.requestAnimationFrame(catchUp)
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      safety = window.setTimeout(catchUp, 5000)
    } catch {
      rvEls.forEach((el) => el.classList.add('in'))
    }
    return () => {
      io?.disconnect()
      if (raf) window.cancelAnimationFrame(raf)
      if (safety) window.clearTimeout(safety)
      if (onScroll) window.removeEventListener('scroll', onScroll)
    }
  }, [])

  /* brand forge */
  const fr = forgeRender(bfName, bfSeed)
  useEffect(() => {
    setBfReady(true)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    if (document.documentElement.classList.contains('low-power')) return undefined
    const NAMES = ['Peacock Technotrics', 'Adis Technologies']
    let ni = 0
    let ci = NAMES[0].length
    let dir = -1
    let wait = 10
    let dead = false
    let t = 0
    const tick = (): void => {
      if (dead || bfUser.current) return
      let d = 95
      if (wait > 0) {
        wait -= 1
        d = 100
      } else {
        ci += dir
        setBfName(NAMES[ni].slice(0, Math.max(0, ci)))
        if (dir === 1 && ci >= NAMES[ni].length) {
          dir = -1
          wait = 18
        } else if (dir === -1 && ci <= 0) {
          dir = 1
          ni = (ni + 1) % NAMES.length
          wait = 4
        }
        if (dir === -1) d = 45
      }
      t = window.setTimeout(tick, d)
    }
    t = window.setTimeout(tick, 600)
    return () => {
      dead = true
      window.clearTimeout(t)
    }
  }, [])

  /* pit */
  useEffect(() => {
    const pit = pitRef.current
    if (!pit) return undefined
    const W0 = pit.clientWidth
    const H0 = pit.clientHeight
    const R = W0 < 560 ? Math.max(42, Math.min(50, W0 / 8)) : Math.max(52, Math.min(84, W0 / 11))
    const M = 10
    const cl = (v: number, a: number, c: number): number => Math.max(a, Math.min(c, v))
    const arr: { el: HTMLDivElement; x: number; y: number; vx: number; vy: number; r: number; i: number; dg: boolean; off: boolean }[] = []
    // Tablet pit looks empty with every ball piled at the top then the
    // floor: spread the starting grid over the full pit height there.
    const tabSpread = window.matchMedia('(min-width: 768px) and (max-width: 1023px)').matches
    const TOP = M + R + 52
    bubbles.forEach((b, i) => {
      const el = document.createElement('div')
      el.className = 'bb'
      el.style.cssText = `width:${R * 2}px;height:${R * 2}px;--bg:${COL[i][0]};--fg:${COL[i][1]}`
      el.textContent = b.t
      el.tabIndex = 0
      el.setAttribute('role', 'button')
      pit.appendChild(el)
      const col = i % 3
      const row = Math.floor(i / 3)
      const spanX = (W0 - M * 2 - R * 2) / 2
      const jx = (Math.random() - 0.5) * 30
      const y0 = tabSpread ? TOP + ((H0 - TOP - M - R) * (row + 0.5)) / 2 : TOP + row * R * 2.4
      arr.push({ el, i, r: R, x: cl(M + R + col * spanX + jx, M + R, W0 - M - R), y: y0 + Math.random() * 6, vx: (Math.random() - 0.5) * 4, vy: 0, dg: false, off: false })
    })
    bubblesRef.current = arr
    let W = W0
    let H = H0
    const select = (idx: number): void => {
      setSel(idx)
      arr.forEach((o) => { const s = o.i === idx; o.el.classList.toggle('sel', s); o.off = s; o.el.style.display = s ? 'none' : '' })
      // React renders the same detail into #dt (keyed by sel); only
      // retrigger the enter animation imperatively.
      const dt = dtRef.current
      if (dt) {
        dt.classList.remove('sw')
        void dt.offsetWidth
        dt.classList.add('sw')
      }
    }
    const step = (): void => {
      for (const b of arr) {
        if (b.off || b.dg) continue
        b.vy += 0.55
        b.x += b.vx
        b.y += b.vy
        b.vx *= 0.996
        if (b.y + b.r > H - M) { b.y = H - M - b.r; b.vy *= -0.45; b.vx *= 0.97; if (Math.abs(b.vy) < 1.4) b.vy = 0 }
        if (b.x - b.r < M) { b.x = M + b.r; b.vx *= -0.6 }
        if (b.x + b.r > W - M) { b.x = W - M - b.r; b.vx *= -0.6 }
      }
      for (let k = 0; k < 8; k++) {
        for (let i = 0; i < arr.length; i++) {
          for (let j = i + 1; j < arr.length; j++) {
            const a = arr[i]
            const c = arr[j]
            if (a.off || c.off) continue
            const dx = c.x - a.x
            const dy = c.y - a.y
            const d = Math.hypot(dx, dy) || 0.01
            const m = a.r + c.r
            if (d < m) {
              const nx = dx / d
              const ny = dy / d
              const o = m - d
              const fa = a.dg ? 0 : c.dg ? 1 : 0.5
              const fc = c.dg ? 0 : a.dg ? 1 : 0.5
              a.x -= nx * o * fa
              a.y -= ny * o * fa
              c.x += nx * o * fc
              c.y += ny * o * fc
              const rv = (c.vx - a.vx) * nx + (c.vy - a.vy) * ny
              if (rv < 0) {
                const im = (-1.45 * rv) / 2
                if (!a.dg) { a.vx -= im * nx; a.vy -= im * ny }
                if (!c.dg) { c.vx += im * nx; c.vy += im * ny }
              }
            }
          }
        }
      }
      // Collisions can shove edge balls past the walls for a frame —
      // pull them back so they never render half-cut at the sides.
      for (const b of arr) {
        if (b.off || b.dg) continue
        b.x = cl(b.x, M + b.r, W - M - b.r)
        b.y = cl(b.y, M + b.r, H - M - b.r)
      }
    }
    const draw = (): void => {
      for (const b of arr) b.el.style.transform = `translate(${(b.x - b.r).toFixed(1)}px,${(b.y - b.r).toFixed(1)}px)`
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lite = reduced || document.documentElement.classList.contains('low-power')
    let running = false
    let raf = 0
    const tick = (): void => {
      step()
      draw()
      raf = requestAnimationFrame(tick)
    }
    const so = new IntersectionObserver(
      (es, o) => {
        if (es[0]?.isIntersecting && !running) {
          running = true
          if (lite) {
            for (let i = 0; i < 600; i++) step()
            draw()
          }
          tick()
          o.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    so.observe(pit)
    arr.forEach((b) => {
      let moved = 0
      let lx = 0
      let ly = 0
      const el = b.el
      el.addEventListener('pointerdown', (e) => {
        pit.classList.add('hit')
        b.dg = true
        moved = 0
        lx = (e as PointerEvent).clientX
        ly = (e as PointerEvent).clientY
        b.vx = 0
        b.vy = 0
        el.classList.add('dg')
        el.setPointerCapture((e as PointerEvent).pointerId)
      })
      el.addEventListener('pointermove', (e) => {
        if (!b.dg) return
        const pe = e as PointerEvent
        const r = pit.getBoundingClientRect()
        moved += Math.abs(pe.clientX - lx) + Math.abs(pe.clientY - ly)
        b.vx = (pe.clientX - lx) * 0.9
        b.vy = (pe.clientY - ly) * 0.9
        lx = pe.clientX
        ly = pe.clientY
        b.x = cl(pe.clientX - r.left, M + b.r, W - M - b.r)
        b.y = cl(pe.clientY - r.top, M + b.r, H - M - b.r)
        if (reduced) draw()
      })
      const up = (): void => {
        if (!b.dg) return
        b.dg = false
        el.classList.remove('dg')
        b.vx = cl(b.vx, -26, 26)
        b.vy = cl(b.vy, -26, 26)
        if (moved < 8) select(b.i)
      }
      el.addEventListener('pointerup', up)
      el.addEventListener('pointercancel', up)
      el.addEventListener('keydown', (e) => {
        if ((e as KeyboardEvent).key === 'Enter' || (e as KeyboardEvent).key === ' ') {
          e.preventDefault()
          select(b.i)
        }
      })
    })
    const shk = rootRef.current?.querySelector('#shk')
    const onShake = (): void => {
      for (const b of arr) {
        b.vy = -(10 + Math.random() * 10)
        b.vx = (Math.random() - 0.5) * 16
      }
    }
    shk?.addEventListener('click', onShake)
    const onResize = (): void => {
      W = pit.clientWidth
      H = pit.clientHeight
      for (const b of arr) {
        b.x = cl(b.x, M + b.r, W - M - b.r)
        b.y = cl(b.y, M + b.r, H - M - b.r)
      }
    }
    window.addEventListener('resize', onResize)
    window.visualViewport?.addEventListener('resize', onResize)
    select(0)
    return () => {
      cancelAnimationFrame(raf)
      so.disconnect()
      window.removeEventListener('resize', onResize)
      window.visualViewport?.removeEventListener('resize', onResize)
      shk?.removeEventListener('click', onShake)
      for (const b of arr) b.el.remove()
      bubblesRef.current = []
    }
  }, [lang])

  /* scratch cards */
  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    const cards = Array.from(root.querySelectorAll<HTMLElement>('.sc'))
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cards.forEach((c) => c.classList.add('done'))
      setDoneCount(cards.length)
      setDoneAll(cards.map(() => true))
      return undefined
    }
    const finish = (c: HTMLElement, idx: number): void => {
      if (c.classList.contains('done')) return
      c.classList.add('done')
      setDoneAll((prev) => {
        if (prev[idx]) return prev
        const next = [...prev]
        next[idx] = true
        return next
      })
      setDoneCount((n) => n + 1)
    }
    const cleanups: (() => void)[] = []
    cards.forEach((c, idx) => {
      const cv = c.querySelector('canvas')
      if (!cv) return
      const cur = c.querySelector<HTMLElement>('.scur')
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const w = c.clientWidth
      const h = c.clientHeight
      cv.width = w * dpr
      cv.height = h * dpr
      const g = cv.getContext('2d')
      if (!g) return
      g.scale(dpr, dpr)
      const gr = g.createLinearGradient(0, 0, w, h)
      gr.addColorStop(0, '#14291f')
      gr.addColorStop(1, '#10211a')
      g.fillStyle = gr
      g.fillRect(0, 0, w, h)
      g.strokeStyle = '#f3f1e614'
      g.lineWidth = 1
      for (let x = -h; x < w + h; x += 22) {
        g.beginPath()
        g.moveTo(x, 0)
        g.lineTo(x + h, h)
        g.stroke()
        g.beginPath()
        g.moveTo(x + h, 0)
        g.lineTo(x, h)
        g.stroke()
      }
      g.textAlign = 'center'
      let down = false
      let n = 0
      const pos = (e: PointerEvent): [number, number] => {
        const r = cv.getBoundingClientRect()
        return [((e.clientX - r.left) * w) / r.width, ((e.clientY - r.top) * h) / r.height]
      }
      const paint = (x: number, y: number): void => {
        g.globalCompositeOperation = 'destination-out'
        g.beginPath()
        g.arc(x, y, Math.max(30, w * 0.12), 0, 6.3)
        g.fill()
        g.globalCompositeOperation = 'source-over'
      }
      const chk = (): void => {
        const d = g.getImageData(0, 0, cv.width, cv.height).data
        let k = 0
        let t = 0
        for (let i = 3; i < d.length; i += 4 * 180) {
          t++
          if (d[i] < 30) k++
        }
        if (k / t > 0.4) finish(c, idx)
      }
      const onDown = (e: PointerEvent): void => {
        down = true
        c.classList.add('gone')
        try { cv.setPointerCapture(e.pointerId) } catch { /* noop */ }
        const p = pos(e)
        paint(p[0], p[1])
      }
      const onMove = (e: PointerEvent): void => {
        if (cur) {
          const r = c.getBoundingClientRect()
          cur.style.opacity = '1'
          cur.style.transform = `translate(${e.clientX - r.left - 14}px, ${e.clientY - r.top - 14}px)`
        }
        if (!down) return
        const p = pos(e)
        paint(p[0], p[1])
        n += 1
        if (n % 6 === 0) chk()
      }
      const onUp = (): void => {
        down = false
        chk()
      }
      cv.addEventListener('pointerdown', onDown as EventListener)
      cv.addEventListener('pointermove', onMove as EventListener)
      cv.addEventListener('pointerup', onUp)
      const onLeave = (): void => {
        if (cur) cur.style.opacity = '0'
      }
      cv.addEventListener('pointerleave', onLeave)
      cleanups.push(() => {
        cv.removeEventListener('pointerdown', onDown as EventListener)
        cv.removeEventListener('pointermove', onMove as EventListener)
        cv.removeEventListener('pointerup', onUp)
        cv.removeEventListener('pointerleave', onLeave)
      })
    })
    const rev = root.querySelector('#rev')
    const onRev = (): void => {
      cards.forEach((c, i) => finish(c, i))
    }
    rev?.addEventListener('click', onRev)
    return () => {
      cleanups.forEach((fn) => fn())
      rev?.removeEventListener('click', onRev)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang])

  return (
    <div ref={rootRef}>
      <div className="grain" aria-hidden="true" />
      <main id="top" tabIndex={-1}>
        {/* Hero */}
        <section className="hero" id="hero" data-io="">
          <div className="wrap">
            <div className="hl">
              <h1 className="rv" style={cssVars({ '--i': 0 })}>{`${T('UX Design &', 'UX ડિઝાઇન અને', 'UX डिज़ाइन और')} `}<em>{T('Branding', 'બ્રાન્ડિંગ', 'ब्रांडिंग')}</em></h1>
              <p className="sub rv" style={cssVars({ '--i': 1 })}>
                {T(
                  'Strategic design solutions that elevate user experiences and strengthen brand identity, driving measurable increases in user adoption, engagement, and business performance.',
                  'વ્યૂહાત્મક ડિઝાઇન સોલ્યુશન્સ જે યુઝર અનુભવોને ઊંચા લઈ જાય અને બ્રાન્ડ ઓળખને મજબૂત કરે, યુઝર અપનાવ, જોડાણ અને વ્યવસાય પ્રદર્શનમાં માપી શકાય તેવો વધારો લાવે.',
                  'रणनीतिक डिज़ाइन समाधान जो यूज़र अनुभवों को ऊपर उठाएँ और ब्रांड पहचान को मज़बूत करें, यूज़र अपनाने, जुड़ाव और व्यावसायिक प्रदर्शन में मापने योग्य वृद्धि लाएँ।',
                )}
              </p>
              <div className="acts rv" style={cssVars({ '--i': 2 })}>
                <a className="pill y" id="cta1" href={withLang('/contact')}>
                  <span>{T('Start Design Project', 'ડિઝાઇન પ્રોજેક્ટ શરૂ કરો', 'डिज़ाइन प्रोजेक्ट शुरू करें')}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" /></svg>
                </a>
              </div>
            </div>
            <div className="fg5 rv" style={cssVars({ '--i': 3 })} role="group" aria-label={T('Brand forge: type a name and a sample identity is generated', 'બ્રાન્ડ ફોર્જ: નામ લખો અને સેમ્પલ ઓળખ બનશે', 'ब्रांड फ़ोर्ज: नाम लिखें और सैंपल पहचान बनेगी')}>
              <div className="fg5-field">
                <label className="fg5-lab mono" htmlFor="bn">{T('Type a brand name', 'બ્રાન્ડ નામ લખો', 'ब्रांड नाम लिखें')}</label>
                <div className="fg5-box">
                  <input className="fg5-in" id="bn" type="text" maxLength={22} placeholder={T('Your brand', 'તમારી બ્રાન્ડ', 'आपका ब्रांड')} autoComplete="off" spellCheck={false} value={bfName} onChange={(e) => { bfUser.current = true; setBfName(e.target.value) }} onFocus={() => { bfUser.current = true }} />
                  <button className="fg5-rmx" type="button" id="rmx" onClick={() => { bfUser.current = true; setBfSeed((s) => s + 1); if (!bfName.trim()) setBfName('Peacock Technotrics') }}>{T('Remix', 'રીમિક્સ', 'रीमिक्स')}</button>
                </div>
              </div>
              <div className="fg5-split" id="bgd">
                {bfReady ? (
                  <div key={`${bfName}:${bfSeed}`} style={{ display: 'contents' }}>
                    <div className="fg5-id"><span className="fg5-n">01 / Identity</span><i className="fg5-dia" aria-hidden="true"><b>{fr.mono}</b></i><b>{bfName.trim() || 'Your brand'}</b><span className="fg5-tag" id="tg">{fr.tagline}</span><em>{`hello@${fr.slug}.studio`}</em></div>
                    <div className="fg5-list">
                      <div className="fg5-row"><span>{T('Palette', 'પેલેટ', 'पैलेट')}</span><div className="fg5-sws"><i style={{ background: '#3fd488' }} /><i style={{ background: '#b8d000' }} /><i style={{ background: '#264438' }} /><i style={{ background: '#f3f1e6' }} /><i style={{ background: '#0a1510' }} /></div></div>
                      <div className="fg5-row"><span>{T('App icon', 'એપ આઇકન', 'ऐप आइकन')}</span><i className="fg5-ic" aria-hidden="true"><b>{fr.mono}</b></i></div>
                      <div className="fg5-row"><span>{T('Card', 'કાર્ડ', 'कार्ड')}</span><b>{bfName.trim() || T('Your brand', 'તમારી બ્રાન્ડ', 'आपका ब्रांड')}</b></div>
                      <div className="fg5-row"><span>{T('Type', 'ટાઇપ', 'टाइप')}</span><b className="fg5-aa">Aa</b><span className="fg5-fn">Bricolage Grotesque</span></div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        {/* Services pit */}
        <section className="sec" id="pitw" data-io="">
          <div className="wrap">
            <div className="top">
              <h2 className="hd2 rv" style={cssVars({ '--i': 0 })}>{`${T('Comprehensive Design', 'કોમ્પ્રિહેન્સિવ ડિઝાઇન', 'कॉम्प्रिहेंसिव डिज़ाइन')} `}<em>{T('Services', 'સેવાઓ', 'सेवाएँ')}</em></h2>
              <p className="lead rv" style={cssVars({ '--i': 1 })}>
                {T(
                  'From user research to brand identity, complete design solutions for digital products. Drag, throw and tap the bubbles.',
                  'યુઝર રિસર્ચથી બ્રાન્ડ ઓળખ સુધી, ડિજિટલ પ્રોડક્ટ્સ માટે સંપૂર્ણ ડિઝાઇન સોલ્યુશન્સ. બબલ્સને ખેંચો, ફેંકો અને ટેપ કરો.',
                  'यूज़र रिसर्च से ब्रांड पहचान तक, डिजिटल प्रोडक्ट्स के लिए संपूर्ण डिज़ाइन समाधान। बबल्स को खींचें, फेंकें और टैप करें।',
                )}
              </p>
            </div>
            <div className="pw rv" style={cssVars({ '--i': 2 })}>
              <div className="pit" id="pit" ref={pitRef}>
                <div className="pbar mono">
                  <button type="button" id="shk" onClick={() => {
                    pitRef.current?.classList.add('hit')
                    for (const b of bubblesRef.current) {
                      b.vy = -(10 + Math.random() * 10)
                      b.vx = (Math.random() - 0.5) * 16
                    }
                  }}>{T('Shuffle', 'શફલ કરો', 'शफ़ल करें')}</button>
                  <span>{T('Tap a bubble to open it', 'ખોલવા માટે બબલ પર ટેપ કરો', 'खोलने के लिए बबल पर टैप करें')}</span>
                </div>
                <div className="phint mono" aria-hidden="true"><span>{T('Drag · Throw · Tap', 'ખેંચો · ફેંકો · ટેપ કરો', 'खींचें · फेंकें · टैप करें')}</span></div>
              </div>
              <div className="dt sw" id="dt" ref={dtRef} aria-live="polite" key={sel ?? 'none'}>
                {sel !== null && (
                  <div key={sel} className="sw">
                    <h3>{bubbles[sel].t}</h3>
                    <p>{bubbles[sel].d}</p>
                    <ul>{bubbles[sel].l.map((x) => (<li key={x}>{x}</li>))}</ul>
                    <div className="vz"><svg className="viz" viewBox="0 0 300 130" aria-hidden="true" dangerouslySetInnerHTML={{ __html: bubbles[sel].a }} /></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Process scratch */}
        <section className="sec" id="process" data-io="">
          <div className="wrap">
            <div className="top">
              <h2 className="hd2 rv" style={cssVars({ '--i': 0 })}>{`${T('Our Design', 'અમારી ડિઝાઇન', 'हमारी डिज़ाइन')} `}<em>{T('Process', 'પ્રોસેસ', 'प्रोसेस')}</em></h2>
              <p className="lead rv" style={cssVars({ '--i': 1 })}>
                {T(
                  'User-centered methodology from research to delivery. Scratch each card to reveal the step.',
                  'રિસર્ચથી ડિલિવરી સુધી યુઝર-કેન્દ્રિત પદ્ધતિ. દરેક કાર્ડને ઘસીને તબક્કો જુઓ.',
                  'रिसर्च से डिलीवरी तक यूज़र-केंद्रित पद्धति। हर कार्ड को खुरचकर चरण देखें।',
                )}
              </p>
            </div>
            <div className="sg2" id="sg">
              {steps.map((st, i) => (
                <article
                  key={st.title}
                  className={`sc${doneAll[i] ? ' done' : ''}`}
                  tabIndex={doneAll[i] ? undefined : 0}
                  onKeyDown={(e) => {
                    if (e.key !== 'Enter' && e.key !== ' ') return
                    const card = e.currentTarget
                    if (card.classList.contains('done')) return
                    e.preventDefault()
                    card.classList.add('done')
                    setDoneAll((prev) => prev.map((d, j) => (j === i ? true : d)))
                    setDoneCount((n) => Math.min(4, n + 1))
                  }}
                >                  <div className="scb">
                    <em className="mono">{`${T('Step', 'તબક્કો', 'चरण')} 0${i + 1}`}</em>
                    <h3>{st.title}</h3>
                    <p>{st.desc}</p>
                  </div>
                  {!doneAll[i] && (<><canvas aria-hidden="true" /><div className="scov" aria-hidden="true"><b>{`0${i + 1}`}</b><span>{T('SCRATCH TO REVEAL', 'ખુલવા માટે ઘસો', 'खुलने के लिए खुरचें')}</span></div><i className="scur" aria-hidden="true"><u /><span>{T('SCRATCH', 'ઘસો', 'खुरचें')}</span></i></>)}
                </article>
              ))}
            </div>
            <div className="sk2 mono rv" style={cssVars({ '--i': 3 })}>
              <span><b id="cnt">{doneCount}</b>{` ${T('of 4 revealed', '4 માંથી ખુલ્લા', '4 में से खुले')}`}</span>
              <button type="button" id="rev" onClick={() => { setDoneAll([true, true, true, true]); setDoneCount(4) }}>{T('Reveal all', 'બધા ખોલો', 'सभी खोलें')}</button>
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}
