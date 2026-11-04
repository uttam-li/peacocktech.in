import { useEffect, useRef, useState } from 'react'
import type { ComponentType, KeyboardEvent, ReactNode } from 'react'
import { site, T, withLang } from '@data/site'
import type { ServiceItem } from '@data/site'
import { useReveal } from '@hooks/useReveal'
import { isServiceSelectEvent, SERVICE_SELECT_EVENT } from '@lib/nav'
import Arrow from '@ui/Arrow'


type JobTone = '' | 'is-yellow' | 'is-grey'

interface MobileJob {
  title: string
  meta: string
  tone: JobTone
}


interface AiNode {
  icon: string
  title: string
  copy: string
  hot?: boolean
}


function PreviewLabel({ children }: { children: ReactNode }) {
  return <span className="preview-label">{children}</span>
}

function PreviewIcon({ path }: { path: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      aria-hidden="true"
      focusable="false"
    >
      <path d={path} />
    </svg>
  )
}

function ErpVisual() {
  return (
    <div className="service-visual">
      <PreviewLabel>{T('Sample UI', 'નમૂનાનું UI', 'नमूना UI')}</PreviewLabel>
      <div className="preview-app">
        <aside className="preview-app__aside" aria-hidden="true">
          <i className="is-on" />
          <i />
          <i />
          <i />
        </aside>
        <div className="preview-app__main">
          <div className="preview-app__top">
            <span>{T('Production board', 'પ્રોડક્શન બોર્ડ', 'प्रोडक्शन बोर्ड')}</span>
            <span className="preview-mono">{T('Today', 'આજે', 'आज')}</span>
          </div>
          <div className="preview-kpis">
            <div><span className="preview-mono">{T('Open jobs', 'ખુલ્લા કામો', 'खुले काम')}</span><b>128</b></div>
            <div><span className="preview-mono">{T('In QC', 'QCમાં', 'QC में')}</span><b>14</b></div>
            <div><span className="preview-mono">{T('Delayed', 'વિલંબિત', 'विलंबित')}</span><b>3</b></div>
          </div>
          <div className="preview-lanes">
            <div className="preview-lane">
              <span className="preview-mono">{T('Planning', 'પ્લાનિંગ', 'प्लानिंग')}</span>
              <i /><i /><i />
            </div>
            <div className="preview-lane">
              <span className="preview-mono">{T('Making', 'બનાવટ', 'निर्माण')}</span>
              <i /><i className="is-lime" />
            </div>
            <div className="preview-lane">
              <span className="preview-mono">{T('Finishing', 'ફિનિશિંગ', 'फ़िनिशिंग')}</span>
              <i /><i />
            </div>
            <div className="preview-lane">
              <span className="preview-mono">{T('QC', 'QC', 'QC')}</span>
              <i className="is-lime" />
            </div>
            <div className="preview-mover">JOB-2041</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MobileVisual() {
  const mobileJobs: MobileJob[] = [
    { title: T('Delivery: Ring set', 'ડિલિવરી: રિંગ સેટ', 'डिलीवरी: रिंग सेट'), meta: T('Pickup 11:30', 'પિકઅપ 11:30', 'पिकअप 11:30'), tone: '' },
    { title: T('Site visit: Unit 4', 'સાઇટ વિઝિટ: યુનિટ 4', 'साइट विज़िट: यूनिट 4'), meta: T('Waiting for parts', 'પાર્ટ્સની રાહ', 'पार्ट्स का इंतज़ार'), tone: 'is-yellow' },
    { title: T('Collection: Lot 18', 'કલેક્શન: લોટ 18', 'कलेक्शन: लॉट 18'), meta: T('Tomorrow', 'આવતીકાલે', 'कल'), tone: 'is-grey' },
    { title: T('Repair check', 'રિપેર તપાસ', 'रिपेयर जाँच'), meta: T('Ready', 'તૈયાર', 'तैयार'), tone: '' },
  ]
  return (
    <div className="service-visual">
      <PreviewLabel>{T('Sample UI', 'નમૂનાનું UI', 'नमूना UI')}</PreviewLabel>
      <div className="preview-phones">
        <div className="preview-phone">
          <span className="preview-phone__notch" />
          <h3>{T("Today's jobs", 'આજનાં કામો', 'आज के काम')}</h3>
          {mobileJobs.map((job) => (
            <div className="preview-job" key={job.title}>
              <i className={`preview-job__dot ${job.tone}`} />
              <div>
                <b>{job.title}</b>
                <span>{job.meta}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="preview-phone">
          <span className="preview-phone__notch" />
          <h3>{T('Scan to confirm', 'પુષ્ટિ માટે સ્કેન કરો', 'पुष्टि के लिए स्कैन करें')}</h3>
          <div className="preview-scan">
            <span className="preview-scan__line" />
          </div>
          <span className="preview-phone__cta">{T('Confirm', 'પુષ્ટિ કરો', 'पुष्टि करें')}</span>
        </div>
      </div>
    </div>
  )
}

function AiVisual() {
  const aiNodes: AiNode[] = [
    {
      icon: 'M6 3h9l3 3v15H6z',
      title: T('Document', 'દસ્તાવેજ', 'दस्तावेज़'),
      copy: T('Invoice, form or message arrives', 'ઇન્વોઇસ, ફોર્મ કે સંદેશ આવે છે', 'इनवॉइस, फ़ॉर्म या संदेश आता है'),
    },
    {
      icon: 'M4 7h16M4 12h10M4 17h13',
      title: T('Extract', 'કાઢો', 'निकालें'),
      copy: T('Fields read and structured', 'ફીલ્ડ વાંચીને ગોઠવાય છે', 'फ़ील्ड पढ़कर व्यवस्थित होते हैं'),
    },
    {
      icon: 'M12 4a4 4 0 100 8 4 4 0 000-8zM5 21c0-4 3-7 7-7s7 3 7 7',
      title: T('Review', 'સમીક્ષા', 'समीक्षा'),
      copy: T('A person checks flagged items', 'વ્યક્તિ ચિહ્નિત વસ્તુઓ તપાસે છે', 'व्यक्ति चिह्नित चीज़ें जाँचता है'),
      hot: true,
    },
    {
      icon: 'M5 12l5 5 9-10',
      title: T('Action', 'કાર્ય', 'कार्रवाई'),
      copy: T('Saved to your ERP', 'તમારા ERPમાં સાચવાયું', 'आपके ERP में सहेजा गया'),
    },
  ]
  return (
    <div className="service-visual">
      <PreviewLabel>{T('Illustrative flow', 'ઉદાહરણ પ્રવાહ', 'उदाहरण प्रवाह')}</PreviewLabel>
      <div className="preview-flow">
        <div className="preview-flow__row">
          {aiNodes.map((node) => (
            <div className={`preview-node${node.hot ? ' is-hot' : ''}`} key={node.title}>
              <PreviewIcon path={node.icon} />
              <b>{node.title}</b>
              <small>{node.copy}</small>
            </div>
          ))}
        </div>
        <div className="preview-log">
          <span><em>✓</em>{` ${T('12 fields extracted', '12 ફીલ્ડ કઢાયા', '12 फ़ील्ड निकाले गए')}`}</span>
          <span><span className="is-warn">!</span>{` ${T('1 field flagged for review', '1 ફીલ્ડ સમીક્ષા માટે ચિહ્નિત', '1 फ़ील्ड समीक्षा हेतु चिह्नित')}`}</span>
          <span><em>✓</em>{` ${T('Posted to purchase ledger', 'ખરીદ લેજરમાં નોંધાયું', 'खरीद लेजर में दर्ज')}`}</span>
        </div>
      </div>
    </div>
  )
}

function UxVisual() {
  return (
    <div className="service-visual">
      <PreviewLabel>{T('Sample canvas', 'નમૂનાનું કેનવાસ', 'नमूना कैनवस')}</PreviewLabel>
      <div className="preview-canvas">
        <div className="preview-canvas__panel">
          <span className="preview-mono">{T('Colour', 'રંગ', 'रंग')}</span>
          <div className="preview-swatches">
            <i className="is-green" />
            <i className="is-lime" />
            <i className="is-yellow" />
            <i className="is-ink" />
            <i className="is-paper" />
          </div>
          <span className="preview-mono">{T('Type', 'ટાઇપ', 'टाइप')}</span>
          <div className="preview-type">Aa<small>Aa</small></div>
        </div>
        <div className="preview-canvas__panel">
          <span className="preview-mono">{T('Components', 'ઘટકો', 'घटक')}</span>
          <div className="preview-input">{T('Search orders…', 'ઓર્ડર શોધો…', 'ऑर्डर खोजें…')}</div>
          <div className="preview-button">{T('Primary action', 'મુખ્ય ક્રિયા', 'मुख्य क्रिया')}</div>
        </div>
        <div className="preview-canvas__panel preview-canvas__panel--wide">
          <span className="preview-mono">{T('Wireframe → screen', 'વાયરફ્રેમ → સ્ક્રીન', 'वायरफ़्रेम → स्क्रीन')}</span>
          <div className="preview-wire">
            <i />
            <i />
            <i className="preview-wire__box" />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Fallback preview for a new service. Adding an item to `services.items`
 * without a dedicated visual in the map below still produces a finished
 * panel instead of an empty box.
 */
function GenericVisual({ item }: { item: ServiceItem }) {
  return (
    <div className="service-visual">
      <PreviewLabel>{T('Capability map', 'ક્ષમતા નકશો', 'क्षमता मानचित्र')}</PreviewLabel>
      <div className="preview-generic">
        <div className="preview-generic__top">
          <span className="preview-mono">{T('Service', 'સેવા', 'सेवा')}</span>
          <span className="preview-mono">{T('In studio', 'સ્ટુડિયોમાં', 'स्टूडियो में')}</span>
        </div>
        <strong className="preview-generic__title">{item.title}</strong>
        <ul className="preview-generic__tags">
          {(item.tags ?? []).map((tag) => <li key={tag}>{tag}</li>)}
        </ul>
        <div className="preview-generic__diagram" aria-hidden="true">
          <span />
          <span />
          <span />
          <i />
        </div>
      </div>
    </div>
  )
}

type ServiceVisual = ComponentType<{ item: ServiceItem }>

const visuals: Record<string, ServiceVisual> = {
  ai: AiVisual,
  erp: ErpVisual,
  mobile: MobileVisual,
  ux: UxVisual,
}

export default function Services() {
  const { services } = site
  const [active, setActive] = useState(0)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const hoverLock = useRef(false)
  const hoverLockTimer = useRef(0)
  const sRef = useReveal()

  // A service link in the desktop dropdown or mobile index opens its tab.
  // Briefly ignore hover as the page scrolls: the resting pointer can land on
  // a different tab and override the service the visitor asked for.
  useEffect(() => {
    const handleSelect = (event: Event): void => {
      if (!isServiceSelectEvent(event)) return
      const index = services.items.findIndex((item) => item.id === event.detail)
      if (index < 0) return

      hoverLock.current = true
      window.clearTimeout(hoverLockTimer.current)
      hoverLockTimer.current = window.setTimeout(() => {
        hoverLock.current = false
      }, 500)
      setActive(index)
    }

    window.addEventListener(SERVICE_SELECT_EVENT, handleSelect)
    return () => {
      window.removeEventListener(SERVICE_SELECT_EVENT, handleSelect)
      window.clearTimeout(hoverLockTimer.current)
    }
  }, [])

  const previewTab = (index: number): void => {
    if (hoverLock.current) return
    setActive(index)
  }

  const moveTab = (event: KeyboardEvent<HTMLButtonElement>, index: number): void => {
    const last = services.items.length - 1
    let next: number | null = null

    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = index === last ? 0 : index + 1
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = index === 0 ? last : index - 1
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = last

    if (next === null) return
    event.preventDefault()
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <section id="services" className="sec" aria-labelledby="services-title" ref={sRef}>
      <div className="wrap">
        <h2 className="sec-title" id="services-title">
          {`${services.titleLead} `}<em>{services.titleAccent}</em>
        </h2>
        <p className="sec-lede">{services.lede}</p>

        <div className="services-tabs">
          <div
            className="services-tablist"
            role="tablist"
            aria-label={T('Services', 'સેવાઓ', 'सेवाएँ')}
            aria-orientation="vertical"
          >
            {services.items.map((item, index) => {
              const selected = active === index
              const number = String(index + 1).padStart(2, '0')

              return (
                <button
                  className="service-tab"
                  id={`service-tab-${item.id}`}
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`service-panel-${item.id}`}
                  tabIndex={selected ? 0 : -1}
                  ref={(node) => { tabRefs.current[index] = node }}
                  onMouseEnter={() => previewTab(index)}
                  onFocus={() => setActive(index)}
                  onClick={() => setActive(index)}
                  onKeyDown={(event) => moveTab(event, index)}
                >
                  <span className="mono-label">{number}</span>
                  <span className="service-tab__title">{item.title}</span>
                  <Arrow />
                </button>
              )
            })}
          </div>

          <div className="services-panel">
            {services.items.map((item, index) => {
              const Visual = visuals[item.id] ?? GenericVisual
              const selected = active === index

              return (
                <div
                  className="service-panel"
                  id={`service-panel-${item.id}`}
                  key={item.id}
                  role="tabpanel"
                  aria-labelledby={`service-tab-${item.id}`}
                  aria-hidden={selected ? undefined : true}
                  data-active={selected ? 'true' : 'false'}
                  inert={selected ? undefined : true}
                >
                  <div className="service-panel__visual" aria-hidden="true">
                    <Visual item={item} />
                  </div>
                  <p className="sr-only">{item.line}</p>
                  {item.href.startsWith('/') && (
                    <a className="service-panel__cta" href={withLang(item.href)}>
                      <span>{T('Learn more', 'વધુ જાણો', 'और जानें')}</span>
                      <Arrow className="service-arrow" />
                    </a>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
