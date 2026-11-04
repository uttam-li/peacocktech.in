import { useEffect, useReducer } from 'react'
import { lang, resolveLang, setLang } from '@data/site'

/**
 * Upgrade English-first HTML to the stored language after hydration.
 * Server markup and first client render are always English, so hydration
 * matches; this effect then swaps to gu/hi with a normal update.
 */
export function useLangUpgrade(): void {
  const [, force] = useReducer((x: number) => x + 1, 0)
  useEffect(() => {
    const l = resolveLang()
    if (l !== lang) {
      setLang(l)
      force()
    }
  }, [force])
}
