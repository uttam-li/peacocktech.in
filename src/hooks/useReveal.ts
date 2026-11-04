import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { isSlowNetwork } from '@lib/network'
import { MEDIA_QUERIES } from '@constants/index'

/**
 * Sets data-in when ~15% of the section is visible. The section head wipes
 * first and the body follows on a short delay, so the title never animates
 * over an already-settled body. CSS owns the motion. On slow networks,
 * Data Saver, or reduced motion the content appears at once: the observer
 * fires at first pixel with a preload margin instead of waiting.
 */
export function useReveal<T extends HTMLElement = HTMLElement>(threshold = 0.15): RefObject<T | null> {
  const ref = useRef<T | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const instant =
      isSlowNetwork() || window.matchMedia(MEDIA_QUERIES.reduce).matches
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          el.setAttribute('data-in', '')
          io.disconnect()
        }
      },
      // Reveal as the section enters the viewport so the animation plays
      // in front of slow scrollers; fast flings are caught by the
      // scroll listener and safety net instead of landing on emptiness.
      instant ? { threshold: 0, rootMargin: '400px' } : { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return ref
}
