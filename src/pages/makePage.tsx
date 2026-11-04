import ErrorCatcher from '@ui/ErrorCatcher'
import { useState } from 'react'
import type { ComponentType } from 'react'
import { useLangUpgrade } from '@hooks/useLang'
import { useSlowNotice } from '@hooks/useSlowNotice'
import { useSmartPrefetch } from '@hooks/useSmartPrefetch'
import { otherPages } from '@lib/pages'
import { T } from '@data/site'
import Header from '@layout/Header'
import Footer from '@layout/Footer'
import MobileMenu from '@layout/MobileMenu'

/**
 * Shared shell for every subpage: identical skip link, header, mobile menu,
 * page content and footer wiring. Only the content component and its slug
 * (for prefetch lists) differ.
 */
export function makePage(Page: ComponentType, slug: string): ComponentType {
  return function App() {
    const [menuOpen, setMenuOpen] = useState(false)
    useLangUpgrade()
    useSlowNotice()
    useSmartPrefetch(otherPages(slug))
    return (
      <ErrorCatcher>
        <a className="skip-link" href="#top">{T('Skip to content', 'મુખ્ય સામગ્રી પર જાઓ', 'मुख्य सामग्री पर जाएँ')}</a>
        <Header
          visible={!menuOpen}
          menuOpen={menuOpen}
          onOpenMenu={() => setMenuOpen(true)}
          activeId=""
          linkPrefix="./"
        />
        <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} activeId="" linkPrefix="./" />
        <Page />
        <Footer />
      </ErrorCatcher>
    )
  }
}
