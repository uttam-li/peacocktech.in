import { useEffect, useState } from 'react'

/**
 * Track which section owns the top of the viewport. Used by the desktop nav
 * and the mobile index to expose the current location without routing.
 */
export function useActiveSection(ids: string[]): string {
  const [activeId, setActiveId] = useState<string>(ids[0] ?? '')

  useEffect(() => {
    let frame = 0

    const update = (): void => {
      frame = 0

      const offset = 140
      const sections = ids
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => el !== null)
        .sort((a, b) => {
          if (a === b) return 0
          return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING
            ? -1
            : 1
        })

      let current = sections[0]?.id ?? ''

      for (const section of sections) {
        if (section.getBoundingClientRect().top <= offset) current = section.id
      }

      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2
      if (atBottom && sections.length) current = sections[sections.length - 1].id

      setActiveId(current)
    }

    const onScroll = (): void => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ids])

  return activeId
}
