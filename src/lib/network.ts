/**
 * One shared network check. Every component that adapts to the user's
 * connection (video, animations, prefetch) reads from here so the rules
 * stay identical everywhere.
 */
export type EffectiveType = 'slow-2g' | '2g' | '3g' | '4g' | 'unknown'

interface NetworkInfo {
  readonly effectiveType?: string
  readonly saveData?: boolean
}

function info(): NetworkInfo | null {
  try {
    const nav = navigator as Navigator & { connection?: NetworkInfo }
    return nav.connection ?? null
  } catch {
    return null
  }
}

/** Explicit user choice to save data. Strongest signal; always respected. */
export function isSaveData(): boolean {
  return info()?.saveData === true
}

/** Effective network class reported by the browser. */
export function effectiveType(): EffectiveType {
  const t = info()?.effectiveType
  return t === 'slow-2g' || t === '2g' || t === '3g' || t === '4g' ? t : 'unknown'
}

/**
 * Slow when the user asked to save data or the network is 2G-class.
 * 3G still gets the full experience (video may buffer, stall guard covers it).
 */
export function isSlowNetwork(): boolean {
  const c = info()
  if (!c) return false
  if (c.saveData) return true
  return c.effectiveType === 'slow-2g' || c.effectiveType === '2g'
}

/** Fast enough to spend bytes early (prefetch, preload video). */
export function isFastNetwork(): boolean {
  const c = info()
  if (!c) return false
  if (c.saveData) return false
  return c.effectiveType === '4g'
}

/**
 * Cheap enough to prefetch the next page's HTML (~5-35KB).
 * Allowed on 3G/4G/unknown, blocked only on Save-Data or 2G-class.
 * Unlike isFastNetwork (4G-only, used for video), unknown means allow:
 * browsers without the Network Information API (Firefox/Safari)
 * must not lose prefetch.
 */
export function canPrefetch(): boolean {
  return !isSlowNetwork() && !isSaveData()
}
