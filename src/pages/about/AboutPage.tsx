import { useEffect, useRef, useState } from 'react'
import { T, withLang } from '@data/site'
import { cssVars } from '@lib/style'




const WORLD_TZ: Array<{ code: string; tz: string }> = [
  { code: 'SURAT', tz: 'Asia/Kolkata' },
  { code: 'DUBAI', tz: 'Asia/Dubai' },
  { code: 'HONG KONG', tz: 'Asia/Hong_Kong' },
  { code: 'NEW YORK', tz: 'America/New_York' },
]

function WorldClocks() {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    setNow(Date.now())
    const id = window.setInterval(() => setNow(Date.now()), 15000)
    return () => window.clearInterval(id)
  }, [])
  const fmt = (tz: string): string => {
    if (now === null) return '--:--'
    try {
      return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: tz }).format(now)
    } catch {
      return '--:--'
    }
  }
  return (
    <span className="why__clocks">
      {WORLD_TZ.map((c) => (
        <span key={c.code} className="why__clock">
          <span className="why__clock-code">{c.code}</span>
          <span className="why__clock-time">{fmt(c.tz)}</span>
        </span>
      ))}
    </span>
  )
}

// Full-hand handshake motif (Lucide `handshake`, ISC) for card 06.
const HAND_PATHS: string[] = [
  'm11 17 2 2a1 1 0 1 0 3-3',
  'm14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4',
  'm21 3 1 11h-2',
  'M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3',
  'M3 4h8',
]

