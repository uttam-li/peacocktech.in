import { site, T, SOCIAL_LINKEDIN, SOCIAL_GITHUB } from '@data/site'
import LangSwitch from '@ui/LangSwitch'

const SOCIALS = [
  {
    label: 'LinkedIn',
    href: SOCIAL_LINKEDIN,
    path: 'M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45z',
  },
  {
    label: 'GitHub',
    href: SOCIAL_GITHUB,
    path: 'M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.15c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.53-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12v3.15c0 .3.21.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z',
  },
]

export default function Footer() {
  return (
    <footer className="site-footer border-t border-line bg-paper">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 pt-8 pb-[max(2rem,env(safe-area-inset-bottom))] sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[42ch] font-serif text-[clamp(1.1rem,1.7vw,1.4rem)] leading-snug tracking-[-.02em]">
          {site.tagline}
        </p>
        <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
          <LangSwitch />
          {SOCIALS.map((s) =>
            s.href ? (
              <a
                key={s.label}
                className="inline-grid min-h-11 min-w-11 place-items-center text-muted transition-colors hover:text-green-deep"
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${s.label} profile`}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d={s.path} /></svg>
              </a>
            ) : (
              <span
                key={s.label}
                role="img"
                className="inline-grid min-h-11 min-w-11 place-items-center text-muted opacity-60"
                title={`${s.label} link coming soon`}
                aria-label={`${s.label} (link coming soon)`}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d={s.path} /></svg>
              </span>
            ),
          )}
          <p className="mono-label text-muted">{`© 2026 ${site.name}`}</p>
          <a className="mono-label inline-flex min-h-11 items-center gap-2 text-ink transition-colors hover:text-green-deep" href="#top">
            {`${T('Back to top', 'ઉપર જાઓ', 'ऊपर जाएँ')} `}<span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
      <p className="mono-label mx-auto w-full max-w-[1440px] pb-6 text-muted">{T('Form details are used only to reply to your inquiry.', 'ફોર્મની વિગતો ફક્ત તમારી પૂછપરછનો જવાબ આપવા માટે વપરાય છે.', 'फ़ॉर्म का विवरण केवल आपकी पूछताछ का उत्तर देने के लिए उपयोग किया जाता है.')}</p>
    </footer>
  )
}
