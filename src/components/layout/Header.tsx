import { useEffect, useRef, useState } from 'react'
import type { FocusEvent, MouseEvent } from 'react'
import { site, T, withLang } from '@data/site'
import type { NavChild, NavGroup } from '@data/site'
import BrandLogo from '@ui/BrandLogo'
import Arrow from '@ui/Arrow'
import { focusHashTarget, joinPrefix, selectService } from '@lib/nav'

function Chevron() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false" className="nav-group__chevron">
      <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square" />
    </svg>
  )
}

interface NavGroupProps {
  item: NavGroup
  open: boolean
  active: boolean
  onOpen: () => void
  onClose: () => void
  linkPrefix?: string
}

function NavGroup({ item, open, active, onOpen, onClose, linkPrefix = '' }: NavGroupProps) {
  const groupRef = useRef<HTMLDivElement | null>(null)

  const handleBlur = (event: FocusEvent<HTMLDivElement>): void => {
    if (event.relatedTarget instanceof Node && groupRef.current?.contains(event.relatedTarget)) return
    onClose()
  }

  const handleTrigger = (): void => {
    if (open) {
      onClose()
      return
    }
    onOpen()
  }

  const handleChild = (event: MouseEvent<HTMLAnchorElement>, child: NavChild): void => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    if (child.serviceId) selectService(child.serviceId)
    onClose()
    focusHashTarget(child.href)
  }

  return (
    <div className="nav-group" ref={groupRef} onBlur={handleBlur}>
      <button
        className={`nav-link nav-group__trigger${active ? ' is-active' : ''}`}
        type="button"
        aria-expanded={open}
        aria-controls={`nav-menu-${item.id}`}
        aria-current={active ? 'location' : undefined}
        onClick={handleTrigger}
      >
        {item.label}
        <Chevron />
      </button>

      <div
        className={`nav-menu${open ? ' is-open' : ''}`}
        id={`nav-menu-${item.id}`}
        aria-hidden={!open}
        inert={!open ? true : undefined}
      >
        {item.children.map((child) => (
          <a
            className="nav-menu__link"
            key={child.id}
            href={withLang(`${joinPrefix(linkPrefix, child.href)}`)}
            onClick={(event) => handleChild(event, child)}
          >
            <span>{child.label}</span>
            <Arrow className="h-4 w-4" />
          </a>
        ))}
      </div>
    </div>
  )
}

interface HeaderProps {
  visible: boolean
  menuOpen: boolean
  onOpenMenu: () => void
  activeId: string
  /** Prefix for in-site links (e.g. "./" when rendered on a sub-page). */
  linkPrefix?: string
}

export default function Header({ visible, menuOpen, onOpenMenu, activeId, linkPrefix = '' }: HeaderProps) {
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const navRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!visible) setOpenGroup(null)
  }, [visible])

  const handleLink = (event: MouseEvent<HTMLAnchorElement>, href: string): void => {
    setOpenGroup(null)
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    focusHashTarget(href)
  }

  useEffect(() => {
    if (!openGroup) return undefined

    const onPointerDown = (event: PointerEvent): void => {
      if (event.target instanceof Node && navRef.current?.contains(event.target)) return
      setOpenGroup(null)
    }

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== 'Escape') return
      const trigger = navRef.current?.querySelector<HTMLElement>(
        `[aria-controls="nav-menu-${openGroup}"]`,
      )
      setOpenGroup(null)
      trigger?.focus()
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [openGroup])

  return (
    <header
      className={`site-header${visible ? ' is-visible' : ''}`}
      aria-label={T('Site header', 'સાઇટ હેડર', 'साइट हेडर')}
      inert={!visible ? true : undefined}
    >
      <div className="site-header__inner">
        <div className="site-header__brand flex min-w-0 items-center gap-4">
          <a className="brand-plate" href={withLang(`${linkPrefix}#top`)} aria-label={T('Peacock Technotrics — home', 'Peacock Technotrics — હોમ', 'Peacock Technotrics — होम')}>
            <BrandLogo alt="" />
          </a>
          <p className="mono-label ml-1 hidden border-l border-line-strong pl-6 text-muted min-[1560px]:block">
            {T('Software studio', 'સોફ્ટવેર સ્ટુડિયો', 'सॉफ़्टवेयर स्टूडियो')}<br />Surat, India <span className="loc-sep" aria-hidden="true" />{` ${T('working worldwide', 'વિશ્વભરમાં કાર્યરત', 'दुनियाभर में कार्यरत')}`}
          </p>
        </div>

        <nav
          className="site-header__nav hidden items-center gap-5 justify-self-center md:flex xl:gap-8"
          aria-label={T('Primary', 'મુખ્ય', 'मुख्य')}
          ref={navRef}
        >
          {site.nav.map((item) => {
            switch (item.kind) {
              case 'group':
                return (
                  <NavGroup
                    key={item.id}
                    item={item}
                    linkPrefix={linkPrefix}
                    open={openGroup === item.id}
                    active={activeId === item.id}
                    onOpen={() => setOpenGroup(item.id)}
                    onClose={() => setOpenGroup((current) => (current === item.id ? null : current))}
                  />
                )
              case 'link':
                return (
                  <a
                    key={item.id}
                    className="nav-link"
                    href={withLang(`${joinPrefix(linkPrefix, item.href)}`)}
                    aria-current={activeId === item.id ? 'location' : undefined}
                    onClick={(event) => handleLink(event, item.href)}
                  >
                    {item.label}
                  </a>
                )
              default: {
                const _exhaustive: never = item
                return _exhaustive
              }
            }
          })}
        </nav>

        <div className="site-header__actions flex items-center gap-4 justify-self-end">
          <a
            className="hero-btn hidden lg:inline-flex"
            href={withLang(`${joinPrefix(linkPrefix, site.cta.href)}`)}
          >
            <span>{site.cta.label}</span>
            <Arrow />
          </a>

          <button
            className="index-trigger md:hidden"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            aria-haspopup="dialog"
            aria-label={T('Open the site index', 'સાઇટ ઇન્ડેક્સ ખોલો', 'साइट इंडेक्स खोलें')}
            onClick={onOpenMenu}
          >
            <span className="index-trigger__mark" aria-hidden="true"><i /><i /><b /></span>
            <span>{T('Index', 'ઇન્ડેક્સ', 'इंडेक्स')}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
