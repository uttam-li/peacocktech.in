import { useEffect, useRef, useState } from 'react'
import { T, withLang } from '@data/site'
import { cssVars } from '@lib/style'
import Arrow from '@ui/Arrow'

const DURW: string[] = ['W1–W2', 'W2–W4', 'W4–W13 · S1–S5', 'W11–W15', 'W15 →']

interface Module {
  title: string
  small: string
  points: [string, string, string]
  short: string
}

const H2 = 'm-0 max-w-[16ch] text-balance font-serif text-[clamp(2.3rem,5.2vw,4.6rem)] font-semibold leading-[1.05] tracking-[-0.035em]'
const LEDE = 'mb-0 ml-0 mr-0 mt-[1.1rem] max-w-[46ch] text-[clamp(1rem,1.3vw,1.15rem)] leading-[1.55] text-muted'

export default function ErpPage() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const dwRef = useRef<HTMLDivElement | null>(null)

  const modules: Module[] = [
    {
      title: T('Custom ERP Development', 'કસ્ટમ ERP ડેવલપમેન્ટ', 'कस्टम ERP डेवलपमेंट'),
      small: T('Tailored ERP solutions designed for your specific industry and business processes', 'તમારી ચોક્કસ ઇન્ડસ્ટ્રી અને બિઝનેસ પ્રોસેસ માટે ડિઝાઇન કરેલા ટેલર્ડ ERP સોલ્યુશન્સ', 'आपके विशिष्ट उद्योग और बिज़नेस प्रोसेस के लिए डिज़ाइन किए गए टेलर्ड ERP सॉल्यूशंस'),
      points: [
        T('Requirements analysis & design', 'રિક્વાયરમેન્ટ્સ એનાલિસિસ અને ડિઝાઇન', 'रिक्वायरमेंट एनालिसिस और डिज़ाइन'),
        T('Modular architecture', 'મોડ્યુલર આર્કિટેક્ચર', 'मॉड्यूलर आर्किटेक्चर'),
        T('Integration with existing systems', 'હાલની સિસ્ટમ્સ સાથે ઇન્ટિગ્રેશન', 'मौजूदा सिस्टम के साथ इंटीग्रेशन'),
      ],
      short: T('Custom ERP', 'કસ્ટમ ERP', 'कस्टम ERP'),
    },
    {
      title: T('Cloud-Native Applications', 'ક્લાઉડ-નેટિવ એપ્લિકેશન્સ', 'क्लाउड-नेटिव एप्लिकेशन'),
      small: T('Scalable SaaS platforms built on modern cloud infrastructure with microservices architecture', 'આધુનિક ક્લાઉડ ઇન્ફ્રાસ્ટ્રક્ચર પર Microservices આર્કિટેક્ચર સાથે બનેલા સ્કેલેબલ SaaS પ્લેટફોર્મ્સ', 'आधुनिक क्लाउड इंफ्रास्ट्रक्चर पर Microservices आर्किटेक्चर के साथ बने स्केलेबल SaaS प्लेटफॉर्म'),
      points: [
        T('AWS, Azure, Google Cloud', 'AWS, Azure, Google Cloud', 'AWS, Azure, Google Cloud'),
        T('Container orchestration', 'કન્ટેનર ઓર્કેસ્ટ્રેશન', 'कंटेनर ऑर्केस्ट्रेशन'),
        T('Auto-scaling & high availability', 'ઓટો-સ્કેલિંગ અને હાઇ અવેલેબિલિટી', 'ऑटो-स्केलिंग और हाई अवेलेबिलिटी'),
      ],
      short: T('Cloud-native', 'ક્લાઉડ-નેટિવ', 'क्लाउड-नेटिव'),
    },
    {
      title: T('Web & Mobile Apps', 'વેબ અને મોબાઇલ એપ્સ', 'वेब और मोबाइल ऐप्स'),
      small: T('Responsive web applications and native mobile apps for iOS and Android platforms', 'iOS અને Android પ્લેટફોર્મ્સ માટે રિસ્પોન્સિવ વેબ એપ્લિકેશન્સ અને નેટિવ મોબાઇલ એપ્સ', 'iOS और Android प्लेटफॉर्म के लिए रिस्पॉन्सिव वेब एप्लिकेशन और नेटिव मोबाइल ऐप्स'),
      points: [
        T('React, Vue.js, Angular', 'React, Vue.js, Angular', 'React, Vue.js, Angular'),
        T('iOS & Android native apps', 'iOS અને Android નેટિવ એપ્સ', 'iOS और Android नेटिव ऐप्स'),
        T('Progressive web apps (PWA)', 'પ્રોગ્રેસિવ વેબ એપ્સ (PWA)', 'प्रोग्रेसिव वेब ऐप्स (PWA)'),
      ],
      short: T('Web & mobile', 'વેબ અને મોબાઇલ', 'वेब और मोबाइल'),
    },
    {
      title: T('Database Design & Optimization', 'ડેટાબેઝ ડિઝાઇન અને ઓપ્ટિમાઇઝેશન', 'डेटाबेस डिज़ाइन और ऑप्टिमाइज़ेशन'),
      small: T('Robust database architecture for performance, scalability, and data integrity', 'પરફોર્મન્સ, સ્કેલેબિલિટી અને ડેટા ઇન્ટિગ્રિટી માટે મજબૂત ડેટાબેઝ આર્કિટેક્ચર', 'परफॉर्मेंस, स्केलेबिलिटी और डेटा इंटीग्रिटी के लिए मज़बूत डेटाबेस आर्किटेक्चर'),
      points: [
        T('SQL & NoSQL databases', 'SQL અને NoSQL ડેટાબેઝ', 'SQL और NoSQL डेटाबेस'),
        T('Performance tuning', 'પરફોર્મન્સ ટ્યુનિંગ', 'परफॉर्मेंस ट्यूनिंग'),
        T('Data migration & backup', 'ડેટા માઇગ્રેશન અને બેકઅપ', 'डेटा माइग्रेशन और बैकअप'),
      ],
      short: T('Database', 'ડેટાબેઝ', 'डेटाबेस'),
    },
    {
      title: T('API Development & Integration', 'API ડેવલપમેન્ટ અને ઇન્ટિગ્રેશન', 'API डेवलपमेंट और इंटीग्रेशन'),
      small: T('RESTful APIs, GraphQL, and seamless third-party system integration', 'RESTful APIs, GraphQL અને સીમલેસ થર્ડ-પાર્ટી સિસ્ટમ ઇન્ટિગ્રેશન', 'RESTful APIs, GraphQL और सहज थर्ड-पार्टी सिस्टम इंटीग्रेशन'),
      points: [
        T('API design & documentation', 'API ડિઝાઇન અને ડોક્યુમેન્ટેશન', 'API डिज़ाइन और डॉक्यूमेंटेशन'),
        T('Payment gateway integration', 'પેમેન્ટ ગેટવે ઇન્ટિગ્રેશન', 'पेमेंट गेटवे इंटीग्रेशन'),
        T('Third-party connectors', 'થર્ડ-પાર્ટી કનેક્ટર્સ', 'थर्ड-पार्टी कनेक्टर्स'),
      ],
      short: 'API',
    },
    {
      title: T('Legacy System Modernization', 'લેગસી સિસ્ટમ મોર્ડનાઇઝેશન', 'लेगसी सिस्टम मॉडर्नाइज़ेशन'),
      small: T('Migrate outdated systems to modern technology stacks without disrupting operations', 'ઓપરેશન્સમાં વિક્ષેપ પાડ્યા વિના જૂની સિસ્ટમ્સને આધુનિક ટેકનોલોજી સ્ટેક પર માઇગ્રેટ કરો', 'ऑपरेशंस बाधित किए बिना पुराने सिस्टम को आधुनिक टेक्नोलॉजी स्टैक पर माइग्रेट करें'),
      points: [
        T('Technology assessment', 'ટેકનોલોજી એસેસમેન્ટ', 'टेक्नोलॉजी असेसमेंट'),
        T('Phased migration', 'તબક્કાવાર માઇગ્રેશન', 'चरणबद्ध माइग्रेशन'),
        T('Zero-downtime cutover', 'ઝીરો-ડાઉનટાઇમ કટઓવર', 'ज़ीरो-डाउनटाइम कटओवर'),
      ],
      short: T('Legacy', 'લેગસી', 'लेगसी'),
    },
  ]

  const families: { name: string; tiles: string[] }[] = [
    { name: T('Frontend', 'ફ્રન્ટએન્ડ', 'फ्रंटएंड'), tiles: ['React.js', 'Vue.js', 'Angular', 'TypeScript', 'Tailwind CSS'] },
    { name: T('Backend', 'બેકએન્ડ', 'बैकएंड'), tiles: ['Node.js', 'Python', '.NET Core', 'Java/Spring', 'PHP/Laravel'] },
    { name: T('Database', 'ડેટાબેઝ', 'डेटाबेस'), tiles: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch'] },
    { name: T('Cloud & DevOps', 'ક્લાઉડ અને DevOps', 'क्लाउड और DevOps'), tiles: ['CI/CD Pipelines', 'AWS', 'Azure', 'Docker', 'Kubernetes'] },
  ]
  const initials = ['Re', 'Vu', 'An', 'Ts', 'Tw', 'Nd', 'Py', 'Ne', 'Jv', 'Ph', 'Pg', 'My', 'Mo', 'Rd', 'El', 'Ci', 'Aw', 'Az', 'Dk', 'K8']

  const phases: { t: string; d: string; cols: string; delay: number; op?: boolean }[] = [
    { t: T('Discovery & Planning', 'ડિસ્કવરી અને પ્લાનિંગ', 'डिस्कवरी और प्लानिंग'), d: T('Workshops, requirements, clear scope', 'વર્કશોપ્સ, રિક્વાયરમેન્ટ્સ, સ્પષ્ટ સ્કોપ', 'वर्कशॉप्स, रिक्वायरमेंट्स, स्पष्ट स्कोप'), cols: '1/3', delay: 0 },
    { t: T('Design & Architecture', 'ડિઝાઇન અને આર્કિટેક્ચર', 'डिज़ाइन और आर्किटेक्चर'), d: T('System design, data model, UX', 'સિસ્ટમ ડિઝાઇન, ડેટા મોડેલ, UX', 'सिस्टम डिज़ाइन, डेटा मॉडल, UX'), cols: '2/5', delay: 2 },
    { t: T('Agile Development', 'એજાઇલ ડેવલપમેન્ટ', 'एजाइल डेवलपमेंट'), d: T('Two-week sprints, a working demo each time', 'બે અઠવાડિયાના સ્પ્રિન્ટ્સ, દરેક વખતે વર્કિંગ ડેમો', 'दो सप्ताह के स्प्रिंट, हर बार वर्किंग डेमो'), cols: '', delay: 4 },
    { t: T('Testing & Deployment', 'ટેસ્ટિંગ અને ડિપ્લોયમેન્ટ', 'टेस्टिंग और डिप्लॉयमेंट'), d: T('QA, security checks, monitored release', 'QA, સિક્યોરિટી ચેક્સ, મોનિટર્ડ રિલીઝ', 'QA, सिक्योरिटी चेक्स, मॉनिटर्ड रिलीज़'), cols: '11/16', delay: 6 },
    { t: T('Support & Growth', 'સપોર્ટ અને ગ્રોથ', 'सपोर्ट और ग्रोथ'), d: T('Maintenance and new modules as you scale', 'તમે સ્કેલ કરો તેમ મેન્ટેનન્સ અને નવા મોડ્યુલ્સ', 'जैसे-जैसे आप स्केल करें, मेंटेनेंस और नए मॉड्यूल्स'), cols: '15/17', delay: 8, op: true },
  ]

  const [onMods, setOnMods] = useState<boolean[]>([true, false, false, false, false, false])
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const cleanups: Array<() => void> = []
    // Scroll reveal with three guards so fling-scrolling never lands on
    // empty sections: (1) entry trigger, (2) rAF scroll catch-up for fast
    // flings, (3) a safety timer so content can never stay hidden.
    // (Same system as the about page.)
    const rvEls = Array.from(root.querySelectorAll('[data-io]'))
    let io: IntersectionObserver | null = null
    let raf = 0
    let safety = 0
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
      rvEls.forEach((el) => {
        io?.observe(el)
      })
      const catchUp = (): void => {
        raf = 0
        const limit = window.innerHeight * 0.5
        for (const el of rvEls) {
          if (el.getBoundingClientRect().top < limit) reveal(el, true)
        }
      }
      const onScroll = (): void => {
        if (!raf) raf = window.requestAnimationFrame(catchUp)
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      cleanups.push(() => window.removeEventListener('scroll', onScroll))
      safety = window.setTimeout(catchUp, 5000)
    } catch {
      rvEls.forEach((el) => el.classList.add('in'))
    }
    // hero tilt
    const hero = root.querySelector('.ep-hero')
    const dw = dwRef.current
    let onMove: ((e: MouseEvent) => void) | null = null
    if (hero && dw && window.matchMedia('(hover:hover)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onMove = (e: MouseEvent) => {
        const r = (hero as HTMLElement).getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width
        const y = (e.clientY - r.top) / r.height
        dw.style.setProperty('--ry', (-9 + (x - 0.5) * 10).toFixed(2))
        dw.style.setProperty('--rx', (3 + (0.5 - y) * 6).toFixed(2))
      }
      hero.addEventListener('pointermove', onMove as EventListener)
    }
    return () => {
      io?.disconnect()
      if (raf) window.cancelAnimationFrame(raf)
      if (safety) window.clearTimeout(safety)
      cleanups.forEach((fn) => fn())
      if (hero && onMove) hero.removeEventListener('pointermove', onMove as EventListener)
    }
  }, [])

  const toggle = (i: number): void => {
    setOnMods((prev) => prev.map((v, k) => (k === i ? !v : v)))
  }
  const onCount = onMods.filter(Boolean).length
  const onNames = modules.filter((_, i) => onMods[i]).map((m) => m.short)

  const C = 260
  const Rd = 190
  const pts = modules.map((_, i) => {
    const a = ((-90 + i * 60) * Math.PI) / 180
    return [C + Rd * Math.cos(a), C + Rd * Math.sin(a)] as [number, number]
  })

  return (
    <div ref={rootRef}>
      <div className="grain" aria-hidden="true" />
      <main id="top" tabIndex={-1}>
        {/* Hero */}
        {/* Hero */}
        <section className="ep-hero px-[var(--pad)] pb-20 pt-[30px]" aria-labelledby="erp-title" data-io="">
          <div className="wrap">
              <div>
                <h1 id="erp-title" className="rv m-0 mb-[1.3rem] text-balance font-serif text-[clamp(2.3rem,5.2vw,4.6rem)] font-semibold leading-[1.05] tracking-[-0.035em]" style={cssVars({ '--i': 0 })}>
                  {`${T('ERP & Software', 'ERP અને સોફ્ટવેર', 'ERP और सॉफ़्टवेयर')} `}<em>{T('Development', 'ડેવલપમેન્ટ', 'डेवलपमेंट')}</em>
                </h1>
                <p className="ep-sub rv" style={cssVars({ '--i': 1 })}>
                  {T(
                    'Mission-critical ERP systems and enterprise applications, architected with industry best practices, modern technology stacks and scalable infrastructure to drive operational excellence.',
                    'મિશન-ક્રિટિકલ ERP સિસ્ટમ્સ અને એન્ટરપ્રાઇઝ એપ્લિકેશન્સ, ઇન્ડસ્ટ્રી બેસ્ટ પ્રેક્ટિસ, આધુનિક ટેકનોલોજી સ્ટેક અને સ્કેલેબલ ઇન્ફ્રાસ્ટ્રક્ચર સાથે આર્કિટેક્ટ કરેલ, ઓપરેશનલ એક્સેલન્સ માટે.',
                    'मिशन-क्रिटिकल ERP सिस्टम और एंटरप्राइज़ एप्लिकेशन, इंडस्ट्री बेस्ट प्रैक्टिस, आधुनिक टेक्नोलॉजी स्टैक और स्केलेबल इंफ्रास्ट्रक्चर के साथ आर्किटेक्टेड, ऑपरेशनल एक्सीलेंस के लिए।',
                  )}
                </p>
                <div className="ep-acts rv" style={cssVars({ '--i': 2 })}>
                  <a className="hero-btn" href={withLang('/contact')}>
                    <span>{T('Discuss your ERP project', 'તમારા ERP પ્રોજેક્ટની ચર્ચા કરો', 'अपने ERP प्रोजेक्ट पर चर्चा करें')}</span>
                    <Arrow />
                  </a>
                </div>
              </div>
              <div className="dw rv" id="dw" ref={dwRef} role="img" style={cssVars({ '--i': 3 })} aria-label={T('ERP deploy console', 'ERP ડિપ્લોય કન્સોલ', 'ERP डिप्लॉय कंसोल')}>
                <div className="term">
                  <div className="term-h"><i /><i /><i /><span className="mono">{T('peacock — deploy', 'peacock — ડિપ્લોય', 'peacock — डिप्लॉय')}</span></div>
                  <pre className="term-b">
                    <code><span className="tp">$</span> peacock deploy --module inventory</code>
                    <code><span className="ok">✓</span> schema migrated · 412 tables</code>
                    <code><span className="ok">✓</span> 1,208 orders synced · 0 conflicts</code>
                    <code><span className="ar">→</span>{` ${T('live on floor 3', 'ફ્લોર 3 પર લાઇવ', 'फ़्लोर 3 पर लाइव')} `}<span className="caret" aria-hidden="true" /></code>
                  </pre>
                </div>
              </div>
          </div>
        </section>

        {/* Modules */}
        <section className="sec" id="build" aria-labelledby="erp-build" data-io="">
          <div className="wrap">
            <div className="mb-[clamp(36px,5vw,64px)] grid justify-items-start gap-[18px]">
              <h2 id="erp-build" className={`${H2} rv`} style={cssVars({ '--i': 0 })}>{`${T('Comprehensive Development', 'કોમ્પ્રિહેન્સિવ ડેવલપમેન્ટ', 'कॉम्प्रिहेंसिव डेवलपमेंट')} `}<em>{T('Services', 'સેવાઓ', 'सेवाएं')}</em></h2>
              <p className={`${LEDE} rv max-w-[46ch]`} style={cssVars({ '--i': 1 })}>
                {T(
                  'End-to-end software development from concept to deployment and beyond. Switch modules on and watch your system take shape.',
                  'કન્સેપ્ટથી ડિપ્લોયમેન્ટ અને તે પછી સુધી એન્ડ-ટુ-એન્ડ સોફ્ટવેર ડેવલપમેન્ટ. મોડ્યુલ્સ ચાલુ કરો અને તમારી સિસ્ટમને આકાર લેતા જુઓ.',
                  'कॉन्सेप्ट से डिप्लॉयमेंट और उसके बाद तक एंड-टू-एंड सॉफ्टवेयर डेवलपमेंट। मॉड्यूल्स चालू करें और अपने सिस्टम को आकार लेते देखें।',
                )}
              </p>
            </div>
            <div className="cfg rv" style={cssVars({ '--i': 2 })}>
              <div className="mds" id="mds">
                {modules.map((m, i) => (
                  <button key={m.title} className={`md efade${onMods[i] ? ' on' : ''}`} type="button" role="switch" aria-checked={onMods[i]} data-i={i} onClick={() => toggle(i)} style={cssVars({ '--i': i })}>
                    <span className="mt"><b>{m.title}</b><small>{m.small}</small></span>
                    <i className="sw" aria-hidden="true" />
                    <ul>{m.points.map((pt) => (<li key={pt}>{pt}</li>))}</ul>
                  </button>
                ))}
              </div>
              <div className="cv">
                <svg viewBox="0 0 520 520" id="svg" aria-hidden="true">
                  {pts.map((p, i) => (
                    <path key={`c${i}`} className={`cn${onMods[i] ? ' on' : ''}`} id={`cn${i}`} d={`M${C},${C} L${p[0].toFixed(1)},${p[1].toFixed(1)}`} />
                  ))}
                  {pts.map((p, i) => (
                    <circle key={`p${i}`} className={`pu${onMods[i] ? ' on' : ''}`} id={`pu${i}`} r={3.5}>
                      <animateMotion dur={`${2 + i * 0.3}s`} repeatCount="indefinite" path={`M${C},${C} L${p[0].toFixed(1)},${p[1].toFixed(1)}`} />
                    </circle>
                  ))}
                  {pts.map((p, i) => (
                    <g key={`n${i}`} className={`nd${onMods[i] ? ' on' : ''}`} id={`nd${i}`} data-i={i} onClick={() => toggle(i)}>
                      <rect x={p[0] - 70} y={p[1] - 21} width={140} height={42} rx={12} />
                      <text x={p[0]} y={p[1]}>{modules[i].short}</text>
                    </g>
                  ))}
                  <g className="hub">
                    <circle cx={C} cy={C} r={52} />
                    <circle className="rg" cx={C} cy={C} r={68} />
                    <text x={C} y={C + 5}>{`${T('YOUR', 'તમારું', 'आपका')} `}<tspan fill="#3fd488">ERP</tspan></text>
                  </g>
                </svg>
                <div className="sm">
                  <p id="sum">
                    {onCount > 0 ? (
                      <><b>{onCount}</b><span style={{ color: 'var(--muted)' }}>{' / 6'}</span>{` ${T('modules selected', 'મોડ્યુલ્સ પસંદ કરેલ', 'मॉड्यूल्स चयनित')}: ${onNames.join(', ')}.`}</>
                    ) : (
                      <>{T('Switch one on to begin.', 'શરૂ કરવા માટે એક ચાલુ કરો.', 'शुरू करने के लिए एक चालू करें.')}</>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stack */}
        <section className="sec" id="stack" aria-labelledby="erp-stack" data-io="">
          <div className="wrap">
            <div className="mb-[clamp(36px,5vw,64px)] grid justify-items-start gap-[18px]">
              <h2 id="erp-stack" className={`${H2} rv`} style={cssVars({ '--i': 0 })}>{`${T('Modern Technology', 'આધુનિક ટેકનોલોજી', 'आधुनिक टेक्नोलॉजी')} `}<em>{T('Stack', 'સ્ટેક', 'स्टैक')}</em></h2>
              <p className={`${LEDE} rv max-w-[46ch]`} style={cssVars({ '--i': 1 })}>
                {T(
                  'We work with the latest and most reliable technologies. Twenty elements, four families.',
                  'અમે નવીનતમ અને સૌથી વિશ્વસનીય ટેકનોલોજીઓ સાથે કામ કરીએ છીએ. વીસ એલિમેન્ટ્સ, ચાર ફેમિલી.',
                  'हम नवीनतम और सबसे विश्वसनीय टेक्नोलॉजी के साथ काम करते हैं। बीस एलिमेंट्स, चार फैमिली।',
                )}
              </p>
            </div>
            <div className="rv border-t border-line" style={cssVars({ '--i': 2 })}>
              {families.map((f, fi) => (
                <div
                  key={f.name}
                  className="grid grid-cols-2 items-baseline gap-x-6 gap-y-4 border-b border-line py-5 lg:grid-cols-[150px_repeat(5,minmax(0,1fr))] lg:items-center efade"
                  style={cssVars({ '--i': fi })}
                >
                  <h3 className="col-span-2 m-0 font-mono text-[11px] font-normal uppercase tracking-[0.1em] text-[var(--gd)] lg:col-span-1">
                    {f.name}
                  </h3>
                  {f.tiles.map((t, ti) => {
                    const gi = fi * 5 + ti
                    return (
                      <div key={t} className="group flex items-baseline gap-2">
                        <span className="font-mono text-[11px] uppercase leading-none tracking-[0.1em] text-[var(--gd)] transition-colors group-hover:text-green-deep">
                          {String(gi + 1).padStart(2, '0')}
                        </span>
                        <b className="font-serif text-base font-semibold leading-none text-ink transition-colors group-hover:text-green-deep">
                          {initials[gi]}
                        </b>
                        <span className="text-sm leading-snug text-muted transition-colors group-hover:text-ink">{t}</span>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        {/* Process */}
        <section className="sec" aria-labelledby="erp-process" data-io="">
          <div className="wrap">
            <div className="mb-[clamp(36px,5vw,64px)] grid justify-items-start gap-[18px]">
              <h2 id="erp-process" className={`${H2} rv`} style={cssVars({ '--i': 0 })}>{`${T('Our Development', 'અમારી ડેવલપમેન્ટ', 'हमारी डेवलपमेंट')} `}<em>{T('Process', 'પ્રોસેસ', 'प्रोसेस')}</em></h2>
              <p className={`${LEDE} rv max-w-[46ch]`} style={cssVars({ '--i': 1 })}>
                {T(
                  'Agile methodology with transparent communication and regular deliveries.',
                  'પારદર્શક કોમ્યુનિકેશન અને નિયમિત ડિલિવરી સાથે એજાઇલ મેથડોલોજી.',
                  'पारदर्शी कम्युनिकेशन और नियमित डिलीवरी के साथ एजाइल मेथडोलॉजी।',
                )}
              </p>
            </div>
            <div className="vstep rv" style={cssVars({ '--i': 2 })}>
              {phases.map((ph, i) => (
                <div key={ph.t} className="vstep-r efade" style={cssVars({ '--i': i })}>
                  <div className="vstep-n"><span className="mono">{`0${i + 1}`}</span></div>
                  <div className="vstep-c">
                    <div><b>{ph.t}</b><span className="mono w">{DURW[i]}</span></div>
                    <p>{ph.d}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="rv vstep-note" style={cssVars({ '--i': 2 })}>
              {T(
                'Illustrative timeline. Every project is scoped and planned to its own size.',
                'દૃષ્ટાંતરૂપ ટાઇમલાઇન. દરેક પ્રોજેક્ટ તેની પોતાની સાઇઝ પ્રમાણે સ્કોપ અને પ્લાન કરવામાં આવે છે.',
                'दृष्टांत टाइमलाइन। हर प्रोजेक्ट को उसके अपने आकार के अनुसार स्कोप और प्लान किया जाता है।',
              )}
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
