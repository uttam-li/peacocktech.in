/**
 * Single source of truth for the site's content and navigation.
 *
 * Services and industries are defined once. The navigation dropdowns are
 * generated from those same arrays, so adding a service or industry updates
 * the showcase, the menus and the active-section targets together.
 */

/** Founder WhatsApp number, digits only with country code. */
export const WHATSAPP_NUMBER = '919879100230'

/** Canonical production origin. Shell HTML files hardcode the same value. */
export const SITE_URL = 'https://peacocktech.in'

export type Lang = 'en' | 'gu' | 'hi'
/** Active language. Always starts English so server HTML and first client render match; upgraded after hydration. */
export let lang: Lang = 'en'
export function setLang(l: Lang): void {
  lang = l
  site = buildSite()
}
/** Resolve ?lang= > saved choice > English. Call once after mount, then re-render. */
export function resolveLang(): Lang {
  const param = typeof location === 'undefined' ? null : new URLSearchParams(location.search).get('lang')
  let stored: string | null = null
  try {
    stored = typeof localStorage === 'undefined' ? null : localStorage.getItem('pt-lang')
  } catch {
    stored = null
  }
  const l: Lang = param === 'gu' || param === 'hi' ? param : stored === 'gu' || stored === 'hi' ? stored : 'en'
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem('pt-lang', l)
  } catch {
    /* private mode: each page falls back to ?lang= */
  }
  if (typeof document !== 'undefined') document.documentElement.lang = l
  return l
}
/** Carry the picked language across pages. Same-page anchors and outside links pass through untouched. */
export function withLang(href: string): string {
  if (!href || href.startsWith('#') || /^[a-z][a-z0-9+.-]*:/i.test(href)) return href
  if (lang === 'en' || /[?&]lang=/.test(href)) return href
  const hashIndex = href.indexOf('#')
  const base = hashIndex < 0 ? href : href.slice(0, hashIndex)
  const hash = hashIndex < 0 ? '' : href.slice(hashIndex)
  return `${base}${base.includes('?') ? '&' : '?'}lang=${lang}${hash}`
}
/** Pick a string for the active language. Gujarati and Hindi are drafts that need a native reviewer. */
export const T = (en: string, gu: string, hi: string): string => (lang === 'gu' ? gu : lang === 'hi' ? hi : en)

/** Public call number. Single source; Contact page + home CTA render it. Empty hides both. */
const TEL = '+919879100230'

/** Social profiles. Empty = icon shows as pending (non-clickable) until the real URL is merged. DO NOT ship to HR with empty values. */
export const SOCIAL_LINKEDIN = ''
export const SOCIAL_GITHUB = ''

export interface Industry {
  quiet?: boolean
  id: string
  title: string
  line: string
  href: string
}

export interface ServiceItem {
  id: string
  title: string
  line: string
  tags: string[]
  href: string
}

export interface NavChild {
  id: string
  label: string
  href: string
  serviceId?: string
}

export interface NavGroup {
  kind: 'group'
  id: string
  label: string
  href: string
  children: NavChild[]
}

/**
 * Navigation variants as a discriminated union, so a dropdown can never lack
 * `children`. Menus switch on `kind` with an exhaustive `never` default.
 */
export type NavItem =
  | { kind: 'link'; id: string; label: string; href: string }
  | NavGroup

export interface ServicesSection {
  eyebrow: string
  titleLead: string
  titleAccent: string
  lede: string
  items: ServiceItem[]
  industriesLabel: string
  industriesTitle: string
  industriesTitleLead: string
  industriesTitleAccent: string
  industriesLede: string
  industries: Industry[]
}

export interface ProcessStep {
  num: string
  title: string
  body: string
}

export interface TitledSection {
  eyebrow: string
  titleLead: string
  titleAccent: string
  lede: string
}

export interface Principle {
  num: string
  title: string
  body: string
}

