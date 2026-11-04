import { useEffect, useRef } from 'react'
import type { CSSProperties, MouseEvent } from 'react'
import { site, T, withLang } from '@data/site'
import BrandLogo from '@ui/BrandLogo'
import { joinPrefix, selectService } from '@lib/nav'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
  activeId: string
  /** Prefix for in-site links (e.g. "./" when rendered on a sub-page). */
  linkPrefix?: string
}

export default function MobileMenu({ open, onClose, activeId, linkPrefix = '' }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement | null>(null)
  const closeRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (!open) return

    const previous = document.activeElement
    const panel = panelRef.current
    document.documentElement.classList.add('menu-open')
    closeRef.current?.focus({ preventScroll: true })

    const focusable = (): HTMLElement[] => {
      if (!panel) return []
      return Array.from(
        panel.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
      ).filter((el): el is HTMLElement => el instanceof HTMLElement && el.offsetParent !== null)
    }

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') return
      const items = focusable()
      if (!items.length) return

      const first = items[0]
      const last = items[items.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.documentElement.classList.remove('menu-open')
      document.removeEventListener('keydown', onKeyDown)
      if (previous instanceof HTMLElement) previous.focus({ preventScroll: true })
    }
  }, [open, onClose])

  const jumpTo = (event: MouseEvent<HTMLAnchorElement>, href: string, serviceId?: string): void => {
    const hash = href.startsWith('#') ? href : href.slice(href.indexOf('#'))
    if (!hash.startsWith('#')) return
    const target = document.getElementById(hash.slice(1))
    if (!target) return

    event.preventDefault()
    onClose()

    if (serviceId) selectService(serviceId)

    window.requestAnimationFrame(() => {
      target.scrollIntoView()
      const heading = target.querySelector<HTMLElement>('h1, h2, h3') ?? target
      if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1')
      window.requestAnimationFrame(() => heading.focus({ preventScroll: true }))
    })
  }

  if (!open) return null

  return (
    <div
      className="menu-panel"
      id="site-menu"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="site-menu-title"
    >
      <header className="menu-head">
        <a
          className="brand-plate"
          href={withLang(`${linkPrefix}#top`)}
          aria-label={T('Peacock Technotrics — home', 'Peacock Technotrics — હોમ', 'Peacock Technotrics — होम')}
          onClick={(event) => jumpTo(event, `${linkPrefix}#top`)}
        >
          <BrandLogo alt="" className="h-8 w-auto" />
        </a>
        <button className="menu-close" type="button" onClick={onClose} ref={closeRef}>
          <span>{T('Close', 'બંધ કરો', 'बंद करें')}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M5 5l14 14M19 5L5 19" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
          </svg>
        </button>
      </header>

      <div className="flex-1 px-[var(--pad)] pb-10 pt-7">
        <h2 className="sr-only" id="site-menu-title">{T('Site index', 'સાઇટ ઇન્ડેક્સ', 'साइट इंडेक्स')}</h2>
        <nav aria-label={T('Full index', 'સંપૂર્ણ ઇન્ડેક્સ', 'पूर्ण इंडेक्स')}>
          {site.nav.map((item, index) => {
            const delay: CSSProperties = { animationDelay: `${0.08 + index * 0.055}s` }
            const number = String(index + 1).padStart(2, '0')

            switch (item.kind) {
              case 'group':
                return (
                  <div className="menu-group" key={item.id}>
                    <a
                      className="menu-link menu-link--group"
                      href={withLang(`${joinPrefix(linkPrefix, item.href)}`)}
                      aria-current={activeId === item.id ? 'location' : undefined}
                      style={delay}
                      onClick={(event) => jumpTo(event, item.href)}
                    >
                      <span className="menu-link__num">{number}</span>
                      <span>{item.label}</span>
                    </a>
                    <ul className="menu-sublist" aria-label={T(`${item.label} links`, `${item.label} લિંક્સ`, `${item.label} लिंक्स`)}>
                      {item.children.map((child) => (
                        <li key={child.id}>
                          <a
                            className="menu-sublink"
                            href={withLang(`${joinPrefix(linkPrefix, child.href)}`)}
                            onClick={(event) => jumpTo(event, child.href, child.serviceId)}
                          >
                            {child.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              case 'link':
                return (
                  <a
                    key={item.id}
                    className="menu-link"
                    href={withLang(`${joinPrefix(linkPrefix, item.href)}`)}
                    aria-current={activeId === item.id ? 'location' : undefined}
                    style={delay}
                    onClick={(event) => jumpTo(event, item.href)}
                  >
                    <span className="menu-link__num">{number}</span>
                    <span>{item.label}</span>
                  </a>
                )
              default: {
                const _exhaustive: never = item
                return _exhaustive
              }
            }
          })}
        </nav>

        <div className="mt-10 flex flex-col gap-4 border-t border-night-line pt-6">
          <p className="mono-label text-night-muted">
            {T(`${site.services.items.length} services · ${site.services.industries.length} industries · one practical end.`, `${site.services.items.length} સેવાઓ · ${site.services.industries.length} ઇન્ડસ્ટ્રીઝ · એક વ્યવહારુ અંત.`, `${site.services.items.length} सेवाएँ · ${site.services.industries.length} इंडस्ट्रीज़ · एक व्यावहारिक अंत.`)}
          </p>
          <p className="max-w-[34ch] font-serif text-[clamp(1.35rem,5vw,2rem)] leading-snug tracking-[-.02em]">
            {`${T('Software people', 'સોફ્ટવેર', 'सॉफ़्टवेयर')} `}<em className="text-lime">{T('can use.', 'લોકો વાપરી શકે તેવું.', 'लोग इस्तेमाल कर सकें.')}</em>
          </p>
          <p className="mono-label mt-2 text-night-muted">{`${site.location} · ${site.working}`}</p>
        </div>
      </div>
    </div>
  )
}
