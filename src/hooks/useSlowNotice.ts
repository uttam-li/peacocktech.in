import { useEffect } from 'react'
import { T } from '@data/site'

/**
 * If the page still shows no usable content after 8s on a very slow
 * connection, say so in the visitor's language instead of silence.
 * Mount once per page entry (main.tsx), before the app renders.
 */
export function watchSlowPage(): void {
  if (typeof window === 'undefined') return
  window.setTimeout(() => {
    try {
      const main = document.querySelector('#root main')
      const ready = main && main.textContent && main.textContent.trim().length > 200
      if (ready || document.querySelector('.slow-notice')) return
      const el = document.createElement('div')
      el.className = 'slow-notice'
      el.setAttribute('role', 'status')
      el.textContent = T(
        'Slow connection detected. Loading the lighter version…',
        'ધીમું કનેક્શન જણાયું. હળવું સંસ્કરણ લોડ થઈ રહ્યું છે…',
        'धीमा कनेक्शन का पता चला। हल्का संस्करण लोड हो रहा है…',
      )
      document.body.appendChild(el)
      window.setTimeout(() => el.remove(), 12000)
    } catch {
      /* never break the page for a notice */
    }
  }, 8000)
}

export function useSlowNotice(): void {
  useEffect(() => {
    watchSlowPage()
  }, [])
}
