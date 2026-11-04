import ErrorCatcher from '@ui/ErrorCatcher'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Header from '@layout/Header'
import Hero from '@sections/Hero'
import Services from '@sections/Services'
import Industries from '@sections/Industries'
import HowWeWork from '@sections/HowWeWork'
import About from '@sections/About'
import Contact from '@sections/Contact'
import Footer from '@layout/Footer'
import MobileMenu from '@layout/MobileMenu'
import Intro from '@layout/Intro'
import { site, T } from '@data/site'
import { useLangUpgrade } from '@hooks/useLang'
import { useSlowNotice } from '@hooks/useSlowNotice'
import { useSmartPrefetch } from '@hooks/useSmartPrefetch'
import { otherPages } from '@lib/pages'
import { useActiveSection } from '@hooks/useActiveSection'
import { useHeaderReveal } from '@hooks/useHeaderReveal'

/** The intro owns the page, then hands it over. No other phase can exist. */
type IntroPhase = 'intro' | 'revealing' | 'ready'

export default function App() {
  const [introPhase, setIntroPhase] = useState<IntroPhase>('intro')
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const heroRef = useRef<HTMLElement | null>(null)
  const mainRef = useRef<HTMLElement | null>(null)
  const wrapRef = useRef<HTMLDivElement | null>(null)
  useLangUpgrade()
  useSlowNotice()
  useSmartPrefetch(otherPages('/'))
  const ready = introPhase !== 'intro'
  const headerVisible = useHeaderReveal(heroRef, ready)
  const sectionIds = useMemo(() => site.sectionIds, [])
  const activeId = useActiveSection(sectionIds)

  useEffect(() => {
    document.documentElement.classList.toggle('intro-pending', introPhase === 'intro')
    const el = wrapRef.current
    if (el) {
      if (ready) el.setAttribute('data-ready', 'true')
      else el.removeAttribute('data-ready')
      // Task 1: keep header + skip-link usable above the intro film —
      // inert only the content, never the header that owns the menu trigger.
      el.querySelectorAll('main, footer').forEach((t) => {
        ;(t as HTMLElement).inert = introPhase === 'intro' || menuOpen
      })
    }
    return () => document.documentElement.classList.remove('intro-pending')
  }, [introPhase, menuOpen, ready])

  const handleIntroReveal = useCallback(() => {
    setIntroPhase('revealing')
    document.documentElement.classList.remove('intro-pending')
    window.requestAnimationFrame(() => mainRef.current?.focus({ preventScroll: true }))
  }, [])

  const handleIntroDone = useCallback(() => setIntroPhase('ready'), [])
  const openMenu = useCallback(() => setMenuOpen(true), [])
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  return (
    <ErrorCatcher>
      <div
        className="min-h-screen"
        ref={wrapRef}
      >
        <a className="skip-link" href="#main">{T('Skip to content', 'મુખ્ય સામગ્રી પર જાઓ', 'मुख्य सामग्री पर जाएँ')}</a>

        <Header
          visible={headerVisible && !menuOpen}
          menuOpen={menuOpen}
          onOpenMenu={openMenu}
          activeId={activeId}
        />

        <main id="main" ref={mainRef} tabIndex={-1} className="outline-none">
          <Hero heroRef={heroRef} ready={ready} />
          <Services />
          <Industries />
          <HowWeWork />
          <About />
          <Contact />
        </main>

        <Footer />
      </div>

      <MobileMenu open={menuOpen} onClose={closeMenu} activeId={activeId} />
      {mounted && introPhase !== 'ready' && (
        <Intro onReveal={handleIntroReveal} onDone={handleIntroDone} />
      )}
    </ErrorCatcher>
  )
}
