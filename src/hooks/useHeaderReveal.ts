import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

/**
 * The header only exists once the cover has been scrolled away.
 * `heroHeight - 88` means section two is at the top of the viewport
 * (just under the header) before the bar animates in.
 */
export function useHeaderReveal(
  heroRef: RefObject<HTMLElement | null>,
  ready: boolean,
): boolean {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!ready) {
      setVisible(false)
      return
    }

    let frame = 0

    const measure = (): void => {
      frame = 0
      const hero = heroRef.current
      if (!hero) return
      const threshold = Math.max(0, hero.offsetHeight - 120)
      setVisible(window.scrollY > threshold)
    }

    const onScroll = (): void => {
      if (frame) return
      frame = window.requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [heroRef, ready])

  return visible
}
