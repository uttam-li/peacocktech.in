import { useEffect } from 'react'
import { canPrefetch, effectiveType, isFastNetwork } from '@lib/network'

function addPrefetchLink(url: string): void {
  if (document.querySelector(`link[rel="prefetch"][href="${url}"]`)) return
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = url
  link.setAttribute('data-smart-prefetch', '')
  document.head.appendChild(link)
}

/**
 * Prefetch/prerender the next likely page(s).
 *
 * - Save-Data or 2G-class: nothing (respect the user's bytes).
 * - 4G: speculation-rules prerender (instant, ~0ms navigation).
 * - 3G / unknown (Firefox/Safari, no Network API): speculation-rules
 *   prefetch + <link rel="prefetch"> fallback on idle, plus instant
 *   prefetch on link hover/focus. HTML is only 5-35KB so even 3G
 *   can afford it; the JS vendor chunk is already cached from the
 *   current page (same hash), so the next navigation reuses it.
 */
export function useSmartPrefetch(urls: string[]): void {
  useEffect(() => {
    if (typeof document === 'undefined') return
    if (!canPrefetch()) return

    // 1. Speculation rules: prerender on 4G, lightweight prefetch on 3G/unknown.
    if (!document.querySelector('script[data-smart-prefetch]')) {
      try {
        const script = document.createElement('script')
        script.type = 'speculationrules'
        script.setAttribute('data-smart-prefetch', '')
        if (isFastNetwork() || effectiveType() === 'unknown') {
          script.textContent = JSON.stringify({
            prerender: [{ source: 'list', urls, eagerness: 'moderate' }],
            prefetch: [{ source: 'list', urls, eagerness: 'moderate' }],
          })
        } else {
          // 3G: fetch HTML early, skip full prerender (saves memory/CPU).
          script.textContent = JSON.stringify({
            prefetch: [{ source: 'list', urls, eagerness: 'moderate' }],
          })
        }
        document.head.appendChild(script)
      } catch {
        /* older browsers ignore speculation rules */
      }
    }

    // 2. Fallback for Firefox/Safari (no speculation-rules): idle prefetch.
    const idlePrefetch = (): void => {
      for (const u of urls) addPrefetchLink(u)
    }
    let idleId = 0
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
      cancelIdleCallback?: (id: number) => void
    }
    if (typeof w.requestIdleCallback === 'function') {
      idleId = w.requestIdleCallback(idlePrefetch, { timeout: 3000 })
    } else {
      idleId = w.setTimeout(idlePrefetch, 2000)
    }

    // 3. Hover/focus: prefetch the exact link the user is about to tap.
    // Covers "hover About, then tap" even before idle prefetch ran.
    const onHover = (e: Event): void => {
      const a = (e.target as HTMLElement | null)?.closest?.('a[href]')
      if (!a) return
      const href = a.getAttribute('href') ?? ''
      if (urls.some((u) => href === u || href.endsWith(u + '.html'))) addPrefetchLink(href)
    }
    document.addEventListener('pointerover', onHover, { passive: true })
    document.addEventListener('focusin', onHover)

    return () => {
      if (typeof w.cancelIdleCallback === 'function' && idleId) w.cancelIdleCallback(idleId)
      else window.clearTimeout(idleId)
      document.removeEventListener('pointerover', onHover)
      document.removeEventListener('focusin', onHover)
    }
  }, [urls.join('|')])
}
