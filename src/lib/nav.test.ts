import { describe, expect, it } from 'vitest'
import { joinPrefix } from './nav'

describe('joinPrefix', () => {
  it.each([
    ['./', 'about', './about'],
    ['./', '/about', '/about'],
    ['./', '', ''],
    ['./', 'https://wa.me/123', 'https://wa.me/123'],
    ['./', '#contact', './#contact'],
    ['/ai/', 'erp', '/ai/erp'],
  ])('joinPrefix(%s, %s) = %s', (prefix, href, expected) => {
    expect(joinPrefix(prefix, href)).toBe(expected)
  })

  it('never produces a doubled slash', () => {
    expect(joinPrefix('./', '/about')).not.toContain('//about')
  })
})
