import type { CSSProperties } from 'react'

/**
 * Inline styles that set brand custom properties (e.g. `--i`,
 * `--intro-progress`) alongside standard CSS. Build the value with
 * `cssVars` — never `as`:
 *
 *   style={cssVars({ '--i': 0 })}
 */
export interface CSSVars extends CSSProperties {
  [key: `--${string}`]: string | number | undefined
}

export function cssVars(vars: Record<`--${string}`, string | number>): CSSVars {
  return vars
}
