import { describe, expect, it } from 'vitest'
import { deskReplyKind } from './AiPage'

describe('paperwork desk replies', () => {
  it('routes certificate questions to the cert reply', () => {
    expect(deskReplyKind('Verify GIA 6147281933.')).toBe('cert')
    expect(deskReplyKind('read this certificate please')).toBe('cert')
  })

  it('routes stone/parcel questions to the match reply', () => {
    expect(deskReplyKind('Does it match parcel A-118?')).toBe('match')
    expect(deskReplyKind('compare the stone')).toBe('match')
  })

  it('routes money questions to the price reply', () => {
    expect(deskReplyKind('What is the price today?')).toBe('price')
    expect(deskReplyKind('day bhav batao')).toBe('price')
  })

  it('routes human requests to the founder reply', () => {
    expect(deskReplyKind('Can I talk to the founder?')).toBe('talk')
    expect(deskReplyKind('i want a call')).toBe('talk')
  })

  it('greets short hellos only', () => {
    expect(deskReplyKind('hello')).toBe('hello')
    expect(deskReplyKind('namaste')).toBe('hello')
    expect(deskReplyKind('this is a machine for grading')).not.toBe('hello')
  })

  it('falls back for anything else', () => {
    expect(deskReplyKind('xyz random thing')).toBe('fallback')
    expect(deskReplyKind('')).toBe('fallback')
  })
})
