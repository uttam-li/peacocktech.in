import { site, T } from '@data/site'
import { useReveal } from '@hooks/useReveal'
import { cssVars } from '@lib/style'
import Arrow from '@ui/Arrow'

export default function Contact() {
  const { contact } = site
  const ref = useReveal()

  return (
    <section id="contact" className="sec" aria-labelledby="contact-title" ref={ref}>
      <div className="wrap brief-compact">
        <div>
          <h2 className="sec-title ct-rv" id="contact-title">
            {`${contact.titleLead} `}<em>{contact.titleAccent}</em>
          </h2>
          <p className="sec-lede ct-rv">{contact.lede}</p>
        </div>
        <div className="brief-cta-row" data-r style={cssVars({ '--i': 2 })}>
          <a className="hero-btn" href={site.cta.href}><span>{site.cta.label}</span><Arrow /></a>
          <p className="brief-inline-meta">
            <span>{`${T('Studio', 'સ્ટુડિયો', 'स्टूडियो')} · ${site.location}`}</span>
            <span>{`${T('Working', 'કાર્ય', 'कार्य')} · ${site.working}`}</span>
          </p>
        </div>
      </div>
    </section>
  )
}
