import { describe, expect, it } from 'vitest'
import { setLang, site, T } from './site'

describe('i18n', () => {
  it('T picks the active language', () => {
    setLang('en')
    expect(T('a', 'b', 'c')).toBe('a')
    setLang('gu')
    expect(T('a', 'b', 'c')).toBe('b')
    setLang('hi')
    expect(T('a', 'b', 'c')).toBe('c')
    setLang('en')
  })

  it('every service ships non-empty copy in all 3 languages', () => {
    for (const lang of ['en', 'gu', 'hi'] as const) {
      setLang(lang)
      expect(site.services.items).toHaveLength(4)
      for (const item of site.services.items) {
        expect(item.title.trim(), `${lang}:${item.id}.title`).not.toBe('')
        expect(item.line.trim(), `${lang}:${item.id}.line`).not.toBe('')
        expect(item.href.startsWith('/'), `${item.id}.href`).toBe(true)
      }
    }
    setLang('en')
  })

  it('service hrefs match the page registry', async () => {
    const { ALL_PAGES } = await import('../lib/pages')
    setLang('en')
    for (const item of site.services.items) {
      expect(ALL_PAGES, `${item.id}.href`).toContain(item.href)
    }
  })
})
