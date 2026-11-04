import { lang, T } from '@data/site'
import type { Lang } from '@data/site'

const OPTIONS: Array<[Lang, string]> = [['en', 'EN'], ['gu', 'ગુ'], ['hi', 'हि']]

/** Reloads with ?lang=. Content resolves once at load, so no per-component refactor is needed. */
export default function LangSwitch() {
  return (
    <nav className="lang-switch" aria-label={T('Language', 'ભાષા', 'भाषा')}>
      {OPTIONS.map(([code, label]) => (
        <a key={code} href={`?lang=${code}`} lang={code} aria-current={code === lang ? 'true' : undefined}>{label}</a>
      ))}
    </nav>
  )
}
