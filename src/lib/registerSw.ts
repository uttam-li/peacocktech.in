import { T } from '@data/site'

/** One place that registers the service worker: idle-deferred so the
 *  first paint never competes with it, silent on failure. */
export function registerSw(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return
  if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') return
  const run = (): void => {
    navigator.serviceWorker
      .register('./sw.js')
      .then((reg) => {
        reg.addEventListener('updatefound', () => {
          const worker = reg.installing
          if (!worker) return
          worker.addEventListener('statechange', () => {
            if (worker.state === 'installed' && navigator.serviceWorker.controller) showUpdateToast(reg)
          })
        })
      })
      .catch(() => {
        /* offline-first is an enhancement; the site works without it */
      })
  }
  // Task 3: never race the critical bytes — register when the browser idles.
  const schedule = (): void => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
    }
    if (typeof w.requestIdleCallback === 'function') w.requestIdleCallback(run, { timeout: 4000 })
    else window.setTimeout(run, 1500)
  }
  if (document.readyState === 'complete') schedule()
  else window.addEventListener('load', schedule, { once: true })
}

function showUpdateToast(reg: ServiceWorkerRegistration): void {
  if (document.querySelector('.sw-toast')) return
  const el = document.createElement('div')
  el.className = 'sw-toast'
  el.setAttribute('role', 'status')
  const label = document.createElement('span')
  label.textContent = T(
    'A new version is available.',
    'નવું સંસ્કરણ ઉપલબ્ધ છે.',
    'नया संस्करण उपलब्ध है।',
  )
  const btn = document.createElement('button')
  btn.type = 'button'
  btn.textContent = T('Refresh', 'રિફ્રેશ', 'रिफ्रेश')
  btn.addEventListener('click', () => {
    reg.waiting?.postMessage('SKIP_WAITING')
  })
  el.append(label, btn)
  document.body.appendChild(el)
  navigator.serviceWorker.addEventListener(
    'controllerchange',
    () => {
      window.location.reload()
    },
    { once: true },
  )
  window.setTimeout(() => el.remove(), 30000)
}
