import { describe, expect, it } from 'vitest'
import { ALL_PAGES, otherPages } from './pages'

describe('page registry', () => {
  it('lists all 7 clean-URL pages', () => {
    expect(ALL_PAGES).toEqual([
      '/',
      '/about',
      '/ai',
      '/erp',
      '/contact',
      '/mobile-app',
      '/ux-design',
    ])
  })

  it('otherPages drops only the current page', () => {
    for (const page of ALL_PAGES) {
      const rest = otherPages(page)
      expect(rest).toHaveLength(ALL_PAGES.length - 1)
      expect(rest).not.toContain(page)
    }
  })

  it('every page is prefetched from somewhere', () => {
    for (const page of ALL_PAGES) {
      const others = ALL_PAGES.filter((p) => p !== page)
      for (const other of others) {
        expect(otherPages(other)).toContain(page)
      }
    }
  })
})
