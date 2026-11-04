import { useEffect, useRef, useState } from 'react'
import { lang, T, withLang } from '@data/site'
import Arrow from '@ui/Arrow'
import { cssVars } from '@lib/style'
import robotPng from '../../assets/ai/robot-working.png'
import robotWebp from '../../assets/ai/robot-working.webp'
import robotAvif from '../../assets/ai/robot-working.avif'
import robotWebp2x from '../../assets/ai/robot-working-2x.webp'
import robotAvif2x from '../../assets/ai/robot-working-2x.avif'

/** Miniature output charts for the six solution tiles (decorative). */
const VIZ = [
  '<rect class="b" x="10" y="50" width="22" height="28" rx="3"/><rect class="b" x="42" y="42" width="22" height="36" rx="3"/><rect class="b" x="74" y="46" width="22" height="32" rx="3"/><rect class="b" x="106" y="32" width="22" height="46" rx="3"/><rect class="b" x="138" y="36" width="22" height="42" rx="3"/><rect class="a" x="170" y="26" width="22" height="52" rx="3"/><rect class="d" x="206" y="20" width="22" height="58" rx="3"/><rect class="d" x="238" y="14" width="22" height="64" rx="3"/><rect class="d" x="270" y="8" width="22" height="70" rx="3"/>',
  '<path class="c f" d="M30 34H290"/><circle class="a" cx="30" cy="34" r="8"/><circle class="a" cx="95" cy="34" r="8"/><circle class="a" cx="160" cy="34" r="8"/><circle class="a" cx="225" cy="34" r="8"/><circle class="c" cx="290" cy="34" r="8" style="stroke:var(--lime)"/><text class="t" x="30" y="62" text-anchor="middle">INBOX</text><text class="t" x="95" y="62" text-anchor="middle">READ</text><text class="t" x="160" y="62" text-anchor="middle">MATCH</text><text class="t" x="225" y="62" text-anchor="middle">POST</text><text class="t" x="290" y="62" text-anchor="middle">REVIEW</text>',
  '<rect class="b" x="10" y="6" width="150" height="28" rx="12"/><text class="t" x="22" y="24" style="fill:#f3f1e6">Where is my order?</text><rect class="a" x="136" y="46" width="174" height="30" rx="12"/><text class="k" x="148" y="65">Dispatched. Arrives Tuesday.</text>',
  '<g class="sc"><rect class="a" x="96" y="8" width="128" height="2" rx="1" opacity=".9"/></g><polygon class="c" points="160,8 200,30 160,78 120,30"/><path class="c" d="M120 30h80M160 8l-18 22 18 48 18-22z" opacity=".5"/><path class="c" d="M92 10h-10v10M228 10h10v10M92 76h-10V66M228 76h10V66" style="stroke:var(--lime)"/><text class="t" x="10" y="48">PASS</text><text class="t" x="262" y="48" style="fill:var(--lime)">FLAG</text>',
  '<rect class="b" x="10" y="6" width="300" height="20" rx="6"/><rect class="a" x="10" y="6" width="258" height="20" rx="6"/><text class="k" x="20" y="20">Design A</text><rect class="b" x="10" y="32" width="300" height="20" rx="6"/><rect class="a" x="10" y="32" width="196" height="20" rx="6" opacity=".75"/><text class="k" x="20" y="46">Design B</text><rect class="b" x="10" y="58" width="300" height="20" rx="6"/><rect class="a" x="10" y="58" width="132" height="20" rx="6" opacity=".5"/><text class="k" x="20" y="72">Design C</text>',
  '<path class="d" d="M10 48H310" opacity=".6"/><polyline class="c" points="10,50 40,46 70,52 100,44 130,50 160,12 190,52 220,46 250,50 280,45 310,49"/><circle class="l pg" cx="160" cy="12" r="4"/><circle class="l" cx="160" cy="12" r="4"/><text class="t" x="172" y="14" style="fill:var(--lime)">OUTLIER</text>',
]

interface Agent {
  name: string
  status: string
  tone: '' | 'idle' | 'warn' | 'held'
}

interface Solution {
  title: string
  tag: string
  desc: string
  points: string[]
  viz: number
  outPre: string
  outHi: string
}

interface IndustryUse {
  title: string
  body: string
}

