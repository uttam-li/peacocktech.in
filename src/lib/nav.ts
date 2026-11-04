/**
 * Cross-component navigation events.
 *
 * Services live inside a tablist, so a menu link cannot select a tab on its
 * own. The Header and the mobile index dispatch this event after navigation;
 * the Services section listens and opens the matching tab.
 */
export const SERVICE_SELECT_EVENT = 'peacock:select-service'

/** Verified guard: a lying guard would be worse than a cast. */
export function isServiceSelectEvent(event: Event): event is CustomEvent<string> {
  return event instanceof CustomEvent && typeof event.detail === 'string'
}

export function selectService(serviceId: string): void {
  if (!serviceId) return
  window.dispatchEvent(
    new CustomEvent(SERVICE_SELECT_EVENT, { detail: serviceId }),
  )
}

/**
 * Join a page prefix with a link target. Absolute paths and full URLs
 * ignore the prefix so "./" never becomes ".//about".
 */
export function joinPrefix(prefix: string, href: string): string {
  if (!href || href.startsWith('/') || /^[a-z][a-z0-9+.-]*:/i.test(href)) return href
  return `${prefix}${href}`
}

/**
 * Move focus to the destination after an in-page link. This matters when a
 * dropdown closes: focus should not stay on a link that is now hidden.
 */
export function focusHashTarget(href: string): void {
  if (!href?.startsWith('#')) return
  const target = document.getElementById(href.slice(1))
  if (!target) return

  const heading = target.querySelector<HTMLElement>('h1, h2, h3') ?? target
  if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1')
  window.requestAnimationFrame(() => heading.focus({ preventScroll: true }))
}
