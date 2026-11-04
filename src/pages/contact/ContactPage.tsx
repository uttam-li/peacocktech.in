import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { site, T } from '@data/site'

/** Bot trap: a field humans never see. Anything in it means a bot filled the form. */
export function isHoneypotFilled(data: FormData): boolean {
  const v = data.get('website')
  return typeof v === 'string' && v.trim().length > 0
}

export default function ContactPage() {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [canSubmit, setCanSubmit] = useState(false)
  const [snackbar, setSnackbar] = useState('')
  const snackbarTimer = useRef<number | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const DRAFT_KEY = 'pt-contact-draft'
  // Mount the heavy Google embed only when the map scrolls near the viewport,
  // so it never blocks the initial page load.
  const [mapReady, setMapReady] = useState(false)
  const [mapArmed, setMapArmed] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [phoneError, setPhoneError] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)

  function showSnackbar(message: string): void {
    setSnackbar(message)
    if (snackbarTimer.current) window.clearTimeout(snackbarTimer.current)
    snackbarTimer.current = window.setTimeout(() => setSnackbar(''), 4000)
  }

  function readDraft(): Record<string, string> {
    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      if (!raw) return {}
      const data: unknown = JSON.parse(raw)
      if (typeof data !== 'object' || data === null) return {}
      return data as Record<string, string>
    } catch {
      return {}
    }
  }

  function saveDraft(): void {
    try {
      const form = formRef.current
      if (!form || sent) return
      const data = new FormData(form)
      const draft: Record<string, string> = {}
      for (const key of ['name', 'email', 'company', 'phone', 'msg']) {
        const value = data.get(key)
        if (typeof value === 'string' && value) draft[key] = value
      }
      if (Object.keys(draft).length > 0) localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
    } catch {
      /* private mode: form simply won't persist */
    }
  }

  function updateCanSubmit(): void {
    const form = formRef.current
    if (!form) return
    const data = new FormData(form)
    const required = ['name', 'email', 'company', 'phone', 'msg']
    const filled = required.every((key) => {
      const value = data.get(key)
      return typeof value === 'string' && value.trim().length > 0
    })
    const email = data.get('email')
    const emailValid = typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    const phone = data.get('phone')
    const phoneValid = typeof phone === 'string' && /^[\d\s+()-]+$/.test(phone)
    setEmailError(typeof email === 'string' && email.length > 0 && !emailValid)
    setPhoneError(typeof phone === 'string' && phone.length > 0 && !phoneValid)
    setCanSubmit(filled && emailValid && phoneValid)
    saveDraft()
  }

  useEffect(() => {
    const form = formRef.current
    const draft = readDraft()
    if (form && Object.keys(draft).length > 0) {
      for (const [key, value] of Object.entries(draft)) {
        const field = form.elements.namedItem(key)
        if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) field.value = value
      }
      showSnackbar(T('Draft restored — review and send.', 'ડ્રાફ્ટ પાછો મળ્યો — તપાસીને મોકલો.', 'ड्राफ्ट वापस मिला — जाँचकर भेजें।'))
    }
    updateCanSubmit()
  }, [])

  const sectionRef = useRef<HTMLElement | null>(null)
  const passRef = useRef<HTMLDivElement | null>(null)
  // Book-flip like the home tickets: the stub unfolds with the scroll
  // (same ease/latch pattern as Industries), not on a fixed timer.
  useEffect(() => {
    const pass = passRef.current
    if (!pass) return undefined
    const r = pass.querySelector<HTMLElement>('.r')
    if (!r) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      r.style.transform = ''
      return undefined
    }
    const ease = (x: number): number => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3)
    let raf = 0
    let visible = true
    // Always park folded first: if the stub is already in view at load,
    // the loop then visibly unfolds it (otherwise no flip is ever seen).
    // Mobile stacks vertically so it unfolds downward like a home ticket
    // (rotateX from the joint); desktop keeps the sideways fold.
    const isStacked = (): boolean => window.matchMedia('(max-width: 860px)').matches
    const park = (): void => {
      if (isStacked()) {
        r.style.transformOrigin = '50% 0'
        r.style.transform = 'rotateX(-90deg)'
      } else {
        r.style.transformOrigin = 'left center'
        r.style.transform = 'rotateY(180deg)'
      }
    }
    let cur = 1
    let low = 1
    park()
    const target = (): number => {
      // Key progress to the STUB itself (not the tall ticket): it swings
      // open exactly as it enters the viewport, like a home ticket card.
      const vh = window.innerHeight || 1
      const top = r.getBoundingClientRect().top
      const p = (top - vh * 0.4) / (vh * 0.6)
      return p < 0 ? 0 : p > 1 ? 1 : p
    }
    const paint = (): void => {
      if (isStacked()) {
        r.style.transformOrigin = '50% 0'
        r.style.transform = `rotateX(${(ease(cur) * -90).toFixed(2)}deg)`
      } else {
        r.style.transformOrigin = 'left center'
        r.style.transform = `rotateY(${(ease(cur) * 180).toFixed(2)}deg)`
      }
    }
    const tick = (): void => {
      raf = 0
      const t = target()
      if (t < low) low = t
      cur += (low - cur) * 0.08
      if (Math.abs(low - cur) < 0.001) cur = low
      else if (visible) raf = window.requestAnimationFrame(tick)
      paint()
    }
    const kick = (): void => {
      if (!raf) raf = window.requestAnimationFrame(tick)
    }
    const onScroll = (): void => {
      if (visible) kick()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting
        if (visible) kick()
      },
      { threshold: 0 },
    )
    io.observe(pass)
    kick()
    return () => {
      window.removeEventListener('scroll', onScroll)
      io.disconnect()
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [])
  useEffect(() => {
    const node = sectionRef.current
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') {
      node.setAttribute('data-in', '')
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          node.setAttribute('data-in', '')
          io.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const node = mapRef.current
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') {
      setMapReady(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMapReady(true)
          io.disconnect()
        }
      },
      { rootMargin: '400px' },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [])

  // Open the fold once the user asks for the map (with a fallback timer
  // so a blocked embed never traps the card folded shut).
  useEffect(() => {
    if (!mapArmed || mapLoaded) return
    const timer = window.setTimeout(() => setMapLoaded(true), 8000)
    return () => window.clearTimeout(timer)
  }, [mapArmed, mapLoaded])

  async function onSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    if (sent || sending) return
    const form = e.currentTarget
    const formData = new FormData(form)
    if (isHoneypotFilled(formData)) {
      // Bot trap: pretend it worked, send nothing.
      setSending(false)
      setSent(true)
      return
    }
    const phone = formData.get('phone')
    const email = formData.get('email')
    if (typeof phone !== 'string' || !/^[\d\s+()-]*$/.test(phone)) return
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showSnackbar(T('Enter a valid email address.', 'સાચું ઇમેઇલ સરનામું લખો.', 'सही ईमेल पता लिखें.'))
      return
    }
    setSending(true)
    const name = String(formData.get('name') ?? '')
    const emailValue = String(formData.get('email') ?? '')
    const company = String(formData.get('company') ?? '')
    const phoneValue = String(formData.get('phone') ?? '')
    const message = String(formData.get('msg') ?? '')
    const payload = {
      name,
      email: emailValue,
      company,
      phone: phoneValue,
      message,
      _subject: 'New project inquiry — peacocktech.in',
      _template: 'table',
      _captcha: 'false',
    }
    async function postLead(signal: AbortSignal): Promise<boolean> {
      const res = await fetch('https://formsubmit.co/ajax/support@peacocktech.in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        signal,
      })
      const data: unknown = await res.json().catch(() => null)
      return res.ok && !!data && typeof data === 'object' && 'success' in data && (data as { success: string }).success === 'true'
    }
    let delivered = false
    for (let attempt = 0; attempt < 3 && !delivered; attempt += 1) {
      if (attempt > 0) await new Promise((r) => setTimeout(r, 1000 * attempt))
      const ctrl = new AbortController()
      const timer = window.setTimeout(() => ctrl.abort(), 10000)
      try {
        delivered = await postLead(ctrl.signal)
      } catch {
        delivered = false
      } finally {
        window.clearTimeout(timer)
      }
    }
    try {
      if (delivered) {
        setSending(false)
        setSent(true)
        try {
          localStorage.removeItem(DRAFT_KEY)
        } catch {
          /* private mode: nothing stored */
        }
        showSnackbar(T('Inquiry sent. We reply within one working day.', 'પૂછપરછ મોકલાઈ. અમે એક કામકાજી દિવસમાં જવાબ આપીએ છીએ.', 'पूछताछ भेज दी गई। हम एक कार्यदिवस में जवाब देते हैं।'))
        return
      }
      throw new Error('submit failed')
    } catch {
      // No-network / blocked fallback: open the visitor's email app
      // pre-filled, so the inquiry is never lost.
      setSending(false)
      const subject = 'Project inquiry — Peacock Technotrics'
      const body = [
        'New project inquiry from the website contact form',
        '',
        `Name: ${name}`,
        `Email: ${emailValue}`,
        `Company: ${company}`,
        `Phone: ${phoneValue}`,
        '',
        'Message:',
        message,
      ].join('\n')
      window.location.href = `mailto:support@peacocktech.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      showSnackbar(T('Network issue. Your email app opened — press Send to complete.', 'નેટવર્ક સમસ્યા. તમારું ઇમેઇલ એપ ખૂલ્યું — પૂર્ણ કરવા Send દબાવો.', 'नेटवर्क समस्या। आपका ईमेल ऐप खुल गया — पूरा करने के लिए Send दबाएँ।'))
    }
  }

  return (
    <main id="top" tabIndex={-1}>
      <section className="contact-ticket border-t border-line bg-paper pb-20 pl-[var(--edge)] pr-[var(--edge)] pt-[29px]" id="contact" aria-labelledby="contact-title" ref={sectionRef}>
        <h1 id="contact-title" className="rise m-0 mb-3 text-center font-serif text-[clamp(2.3rem,5.2vw,4.6rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-pearl">
          {`${T('Your next', 'તમારી આગામી', 'आपका अगला')} `}<em className="not-italic text-lime">{T('system', 'સિસ્ટમ', 'सिस्टम')}</em>{` ${T('starts here', 'અહીંથી શરૂ થાય છે', 'यहीं से शुरू होता है')}`}
        </h1>
        <p className="sub rise mx-auto mb-11 block max-w-[62ch] text-center text-[clamp(1rem,1.3vw,1.15rem)] leading-[1.55] text-muted" style={{ animationDelay: '.06s' }}>
          {T('ERP, custom software, mobile apps, AI and UX — built around how your business actually runs. Tell us what is manual, slow or stuck; we will tell you what we would build first. We reply within one working day.', 'ERP, કસ્ટમ સોફ્ટવેર, મોબાઇલ એપ્સ, AI અને UX — તમારો વ્યવસાય ખરેખર કેવી રીતે ચાલે છે તેને ધ્યાનમાં રાખીને. શું હાથથી, ધીમું કે અટકેલું છે તે કહો; અમે કહીશું કે અમે પહેલા શું બનાવીશું. અમે એક કામકાજી દિવસમાં જવાબ આપીએ છીએ.', 'ERP, कस्टम सॉफ़्टवेयर, मोबाइल ऐप्स, AI और UX — आपका व्यवसाय असल में जैसे चलता है, उसे ध्यान में रखकर। बताइए क्या हाथ से, धीमा या अटका हुआ है; हम बताएँगे कि हम पहले क्या बनाएँगे। हम एक कार्यदिवस में जवाब देते हैं।')}
        </p>
        <div ref={passRef} className={mapReady ? 'pass rise is-open' : 'pass rise'} style={{ animationDelay: '.12s' }}>
          <form ref={formRef} className={`l relative z-[2] bg-night p-[clamp(24px,4vw,48px)] text-pearl [transform:translateZ(1px)]${sent ? ' sent' : ''}`} onSubmit={onSubmit} onInput={updateCanSubmit} noValidate>
            <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.08em] text-night-soft">{T('* Required field', '* જરૂરી ફીલ્ડ', '* आवश्यक फ़ील्ड')}</p>
            <div className="grid">
              <label className="bx block">
                <span className="mb-2 block font-mono text-[11px] font-normal uppercase tracking-[0.1em] text-night-soft">{T('Full name', 'પૂરું નામ', 'पूरा नाम')}<span aria-hidden="true"> *</span></span>
                <input name="name" type="text" required placeholder={T('Your name', 'તમારું નામ', 'आपका नाम')} autoComplete="name" />
              </label>
              <label className="bx block">
                <span className="mb-2 block font-mono text-[11px] font-normal uppercase tracking-[0.1em] text-night-soft">{T('Email address', 'ઇમેઇલ સરનામું', 'ईमेल पता')}<span aria-hidden="true"> *</span></span>
                <input
                  name="email"
                  type="email"
                  required
                  pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                  placeholder="you@company.com"
                  autoComplete="email"
                  aria-invalid={emailError || undefined}
                  aria-describedby={emailError ? 'email-err' : undefined}
                />
                {emailError && <p id="email-err" role="alert" className="field-error mb-0 ml-0 mr-0 mt-2 font-mono text-[10px] uppercase tracking-[0.08em] text-[#e5806b]">{T('Enter a valid email address', 'સાચું ઇમેઇલ સરનામું લખો', 'सही ईमेल पता लिखें')}</p>}
              </label>
              <label className="bx block">
                <span className="mb-2 block font-mono text-[11px] font-normal uppercase tracking-[0.1em] text-night-soft">{T('Company', 'કંપની', 'कंपनी')}<span aria-hidden="true"> *</span></span>
                <input name="company" type="text" required placeholder={T('Company name', 'કંપનીનું નામ', 'कंपनी का नाम')} autoComplete="organization" />
              </label>
              <label className="bx block">
                <span className="mb-2 block font-mono text-[11px] font-normal uppercase tracking-[0.1em] text-night-soft">{T('Phone number', 'ફોન નંબર', 'फ़ोन नंबर')}<span aria-hidden="true"> *</span></span>
                <input
                  name="phone"
                  type="tel"
                  required
                  inputMode="tel"
                  pattern="[\d\s+()-]+"
                  placeholder="+91 00000 00000"
                />
                {phoneError && <p id="phone-err" role="alert" className="field-error mb-0 ml-0 mr-0 mt-2 font-mono text-[10px] uppercase tracking-[0.08em] text-[#e5806b]">{T('Digits only, no letters', 'માત્ર અંકો, અક્ષરો નહીં', 'सिर्फ़ अंक, अक्षर नहीं')}</p>}
              </label>
              <label className="bx w block">
                <span className="mb-2 block font-mono text-[11px] font-normal uppercase tracking-[0.1em] text-night-soft">{T('Message', 'સંદેશ', 'संदेश')}<span aria-hidden="true"> *</span></span>
                <textarea name="msg" required placeholder={T('Tell us about your requirements…', 'તમારી જરૂરિયાતો વિશે કહો…', 'अपनी ज़रूरतों के बारे में बताएँ…')} rows={4} />
              </label>
            </div>
            <br />
            <label aria-hidden="true" style={{ position: 'fixed', left: -9999, top: 0, width: 1, height: 1, overflow: 'hidden' }}>
              Website
              <input name="website" type="text" tabIndex={-1} autoComplete="off" />
            </label>
            <button className="btn" type="submit" disabled={sending || sent || !canSubmit}>
              {sending ? T('Sending…', 'મોકલી રહ્યા છીએ…', 'भेज रहे हैं…') : T('Submit Request', 'વિનંતી મોકલો', 'अनुरोध भेजें')}
            </button>
            {sent && <p className="ok" role="status">{T('Thank you. We reply within one working day.', 'આભાર. અમે એક કામકાજી દિવસમાં જવાબ આપીએ છીએ.', 'धन्यवाद। हम एक कार्यदिवस में जवाब देते हैं।')}</p>}
          </form>
          <aside className="r">
            <div className={mapLoaded ? 'map is-live' : 'map'} ref={mapRef} suppressHydrationWarning>
              {mapArmed ? (
                <iframe
                  title={T('Peacock Technotrics on map', 'નકશા પર પીકોક ટેક્નોટ્રિક્સ', 'नक्शे पर पीकॉक टेक्नोट्रिक्स')}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  src="https://maps.google.com/maps?q=312+Zircon+Plus,+Aamba+Talavadi,+Katargam,+Surat,+Gujarat+395004&z=15&output=embed"
                  onLoad={() => setMapLoaded(true)}
                  onError={() => setMapLoaded(true)}
                />
              ) : (
                <div className="map-preview flex flex-1 items-center justify-center min-h-[260px] p-6 text-center">
                  <button type="button" className="map-preview__btn" onClick={() => setMapArmed(true)} disabled={!mapReady}>
                    {T('Load map', 'નકશો ખોલો', 'नक्शा खोलें')}
                  </button>
                </div>
              )}
            </div>
            <address className="px-7 py-6 leading-[1.8] not-italic">
              <a className="text-lime no-underline hover:text-green-deep" href="mailto:support@peacocktech.in">support@peacocktech.in</a>
              <br />
              {site.tel && <a className="text-lime no-underline hover:text-green-deep" href={`tel:${site.tel}`}>+91 987 910 0230</a>}
              <br />
              312 Zircon Plus, Aamba Talavadi,
              <br />
              Katargam, Surat, Gujarat 395004
            </address>
          </aside>
        </div>
      </section>
      {snackbar && <div className="contact-snackbar" role="alert">{snackbar}</div>}
    </main>
  )
}