export default function AiPage() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const [open, setOpen] = useState(0)
  const [openSol, setOpenSol] = useState(0)

  const agents: Agent[] = [
    { name: T('Research Agent', 'રિસર્ચ એજન્ટ', 'रिसर्च एजेंट'), status: T('Working', 'કામ ચાલુ', 'कार्यरत'), tone: '' },
    { name: T('Sales Agent', 'સેલ્સ એજન્ટ', 'सेल्स एजेंट'), status: T('Ready', 'તૈયાર', 'तैयार'), tone: 'idle' },
    { name: T('Finance Agent', 'ફાઇનાન્સ એજન્ટ', 'फ़ाइनेंस एजेंट'), status: T('Needs approval', 'મંજૂરી બાકી', 'मंज़ूरी बाकी'), tone: 'held' },
    { name: T('Support Agent', 'સપોર્ટ એજન્ટ', 'सपोर्ट एजेंट'), status: T('Active', 'સક્રિય', 'सक्रिय'), tone: '' },
    { name: T('Operations Agent', 'ઓપરેશન્સ એજન્ટ', 'ऑपरेशंस एजेंट'), status: T('Running', 'ચાલુ', 'चालू'), tone: 'warn' },
  ]

  const solutions: Solution[] = [
    {
      title: T('Predictive Analytics', 'પ્રિડિક્ટિવ એનાલિટિક્સ', 'प्रिडिक्टिव एनालिटिक्स'),
      tag: T('Know next quarter before it arrives', 'આગલું ક્વાર્ટર આવે તે પહેલાં જાણો', 'अगला क्वार्टर आने से पहले जान लें'),
      desc: T('Machine learning reads your history and projects what comes next, so plans start from evidence.', 'મશીન લર્નિંગ તમારો ઇતિહાસ વાંચે છે અને આગળ શું આવશે તે બતાવે છે, જેથી યોજનાઓ પુરાવાથી શરૂ થાય.', 'मशीन लर्निंग आपका इतिहास पढ़ता है और आगे क्या होगा बताता है, ताकि योजनाएँ सबूत से शुरू हों।'),
      points: [
        T('Sales and demand forecasts by product line', 'પ્રોડક્ટ લાઇન પ્રમાણે વેચાણ અને માંગની આગાહી', 'प्रोडक्ट लाइन के हिसाब से बिक्री और मांग का पूर्वानुमान'),
        T('Reorder prediction for every customer', 'દરેક ગ્રાહક માટે રિઓર્ડરની આગાહી', 'हर ग्राहक के लिए रीऑर्डर का पूर्वानुमान'),
        T('Stock levels that follow the forecast', 'આગાહીને અનુસરતું સ્ટોક લેવલ', 'पूर्वानुमान के अनुसार स्टॉक स्तर'),
      ],
      viz: 0,
      outPre: T('demand next 30 days', 'આગલા 30 દિવસની માંગ', 'अगले 30 दिनों की मांग'),
      outHi: T('+8% vs last cycle', 'ગયા ચક્ર કરતાં +8%', 'पिछले चक्र से +8%'),
    },
    {
      title: T('Process Automation', 'પ્રોસેસ ઓટોમેશન', 'प्रोसेस ऑटोमेशन'),
      tag: T('Paperwork that files itself', 'કાગળકામ જે જાતે ફાઇલ થાય', 'काग़ज़ी काम जो खुद फ़ाइल हो जाए'),
      desc: T('Intelligent automation takes the repetitive entry and routing, and brings your team in only for exceptions.', 'ઇન્ટેલિજન્ટ ઓટોમેશન પુનરાવર્તી એન્ટ્રી અને રૂટિંગ સંભાળે છે, અને તમારી ટીમને ફક્ત અપવાદો માટે બોલાવે છે.', 'इंटेलिजेंट ऑटोमेशन दोहराव वाली एंट्री और रूटिंग संभालता है, और आपकी टीम को सिर्फ़ अपवादों के लिए बुलाता है।'),
      points: [
        T('Documents read, matched and posted', 'દસ્તાવેજો વંચાય, મેળ ખાય અને નોંધાય', 'दस्तावेज़ पढ़े, मिलाए और दर्ज किए जाएँ'),
        T('Data entry removed from daily work', 'રોજિંદા કામમાંથી ડેટા એન્ટ્રી દૂર', 'रोज़ के काम से डेटा एंट्री ख़त्म'),
        T('Approvals routed to the right person', 'મંજૂરી યોગ્ય વ્યક્તિ સુધી પહોંચે', 'मंज़ूरी सही व्यक्ति तक पहुँचे'),
      ],
      viz: 1,
      outPre: T('inbox › read › match › post', 'ઇનબોક્સ › વાંચો › મેળવો › નોંધો', 'इनबॉक्स › पढ़ें › मिलाएँ › दर्ज करें'),
      outHi: T('2 exceptions to review', 'સમીક્ષા માટે 2 અપવાદ', 'समीक्षा हेतु 2 अपवाद'),
    },
    {
      title: T('Natural Language Processing', 'નેચરલ લેંગ્વેજ પ્રોસેસિંગ', 'नेचुरल लैंग्वेज प्रोसेसिंग'),
      tag: T('Software that understands your customers', 'સોફ્ટવેર જે તમારા ગ્રાહકોને સમજે', 'सॉफ़्टवेयर जो आपके ग्राहकों को समझे'),
      desc: T('Models read and write language, turning free text and voice into answers, tickets and insight.', 'મોડેલો ભાષા વાંચે અને લખે છે, ખુલ્લા ટેક્સ્ટ અને અવાજને જવાબો, ટિકિટો અને સમજમાં ફેરવે છે.', 'मॉडल भाषा पढ़ते और लिखते हैं, खुले टेक्स्ट और आवाज़ को जवाबों, टिकटों और समझ में बदलते हैं।'),
      points: [
        T('Assistants for customer support', 'ગ્રાહક સપોર્ટ માટે આસિસ્ટન્ટ', 'ग्राहक सहायता हेतु असिस्टेंट'),
        T('Sentiment read across feedback', 'ફીડબેકમાં ભાવના વંચાય', 'फ़ीडबैक में भावना पढ़ी जाए'),
        T('Documents sorted by type on arrival', 'આવતા જ દસ્તાવેજો પ્રકાર પ્રમાણે ગોઠવાય', 'आते ही दस्तावेज़ प्रकार के हिसाब से छँटें'),
      ],
      viz: 2,
      outPre: T('“Where is my order?” ›', '“મારો ઓર્ડર ક્યાં છે?” ›', '“मेरा ऑर्डर कहाँ है?” ›'),
      outHi: T('status found, reply sent', 'સ્થિતિ મળી, જવાબ મોકલાયો', 'स्थिति मिली, जवाब भेजा गया'),
    },
    {
      title: T('Computer Vision', 'કમ્પ્યુટર વિઝન', 'कंप्यूटर विज़न'),
      tag: T('Inspection that never blinks', 'તપાસ જે ક્યારેય આંખ મીંચતી નથી', 'निरीक्षण जो कभी पलक नहीं झपकाता'),
      desc: T('Image models see what your team sees, at the pace of your production line.', 'ઇમેજ મોડેલો તમારી ટીમ જે જુએ છે તે જુએ છે, તમારી પ્રોડક્શન લાઇનની ગતિએ.', 'इमेज मॉडल वही देखते हैं जो आपकी टीम देखती है, आपकी प्रोडक्शन लाइन की रफ़्तार से।'),
      points: [
        T('Quality inspection from photographs', 'ફોટોગ્રાફ પરથી ગુણવત્તા તપાસ', 'फ़ोटो से गुणवत्ता निरीक्षण'),
        T('Visual search across your catalogue', 'તમારા કેટલોગમાં વિઝ્યુઅલ શોધ', 'आपके कैटलॉग में विज़ुअल खोज'),
        T('Defects logged with the image attached', 'ખામીઓ છબી સાથે નોંધાય', 'ख़ामियाँ तस्वीर सहित दर्ज हों'),
      ],
      viz: 3,
      outPre: T('piece 0412 › pass · piece 0413 ›', 'પીસ 0412 › પાસ · પીસ 0413 ›', 'पीस 0412 › पास · पीस 0413 ›'),
      outHi: T('flagged, chip on edge', 'ચિહ્નિત, ધાર પર ચીપ', 'चिह्नित, किनारे पर चिप'),
    },
    {
      title: T('Recommendation Engines', 'રેકમેન્ડેશન એન્જિન', 'रेकमेंडेशन इंजन'),
      tag: T('The right product for the right buyer', 'યોગ્ય ખરીદદાર માટે યોગ્ય ઉત્પાદન', 'सही ख़रीददार के लिए सही उत्पाद'),
      desc: T('Personalisation that learns taste from behaviour and puts relevant items in front of each person.', 'વર્તણૂકમાંથી પસંદ શીખતું પર્સનલાઇઝેશન, દરેક વ્યક્તિ સામે યોગ્ય વસ્તુઓ મૂકે છે.', 'व्यवहार से पसंद सीखने वाला पर्सनलाइज़ेशन, हर व्यक्ति के सामने सही चीज़ें रखता है।'),
      points: [
        T('Product recommendations per shopper', 'દરેક ખરીદદાર માટે ઉત્પાદન ભલામણો', 'हर ख़रीददार हेतु उत्पाद सुझाव'),
        T('Content curated to the reader', 'વાચકને અનુરૂપ સામગ્રી', 'पाठक के अनुरूप सामग्री'),
        T('Cross-sell suggestions at the counter', 'કાઉન્ટર પર ક્રોસ-સેલ સૂચનો', 'काउंटर पर क्रॉस-सेल सुझाव'),
      ],
      viz: 4,
      outPre: T('visitor 118 ›', 'મુલાકાતી 118 ›', 'आगंतुक 118 ›'),
      outHi: T('3 similar designs surfaced', '3 સમાન ડિઝાઇન મળી', '3 समान डिज़ाइन मिले'),
    },
    {
      title: T('Anomaly Detection', 'એનોમલી ડિટેક્શન', 'एनॉमली डिटेक्शन'),
      tag: T('Catch the one that doesn’t fit', 'જે બંધબેસતું નથી તે પકડો', 'जो फ़िट नहीं होता उसे पकड़ें'),
      desc: T('Models learn what normal looks like and raise a hand the moment something departs from it.', 'મોડેલો સામાન્ય કેવું દેખાય છે તે શીખે છે અને જેવું કંઈ અલગ થાય તરત બતાવે છે.', 'मॉडल सीखते हैं कि सामान्य कैसा दिखता है और जैसे ही कुछ अलग हो तुरंत बताते हैं।'),
      points: [
        T('Fraud detection on live transactions', 'લાઇવ વ્યવહારો પર છેતરપિંડી પકડાય', 'लाइव लेनदेन में धोखाधड़ी पकड़ी जाए'),
        T('System failures flagged early', 'સિસ્ટમ નિષ્ફળતા વહેલી ચિહ્નિત થાય', 'सिस्टम विफलता पहले ही चिह्नित हो'),
        T('Quality drift monitored in real time', 'ગુણવત્તા બદલાવ પર સતત નજર', 'गुणवत्ता बदलाव पर लगातार नज़र'),
      ],
      viz: 5,
      outPre: T('stream normal ›', 'સ્ટ્રીમ સામાન્ય ›', 'स्ट्रीम सामान्य ›'),
      outHi: T('1 outlier held for review', '1 અપવાદ સમીક્ષા માટે રોકાયો', '1 अपवाद समीक्षा हेतु रोका गया'),
    },
  ]

  const industries: { name: string; items: IndustryUse[] }[] = [
    {
      name: T('Diamond & Jewellery', 'ડાયમંડ અને જ્વેલરી', 'डायमंड और ज्वेलरी'),
      items: [
        { title: T('Grade with a second pair of eyes', 'બીજી નજરે ગ્રેડિંગ', 'दूसरी नज़र से ग्रेडिंग'), body: T('Vision models assess cut, colour and clarity from photographs and flag stones that need a closer look.', 'વિઝન મોડેલો ફોટોગ્રાફ પરથી કટ, કલર અને ક્લેરિટી તપાસે છે અને જે પથ્થરોને નજીકથી જોવાની જરૂર છે તે બતાવે છે.', 'विज़न मॉडल फ़ोटो से कट, कलर और क्लैरिटी आँकते हैं और जिन पत्थरों को क़रीब से देखना हो उन्हें बताते हैं।') },
        { title: T('Plan the rough before you cut', 'કાપતા પહેલાં રફનું આયોજન', 'काटने से पहले रफ़ की योजना'), body: T('Compare cutting plans and see the likely yield before the first stone is touched.', 'કટિંગ પ્લાન સરખાવો અને પહેલો પથ્થર અડકતા પહેલાં સંભવિત ઉપજ જુઓ.', 'कटिंग प्लान तुलना करें और पहला पत्थर छूने से पहले संभावित उपज देखें।') },
        { title: T('Price with the market', 'બજાર સાથે ભાવ', 'बाज़ार के साथ भाव'), body: T('Pricing that follows stone characteristics and live market movement, not last month’s list.', 'ભાવ જે પથ્થરની લાક્ષણિકતાઓ અને લાઇવ બજાર હલચલને અનુસરે, ગયા મહિનાની યાદીને નહીં.', 'भाव जो पत्थर की विशेषताओं और लाइव बाज़ार हलचल का पालन करे, पिछले महीने की सूची का नहीं।') },
      ],
    },
    {
      name: T('Manufacturing', 'મેન્યુફેક્ચરિંગ', 'मैन्युफ़ैक्चरिंग'),
      items: [
        { title: T('Fix it before it fails', 'બગડે તે પહેલાં સુધારો', 'बिगड़ने से पहले सुधारें'), body: T('Machine signals predict wear, so maintenance happens on your schedule, not the machine’s.', 'મશીન સંકેતો ઘસારાની આગાહી કરે છે, જેથી જાળવણી તમારા સમયપત્રકે થાય, મશીનના સમયે નહીં.', 'मशीन संकेत घिसाव की भविष्यवाणी करते हैं, ताकि रखरखाव आपके समय पर हो, मशीन के समय पर नहीं।') },
        { title: T('Inspect every piece', 'દરેક પીસની તપાસ', 'हर पीस का निरीक्षण'), body: T('Cameras on the line check each item against your standard and log the defects.', 'લાઇન પર કેમેરા દરેક વસ્તુને તમારા ધોરણે તપાસે છે અને ખામીઓ નોંધે છે.', 'लाइन पर कैमरे हर वस्तु को आपके मानक से जाँचते हैं और ख़ामियाँ दर्ज करते हैं।') },
        { title: T('Produce what will sell', 'જે વેચાશે તે બનાવો', 'जो बिकेगा वही बनाएँ'), body: T('Demand forecasts shape the production plan and the raw material order.', 'માંગની આગાહી પ્રોડક્શન યોજના અને કાચા માલના ઓર્ડરને આકાર આપે છે.', 'मांग का पूर्वानुमान प्रोडक्शन योजना और कच्चे माल के ऑर्डर को आकार देता है।') },
      ],
    },
    {
      name: T('Retail & E-commerce', 'રિટેલ અને ઈ-કોમર્સ', 'रिटेल और ई-कॉमर्स'),
      items: [
        { title: T('Show the right thing first', 'પહેલાં યોગ્ય વસ્તુ બતાવો', 'पहले सही चीज़ दिखाएँ'), body: T('Each shopper sees products chosen from what they browse and buy.', 'દરેક ખરીદદાર તેઓ જે જુએ અને ખરીદે તેના આધારે પસંદ કરેલા ઉત્પાદનો જુએ છે.', 'हर ख़रीददार वही उत्पाद देखता है जो उसके देखने और ख़रीदने के आधार पर चुने गए हों।') },
        { title: T('Price to the moment', 'ક્ષણ પ્રમાણે ભાવ', 'क्षण के अनुसार भाव'), body: T('Prices respond to demand and competitor moves within limits you set.', 'ભાવ તમારી નક્કી કરેલી મર્યાદામાં માંગ અને હરીફ હલચલને અનુસરે છે.', 'भाव आपकी तय सीमा में मांग और प्रतिस्पर्धी हलचल का पालन करते हैं।') },
        { title: T('Answer at any hour', 'ગમે ત્યારે જવાબ', 'किसी भी समय जवाब'), body: T('Assistants handle routine questions and hand over to your team with the full context.', 'આસિસ્ટન્ટ નિયમિત પ્રશ્નો સંભાળે છે અને સંપૂર્ણ સંદર્ભ સાથે તમારી ટીમને સોંપે છે.', 'असिस्टेंट नियमित प्रश्न संभालते हैं और पूरे संदर्भ के साथ आपकी टीम को सौंपते हैं।') },
      ],
    },
    {
      name: T('Financial Services', 'ફાઇનાન્શિયલ સર્વિસિસ', 'फ़ाइनेंशियल सर्विसेज़'),
      items: [
        { title: T('Stop fraud as it happens', 'છેતરપિંડી થતી જ અટકાવો', 'धोखाधड़ी होते ही रोकें'), body: T('Every transaction is scored in real time and the suspicious ones are held for review.', 'દરેક વ્યવહારને રિયલ ટાઇમમાં સ્કોર મળે છે અને શંકાસ્પદ વ્યવહારો સમીક્ષા માટે રોકાય છે.', 'हर लेनदेन को रीयल टाइम में स्कोर मिलता है और संदिग्ध लेनदेन समीक्षा हेतु रोके जाते हैं।') },
        { title: T('Decide credit faster', 'ધિરાણ નિર્ણય ઝડપી', 'ऋण निर्णय तेज़'), body: T('Risk scoring and approval workflows turn applications into clear, explainable decisions.', 'જોખમ સ્કોરિંગ અને મંજૂરી પ્રવાહ અરજીઓને સ્પષ્ટ, સમજાવી શકાય તેવા નિર્ણયોમાં ફેરવે છે.', 'जोखिम स्कोरिंग और अनुमोदन प्रवाह आवेदनों को स्पष्ट, समझाने योग्य निर्णयों में बदलते हैं।') },
        { title: T('Advise with data', 'ડેટા સાથે સલાહ', 'डेटा के साथ सलाह'), body: T('Models surface investment signals for your analysts to weigh and act on.', 'મોડેલો રોકાણ સંકેતો સપાટી પર લાવે છે જેથી તમારા વિશ્લેષકો તોલીને કાર્ય કરે.', 'मॉडल निवेश संकेत सामने लाते हैं ताकि आपके विश्लेषक तौलकर कार्रवाई करें।') },
      ],
    },
  ]

  const practical: { hype: string; title: string; body: string }[] = [
    { hype: T('“AI will transform everything overnight.”', '“AI રાતોરાત બધું બદલી નાખશે.”', '“AI रातोंरात सब कुछ बदल देगा।”'), title: T('One decision, done better', 'એક નિર્ણય, વધુ સારી રીતે', 'एक निर्णय, बेहतर तरीक़े से'), body: T('We start with a decision your team makes every day and build only what improves it. The technology follows the problem.', 'અમે તમારી ટીમ રોજ લેતા એક નિર્ણયથી શરૂ કરીએ છીએ અને ફક્ત તેને સુધારે તે જ બનાવીએ છીએ. ટેકનોલોજી સમસ્યાને અનુસરે છે.', 'हम आपकी टीम के रोज़ के एक निर्णय से शुरू करते हैं और सिर्फ़ वही बनाते हैं जो उसे सुधारे। तकनीक समस्या का अनुसरण करती है।') },
    { hype: T('“Cutting-edge, experimental models.”', '“અત્યાધુનિક, પ્રાયોગિક મોડેલો.”', '“अत्याधुनिक, प्रायोगिक मॉडल।”'), title: T('Methods that already work', 'પદ્ધતિઓ જે પહેલેથી કામ કરે છે', 'तरीक़े जो पहले से काम करते हैं'), body: T('Established algorithms and frameworks, chosen because they are reliable, explainable and easy to maintain.', 'સ્થાપિત અલ્ગોરિધમ અને ફ્રેમવર્ક, પસંદ કરેલા કારણ કે તે વિશ્વસનીય, સમજાવી શકાય તેવા અને જાળવવામાં સરળ છે.', 'स्थापित एल्गोरिदम और फ्रेमवर्क, चुने गए क्योंकि वे विश्वसनीय, समझाने योग्य और रखरखाव में आसान हैं।') },
    { hype: T('“Trust us, it’s intelligent.”', '“ભરોસો રાખો, તે ઇન્ટેલિજન્ટ છે.”', '“भरोसा रखें, यह इंटेलिजेंट है।”'), title: T('A yardstick before any code', 'કોઈપણ કોડ પહેલાં માપદંડ', 'किसी भी कोड से पहले मापदंड'), body: T('Every model ships with a clear measure of success agreed up front, so you can see exactly what it changes.', 'દરેક મોડેલ અગાઉથી સંમત સફળતાના સ્પષ્ટ માપ સાથે આવે છે, જેથી તમે બરાબર જોઈ શકો કે તે શું બદલે છે.', 'हर मॉडल पहले से तय सफलता के स्पष्ट माप के साथ आता है, ताकि आप ठीक देख सकें कि वह क्या बदलता है।') },
    { hype: T('“Set it up once and forget it.”', '“એકવાર ગોઠવો અને ભૂલી જાઓ.”', '“एक बार लगाएँ और भूल जाएँ।”'), title: T('Sharper the longer it runs', 'જેટલું ચાલે તેટલું ધારદાર', 'जितना चले उतना धारदार'), body: T('We monitor the model and retrain it on your data as your business moves, so results do not drift.', 'અમે મોડેલ પર નજર રાખીએ છીએ અને તમારો વ્યવસાય બદલાય તેમ તમારા ડેટા પર ફરી તાલીમ આપીએ છીએ, જેથી પરિણામો ભટકે નહીં.', 'हम मॉडल पर नज़र रखते हैं और आपका व्यवसाय बदले तो आपके डेटा पर फिर प्रशिक्षित करते हैं, ताकि परिणाम भटकें नहीं।') },
  ]

  // Scroll reveal with three guards so fling-scrolling never lands on
  // empty sections: (1) entry trigger, (2) rAF scroll catch-up for fast
  // flings, (3) a safety timer so content can never stay hidden.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const cleanups: Array<() => void> = []
    let io: IntersectionObserver | null = null
    let raf = 0
    let safety = 0
    const reveal = (n: Element, fast = false): void => {
      if (n.hasAttribute('data-in')) return
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
        { threshold: 0.15, rootMargin: '0px' },
      )
      const nodes = Array.from(root.querySelectorAll('[data-io]'))
      nodes.forEach((n) => io?.observe(n))
      const catchUp = (): void => {
        raf = 0
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
      safety = window.setTimeout(catchUp, 5000)
    } catch {
      root.querySelectorAll('[data-r]').forEach((n) => {
        if (n instanceof HTMLElement) {
          n.style.opacity = '1'
          n.style.transform = 'none'
        }
      })
    }
    return () => {
      io?.disconnect()
      if (raf) window.cancelAnimationFrame(raf)
      if (safety) window.clearTimeout(safety)
      cleanups.forEach((fn) => fn())
    }
  }, [])

  // Orbiting agent badges around the hero stage (paused off-screen and
  // for reduced motion, where badges rest in a static ring).
  // Re-runs on language switch: gu/hi replaces badge DOM, so chips must be
  // re-queried, otherwise the loop keeps moving detached English nodes.
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const chips = Array.from(stage.querySelectorAll<HTMLElement>('[data-orbit]'))
    if (!chips.length) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let ang = -20
    let visible = true
    let raf = 0
    const place = (): void => {
      const narrow = stage.clientWidth < 500
      const spread = narrow ? 30 : 34
      chips.forEach((chip, i) => {
        const th = ((ang + i * 72) * Math.PI) / 180
        const depth = (Math.sin(th) + 1) / 2
        chip.style.left = `${50 + spread * Math.cos(th)}%`
        chip.style.top = `${40 + 13 * Math.sin(th)}%`
        // Badges passing behind the desk fade out so the overlap reads as
        // depth instead of clipped text.
        chip.style.opacity = `${(0.3 + 0.7 * depth).toFixed(2)}`
        chip.style.zIndex = Math.sin(th) > 0 ? '3' : '0'
        chip.style.transform = `translate(-50%,-50%) scale(${(0.74 + 0.3 * depth).toFixed(3)})`
      })
    }
    place()
    if (reduce) return
    const io = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting
    })
    io.observe(stage)
    const tick = (): void => {
      if (visible) {
        ang += 0.22
        place()
      }
      raf = window.requestAnimationFrame(tick)
    }
    raf = window.requestAnimationFrame(tick)
    return () => {
      window.cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [lang])

  const hoverPanels = (): boolean =>
    window.matchMedia('(hover:hover) and (min-width:981px)').matches

  return (
    <div ref={rootRef}>
      <div className="grain" aria-hidden="true" />

      <main id="top" tabIndex={-1}>
        {/* Hero */}
        <section className="ai-hero relative overflow-clip bg-paper px-[var(--pad)] pb-20 pt-[30px]" aria-labelledby="ai-title" data-io="">
          <div className="ai-hero__in mx-auto grid w-full max-w-[1440px] items-start gap-[clamp(28px,5vw,80px)] [grid-template-columns:1.02fr_1fr] max-[980px]:grid-cols-1">
                <div className="ai-copy">
                  <h1 id="ai-title" data-r="" style={cssVars({ '--i': 0 })} className="m-0 mb-[1.3rem] text-balance font-serif text-[clamp(2.3rem,5.2vw,4.6rem)] font-semibold leading-[1.05] tracking-[-0.035em]">
                    {`${T('AI & Intelligent', 'AI અને ઇન્ટેલિજન્ટ', 'AI और इंटेलिजेंट')} `}<em>{T('Systems', 'સિસ્ટમ્સ', 'सिस्टम्स')}</em>
                  </h1>
                  <p data-r="" className="lede mb-8 max-w-[44ch] text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.5] text-[var(--text)]" style={cssVars({ '--i': 1 })}>
                    {T(
                      'Enterprise AI that forecasts demand, reads your paperwork, inspects your product and flags what needs a human. Built on your own data, shipped into the software you already run.',
                      'એન્ટરપ્રાઇઝ AI જે માંગની આગાહી કરે છે, તમારા કાગળો વાંચે છે, તમારા ઉત્પાદનની તપાસ કરે છે અને માનવની જરૂર ક્યાં છે તે બતાવે છે. તમારા પોતાના ડેટા પર બનેલું, તમે જે સોફ્ટવેર ચલાવો છો તેમાં જ પહોંચાડેલું.',
                      'एंटरप्राइज़ AI जो मांग का पूर्वानुमान लगाता है, आपके काग़ज़ात पढ़ता है, आपके उत्पाद का निरीक्षण करता है और बताता है कि इंसान की ज़रूरत कहाँ है। आपके अपने डेटा पर बना, उसी सॉफ़्टवेयर में पहुँचाया जिसे आप पहले से चलाते हैं।',
                    )}
                  </p>
                  <div data-r="" className="ai-acts flex flex-wrap items-center gap-5 gap-x-7" style={cssVars({ '--i': 2 })}>
                    <a className="hero-btn" href={withLang('/contact')}>
                      <span>{T('Discuss your AI project', 'તમારા AI પ્રોજેક્ટની ચર્ચા કરો', 'अपने AI प्रोजेक्ट पर चर्चा करें')}</span>
                      <Arrow />
                    </a>
                  </div>
                </div>

                <div
                  className="ai-stage"
                  id="ai-stage"
                  ref={stageRef}
                  role="img"
                  aria-label={T('AI agents working around your business data', 'તમારા વ્યવસાય ડેટાની આસપાસ કામ કરતા AI એજન્ટ', 'आपके व्यवसाय डेटा के इर्द-गिर्द काम करते AI एजेंट')}
                  data-r=""
                  style={cssVars({ '--i': 1 })}
                >
                  <div className="ai-glow" aria-hidden="true" />
                  <picture className="ai-model" aria-hidden="true">
                    <source srcSet={`${robotAvif} 1x, ${robotAvif2x} 2x`} type="image/avif" />
                    <source srcSet={`${robotWebp} 1x, ${robotWebp2x} 2x`} type="image/webp" />
                    <img src={robotPng} width={600} height={900} decoding="async" fetchPriority="high" alt="" draggable={false} />
                  </picture>
                  {agents.map((agent, i) => (
                    <div className={`ai-ob${agent.tone ? ` ${agent.tone}` : ''}`} data-orbit="" key={i}>
                      <i aria-hidden="true" />
                      <div><b>{agent.name}</b><small>{agent.status}</small></div>
                    </div>
                  ))}
                </div>
              </div>

        </section>

        {/* Solutions */}
        <section className="ai-sec px-[var(--pad)] py-20" id="solutions" aria-labelledby="ai-solutions" data-io="">
          <div className="ai-wrap mx-auto max-w-[1440px]">
            <div className="ai-top mb-[clamp(36px,5vw,64px)]">
              <h2 id="ai-solutions" data-r="" className="m-0 max-w-[16ch] text-balance font-serif text-[clamp(2.3rem,5.2vw,4.6rem)] font-semibold leading-[1.05] tracking-[-0.035em]">{`${T('AI-powered business', 'AI-સંચાલિત વ્યવસાય', 'AI-संचालित व्यवसाय')} `}<em>{T('solutions', 'સોલ્યુશન્સ', 'सोल्यूशंस')}</em></h2>
              <p className="lede mb-0 ml-0 mr-0 mt-6 max-w-[44ch] text-[clamp(1rem,1.3vw,1.15rem)] leading-[1.55] text-muted" data-r="" style={cssVars({ '--i': 1 })}>
                {T('Six capabilities, each built around a decision your team makes every day.', 'છ ક્ષમતાઓ, દરેક તમારી ટીમ રોજ લેતા એક નિર્ણયની આસપાસ બનેલી.', 'छह क्षमताएँ, हर एक आपकी टीम के रोज़ के एक निर्णय के इर्द-गिर्द बनी।')}
              </p>
            </div>
            <div className="sol-acc">
              {solutions.map((solution, i) => (
                <div className="sol-acc-item ai-fade" key={solution.title} data-open={openSol === i || undefined} style={cssVars({ '--i': i })}>
                  <h3 className="sol-acc-h">
                  <button type="button" className="sol-acc-sum" id={`sol-sum-${i}`} aria-expanded={openSol === i} aria-controls={`sol-body-${i}`} onClick={() => setOpenSol(openSol === i ? -1 : i)}>
                    <span className="mono font-mono text-[11px] uppercase leading-[1.5] tracking-[0.1em]">{`0${i + 1}`}</span>
                    <b>{solution.title}</b>
                    <span className="sol-acc-tag">{solution.tag}</span>
                  </button>
                  </h3>
                  <div className={`sol-acc-body${openSol !== i ? ' is-hidden' : ''}`} id={`sol-body-${i}`} role="region" aria-labelledby={`sol-sum-${i}`}>
                    <p className="sol-acc-desc">{solution.desc}</p>
                    <ul>
                      {solution.points.map((point) => (
                        <li key={point}><i className="dm" aria-hidden="true" />{point}</li>
                      ))}
                    </ul>
                    <div className="sol-acc-vz" aria-hidden="true">
                      <svg className="viz" viewBox="0 0 320 84" dangerouslySetInnerHTML={{ __html: VIZ[solution.viz] }} />
                      <p className="ai-out mb-0 ml-0 mr-0 mt-[10px] font-mono text-[11px] leading-[1.6] text-[var(--text)]">{`${solution.outPre} `}<b className="font-normal text-[var(--gd)]">{solution.outHi}</b></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Industries */}
        <section className="ai-sec px-[var(--pad)] py-20" aria-labelledby="ai-industries" data-io="">
          <div className="ai-wrap mx-auto max-w-[1440px]">
            <div className="ai-top mb-[clamp(36px,5vw,64px)]">
              <h2 id="ai-industries" data-r="" className="m-0 max-w-[16ch] text-balance font-serif text-[clamp(2.3rem,5.2vw,4.6rem)] font-semibold leading-[1.05] tracking-[-0.035em]">{`${T('AI across', 'AI દરેક', 'AI हर')} `}<em>{T('industries', 'ઇન્ડસ્ટ્રીમાં', 'इंडस्ट्री में')}</em></h2>
              <p className="lede mb-0 ml-0 mr-0 mt-6 max-w-[44ch] text-[clamp(1rem,1.3vw,1.15rem)] leading-[1.55] text-muted" data-r="" style={cssVars({ '--i': 1 })}>
                {T('The same engine, tuned to the way each trade actually works.', 'એક જ એન્જિન, દરેક વેપાર ખરેખર કેવી રીતે કામ કરે છે તે પ્રમાણે ટ્યુન કરેલું.', 'एक ही इंजन, हर कारोबार असल में जैसे काम करता है उसके हिसाब से ट्यून किया।')}
              </p>
            </div>
            <div className="ai-pan">
              {industries.map((industry, i) => (
                <article
                  className={`ai-col ai-fade${open === i ? ' is-open' : ''}`}
                  key={industry.name}
                  style={cssVars({ '--i': i })}
                  role="button"
                  tabIndex={0}
                  aria-expanded={open === i}
                  onClick={() => setOpen(i)}
                  onMouseEnter={() => { if (hoverPanels()) setOpen(i) }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(i) }
                    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                      e.preventDefault()
                      const cols = Array.from(e.currentTarget.parentElement?.querySelectorAll('.ai-col') ?? [])
                      const d = (e.key === 'ArrowRight' || e.key === 'ArrowDown') ? 1 : -1
                      const n = (i + d + cols.length) % cols.length
                      ;(cols[n] as HTMLElement | undefined)?.focus()
                      setOpen(n)
                    }
                  }}
                >
                  <h3 className="ai-col__vt" aria-hidden={open === i}>{industry.name}</h3>
                  <div className="ai-col__cx" aria-hidden={open !== i}>
                    <h3>{industry.name}</h3>
                    <ol>
                      {industry.items.map((item) => (
                        <li key={item.title}><b>{item.title}</b><p>{item.body}</p></li>
                      ))}
                    </ol>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Practical */}
        <section className="ai-sec px-[var(--pad)] py-20" aria-labelledby="ai-practical" data-io="">
          <div className="ai-wrap mx-auto max-w-[1440px]">
            <div className="ai-top mb-[clamp(36px,5vw,64px)]">
              <h2 id="ai-practical" data-r="" className="m-0 max-w-[16ch] text-balance font-serif text-[clamp(2.3rem,5.2vw,4.6rem)] font-semibold leading-[1.05] tracking-[-0.035em]">{`${T('Practical AI, not just', 'વ્યવહારુ AI, ફક્ત', 'व्यावहारिक AI, सिर्फ़')} `}<em>{T('hype', 'હાઇપ નહીં', 'हाइप नहीं')}</em></h2>
              <p className="lede mb-0 ml-0 mr-0 mt-6 max-w-[44ch] text-[clamp(1rem,1.3vw,1.15rem)] leading-[1.55] text-muted" data-r="" style={cssVars({ '--i': 1 })}>
                {T('We build AI that earns its place in your business and shows its results.', 'અમે એવું AI બનાવીએ છીએ જે તમારા વ્યવસાયમાં પોતાનું સ્થાન કમાય અને પરિણામો બતાવે.', 'हम ऐसा AI बनाते हैं जो आपके व्यवसाय में अपनी जगह कमाए और परिणाम दिखाए।')}
              </p>
            </div>
            <ol className="myth-ledger">
              {practical.map((row, i) => (
                <li key={row.title} className="ai-fade" style={cssVars({ '--i': i })}>
                  <span className="mono idx">{`0${i + 1}`}</span>
                  <s>{row.hype}</s>
                  <div><b>{row.title}</b><p>{row.body}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
    </div>
  )
}
