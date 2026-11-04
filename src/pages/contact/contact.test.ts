import { describe, expect, it } from 'vitest'
import { isHoneypotFilled } from './ContactPage'
import { SITE_URL, WHATSAPP_NUMBER } from '@data/site'

function fd(entries: Array<[string, string]>): FormData {
  const f = new FormData()
  for (const [k, v] of entries) f.append(k, v)
  return f
}

describe('contact form', () => {
  it('ignores empty or missing honeypot field', () => {
    expect(isHoneypotFilled(fd([]))).toBe(false)
    expect(isHoneypotFilled(fd([['website', '']]))).toBe(false)
    expect(isHoneypotFilled(fd([['website', '   ']]))).toBe(false)
  })

  it('flags a filled honeypot field as spam', () => {
    expect(isHoneypotFilled(fd([['website', 'http://spam.example']]))).toBe(true)
  })

  it('ships the confirmed production domain and WhatsApp number', () => {
    expect(SITE_URL).toBe('https://peacocktech.in')
    expect(WHATSAPP_NUMBER).toBe('919879100230')
  })
})
