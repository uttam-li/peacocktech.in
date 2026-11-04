import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { T, withLang } from '@data/site'
import { cssVars } from '@lib/style'

const Ic = ({ children }: { children: ReactNode }): React.JSX.Element => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
)
const IP: Record<string, ReactNode> = {
  box: <path d="M4 7l8-4 8 4v10l-8 4-8-4Z" />,
  ok: <path d="M4 12l5 5L20 6" />,
  lock: <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" /></>,
  bolt: <path d="M13 3L5 14h6l-1 7 8-11h-6Z" />,
  plus: <path d="M12 5v14M5 12h14" />,
}
const Row = ({ i, a, b, r }: { i: string; a: string; b: string; r: ReactNode }): React.JSX.Element => (
  <div className="row"><span className="ib"><Ic>{IP[i]}</Ic></span><span><b>{a}</b>{b}</span>{r}</div>
)
const TabBar = ({ home, mid, me }: { home: string; mid: string; me: string }): React.JSX.Element => (
  <div className="tb"><span className="a"><span className="ib"><Ic>{IP.box}</Ic></span>{home}</span><span><span className="ib"><Ic>{IP.bolt}</Ic></span>{mid}</span><span><span className="ib"><Ic>{IP.lock}</Ic></span>{me}</span></div>
)

interface Service { n: string; h: string; p: string; b: [string, string, string]; s: ReactNode }
interface ToolFam { key: string; label: string; tools: [string, string][] }

