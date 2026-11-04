import type { RefObject } from 'react'
import { site, T, withLang } from '@data/site'
import { cssVars } from '@lib/style'
import Plumage from '@ui/Plumage'
import LangSwitch from '@ui/LangSwitch'
import BrandLogo from '@ui/BrandLogo'

interface HeroProps {
  heroRef: RefObject<HTMLElement | null>
  ready: boolean
}

export default function Hero({ heroRef, ready }: HeroProps) {
  return (
    <section className="hero" id="top" ref={heroRef} aria-labelledby="hero-title">
      <Plumage ready={ready} />

      <div className="hero-bar">
        <a className="brand-plate" href="#top" aria-label={T('Peacock Technotrics home', 'Peacock Technotrics હોમ', 'Peacock Technotrics होम')}>
          <BrandLogo alt="" />
        </a>
        <span className="hero-loc">Surat, India <span className="loc-sep" aria-hidden="true" />{` ${T('Working worldwide', 'વિશ્વભરમાં કાર્યરત', 'दुनियाभर में कार्यरत')}`}</span>
        <LangSwitch />
      </div>

      <div className="hero-veil" aria-hidden="true" />

      <div className="hero-copy">
        <h1 className="hero-title hero-rv" id="hero-title" style={cssVars({ '--i': 0 })}>
          {`${site.hero.lead} `}<em>{site.hero.accent}</em>
        </h1>
        <p className="hero-sub hero-rv" style={cssVars({ '--i': 1 })}>
          {site.hero.sub}
        </p>
        <a className="hero-btn hero-rv" style={cssVars({ '--i': 2 })} href={withLang('/contact')} >
          <span>{T('Start your project', 'તમારો પ્રોજેક્ટ શરૂ કરો', 'अपना प्रोजेक्ट शुरू करें')}</span>
          <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" width="16" height="16">
            <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
          </svg>
        </a>
      </div>
    </section>
  )
}