export default function AboutPage() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const visions = [
    {
      title: T('Industry-first approach with deep domain knowledge', 'ઊંડા ક્ષેત્રજ્ઞાન સાથે ઇન્ડસ્ટ્રી-ફર્સ્ટ અભિગમ', 'गहरे क्षेत्रज्ञान के साथ इंडस्ट्री-फ़र्स्ट दृष्टिकोण'),
      body: T('Two decades inside diamond & jewellery ERP means we design around your manufacturing reality — from rough procurement to final delivery — never generic software forced onto your craft.', 'ડાયમંડ અને જ્વેલરી ERPમાં બે દાયકા એટલે અમે તમારી ઉત્પાદન વાસ્તવિકતાને ધ્યાનમાં રાખીને ડિઝાઇન કરીએ છીએ — રફ ખરીદીથી અંતિમ ડિલિવરી સુધી — તમારી કળા પર દબાણ કરેલું સામાન્ય સોફ્ટવેર નહીં.', 'डायमंड और ज्वेलरी ERP में दो दशक यानी हम आपकी उत्पादन वास्तविकता को ध्यान में रखकर डिज़ाइन करते हैं — रफ़ ख़रीद से अंतिम डिलीवरी तक — आपकी कला पर थोपा गया सामान्य सॉफ़्टवेयर नहीं।'),
    },
    {
      title: T('Long-term partnerships built on trust and results', 'વિશ્વાસ અને પરિણામો પર બનેલી લાંબા ગાળાની ભાગીદારી', 'भरोसे और नतीजों पर बनी लंबी अवधि की साझेदारियाँ'),
      body: T('We stay beyond go-live with support, enhancements, and a team invested in your growth — proven by 20+ implementations and 100% client satisfaction.', 'અમે ગો-લાઇવ પછી પણ સાથે રહીએ છીએ — સપોર્ટ, સુધારા અને તમારી વૃદ્ધિમાં રોકાયેલી ટીમ સાથે — 20+ અમલીકરણ અને 100% ગ્રાહક સંતોષ તેનો પુરાવો છે.', 'हम गो-लाइव के बाद भी साथ रहते हैं — सपोर्ट, सुधार और आपकी वृद्धि में लगी टीम के साथ — 20+ कार्यान्वयन और 100% ग्राहक संतुष्टि इसका प्रमाण है।'),
    },
    {
      title: T('Continuous innovation and technology excellence', 'સતત નવીનતા અને ટેકનોલોજી શ્રેષ્ઠતા', 'निरंतर नवाचार और तकनीकी उत्कृष्टता'),
      body: T('AI-powered automation, modern architecture, and engineering standards that keep your business ahead of the market.', 'AI-સંચાલિત ઓટોમેશન, આધુનિક આર્કિટેક્ચર અને એન્જિનિયરિંગ ધોરણો જે તમારા વ્યવસાયને બજારમાં આગળ રાખે છે.', 'AI-संचालित ऑटोमेशन, आधुनिक आर्किटेक्चर और इंजीनियरिंग मानक जो आपके व्यवसाय को बाज़ार में आगे रखते हैं।'),
    },
    {
      title: T('Global delivery with local market expertise', 'સ્થાનિક બજાર કુશળતા સાથે વૈશ્વિક ડિલિવરી', 'स्थानीय बाज़ार विशेषज्ञता के साथ वैश्विक डिलीवरी'),
      body: T('Successful delivery across India, USA, Dubai, and China — global best practices with local market understanding.', 'ભારત, USA, દુબઈ અને ચીન સહિત સફળ ડિલિવરી — સ્થાનિક બજાર સમજ સાથે વૈશ્વિક શ્રેષ્ઠ પ્રથાઓ.', 'भारत, USA, दुबई और चीन सहित सफल डिलीवरी — स्थानीय बाज़ार समझ के साथ वैश्विक सर्वोत्तम प्रथाएँ।'),
    },
  ]
  const timeline = [
    {
      icon: <path d="M12 2l3 7h7l-5.5 4 2 7-6.5-4.5L5.5 20l2-7L2 9h7z" />,
      text: T('20+ years of specialized diamond & jewellery ERP experience', 'ડાયમંડ અને જ્વેલરી ERPનો 20+ વર્ષનો વિશિષ્ટ અનુભવ', 'डायमंड और ज्वेलरी ERP का 20+ वर्षों का विशिष्ट अनुभव'),
    },
    {
      icon: (
        <>
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z" />
        </>
      ),
      text: T('Global delivery — India, USA, Dubai, China & beyond', 'વૈશ્વિક ડિલિવરી — ભારત, USA, દુબઈ, ચીન અને વધુ', 'वैश्विक डिलीवरी — भारत, USA, दुबई, चीन और आगे'),
    },
    {
      icon: <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />,
      text: T('A-to-Z software: ERP, web, mobile, AI & branding', 'Aથી Z સોફ્ટવેર: ERP, વેબ, મોબાઇલ, AI અને બ્રાન્ડિંગ', 'A से Z सॉफ़्टवेयर: ERP, वेब, मोबाइल, AI और ब्रांडिंग'),
    },
    {
      icon: (
        <>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <path d="m9 11 3 3L22 4" />
        </>
      ),
      text: T('Big-enterprise clients with 100% satisfaction', '100% સંતોષ સાથે મોટા એન્ટરપ્રાઇઝ ગ્રાહકો', '100% संतुष्टि के साथ बड़े एंटरप्राइज़ ग्राहक'),
    },
  ]
  const whyCards = [
    {
      icon: (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </>
      ),
      title: T('20+ Years of Industry Experience', '20+ વર્ષનો ઇન્ડસ્ટ્રી અનુભવ', '20+ वर्षों का इंडस्ट्री अनुभव'),
      body: T('With over two decades of experience, we bring deep industry knowledge, practical insights, and a strong understanding of business needs.', 'બે દાયકાથી વધુ અનુભવ સાથે, અમે ઊંડું ઇન્ડસ્ટ્રી જ્ઞાન, વ્યવહારુ સમજ અને વ્યવસાય જરૂરિયાતોની મજબૂત સમજ લાવીએ છીએ.', 'दो दशकों से अधिक अनुभव के साथ, हम गहरा इंडस्ट्री ज्ञान, व्यावहारिक समझ और व्यावसायिक ज़रूरतों की मज़बूत समझ लाते हैं।'),
    },
    {
      icon: (
        <>
          <path d="M6 3h12l4 6-10 12L2 9z" />
          <path d="M2 9h20M6 3l4 6 2 12M18 3l-4 6-2 12" />
        </>
      ),
      title: T('Diamonds & Jewellery Expertise', 'ડાયમંડ અને જ્વેલરી કુશળતા', 'डायमंड और ज्वेलरी विशेषज्ञता'),
      body: T('Our core expertise lies in the Diamonds and Jewellery industry, where we understand specialized workflows, industry challenges, and business requirements.', 'અમારી મુખ્ય કુશળતા ડાયમંડ અને જ્વેલરી ઉદ્યોગમાં છે, જ્યાં અમે વિશિષ્ટ વર્કફ્લો, ઇન્ડસ્ટ્રી પડકારો અને વ્યવસાય જરૂરિયાતો સમજીએ છીએ.', 'हमारी मुख्य विशेषज्ञता डायमंड और ज्वेलरी उद्योग में है, जहाँ हम विशिष्ट वर्कफ़्लो, इंडस्ट्री चुनौतियों और व्यावसायिक ज़रूरतों को समझते हैं।'),
    },
    {
      icon: (
        <>
          <rect x="7" y="7" width="10" height="10" rx="2" />
          <path d="M10 7V4M14 7V4M10 20v-3M14 20v-3M7 10H4M7 14H4M20 10h-3M20 14h-3" />
          <circle cx="12" cy="12" r="1.6" />
        </>
      ),
      title: T('AI-Powered Innovation', 'AI-સંચાલિત નવીનતા', 'AI-संचालित नवाचार'),
      body: T('We combine industry experience with AI capabilities to develop intelligent solutions, automate processes, and unlock new business opportunities.', 'અમે ઇન્ડસ્ટ્રી અનુભવને AI ક્ષમતાઓ સાથે જોડીને બુદ્ધિશાળી ઉકેલો વિકસાવીએ છીએ, પ્રક્રિયાઓ ઓટોમેટ કરીએ છીએ અને નવી વ્યવસાય તકો ખોલીએ છીએ.', 'हम इंडस्ट्री अनुभव को AI क्षमताओं के साथ जोड़कर बुद्धिमान समाधान विकसित करते हैं, प्रक्रियाएँ ऑटोमेट करते हैं और नए व्यावसायिक अवसर खोलते हैं।'),
      ai: true,
    },
    {
      icon: (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </>
      ),
      title: T('Global Reach, Global Perspective', 'વૈશ્વિક પહોંચ, વૈશ્વિક દૃષ્ટિકોણ', 'वैश्विक पहुँच, वैश्विक दृष्टिकोण'),
      body: T('Our business presence and connections across markets including India, China, the USA, and Dubai help us understand diverse business needs.', 'ભારત, ચીન, USA અને દુબઈ સહિતના બજારોમાં અમારી વ્યવસાય હાજરી અને જોડાણો અમને વિવિધ વ્યવસાય જરૂરિયાતો સમજવામાં મદદ કરે છે.', 'भारत, चीन, USA और दुबई सहित बाज़ारों में हमारी व्यावसायिक उपस्थिति और जुड़ाव हमें विविध व्यावसायिक ज़रूरतें समझने में मदद करते हैं।'),
    },
    {
      icon: (
        <>
          <path d="M9 18h6M10 21h4" />
          <path d="M12 3a6 6 0 0 0-3.6 10.8c.8.7 1.6 1.7 1.6 2.7h4c0-1 .8-2 1.6-2.7A6 6 0 0 0 12 3z" />
        </>
      ),
      title: T('Solutions for Complex Challenges', 'જટિલ પડકારો માટે ઉકેલો', 'जटिल चुनौतियों के समाधान'),
      body: T('From specialized industry software to AI-driven automation, we focus on finding practical, tailored solutions for challenging business problems.', 'વિશિષ્ટ ઇન્ડસ્ટ્રી સોફ્ટવેરથી AI-સંચાલિત ઓટોમેશન સુધી, અમે પડકારજનક વ્યવસાય સમસ્યાઓ માટે વ્યવહારુ, અનુકૂળ ઉકેલો શોધવા પર ધ્યાન આપીએ છીએ.', 'विशिष्ट इंडस्ट्री सॉफ़्टवेयर से AI-संचालित ऑटोमेशन तक, हम चुनौतीपूर्ण व्यावसायिक समस्याओं के व्यावहारिक, अनुकूल समाधान खोजने पर ध्यान देते हैं।'),
    },
    {
      icon: (
        <>
          <circle cx="9" cy="12" r="5" />
          <circle cx="15" cy="12" r="5" />
        </>
      ),
      title: T('One Technology Partner, Endless Possibilities', 'એક ટેકનોલોજી ભાગીદાર, અનંત શક્યતાઓ', 'एक तकनीकी भागीदार, अनंत संभावनाएँ'),
      body: T('Bring your ideas, business challenges, and future goals to one technology partner focused on building solutions that fit your needs.', 'તમારા વિચારો, વ્યવસાય પડકારો અને ભવિષ્યના લક્ષ્યો એક ટેકનોલોજી ભાગીદાર પાસે લાવો જે તમારી જરૂરિયાતોને અનુરૂપ ઉકેલો બનાવવા પર ધ્યાન આપે છે.', 'अपने विचार, व्यावसायिक चुनौतियाँ और भविष्य के लक्ष्य एक तकनीकी भागीदार के पास लाएँ जो आपकी ज़रूरतों के अनुरूप समाधान बनाने पर ध्यान देता है।'),
    },
  ]

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cleanups: Array<() => void> = []

    // Scroll reveal with three guards so fling-scrolling never lands on
    // empty sections: (1) early trigger via rootMargin, (2) rAF scroll
    // catch-up because IO callbacks can lag behind a fast fling,
    // (3) a safety timer so content can never stay hidden.
    let io: IntersectionObserver | null = null
    let raf = 0
    let safety = 0
    const reveal = (n: Element, fast = false): void => {
      if (n.hasAttribute('data-in')) return
      // Fast path (fling/jump): skip the cascade so the section settles
      // instantly instead of animating in pieces after arrival.
      if (fast) n.setAttribute('data-fast', '')
      n.setAttribute('data-in', '')
      if (io) io.unobserve(n)
    }
    try {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) reveal(e.target)
          })
        },
        // Fire as the section enters the viewport (not before), so slow
        // scrollers watch the animation play. Fast flings are covered by
        // the catch-up below: content animates on arrival instead of
        // staying empty.
        { threshold: 0.15, rootMargin: '0px' },
      )
      const nodes = Array.from(root.querySelectorAll('[data-io]'))
      nodes.forEach((n) => io?.observe(n))
      const catchUp = (): void => {
        raf = 0
        // Only sections the reader has already scrolled halfway past (or
        // jumped over) settle instantly. Anything still entering the lower
        // half stays on the observer path so slow scrollers see the full
        // animation play on arrival.
        const limit = window.innerHeight * 0.5
        for (const n of nodes) {
          if (n.getBoundingClientRect().top < limit) reveal(n, true)
        }
      }
      const onScroll = (): void => {
        if (!raf) raf = window.requestAnimationFrame(catchUp)
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      cleanups.push(() => window.removeEventListener('scroll', onScroll))
      // Safety net: re-run the same above-the-fold check, so a stalled
      // observer can never leave passed content hidden — while sections
      // the reader hasn't reached keep their animation.
      safety = window.setTimeout(catchUp, 5000)
    } catch {
      root.querySelectorAll('[data-r]').forEach((n) => {
        if (n instanceof HTMLElement) {
          n.style.opacity = '1'
          n.style.transform = 'none'
        }
      })
    }

    // Subtle 3D tilt on stage cards.
    if (!reduce) {
      root.querySelectorAll('.card').forEach((c) => {
        if (!(c instanceof HTMLElement)) return
        const move = (e: PointerEvent): void => {
          const r = c.getBoundingClientRect()
          const x = (e.clientX - r.left) / r.width - 0.5
          const y = (e.clientY - r.top) / r.height - 0.5
          c.style.transform = `translateY(-6px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 4).toFixed(2)}deg)`
        }
        const leave = (): void => {
          c.style.transform = ''
        }
        c.addEventListener('pointermove', move)
        c.addEventListener('pointerleave', leave)
        cleanups.push(() => {
          c.removeEventListener('pointermove', move)
          c.removeEventListener('pointerleave', leave)
        })
      })
    }

    return () => {
      io?.disconnect()
      if (raf) window.cancelAnimationFrame(raf)
      if (safety) window.clearTimeout(safety)
      cleanups.forEach((fn) => fn())
    }
  }, [])

  return (
    <div ref={rootRef}>
      <div className="grain" aria-hidden="true" />

      <main id="top" tabIndex={-1}>
        <section className="about-v4 px-[var(--pad)] pb-20 pt-[30px]" aria-labelledby="a4" data-io="">
          <div className="av4-grid mx-auto grid max-w-[1440px] grid-cols-2 items-start gap-[clamp(40px,6vw,96px)] max-[900px]:grid-cols-1">
            <div className="av4-left">
              <h1 id="a4" className="av4-rv" style={cssVars({ '--i': 0 })}>
                {`${T('About Peacock', 'પીકોક વિશે', 'पीकॉक के बारे में')} `}<em>{T('Technotrics.', 'ટેક્નોટ્રિક્સ.', 'टेक्नोट्रिक्स।')}</em>
              </h1>
              <p className="av4-lead av4-rv mb-6 text-[clamp(1rem,1.3vw,1.15rem)] leading-[1.5] text-[var(--text)]" style={cssVars({ '--i': 1 })}>
                {T('A software studio with over two decades of specialized experience in Diamond & Jewellery ERP development — the premier technology partner for manufacturers, traders, and enterprises across the global gem and jewellery industry.', 'ડાયમંડ અને જ્વેલરી ERP ડેવલપમેન્ટમાં બે દાયકાથી વધુ વિશિષ્ટ અનુભવ ધરાવતો સોફ્ટવેર સ્ટુડિયો — વૈશ્વિક રત્ન અને જ્વેલરી ઉદ્યોગના ઉત્પાદકો, વેપારીઓ અને સાહસો માટે મુખ્ય ટેકનોલોજી ભાગીદાર.', 'डायमंड और ज्वेलरी ERP डेवलपमेंट में दो दशकों से अधिक विशिष्ट अनुभव वाला सॉफ़्टवेयर स्टूडियो — वैश्विक रत्न और ज्वेलरी उद्योग के निर्माताओं, व्यापारियों और उद्यमों के लिए प्रमुख तकनीकी भागीदार।')}
              </p>
              <blockquote className="av4-rv border-l-2 border-green-deep pl-5 font-serif text-[clamp(1.3rem,2.2vw,1.8rem)] leading-[1.25] text-pearl" style={cssVars({ '--i': 2 })}>{T('We partner with clients, not just deliver to them.', 'અમે ગ્રાહકો સાથે ભાગીદારી કરીએ છીએ, માત્ર ડિલિવરી નહીં.', 'हम ग्राहकों के साथ साझेदारी करते हैं, सिर्फ़ डिलीवरी नहीं।')}</blockquote>
            </div>
            <div className="av4-right">
              <p className="av4-rv mb-[1.4em] text-[clamp(1rem,1.1vw,1.1rem)] leading-[1.75] text-muted last:mb-0" style={cssVars({ '--i': 3 })}>
                {`${T('For over two decades, Peacock Technotrics has stood as the', 'બે દાયકાથી વધુ સમયથી, પીકોક ટેક્નોટ્રિક્સ', 'दो दशकों से अधिक समय से, पीकॉक टेक्नोट्रिक्स')} `}
                <strong className="font-semibold text-pearl">{T('premier technology partner', 'મુખ્ય ટેકનોલોજી ભાગીદાર', 'प्रमुख तकनीकी भागीदार')}</strong>{` ${T('for manufacturers, traders, and enterprises across the global gem and jewellery industry. Our specialized focus on Diamond & Jewellery ERP development has shaped a practice that understands not just software — but the business of gems.', 'વૈશ્વિક રત્ન અને જ્વેલરી ઉદ્યોગના ઉત્પાદકો, વેપારીઓ અને સાહસો માટે તરીકે ઊભું છે. ડાયમંડ અને જ્વેલરી ERP ડેવલપમેન્ટ પરના અમારા વિશિષ્ટ ધ્યાને એવી પ્રથા ઘડી છે જે માત્ર સોફ્ટવેર નહીં — રત્નોના વ્યવસાયને સમજે છે.', 'वैश्विक रत्न और ज्वेलरी उद्योग के निर्माताओं, व्यापारियों और उद्यमों के लिए के रूप में खड़ा है। डायमंड और ज्वेलरी ERP डेवलपमेंट पर हमारे विशिष्ट ध्यान ने ऐसी प्रथा गढ़ी है जो सिर्फ़ सॉफ़्टवेयर नहीं — रत्नों के व्यवसाय को समझती है।')}`}
              </p>
              <p className="av4-rv mb-[1.4em] text-[clamp(1rem,1.1vw,1.1rem)] leading-[1.75] text-muted last:mb-0" style={cssVars({ '--i': 4 })}>
                {`${T('We possess a profound, end-to-end understanding of the diamond manufacturing journey — from', 'ડાયમંડ મેન્યુફેક્ચરિંગ યાત્રાની અમને ઊંડી, શરૂથી અંત સુધીની સમજ છે —', 'डायमंड निर्माण यात्रा की हमें गहरी, शुरू से अंत तक समझ है —')} `}
                <strong className="font-semibold text-pearl">
                  {T('rough stone procurement through cutting, polishing, certification, and final product delivery', 'રફ સ્ટોન ખરીદીથી કટિંગ, પોલિશિંગ, સર્ટિફિકેશન અને અંતિમ ઉત્પાદન ડિલિવરી સુધી', 'रफ़ स्टोन ख़रीद से कटिंग, पॉलिशिंग, प्रमाणन और अंतिम उत्पाद डिलीवरी तक')}
                </strong>
                {T('. This depth allows us to architect ERP solutions that genuinely address the unique complexities and regulatory demands of this highly specialized industry, rather than forcing generic software onto a craft it was never built for.', '. આ ઊંડાણ અમને એવા ERP ઉકેલો ઘડવાની તક આપે છે જે આ અત્યંત વિશિષ્ટ ઉદ્યોગની અનોખી જટિલતાઓ અને નિયમનકારી માંગોને ખરેખર સંબોધે છે, તેના બદલે કે જે કળા માટે બન્યું જ નથી તેના પર સામાન્ય સોફ્ટવેર દબાણ કરવામાં આવે.', '. यह गहराई हमें ऐसे ERP समाधान गढ़ने देती है जो इस अत्यंत विशिष्ट उद्योग की अनूठी जटिलताओं और नियामक माँगों को सच में संबोधित करते हैं, बजाय उस कला पर सामान्य सॉफ़्टवेयर थोपने के जिसके लिए वह बना ही नहीं।')}
              </p>
              <p className="av4-rv mb-[1.4em] text-[clamp(1rem,1.1vw,1.1rem)] leading-[1.75] text-muted last:mb-0" style={cssVars({ '--i': 5 })}>
                {T('We go beyond traditional software delivery. We partner strategically with our clients to orchestrate comprehensive digital transformation — optimizing operational workflows, unlocking efficiency, and accelerating sustainable business growth through intelligent, enterprise-grade technology platforms. Our clients don\u2019t just receive software; they gain a long-term technology partner invested in their success.', 'અમે પરંપરાગત સોફ્ટવેર ડિલિવરીથી આગળ વધીએ છીએ. અમે અમારા ગ્રાહકો સાથે વ્યૂહાત્મક ભાગીદારી કરીને વ્યાપક ડિજિટલ પરિવર્તનનું આયોજન કરીએ છીએ — કાર્યપ્રવાહોને શ્રેષ્ઠ બનાવવા, કાર્યક્ષમતા ખોલવા અને બુદ્ધિશાળી, એન્ટરપ્રાઇઝ-ગ્રેડ ટેકનોલોજી પ્લેટફોર્મ દ્વારા ટકાઉ વ્યવસાય વૃદ્ધિને વેગ આપવા. અમારા ગ્રાહકો માત્ર સોફ્ટવેર મેળવતા નથી; તેઓ તેમની સફળતામાં રોકાયેલ લાંબા ગાળાના ટેકનોલોજી ભાગીદાર મેળવે છે.', 'हम पारंपरिक सॉफ़्टवेयर डिलीवरी से आगे जाते हैं। हम अपने ग्राहकों के साथ रणनीतिक साझेदारी करके व्यापक डिजिटल परिवर्तन का आयोजन करते हैं — परिचालन वर्कफ़्लो को श्रेष्ठ बनाना, दक्षता खोलना और बुद्धिमान, एंटरप्राइज़-ग्रेड तकनीकी प्लेटफ़ॉर्म से टिकाऊ व्यावसायिक वृद्धि को गति देना। हमारे ग्राहक सिर्फ़ सॉफ़्टवेयर नहीं पाते; वे अपनी सफलता में लगा लंबी अवधि का तकनीकी भागीदार पाते हैं।')}
              </p>
            </div>
          </div>
          <div className="av4-timeline">
            {timeline.map((t) => (
              <div className="av4-tl" key={t.text}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                  {t.icon}
                </svg>
                <div className="dot" />
                <span>{t.text}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="why bg-paper px-[var(--edge)] py-20" aria-labelledby="w" data-io="">
          <div className="why__head mx-auto mb-[clamp(36px,5vw,60px)] grid max-w-[1440px] justify-items-start gap-[18px]">
            <h2 id="w" className="why-rv">
              {`${T('Why Businesses Choose', 'વ્યવસાયો શા માટે પસંદ કરે છે', 'व्यवसाय क्यों चुनते हैं')} `}<em>{T('Peacock Tech.', 'પીકોક ટેક.', 'पीकॉक टेक।')}</em>
            </h2>
            <p className="why__lede why-rv mb-[6px] max-w-[52ch] text-[clamp(1rem,1.3vw,1.15rem)] leading-[1.55] text-muted">
              {T('20+ Years of Expertise. Global Vision. Intelligent AI Solutions. We bring industry knowledge, technological innovation, and a solution-driven mindset together to help businesses move forward.', '20+ વર્ષની કુશળતા. વૈશ્વિક દૃષ્ટિ. બુદ્ધિશાળી AI ઉકેલો. વ્યવસાયોને આગળ વધવામાં મદદ કરવા અમે ઇન્ડસ્ટ્રી જ્ઞાન, ટેકનોલોજીકલ નવીનતા અને ઉકેલ-કેન્દ્રિત માનસિકતાને એકસાથે લાવીએ છીએ.', '20+ वर्षों की विशेषज्ञता। वैश्विक दृष्टि। बुद्धिमान AI समाधान। व्यवसायों को आगे बढ़ाने में मदद के लिए हम इंडस्ट्री ज्ञान, तकनीकी नवाचार और समाधान-केंद्रित मानसिकता को एक साथ लाते हैं।')}
            </p>
          </div>
          <div className="why__sheet">
            {whyCards.map((card, i) => (
              <article className={`why__cell why__cell--${i + 1}`} data-r="" key={card.title} style={i > 0 ? cssVars({ '--i': i }) : undefined}>
                <span className="why__top">
                  <span className="why__num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="why__ico" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>{card.icon}</svg>
                  </span>
                </span>
                <h3 className="why__title">{card.title}</h3>
                {i === 5 && (
                  <svg className="why__hands-inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {HAND_PATHS.map((d) => (
                      <path key={d} d={d} />
                    ))}
                  </svg>
                )}
                <p className="why__body">{card.body}</p>
                {i === 0 && (
                  <svg className="why__art" viewBox="0 0 240 120" fill="none" aria-hidden="true">
                    <path d="M12 104h216" stroke="currentColor" strokeWidth=".9" />
                    <path d="M12 104V88h44V70h44V52h44V34h44V16" stroke="currentColor" strokeWidth=".9" />
                    <circle cx="12" cy="104" r="3" fill="currentColor" />
                    <circle cx="100" cy="70" r="3" fill="currentColor" />
                    <circle cx="144" cy="52" r="3" fill="currentColor" />
                    <circle cx="188" cy="16" r="3.5" fill="currentColor" />
                  </svg>
                )}
                {i === 1 && (
                  <svg className="why__facet" viewBox="0 0 260 200" fill="none" aria-hidden="true">
                    <path d="M130 10l86 44-18 96-68 40-68-40-18-96z" stroke="currentColor" strokeWidth=".9" />
                    <path d="M130 10v180M44 54l86 52 86-52M62 150l68-96 68 96M130 106l-44-52M130 106l44-52" stroke="currentColor" strokeWidth=".9" />
                  </svg>
                )}
                {i === 2 && (
                  <span className="why__signal" aria-hidden="true">
                    {[34, 18, 30, 12, 40, 22, 32, 16, 38, 24, 10, 36, 20, 42].map((h, k) => (
                      <i key={k} style={cssVars({ '--h': h, '--k': k })} />
                    ))}
                  </span>
                )}
                {i === 3 && <WorldClocks />}
                {i === 4 && (
                  <svg className="why__fix" viewBox="0 0 400 60" fill="none" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M30 18 C70 8, 60 48, 100 40 C130 34, 120 28, 150 30" stroke="currentColor" strokeWidth="1.1" />
                    <path d="M22 44 C60 58, 90 50, 118 38 C132 33, 140 31, 150 30" stroke="currentColor" strokeWidth="1.1" />
                    <path d="M40 30 C80 20, 110 45, 135 32 C143 28, 147 29, 150 30" stroke="currentColor" strokeWidth="1.1" />
                    <circle cx="30" cy="18" r="2.5" stroke="currentColor" strokeWidth="1.1" />
                    <circle cx="22" cy="44" r="2.5" stroke="currentColor" strokeWidth="1.1" />
                    <circle cx="40" cy="30" r="2.5" stroke="currentColor" strokeWidth="1.1" />
                    <circle cx="150" cy="30" r="3" fill="currentColor" />
                    <path d="M150 30 H375" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M363 24l12 6-12 6" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                )}
              </article>
            ))}
          </div>
        </section>


        <section className="rows mt-0 px-[var(--edge)] py-20" aria-labelledby="v" data-io="">
          {visions.map((v, i) => (
            <input
              key={`vis-radio-${v.title}`}
              className="vis-radio"
              type="radio"
              name="vision"
              id={`visr${i + 1}`}
              defaultChecked={i === 0}
              aria-label={`Principle ${i + 1}: ${v.title}`}
            />
          ))}
          <div className="vis-in">
            <div className="vis-head">
              <h2 id="v" className="vis-rv">
                {`${T('Our vision', 'અમારું વિઝન અને', 'हमारा विज़न और')} `}<em>{T('values.', 'મૂલ્યો.', 'मूल्य।')}</em>
              </h2>
              <p className="vis-lede vis-rv mb-0 ml-0 mr-0 mt-[26px] max-w-[46ch] text-[clamp(1rem,1.3vw,1.15rem)] leading-[1.55] text-muted">
                {T('Principles that shape every ERP we build and every partnership we keep — from Surat to the world.', 'અમારે બનાવેલા દરેક ERP અને જાળવેલી દરેક ભાગીદારીને આકાર આપતા સિદ્ધાંતો — સુરતથી વિશ્વ સુધી.', 'हमारे बनाए हर ERP और निभाई हर साझेदारी को आकार देने वाले सिद्धांत — सूरत से दुनिया तक।')}
              </p>
              <div className="vis-ctl" data-r="">
                {[1, 2, 3, 4].map((n) => (
                  <label key={`prev-${n}`} className={`vis-arrow vis-prev vis-prev--${n}`} htmlFor={`visr${n === 1 ? 4 : n - 1}`} aria-hidden="true">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true"><path d="M3 10l5-5 5 5" /></svg>
                  </label>
                ))}
                {[1, 2, 3, 4].map((n) => (
                  <label key={`next-${n}`} className={`vis-arrow vis-next vis-next--${n}`} htmlFor={`visr${n === 4 ? 1 : n + 1}`} aria-hidden="true">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true"><path d="M3 6l5 5 5-5" /></svg>
                  </label>
                ))}
                <span className="vis-count" aria-hidden="true">
                  {[1, 2, 3, 4].map((n) => (
                    <span key={n} className={`vis-count__n vis-count__n--${n}`}>{String(n).padStart(2, '0')}</span>
                  ))}
                  <span className="vis-count__sep">/</span>
                  <span className="vis-count__tot">04</span>
                </span>
              </div>
            </div>
            <div className="vis-stack">
              {visions.map((v, i) => (
                <label className="vis-row" htmlFor={`visr${i + 1}`} key={v.title} data-r="" style={i > 0 ? cssVars({ '--i': i }) : undefined}>
                  <span className="vis-row__num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="vis-row__main">
                    <span className="vis-row__title" role="heading" aria-level={3}>{v.title}</span>
                    <span className="vis-row__body"><span>{v.body}</span></span>
                  </span>
                  <span className="vis-row__mark" aria-hidden="true" />
                </label>
              ))}
            </div>
          </div>
        </section>

        <section className="close grid gap-[clamp(20px,2.5vw,28px)] px-[var(--edge)] py-20" id="contact" aria-labelledby="k" data-io="">
          <h2 id="k" className="close-rv">
            {`${T('Ready to transform your', 'તમારો વ્યવસાય બદલવા', 'अपना व्यवसाय बदलने के लिए')} `}<em>{T('business?', 'તૈયાર?', 'तैयार?')}</em>
          </h2>
          <div className="close__rail close-rv grid grid-cols-[minmax(0,1fr)_auto] items-center gap-[clamp(28px,5vw,64px)] max-[900px]:grid-cols-1 max-[900px]:items-start">
            <p className="close__lede max-w-[52ch] text-[clamp(1rem,1.3vw,1.15rem)] leading-[1.55] text-muted">
              {T('ERP, mapped to how your business actually runs. We review the current stack, data flow, and integration gaps, then scope a rollout your team can execute.', 'ERP, તમારો વ્યવસાય ખરેખર કેવી રીતે ચાલે છે તેને અનુરૂપ. અમે વર્તમાન સ્ટેક, ડેટા પ્રવાહ અને ઇન્ટિગ્રેશન ખામીઓની સમીક્ષા કરીએ છીએ, પછી તમારી ટીમ અમલ કરી શકે તેવા રોલઆઉટની રૂપરેખા બનાવીએ છીએ.', 'ERP, आपका व्यवसाय असल में जैसे चलता है उसके अनुरूप। हम मौजूदा स्टैक, डेटा प्रवाह और इंटीग्रेशन खामियों की समीक्षा करते हैं, फिर ऐसा रोलआउट तय करते हैं जिसे आपकी टीम लागू कर सके।')}
            </p>
            <a className="hero-btn" href={withLang('/contact')}>
              <span>{T('Plan your rollout', 'રોલઆઉટનું આયોજન કરો', 'रोलआउट की योजना बनाएँ')}</span>
              <svg viewBox="0 0 16 16" width="20" height="20" aria-hidden="true" focusable="false">
                <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="square" />
              </svg>
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}