export default function MobileAppPage() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [os, setOs] = useState<'ios' | 'and'>('ios')
  const [toast, setToast] = useState(-1)
  const [tab, setTab] = useState('iOS')
  const [activeSvc, setActiveSvc] = useState(0)
  const svcRefs = useRef<Array<HTMLElement | null>>([])
  const railRefs = useRef<Array<HTMLButtonElement | null>>([])

  const moveRailTab = (e: React.KeyboardEvent<HTMLButtonElement>, index: number): void => {
    const last = fams.length - 1
    let next: number | null = null
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = index === last ? 0 : index + 1
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = index === 0 ? last : index - 1
    if (e.key === 'Home') next = 0
    if (e.key === 'End') next = last
    if (next === null) return
    e.preventDefault()
    setTab(fams[next].key)
    railRefs.current[next]?.focus()
  }

  const services: Service[] = [
    {
      n: T('iOS Development', 'iOS ડેવલપમેન્ટ', 'iOS डेवलपमेंट'),
      h: T('iOS App Development', 'iOS એપ ડેવલપમેન્ટ', 'iOS ऐप डेवलपमेंट'),
      p: T('Native Swift and SwiftUI apps that feel at home on iPhone and iPad, built to App Store review standards from day one.', 'iPhone અને iPad પર ઘર જેવી લાગતી નેટિવ Swift અને SwiftUI એપ્સ, પહેલા દિવસથી App Store રિવ્યૂ સ્ટાન્ડર્ડ મુજબ બનેલી.', 'iPhone और iPad पर घर जैसी लगने वाली नेटिव Swift और SwiftUI ऐप्स, पहले दिन से App Store रिव्यू स्टैंडर्ड के हिसाब से बनीं।'),
      b: [
        T('Swift and SwiftUI native builds', 'Swift અને SwiftUI નેટિવ બિલ્ડ્સ', 'Swift और SwiftUI नेटिव बिल्ड'),
        T('Human Interface Guidelines, done properly', 'Human Interface Guidelines, યોગ્ય રીતે', 'Human Interface Guidelines, सही तरीके से'),
        T('TestFlight beta and App Store submission', 'TestFlight બીટા અને App Store સબમિશન', 'TestFlight बीटा और App Store सबमिशन'),
      ],
      s: (<><div className="t0">{T('Today', 'આજે', 'आज')}</div><div className="t1">{T('Activity', 'પ્રવૃત્તિ', 'गतिविधि')}</div><svg viewBox="0 0 120 120" style={{ width: 120, margin: '18px auto 8px', display: 'block' }} fill="none" strokeLinecap="round" strokeWidth={10}><circle cx="60" cy="60" r="50" stroke="#14291f" /><circle cx="60" cy="60" r="50" stroke="#b8d000" strokeDasharray="230 314" transform="rotate(-90 60 60)" /><circle cx="60" cy="60" r="32" stroke="#14291f" /><circle cx="60" cy="60" r="32" stroke="#3fd488" strokeDasharray="130 201" transform="rotate(-90 60 60)" /></svg><Row i="ok" a={T('Move', 'મૂવ', 'मूव')} b={T('72% of goal', 'લક્ષ્યના 72%', 'लक्ष्य का 72%')} r={<span className="r">432</span>} /><Row i="bolt" a={T('Focus', 'ફોકસ', 'फ़ोकस')} b={T('48 min', '48 મિનિટ', '48 मिनट')} r={<span className="chip">{T('On track', 'ટ્રેક પર', 'ट्रैक पर')}</span>} /></>),
    },
    {
      n: T('Android Development', 'Android ડેવલપમેન્ટ', 'Android डेवलपमेंट'),
      h: T('Android App Development', 'Android એપ ડેવલપમેન્ટ', 'Android ऐप डेवलपमेंट'),
      p: T('Kotlin and Jetpack Compose apps tuned for the huge range of Android devices, from flagships to budget handsets.', 'ફ્લેગશિપથી લઈને બજેટ ફોન સુધી, Android ડિવાઇસની વિશાળ રેન્જ માટે ટ્યુન કરેલી Kotlin અને Jetpack Compose એપ્સ.', 'फ़्लैगशिप से बजट फोन तक, Android डिवाइस की विशाल रेंज के लिए ट्यून की गई Kotlin और Jetpack Compose ऐप्स।'),
      b: [
        T('Kotlin and Jetpack Compose', 'Kotlin અને Jetpack Compose', 'Kotlin और Jetpack Compose'),
        T('Material Design, adaptive to every screen', 'Material Design, દરેક સ્ક્રીનને અનુકૂળ', 'Material Design, हर स्क्रीन के अनुकूल'),
        T('Google Play release and staged rollouts', 'Google Play રિલીઝ અને તબક્કાવાર રોલઆઉટ', 'Google Play रिलीज़ और चरणबद्ध रोलआउट'),
      ],
      s: (<><div className="t1">{T('Inbox', 'ઇનબોક્સ', 'इनबॉक्स')}</div><Row i="box" a={T('Order #2041', 'ઓર્ડર #2041', 'ऑर्डर #2041')} b={T('Packed and ready', 'પેક અને તૈયાર', 'पैक और तैयार')} r={<span className="chip">{T('New', 'નવું', 'नया')}</span>} /><Row i="box" a={T('Order #2040', 'ઓર્ડર #2040', 'ऑर्डर #2040')} b={T('Out for delivery', 'ડિલિવરી માટે નીકળ્યું', 'डिलीवरी के लिए निकला')} r={<span className="chip w">{T('Moving', 'રસ્તામાં', 'रास्ते में')}</span>} /><Row i="ok" a={T('Order #2039', 'ઓર્ડર #2039', 'ऑर्डर #2039')} b={T('Delivered', 'ડિલિવર થયું', 'डिलीवर हुआ')} r={<span className="r">{T('Done', 'પૂર્ણ', 'पूर्ण')}</span>} /><Row i="box" a={T('Order #2038', 'ઓર્ડર #2038', 'ऑर्डर #2038')} b={T('Packed and ready', 'પેક અને તૈયાર', 'पैक और तैयार')} r={<span className="chip">{T('New', 'નવું', 'नया')}</span>} /></>),
    },
    {
      n: T('Cross-Platform Development', 'ક્રોસ-પ્લેટફોર્મ ડેવલપમેન્ટ', 'क्रॉस-प्लेटफ़ॉर्म डेवलपमेंट'),
      h: T('Cross-Platform Development', 'ક્રોસ-પ્લેટફોર્મ ડેવલપમેન્ટ', 'क्रॉस-प्लेटफ़ॉर्म डेवलपमेंट'),
      p: T('React Native and Flutter apps that share one codebase across iOS and Android, so you ship faster and maintain once.', 'React Native અને Flutter એપ્સ જે iOS અને Android પર એક જ કોડબેઝ શેર કરે, જેથી તમે ઝડપથી શિપ કરો અને એક જ વાર મેન્ટેન કરો.', 'React Native और Flutter ऐप्स जो iOS और Android पर एक ही कोडबेस साझा करते हैं, ताकि आप तेज़ी से शिप करें और एक बार मेंटेन करें।'),
      b: [
        T('One codebase, two stores', 'એક કોડબેઝ, બે સ્ટોર', 'एक कोडबेस, दो स्टोर'),
        T('Native performance where it counts', 'જ્યાં જરૂરી ત્યાં નેટિવ પર્ફોર્મન્સ', 'जहाँ ज़रूरी वहाँ नेटिव परफ़ॉर्मेंस'),
        T('Shared logic, platform-true interface', 'શેર કરેલું લોજિક, પ્લેટફોર્મ-સાચું ઇન્ટરફેસ', 'साझा लॉजिक, प्लेटफ़ॉर्म-सच्चा इंटरफ़ेस'),
      ],
      s: (<><div className="t0">{T('Shared', 'શેઅર્ડ', 'साझा')}</div><div className="t1">{T('One logic', 'એક લોજિક', 'एक लॉजिक')}</div><div style={{display:'flex',gap:'8px',margin:'14px 0'}}><span className="chip">iOS</span><span className="chip w">Android</span></div><div className="t0" style={{marginTop:'12px'}}>{T('Interface', 'ઇન્ટરફેસ', 'इंटरफ़ेस')}</div><div className="t1">{T('Platform-true', 'મૂળ અનુભવ', 'मूल अनुभव')}</div><Row i="ok" a={T('Buttons', 'બટનો', 'बटन')} b={T('Native feel', 'નેટિવ અનુભવ', 'नेटिव अनुभव')} r={'<span className="r">100%</span>'} /><Row i="ok" a={T('Gestures', 'જેસ્ચર', 'जेस्चर')} b={T('Each OS way', 'દરેક OSની રીતે', 'हर OS के तरीके से')} r={'<span className="r">100%</span>'} /></>),
    },
    {
      n: T('Enterprise Mobility', 'એન્ટરપ્રાઇઝ મોબિલિટી', 'एंटरप्राइज़ मोबिलिटी'),
      h: T('Enterprise Mobile Solutions', 'એન્ટરપ્રાઇઝ મોબાઇલ સોલ્યુશન્સ', 'एंटरप्राइज़ मोबाइल सॉल्यूशंस'),
      p: T('Field, warehouse and back-office apps that connect straight into your ERP, CRM and internal systems.', 'ફિલ્ડ, વેરહાઉસ અને બેક-ઓફિસ એપ્સ જે સીધી તમારા ERP, CRM અને આંતરિક સિસ્ટમ્સ સાથે જોડાય.', 'फ़ील्ड, वेयरहाउस और बैक-ऑफ़िस ऐप्स जो सीधे आपके ERP, CRM और आंतरिक सिस्टम से जुड़ें।'),
      b: [
        T('ERP and CRM integration', 'ERP અને CRM ઇન્ટિગ્રેશન', 'ERP और CRM इंटीग्रेशन'),
        T('Role-based access for every team', 'દરેક ટીમ માટે રોલ-બેઝ્ડ એક્સેસ', 'हर टीम के लिए रोल-आधारित एक्सेस'),
        T('Offline-first for the shop floor', 'શોપ ફ્લોર માટે ઓફલાઇન-ફર્સ્ટ', 'शॉप फ़्लोर के लिए ऑफ़लाइन-फ़र्स्ट'),
      ],
      s: (<><div className="t0">{T('Team', 'ટીમ', 'टीम')}</div><div className="t1">{T('Approvals', 'મંજૂરીઓ', 'स्वीकृतियाँ')}</div><Row i="lock" a={T('Gate pass', 'ગેટ પાસ', 'गेट पास')} b={T('Level 2', 'લેવલ 2', 'लेवल 2')} r={<span className="chip">{T('Pending', 'બાકી', 'लंबित')}</span>} /><Row i="ok" a={T('Leave', 'રજા', 'छुट्टी')} b={T('Approved', 'મંજૂર', 'स्वीकृत')} r={<span className="r">{T('Done', 'પૂર્ણ', 'पूर्ण')}</span>} /><Row i="box" a={T('Material', 'મટિરિયલ', 'सामग्री')} b={T('Inward done', 'આવક પૂર્ણ', 'आवक पूर्ण')} r={<span className="r">{T('Done', 'પૂર્ણ', 'पूर्ण')}</span>} /></>),
    },
    {
      n: T('App Security', 'એપ સિક્યોરિટી', 'ऐप सुरक्षा'),
      h: T('Mobile App Security', 'મોબાઇલ એપ સિક્યોરિટી', 'मोबाइल ऐप सुरक्षा'),
      p: T('Security designed in rather than bolted on, covering authentication, data at rest and every API call.', 'ઓથેન્ટિકેશન, સંગ્રહિત ડેટા અને દરેક API કોલને આવરી લેતી, ઉપરથી નહીં પણ અંદરથી ડિઝાઇન કરેલી સિક્યોરિટી.', 'ऑथेंटिकेशन, संग्रहीत डेटा और हर API कॉल को कवर करने वाली, ऊपर से नहीं बल्कि अंदर से डिज़ाइन की गई सुरक्षा।'),
      b: [
        T('Biometric sign-in and secure storage', 'બાયોમેટ્રિક સાઇન-ઇન અને સુરક્ષિત સ્ટોરેજ', 'बायोमेट्रिक साइन-इन और सुरक्षित स्टोरेज'),
        T('Encrypted traffic and certificate pinning', 'એન્ક્રિપ્ટેડ ટ્રાફિક અને સર્ટિફિકેટ પિનિંગ', 'एन्क्रिप्टेड ट्रैफ़िक और सर्टिफ़िकेट पिनिंग'),
        T('Audit-ready logging and access control', 'ઓડિટ-રેડી લોગિંગ અને એક્સેસ કંટ્રોલ', 'ऑडिट-रेडी लॉगिंग और एक्सेस कंट्रोल'),
      ],
      s: (<><div className="t0">{T('Shield', 'શીલ્ડ', 'शील्ड')}</div><div className="t1">{T('Protected', 'સુરક્ષિત', 'सुरक्षित')}</div><div style={{display:'flex',gap:'10px',justifyContent:'center',margin:'16px 0'}}><span style={{width:'46px',height:'46px',borderRadius:'50%',border:'1px solid var(--gd)'}}></span><span style={{width:'46px',height:'46px',borderRadius:'50%',background:'#3fd48833',border:'1px solid var(--gd)'}}></span><span style={{width:'46px',height:'46px',borderRadius:'50%',background:'var(--gd)'}}></span></div><Row i="lock" a={T('Vault', 'તિજોરી', 'तिजोरी')} b={'AES-256'} r={<span className="chip">{T('Locked', 'લોક્ડ', 'लॉक्ड')}</span>} /></>),
    },
    {
      n: T('Backend & APIs', 'બેકએન્ડ અને API', 'बैकएंड और API'),
      h: T('Backend and API Integration', 'બેકએન્ડ અને API ઇન્ટિગ્રેશન', 'बेकएंड और API इंटीग्रेशन'),
      p: T('The server side your app lives on: scalable APIs, real-time sync and cloud infrastructure that grows with your users.', 'તમારી એપ જેના પર ચાલે તે સર્વર સાઇડ: સ્કેલેબલ API, રિયલ-ટાઇમ સિંક અને તમારા યુઝર્સ સાથે વધતું ક્લાઉડ ઇન્ફ્રાસ્ટ્રક્ચર.', 'आपकी ऐप जिस पर चलती है वह सर्वर साइड: स्केलेबल API, रियल-टाइम सिंक और आपके यूज़र्स के साथ बढ़ता क्लाउड इंफ्रास्ट्रक्चर।'),
      b: [
        T('REST and GraphQL APIs', 'REST અને GraphQL API', 'REST और GraphQL API'),
        T('Real-time sync and push notifications', 'રિયલ-ટાઇમ સિંક અને પુશ નોટિફિકેશન', 'रियल-टाइम सिंक और पुश नोटिभिकेशन'),
        T('Cloud hosting on AWS or Firebase', 'AWS કે Firebase પર ક્લાઉડ હોસ્ટિંગ', 'AWS या Firebase पर क्लाउड होस्टिंग'),
      ],
      s: (<><div className="t1">{T('Sync', 'સિંક', 'सिंक')}</div><div style={{display:'flex',alignItems:'flex-end',gap:'7px',height:'96px',margin:'18px 0 6px'}}>{[40, 62, 48, 80, 56, 92, 70, 52, 84].map((hh, k) => <i key={k} style={{ flex: 1, height: hh + '%', borderRadius: '5px 5px 2px 2px', background: hh > 80 ? 'var(--lime)' : 'var(--green)' }} />)}</div><div className="t0">{T('Requests per minute', 'પ્રતિ મિનિટ રિક્વેસ્ટ', 'प्रति मिनट अनुरोध')}</div><Row i="bolt" a={'API'} b={T('Healthy', 'સ્વસ્થ', 'स्वस्थ')} r={'<span className="chip">200 OK</span>'} /><Row i="box" a={T('Database', 'ડેટાબેઝ', 'डेटाबेस')} b={T('Replicated', 'પ્રતિકૃત', 'प्रतिकृत')} r={<span className="chip">{T('Live', 'લાઇવ', 'लाइव')}</span>} /></>),
    },
  ]

  const fams: ToolFam[] = [
    {
      key: 'iOS', label: T('iOS', 'iOS', 'iOS'),
      tools: [['Sw', 'Swift'], ['SU', 'SwiftUI'], ['Oc', 'Objective-C'], ['UK', 'UIKit'], ['CD', 'Core Data'], ['XC', 'Xcode']],
    },
    {
      key: 'Android', label: T('Android', 'Android', 'Android'),
      tools: [['Kt', 'Kotlin'], ['Jv', 'Java'], ['JC', 'Jetpack Compose'], ['SD', 'Android SDK'], ['Rm', 'Room'], ['AS', 'Android Studio']],
    },
    {
      key: 'Cross-Platform', label: T('Cross-Platform', 'ક્રોસ-પ્લેટફોર્મ', 'क्रॉस-प्लेटफ़ॉर्म'),
      tools: [['RN', 'React Native'], ['Fl', 'Flutter'], ['Dt', 'Dart'], ['Io', 'Ionic'], ['MA', '.NET MAUI'], ['Ex', 'Expo']],
    },
    {
      key: 'Backend & Tools', label: T('Backend & Tools', 'બેકએન્ડ અને ટૂલ્સ', 'बैकएंड और टूल्स'),
      tools: [['Nd', 'Node.js'], ['Fb', 'Firebase'], ['AW', 'AWS'], ['GQ', 'GraphQL'], ['Rs', 'REST APIs'], ['Fg', 'Figma'], ['Gt', 'Git'], ['Fa', 'Fastlane']],
    },
  ]

  const steps = [
    { title: T('Discovery', 'ડિસ્કવરી', 'डिस्कवरी'), desc: T('Requirements, user research and a scope everyone signs off on.', 'રિક્વાયરમેન્ટ્સ, યુઝર રિસર્ચ અને સૌ સહી કરે તેવો સ્કોપ.', 'रिक्वायरमेंट, यूज़र रिसर्च और ऐसा स्कोप जिस पर सभी सहमत हों।'), out: T('Output: roadmap', 'આઉટપુટ: રોડમેપ', 'आउटपुट: रोडमैप') },
    { title: T('Design', 'ડિઝાઇન', 'डिज़ाइन'), desc: T('UX flows, UI design and clickable prototypes you can test on a real phone.', 'UX ફ્લો, UI ડિઝાઇન અને ક્લિક કરી શકાય તેવા પ્રોટોટાઇપ જે તમે ખરા ફોન પર ટેસ્ટ કરી શકો.', 'UX फ़्लो, UI डिज़ाइन और क्लिक करने योग्य प्रोटोटाइप जिन्हें आप असली फ़ोन पर टेस्ट कर सकें।'), out: T('Output: prototype', 'આઉટપુટ: પ્રોટોટાઇપ', 'आउटपुट: प्रोटोटाइप') },
    { title: T('Development', 'ડેવલપમેન્ટ', 'डेवलपमेंट'), desc: T('Agile sprints with a working build in your hands every week.', 'એજાઇલ સ્પ્રિન્ટ્સ સાથે દર અઠવાડિયે તમારા હાથમાં વર્કિંગ બિલ્ડ.', 'एजाइल स्प्रिंट के साथ हर हफ़्ते आपके हाथ में वर्किंग बिल्ड।'), out: T('Output: weekly builds', 'આઉટપુટ: સાપ્તાહિક બિલ્ડ્સ', 'आउटपुट: साप्ताहिक बिल्ड') },
    { title: T('Testing', 'ટેસ્ટિંગ', 'टेस्टिंग'), desc: T('Real devices, performance and security checks before anyone else sees it.', 'બીજું કોઈ જુએ તે પહેલાં ખરા ડિવાઇસ, પર્ફોર્મન્સ અને સિક્યોરિટી ચેક.', 'कोई और देखे उससे पहले असली डिवाइस, परफ़ॉर्मेंस और सुरक्षा जाँच।'), out: T('Output: release candidate', 'આઉટપુટ: રિલીઝ કેન્ડિડેટ', 'आउटपुट: रिलीज़ कैंडिडेट') },
    { title: T('Launch', 'લોન્ચ', 'लॉन्च'), desc: T('Store submission, review and a staged rollout to your users.', 'સ્ટોર સબમિશન, રિવ્યૂ અને તમારા યુઝર્સ સુધી તબક્કાવાર રોલઆઉટ.', 'स्टोर सबमिशन, रिव्यू और आपके यूज़र्स तक चरणबद्ध रोलआउट।'), out: T('Output: live app', 'આઉટપુટ: લાઇવ એપ', 'आउटपुट: लाइव ऐप') },
    { title: T('Support', 'સપોર્ટ', 'सपोर्ट'), desc: T('Updates, monitoring and new features as your users grow.', 'તમારા યુઝર્સ વધે તેમ અપડેટ્સ, મોનિટરિંગ અને નવા ફીચર્સ.', 'आपके यूज़र्स बढ़ें तो अपडेट, मॉनिटरिंग और नए फ़ीचर्स।'), out: T('Output: steady growth', 'આઉટપુટ: સ્થિર વૃદ્ધિ', 'आउटपुट: स्थिर वृद्धि') },
  ]

  const toasts: string[] = [
    T('Build passed', 'બિલ્ડ પાસ', 'बिल्ड पास'),
    T('Submitted to the App Store', 'App Store પર સબમિટ થયું', 'App Store पर सबमिट हुआ'),
    T('Live on Google Play', 'Google Play પર લાઇવ', 'Google Play पर लाइव'),
  ]

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setToast(0)
      return
    }
    const t1 = window.setTimeout(() => setToast(0), 1200)
    const id = window.setInterval(() => setToast((t) => (t + 1) % toasts.length), 4200)
    return () => {
      window.clearTimeout(t1)
      window.clearInterval(id)
    }
  }, [toasts.length])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    // Scroll reveal with three guards so fling-scrolling never lands on
    // empty sections: (1) entry trigger, (2) rAF scroll catch-up for fast
    // flings, (3) a safety timer so content can never stay hidden.
    // (Same system as the about page.)
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
      window.addEventListener('resize', onScroll)
      safety = window.setTimeout(catchUp, 5000)
    } catch {
      rvEls.forEach((el) => el.classList.add('in'))
    }
    let cur = -1
    let ticking = false
    const spy = (): void => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        const live = Array.from(root.querySelectorAll<HTMLElement>('#sl .si'))
        if (!live.length) return
        const mid = window.innerHeight * 0.5
        let best = 0
        let bestDist = Infinity
        live.forEach((el, k) => {
          const r = el.getBoundingClientRect()
          const d = Math.abs(r.top + r.height / 2 - mid)
          if (d < bestDist) {
            bestDist = d
            best = k
          }
        })
        if (best === cur) return
        cur = best
        setActiveSvc(best)
      })
    }
    spy()
    window.addEventListener('scroll', spy, { passive: true })
    window.addEventListener('resize', spy)
    return () => {
      io?.disconnect()
      if (raf) window.cancelAnimationFrame(raf)
      if (safety) window.clearTimeout(safety)
      if (onScroll) {
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onScroll)
      }
      window.removeEventListener('scroll', spy)
      window.removeEventListener('resize', spy)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const flow = rootRef.current?.querySelector('#mflow')
    if (!flow) return undefined
    const sts = Array.from(flow.querySelectorAll('.st'))
    const fill = flow.querySelector<HTMLElement>('.fill')
    const prog = (): void => {
      const r = flow.getBoundingClientRect()
      const mid = window.innerHeight * 0.55
      const h = Math.max(0, Math.min(r.height - 80, mid - r.top))
      if (fill) fill.style.setProperty('--p', `${h}px`)
      sts.forEach((st) => st.classList.toggle('on', st.getBoundingClientRect().top < mid))
    }
    prog()
    window.addEventListener('scroll', prog, { passive: true })
    window.addEventListener('resize', prog)
    return () => {
      window.removeEventListener('scroll', prog)
      window.removeEventListener('resize', prog)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={rootRef} data-os={os}>
      <div className="grain" aria-hidden="true" />
      <main id="top" tabIndex={-1}>
        {/* Hero */}
        <section className="hero" data-io="">
          <div className="wrap">
            <div>
              <h1 className="rv" style={cssVars({ '--i': 0 })}>{`${T('Mobile App', 'મોબાઇલ એપ', 'मोबाइल ऐप')} `}<em>{T('Development', 'ડેવલપમેન્ટ', 'डेवलपमेंट')}</em></h1>
              <p className="lead rv" style={cssVars({ '--i': 1 })}>
                {T(
                  'Custom mobile apps for iOS and Android — built for your field teams and customers, from first screen to store release.',
                  'iOS અને Android માટે કસ્ટમ મોબાઇલ એપ્સ — તમારી ફિલ્ડ ટીમ અને ગ્રાહકો માટે, પહેલી સ્ક્રીનથી સ્ટોર રિલીઝ સુધી.',
                  'iOS और Android के लिए कस्टम मोबाइल ऐप्स — आपकी फ़ील्ड टीम और ग्राहकों के लिए, पहली स्क्रीन से स्टोर रिलीज़ तक।',
                )}
              </p>
              <div className="acts rv" style={cssVars({ '--i': 2 })}>
                <a className="pill y" href={withLang('/contact')}>
                  {T('Start Your Mobile Project', 'તમારો મોબાઇલ પ્રોજેક્ટ શરૂ કરો', 'अपना मोबाइल प्रोजेक्ट शुरू करें')}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </a>
              </div>
            </div>
            <div className="stage rv" id="stage" style={cssVars({ '--i': 1 })}>
              <div className="phone" id="hp">
                <div className="isl" aria-hidden="true" />
                <div className="sc">
                  <div className="sb"><span>9:41</span><span>5G</span></div>
                  <div className="body">
                    <div className="t0">{T('Good morning, Aarav', 'શુભ સવાર, આરવ', 'सुप्रभात, आरव')}</div>
                    <div className="t1">{T('Field Operations', 'ફિલ્ડ ઓપરેશન્સ', 'फ़ील्ड ऑपरेशंस')}</div>
                    <div className="big">128<small>{T('orders today', 'આજના ઓર્ડર્સ', 'आज के ऑर्डर')}</small></div>
                    <svg className="spark" viewBox="0 0 220 64" preserveAspectRatio="none" fill="none" aria-hidden="true">
                      <path d="M0 52C20 48 30 30 52 34S86 54 110 38 150 10 176 20 206 8 220 6" stroke="#3fd488" strokeWidth="2.4" strokeLinecap="round" />
                      <path d="M0 52C20 48 30 30 52 34S86 54 110 38 150 10 176 20 206 8 220 6V64H0Z" fill="#00a058" opacity=".16" />
                    </svg>
                    <div className="row"><span className="ib"><Ic>{IP.box}</Ic></span><span><b>{T('Warehouse A', 'વેરહાઉસ A', 'वेयरहाउस A')}</b>{T('Dispatch ready', 'ડિસ્પેચ તૈયાર', 'डिस्पैच तैयार')}</span><span className="r">42</span></div>
                    <div className="row"><span className="ib"><Ic>{IP.ok}</Ic></span><span><b>{T('Approvals', 'મંજૂરીઓ', 'स्वीकृतियाँ')}</b>{T('Awaiting you', 'તમારી રાહ જુએ છે', 'आपका इंतज़ार')}</span><span className="chip w">{T('3 new', '3 નવા', '3 नए')}</span></div>
                    <div className="row"><span className="ib"><Ic>{IP.lock}</Ic></span><span><b>{T('Route sync', 'રૂટ સિંક', 'रूट सिंक')}</b>{T('2 min ago', '2 મિનિટ પહેલાં', '2 मिनट पहले')}</span><span className="chip">{T('Live', 'લાઇવ', 'लाइव')}</span></div>
                  </div>
                  <div className="tb">
                    <span className="a"><span className="ib"><Ic>{IP.box}</Ic></span>{T('Home', 'હોમ', 'होम')}</span>
                    <span><span className="ib"><Ic>{IP.bolt}</Ic></span>{T('Reports', 'રિપોર્ટ્સ', 'रिपोर्ट')}</span>
                    <span><span className="ib"><Ic>{IP.lock}</Ic></span>{T('Profile', 'પ્રોફાઇલ', 'प्रोफ़ाइल')}</span>
                  </div>
                  <div className="gest" aria-hidden="true" />
                </div>
                {toast >= 0 && (
                  <div key={toast} className="toast in" role="status"><span className="ib"><Ic>{IP.ok}</Ic></span><span>{toasts[toast]}</span></div>
                )}
              </div>
              <div className="seg" role="group" aria-label={T('Preview platform', 'પ્રિવ્યૂ પ્લેટફોર્મ', 'प्रीव्यू प्लेटफ़ॉर्म')}>
                <button type="button" data-os="ios" aria-pressed={os === 'ios'} onClick={() => setOs('ios')}>iOS</button>
                <button type="button" data-os="and" aria-pressed={os === 'and'} onClick={() => setOs('and')}>Android</button>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" data-io="">
          <div className="wrap">
            <div className="head">
              <h2 className="hd2 rv" style={cssVars({ '--i': 0 })}>{`${T('Comprehensive Mobile Development', 'કોમ્પ્રિહેન્સિવ મોબાઇલ ડેવલપમેન્ટ', 'कॉम्प्रिहेंसिव मोबाइल डेवलपमेंट')} `}<em>{T('Services', 'સેવાઓ', 'सेवाएँ')}</em></h2>
              <p className="lead rv" style={cssVars({ '--i': 1 })}>
                {T(
                  'From concept to App Store - complete mobile app development for iOS and Android platforms',
                  'કન્સેપ્ટથી App Store સુધી - iOS અને Android પ્લેટફોર્મ માટે સંપૂર્ણ મોબાઇલ એપ ડેવલપમેન્ટ',
                  'कंसेप्ट से App Store तक - iOS और Android प्लेटफ़ॉर्म के लिए संपूर्ण मोबाइल ऐप डेवलपमेंट',
                )}
              </p>
            </div>
            <div className="svc">
              <div className="pin">
                <div className="phone" data-os-fixed="true">
                  <div className="isl" aria-hidden="true" />
                  <div className="sc">
                    <div className="sb"><span>9:41</span><span>5G</span></div>
                    <div id="scrs">
                      {services.map((sv, i) => (
                        <div key={sv.n} className={`scr${i === activeSvc ? ' on' : ''}`}>
                          <div className="body">{sv.s}</div>
                          <TabBar home={T('Home', 'હોમ', 'होम')} mid={T('Data', 'ડેટા', 'डेटा')} me={T('Me', 'હું', 'मैं')} />
                        </div>
                      ))}
                    </div>
                    <div className="gest" aria-hidden="true" />
                  </div>
                </div>
                <div className="cap" id="cap" aria-live="polite">{services[activeSvc].n}</div>
              </div>
              <div id="sl">
                {services.map((sv, i) => (
                  <article
                    key={sv.n}
                    ref={(el) => { svcRefs.current[i] = el }}
                    data-si={i}
                    style={cssVars({ '--i': i + 2 })}
                    className={`si rv${i === activeSvc ? ' on' : ''}`}
                  >
                    <h3>{sv.h}</h3>
                    <p>{sv.p}</p>
                    <ul>
                      {sv.b.map((pt) => (
                        <li key={pt}><span className="dm" />{pt}</li>
                      ))}
                    </ul>
                    <div className="inl">
                      <div className="phone">
                        <div className="isl" aria-hidden="true" />
                        <div className="sc">
                          <div className="sb"><span>9:41</span><span>5G</span></div>
                          <div className="scr">
                            <div className="body">{sv.s}</div>
                            <TabBar home={T('Home', 'હોમ', 'होम')} mid={T('Data', 'ડેટા', 'डेटા')} me={T('Me', 'હું', 'मैं')} />
                          </div>
                          <div className="gest" aria-hidden="true" />
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stack */}
        <section id="stack" data-io="">
          <div className="wrap">
            <div className="tech">
              <div>
                <h2 className="hd2 rv" style={cssVars({ '--i': 0 })}>{`${T('Technology', 'ટેકનોલોજી', 'टेक्नोलॉजी')} `}<em>{T('Stack', 'સ્ટેક', 'स्टैक')}</em></h2>
                <p className="lead rv" style={{ marginTop: 22, ...cssVars({ '--i': 1 }) }}>
                  {T(
                    'Native and cross-platform tools, chosen per product rather than per trend. Flip through the pages of the drawer.',
                    'ટ્રેન્ડને બદલે દરેક પ્રોડક્ટ મુજબ પસંદ કરેલા નેટિવ અને ક્રોસ-પ્લેટફોર્મ ટૂલ્સ. ડ્રોઅરના પાના ફેરવો.',
                    'ट्रेंड के बजाय हर प्रोडक्ट के हिसाब से चुने गए नेटिव और क्रॉस-प्लेटफ़ॉर्म टूल्स। ड्रॉअर के पन्ने पलटें।',
                  )}
                </p>
              </div>
              <div className="drawer rv v2" style={cssVars({ '--i': 2 })}>
                <div className="v2-rail" role="tablist" aria-label={T('Technology groups', 'ટેકનોલોજી જૂથો', 'टेक्नोलॉजी समूह')}>
                  {fams.map((fm, fi) => (
                    <button key={fm.key} ref={(el) => { railRefs.current[fi] = el }} role="tab" id={`v2-tab-${fm.key}`} aria-selected={tab === fm.key} aria-controls="apps" tabIndex={tab === fm.key ? 0 : -1} onClick={() => setTab(fm.key)} onKeyDown={(e) => moveRailTab(e, fi)} className={tab === fm.key ? 'on' : ''}>
                      <small>{`0${fi + 1}`}</small>{fm.label}
                    </button>
                  ))}
                </div>
                <div className="v2-grid" id="apps" role="tabpanel" aria-labelledby={`v2-tab-${tab}`} tabIndex={0}>
                  {fams.find((f) => f.key === tab)?.tools.map((t) => (
                    <div key={t[0]} className="v2-plate"><b>{t[0]}</b><span>{t[1]}</span></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process */}
        <section id="process" data-io="">
          <div className="wrap">
            <div className="head" style={{ justifyItems: 'start', textAlign: 'left' }}>
              <h2 className="hd2 rv" style={{ maxWidth: '18ch', ...cssVars({ '--i': 0 }) }}>{`${T('From first call to', 'પહેલા કોલથી', 'पहले कॉल से')} `}<em>{T('live release', 'લાઇવ રિલીઝ', 'लाइव रिलीज़')}</em></h2>
              <p className="lead rv" style={cssVars({ '--i': 1 })}>
                {T(
                  'A six-stage path, and every stage ends with something you can hold in your hand.',
                  'છ તબક્કાનો માર્ગ, અને દરેક તબક્કો કંઈક એવું આપે છે જે તમે હાથમાં પકડી શકો.',
                  'छह चरणों का मार्ग, और हर चरण कुछ ऐसा देता है जिसे आप हाथ में पकड़ सकें।',
                )}
              </p>
            </div>
            <div className="hz3 rv" id="mflow" style={cssVars({ '--i': 2 })}>
                <ol className="hz3-segs">
                  {steps.map((st, i) => (
                    <li key={st.title}><small>{`0${i + 1}`}</small><b>{st.title}</b></li>
                  ))}
                </ol>
                <div className="hz3-grid">
                  {steps.map((st) => (
                    <div key={st.title} className="hz3-cell"><h3>{st.title}</h3><p>{st.desc}</p><span>{st.out}</span></div>
                  ))}
                </div>
              </div>
          </div>
        </section>

      </main>
    </div>
  )
}