export interface ContactSection extends TitledSection {
  formNote: string
}

export interface HeroCopy {
  lead: string
  accent: string
  sub: string
  hintMouse: string
  hintTouch: string
}

export interface Site {
  hero: HeroCopy
  tel: string
  callLabel: string
  name: string
  tagline: string
  location: string
  working: string
  nav: NavItem[]
  sectionIds: string[]
  cta: { label: string; href: string }
  services: ServicesSection
  about: TitledSection
  process: TitledSection & { steps: ProcessStep[] }
  principles: Principle[]
  contact: ContactSection
}

function buildSite(): Site {
const industries: Industry[] = [
  { id: 'diamond-manufacturing', title: T('Diamond Manufacturing ERP', 'ડાયમંડ મેન્યુફેક્ચરિંગ ERP', 'डायमंड मैन्युफ़ैक्चरिंग ERP'), line: T('ERP built for diamond manufacturing workflows. Stock, cutting and QC in one place.', 'ડાયમંડ મેન્યુફેક્ચરિંગ વર્કફ્લો માટે બનાવેલું ERP. સ્ટોક, કટિંગ અને QC એક જગ્યાએ.', 'डायमंड मैन्युफ़ैक्चरिंग वर्कफ़्लो के लिए बना ERP। स्टॉक, कटिंग और QC एक जगह।'), href: '#contact' },
  { id: 'jewellery-manufacturing', title: T('Jewellery Manufacturing ERP', 'જ્વેલરી મેન્યુફેક્ચરિંગ ERP', 'ज्वेलरी मैन्युफ़ैक्चरिंग ERP'), line: T('ERP built for jewellery manufacturing workflows. Designs, orders and inventory in one place.', 'જ્વેલરી મેન્યુફેક્ચરિંગ વર્કફ્લો માટે બનાવેલું ERP. ડિઝાઇન, ઓર્ડર અને ઇન્વેન્ટરી એક જગ્યાએ.', 'ज्वेलरी मैन्युफ़ैक्चरिंग वर्कफ़्लो के लिए बना ERP। डिज़ाइन, ऑर्डर और इन्वेंटरी एक जगह।'), href: '#contact' },
  { id: 'erp-startups', title: T('ERP startups', 'ERP સ્ટાર્ટઅપ્સ', 'ERP स्टार्टअप्स'), line: T('A practical ERP foundation for teams moving past spreadsheets. Start small, scale when ready.', 'સ્પ્રેડશીટથી આગળ વધતી ટીમો માટે વ્યવહારુ ERP પાયો. નાનેથી શરૂ કરો, જરૂર પડે ત્યારે વધારો.', 'स्प्रेडशीट से आगे बढ़ती टीमों के लिए व्यावहारिक ERP नींव। छोटे से शुरू करें, ज़रूरत पर बढ़ाएँ।'), href: '#contact' },
  { id: 'smes-enterprise', title: T('SMEs and enterprise', 'SME અને એન્ટરપ્રાઇઝ', 'SME और एंटरप्राइज़'), line: T('Connected systems for growing teams and established operations. One system your whole team can use.', 'વધતી ટીમો અને સ્થાપિત કામગીરી માટે જોડાયેલી સિસ્ટમ. એક સિસ્ટમ જે આખી ટીમ વાપરી શકે.', 'बढ़ती टीमों और स्थापित संचालन के लिए जुड़े सिस्टम। एक सिस्टम जो पूरी टीम इस्तेमाल कर सके।'), href: '#contact' },
]

const services: ServicesSection = {
  eyebrow: 'What we do',
  titleLead: T('Run the floor.', 'ફ્લોર ચલાવો.', 'फ़्लोर चलाइए।'),
  titleAccent: T('Grow the trade.', 'ધંધો વધારો.', 'कारोबार बढ़ाइए।'),
  lede: T(
    'ERP from design to deployment, and posts and reels for factories. Mobile apps and UX design come with every build. Our team builds AI-first: AI is how we work, not a feature on your screens.',
    'ડિઝાઇનથી ડિપ્લોયમેન્ટ સુધી ERP, અને ફેક્ટરીઓ માટે પોસ્ટ અને રીલ. અમે AI-ફર્સ્ટ બનાવીએ છીએ: AI અમારી ટીમની કાર્યપદ્ધતિમાં છે, તમારી સ્ક્રીન પરની સુવિધા નથી.',
    'डिज़ाइन से डिप्लॉयमेंट तक ERP, और फ़ैक्टरियों के लिए पोस्ट और रील। हम AI-फ़र्स्ट बनाते हैं: AI हमारी टीम के काम करने का तरीक़ा है, आपकी स्क्रीन का फ़ीचर नहीं।'),
  items: [
    { id: 'ai', title: T('AI & Intelligent Systems', 'AI અને ઇન્ટેલિજન્ટ સિસ્ટમ્સ', 'AI और इंटेलिजेंट सिस्टम्स'),
      line: T('Automation and AI added to the systems you already run.', 'તમે જે સિસ્ટમ ચલાવો છો તેમાં ઓટોમેશન અને AI ઉમેરીએ છીએ.', 'जो सिस्टम आप पहले से चलाते हैं, उनमें ऑटोमेशन और AI जोड़ते हैं.'),
      tags: [T('Automation', 'ઓટોમેશન', 'ऑटोमेशन'), T('AI features', 'AI ફીચર્સ', 'AI फ़ीचर्स')], href: '/ai' },
    { id: 'erp', title: T('ERP & Software Development', 'ERP અને સોફ્ટવેર ડેવલપમેન્ટ', 'ERP और सॉफ़्टवेयर डेवलपमेंट'),
      line: T('Custom ERP and business software built around your process.', 'તમારી પ્રક્રિયાને ધ્યાનમાં રાખીને કસ્ટમ ERP અને બિઝનેસ સોફ્ટવેર.', 'आपकी प्रक्रिया के हिसाब से कस्टम ERP और बिज़नेस सॉफ़्टवेयर.'),
      tags: ['ERP', T('Custom software', 'કસ્ટમ સોફ્ટવેર', 'कस्टम सॉफ़्टवेयर'), T('Integrations', 'ઇન્ટિગ્રેશન', 'इंटीग्रेशन')], href: '/erp' },
    { id: 'mobile', title: T('Mobile App Development', 'મોબાઇલ એપ ડેવલપમેન્ટ', 'मोबाइल ऐप डेवलपमेंट'),
      line: T('Mobile apps for your customers and your field teams.', 'તમારા ગ્રાહકો અને ફિલ્ડ ટીમ માટે મોબાઇલ એપ્સ.', 'आपके ग्राहकों और फ़ील्ड टीमों के लिए मोबाइल ऐप्स.'),
      tags: [T('Customer apps', 'ગ્રાહક એપ્સ', 'ग्राहक ऐप्स'), T('Field teams', 'ફિલ્ડ ટીમ', 'फ़ील्ड टीमें')], href: '/mobile-app' },
    { id: 'ux', title: T('UX Design Branding', 'UX ડિઝાઇન બ્રાન્ડિંગ', 'UX डिज़ाइन ब्रांडिंग'),
      line: T('Interfaces and identity that make software easy to use.', 'સોફ્ટવેર વાપરવામાં સરળ લાગે તેવા ઇન્ટરફેસ અને ઓળખ.', 'ऐसे इंटरफ़ेस और पहचान जो सॉफ़्टवेयर को आसान बनाएँ.'),
      tags: [T('UX design', 'UX ડિઝાઇન', 'UX डिज़ाइन'), T('Branding', 'બ્રાન્ડિંગ', 'ब्रांडिंग')], href: '/ux-design' },
  ],
  industriesLabel: 'Trades',
  industriesTitle: 'Built for the trade you work in.',
  industriesTitleLead: T('Built for the trade', 'તમે જે વેપારમાં', 'जिस कारोबार में'),
  industriesTitleAccent: T('you work in.', 'કામ કરો છો તે માટે.', 'आप काम करते हैं, उसके लिए.'),
  industriesLede: T('Diamond and jewellery manufacturing are where we have spent over twenty years. Teams outside the trade are welcome too.', 'ડાયમંડ અને જ્વેલરી મેન્યુફેક્ચરિંગમાં અમને વીસ વર્ષથી વધુનો અનુભવ છે. આ ક્ષેત્ર બહારની ટીમોનું પણ સ્વાગત છે.', 'डायमंड और ज्वेलरी मैन्युफ़ैक्चरिंग में हमें बीस वर्षों से अधिक का अनुभव है। इस क्षेत्र से बाहर की टीमों का भी स्वागत है.'),
  industries,
}

  return {
  name: 'Peacock Technotrics',
  tagline: T('Empowering businesses through technology and innovation.', 'ટેકનોલોજી અને નવીનતા દ્વારા વ્યવસાયોને સશક્ત બનાવીએ છીએ.', 'तकनीक और नवाचार के ज़रिए व्यवसायों को सशक्त बनाते हैं.'),
  location: 'Surat, Gujarat, India',
  working: T('Remote-first, worldwide', 'રિમોટ-ફર્સ્ટ, વિશ્વભરમાં', 'रिमोट-फ़र्स्ट, दुनियाभर में'),

  /**
   * Navigation. `group` items render as accessible dropdowns on
   * desktop and grouped links in the mobile index.
   */
  nav: [
    { kind: 'link', id: 'top', label: T('Home', 'હોમ', 'होम'), href: '#top' },
    { kind: 'group', id: 'industries', label: T('Industries', 'ઇન્ડસ્ટ્રીઝ', 'इंडस्ट्रीज़'), href: '#industries',
      children: industries.map((industry) => ({ id: `industry-${industry.id}`, label: industry.title, href: `#industry-${industry.id}` })) },
    { kind: 'group', id: 'services', label: T('Services', 'સેવાઓ', 'सेवाएँ'), href: '#services',
      children: services.items.map((service) => ({ id: `service-${service.id}`, label: service.title, href: service.href.startsWith('/') ? service.href : '#services', serviceId: service.id })) },
    { kind: 'link', id: 'about', label: T('About us', 'અમારા વિશે', 'हमारे बारे में'), href: '/about' },
    { kind: 'link', id: 'contact', label: T('Talk to us', 'વાત કરો', 'बात करें'), href: '/contact' },
  ],

  /**
   * Every section that can own the reading position. Kept separate from the
   * nav because How we work remains on the page even though it is not a
   * top-level menu item. The hook sorts these by document order.
   * About stays on the home page but has no header link for now, so it is
   * excluded from the spy to avoid highlighting a dead link.
   */
  sectionIds: ['top', 'services', 'industries', 'process', 'contact'],

  /** Primary call to action, used in the hero and the header. */
  // Primary action is a founder on WhatsApp. Until the number is supplied the button falls back to the brief form.
  cta: { label: T('Talk to a founder', 'ફાઉન્ડર સાથે વાત કરો', 'फ़ाउंडर से बात करें'), href: WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : '/contact' },
  tel: TEL,
  callLabel: T('Call', 'ફોન કરો', 'कॉल करें'),
  hero: {
    lead: T('Diamond and jewellery ERP, built by people who', 'ડાયમંડ અને જ્વેલરી ERP, જે લોકો', 'डायमंड और ज्वेलरी ERP, उन लोगों का बनाया जो'),
    accent: T('know your floor.', 'તમારું ફ્લોર જાણે છે તેમણે બનાવેલું.', 'आपका फ़्लोर जानते हैं।'),
    sub: T('ERP from design to deployment, and posts and reels for factories.', 'ડિઝાઇનથી ડિપ્લોયમેન્ટ સુધી ERP, અને ફેક્ટરીઓ માટે પોસ્ટ અને રીલ.', 'डिज़ाइन से डिप्लॉयमेंट तक ERP, और फ़ैक्टरियों के लिए पोस्ट और रील।'),
    hintMouse: T('Sweep across the fan.', 'પંખા પર માઉસ ફેરવો.', 'पंखे पर माउस घुमाइए।'),
    hintTouch: T('Drag across the fan.', 'પંખા પર આંગળી ફેરવો.', 'पंखे पर उँगली घुमाइए।'),
  },
  /**
   * Section 02 — services and industries.
   *
   * The AI service has its own page (`/ai`); the rest of the showcase links
   * point at the contact brief. Industry links go to contact too. Change
   * `href` values here once more service pages are built.
   */
  services,

  /** Section 04 — the studio and the commitments behind it. */
  about: {
    eyebrow: 'About us',
    titleLead: T('Built by people', 'તમારું કામ જાણતા', 'आपका काम जानने वाले'),
    titleAccent: T('who know your floor.', 'લોકોએ બનાવેલું.', 'लोगों ने बनाया.'),
    lede: T('A software team in Surat that has worked with the diamond and jewellery trade for over twenty years. Three commitments shape every project.', 'સુરતની સોફ્ટવેર ટીમ, જે વીસ વર્ષથી વધુ સમયથી ડાયમંડ અને જ્વેલરી વેપાર સાથે કામ કરે છે. દરેક પ્રોજેક્ટને ત્રણ પ્રતિબદ્ધતાઓ આકાર આપે છે.', 'सूरत की सॉफ़्टवेयर टीम, जो बीस वर्षों से अधिक समय से डायमंड और ज्वेलरी व्यापार के साथ काम कर रही है। हर प्रोजेक्ट को तीन प्रतिबद्धताएँ आकार देती हैं.'),
  },

  /**
   * Section 03 — how we work.
   *
   * The three-step process is deliberately short: map the real workflow,
   * build the smallest system that improves it, then hand over something the
   * team can own. The section scroll-links any number of stages to a sticky
   * number and progress rail; three is the current editorial rhythm.
   */
  process: {
    eyebrow: 'How we work',
    titleLead: T('From your floor', 'તમારા ફ્લોરથી', 'आपके फ़्लोर से'),
    titleAccent: T('to deployment.', 'ડિપ્લોયમેન્ટ સુધી.', 'डिप्लॉयमेंट तक.'),
    lede: T('Three steps. Software that still makes sense the day after launch.', 'ત્રણ પગલાં. લોન્ચ પછીના દિવસે પણ અર્થપૂર્ણ લાગે તેવું સોફ્ટવેર.', 'तीन कदम। ऐसा सॉफ़्टवेयर जो लॉन्च के अगले दिन भी समझ आए.'),
    steps: [
      { num: '01', title: T('Walk the floor', 'ફ્લોર પર ચાલો', 'फ़्लोर पर चलें'), body: T('We map how work really moves, from rough to dispatch, spreadsheets and chat groups included.', 'કામ ખરેખર કેવી રીતે આગળ વધે છે તે અમે નોંધીએ છીએ — રફથી ડિસ્પેચ સુધી, સ્પ્રેડશીટ અને ચેટ ગ્રુપ સહિત.', 'हम देखते हैं कि काम असल में कैसे आगे बढ़ता है — रफ़ से डिस्पैच तक, स्प्रेडशीट और चैट ग्रुप सहित.') },
      { num: '02', title: T('Build', 'બનાવો', 'बनाएँ'), body: T('We design the ERP around those stages and build it.', 'અમે તે તબક્કાઓને ધ્યાનમાં રાખીને ERP ડિઝાઇન કરીએ છીએ અને બનાવીએ છીએ.', 'हम उन्हीं चरणों को ध्यान में रखकर ERP डिज़ाइन करते हैं और बनाते हैं.') },
      { num: '03', title: T('Deploy', 'ડિપ્લોય કરો', 'डिप्लॉय करें'), body: T('We deploy it on your floor and hand over software your team can run and extend.', 'અમે તેને તમારા ફ્લોર પર ડિપ્લોય કરીએ છીએ અને તમારી ટીમ ચલાવી-વધારી શકે તેવું સોફ્ટવેર સોંપીએ છીએ.', 'हम इसे आपके फ़्लोर पर डिप्लॉय करते हैं और ऐसा सॉफ़्टवेयर सौंपते हैं जिसे आपकी टीम चला और बढ़ा सके.') },
    ],
  },

  principles: [
    { num: '01', title: T('Start on your floor', 'તમારા ફ્લોરથી શરૂઆત', 'आपके फ़्लोर से शुरुआत'), body: T('We begin with how a packet really moves through your factory, then build the system around it.', 'તમારી ફેક્ટરીમાં પેકેટ ખરેખર કેવી રીતે ફરે છે તેનાથી અમે શરૂ કરીએ છીએ, પછી તેની આસપાસ સિસ્ટમ બનાવીએ છીએ.', 'हम देखते हैं कि पैकेट आपकी फ़ैक्ट्री में असल में कैसे घूमता है, फिर उसके इर्द-गिर्द सिस्टम बनाते हैं.') },
    { num: '02', title: T('Build for the day after launch', 'લોન્ચ પછીના દિવસ માટે બનાવો', 'लॉन्च के अगले दिन के लिए बनाएँ'), body: T('Maintainable, documented and ready for your team to run and extend.', 'જાળવણી યોગ્ય, દસ્તાવેજીકૃત અને તમારી ટીમ ચલાવી-વધારી શકે તે માટે તૈયાર.', 'रखरखाव योग्य, दस्तावेज़ित और आपकी टीम के चलाने-बढ़ाने के लिए तैयार.') },
    { num: '03', title: T('Keep it practical', 'વ્યવહારુ રાખો', 'व्यावहारिक रखें'), body: T('Software people can use. Every decision should make the floor clearer or the handover lighter.', 'લોકો વાપરી શકે તેવું સોફ્ટવેર. દરેક નિર્ણય ફ્લોરને સ્પષ્ટ અથવા હેન્ડઓવરને હળવું બનાવવો જોઈએ.', 'ऐसा सॉफ़्टवेयर जो लोग इस्तेमाल कर सकें। हर फ़ैसले से फ़्लोर स्पष्ट या हैंडओवर हल्का होना चाहिए.') },
  ],

  contact: {
    eyebrow: 'Talk to a founder',
    titleLead: T('Tell us what is', 'તમારા ફ્લોર પર શું', 'आपके फ़्लोर पर क्या'),
    titleAccent: T('slow on your floor.', 'ધીમું છે તે કહો.', 'धीमा है, बताइए।'),
    lede: T('A founder reads every message. We reply within one working day.', 'ફાઉન્ડર દરેક મેસેજ વાંચે છે. અમે એક કામકાજી દિવસમાં જવાબ આપીએ છીએ.', 'फ़ाउंडर हर मैसेज पढ़ते हैं। हम एक कार्यदिवस में जवाब देते हैं.'),
    formNote: T('Form not connected. Endpoint to be supplied.', 'ફોર્મ જોડાયેલું નથી. એન્ડપોઇન્ટ આપવાનું બાકી છે.', 'फ़ॉर्म जुड़ा नहीं है। एंडपॉइंट दिया जाना बाकी है.'),
  },
  }
}

/** Page content in the active language. Rebuilt by setLang() on switch. */
export let site: Site = buildSite()
