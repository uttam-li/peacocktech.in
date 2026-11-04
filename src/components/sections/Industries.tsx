import { useEffect, useRef } from 'react'
import { useReveal } from '@hooks/useReveal'
import { site } from '@data/site'
import artDiamondRing from '../../assets/industries/diamond-ring-green.png'
import artDiamondRingWebp from '../../assets/industries/diamond-ring-green.webp'
import artDiamondRingAvif from '../../assets/industries/diamond-ring-green.avif'
import artDiamondRingWebp2x from '../../assets/industries/diamond-ring-green-2x.webp'
import artDiamondRingAvif2x from '../../assets/industries/diamond-ring-green-2x.avif'
import artJewellery from '../../assets/industries/jewellery-necklace.png'
import artJewelleryWebp from '../../assets/industries/jewellery-necklace.webp'
import artJewelleryAvif from '../../assets/industries/jewellery-necklace.avif'
import artJewelleryWebp2x from '../../assets/industries/jewellery-necklace-2x.webp'
import artJewelleryAvif2x from '../../assets/industries/jewellery-necklace-2x.avif'
import artErpLaptop from '../../assets/industries/erp-laptop.png'
import artErpLaptopWebp from '../../assets/industries/erp-laptop.webp'
import artErpLaptopAvif from '../../assets/industries/erp-laptop.avif'
import artErpLaptopWebp2x from '../../assets/industries/erp-laptop-2x.webp'
import artErpLaptopAvif2x from '../../assets/industries/erp-laptop-2x.avif'
import artSmeBuildings from '../../assets/industries/sme-buildings.png'
import artSmeBuildingsWebp from '../../assets/industries/sme-buildings.webp'
import artSmeBuildingsAvif from '../../assets/industries/sme-buildings.avif'
import artSmeBuildingsWebp2x from '../../assets/industries/sme-buildings-2x.webp'
import artSmeBuildingsAvif2x from '../../assets/industries/sme-buildings-2x.avif'

const ART = [artDiamondRing, artJewellery, artErpLaptop, artSmeBuildings]
const ART_WEBP = [artDiamondRingWebp, artJewelleryWebp, artErpLaptopWebp, artSmeBuildingsWebp]
const ART_AVIF = [artDiamondRingAvif, artJewelleryAvif, artErpLaptopAvif, artSmeBuildingsAvif]
const ART_WEBP2X = [artDiamondRingWebp2x, artJewelleryWebp2x, artErpLaptopWebp2x, artSmeBuildingsWebp2x]
const ART_AVIF2X = [artDiamondRingAvif2x, artJewelleryAvif2x, artErpLaptopAvif2x, artSmeBuildingsAvif2x]
const ART_DIMS = [[365, 465], [468, 480], [480, 387], [365, 480]]

export default function Industries() {
  const { services } = site
  const cardsRef = useRef<Array<HTMLDivElement | null>>([])
  const secRef = useReveal()

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const items = cardsRef.current
      .filter((el): el is HTMLDivElement => el instanceof HTMLDivElement)
      .map((el) => ({ el, r: el.querySelector<HTMLElement>('.fc-right'), l: el.querySelector<HTMLElement>('.fc-left'), cur: null as number | null, low: 1 }))
    if (items.length === 0) return
    const sec = secRef.current
    const target = (o: { el: HTMLElement }): number => {
      const vh = window.innerHeight || 1
      const R = vh * 0.07
      const e = o.el.getBoundingClientRect().bottom
      const p = (e - (vh - R)) / R
      return p < 0 ? 0 : p > 1 ? 1 : p
    }
    const ease = (x: number): number => 1 - Math.pow(1 - x, 3)
    let raf = 0
    let visible = true
    const paint = (o: { r: HTMLElement | null; l: HTMLElement | null; cur: number | null }): void => {
      if (o.cur === null) return
      // Mobile (stacked ticket): same book-opening as desktop, adapted to the
      // vertical stack — the image stub stays fixed while the text panel
      // unfolds downward from the joint edge.
      if (window.matchMedia('(max-width: 760px)').matches) {
        if (o.r) o.r.style.transform = ''
        if (o.l) o.l.style.transform = `rotateX(${(ease(o.cur) * -90).toFixed(2)}deg)`
        return
      }
      if (o.l) o.l.style.transform = ''
      if (o.r) o.r.style.transform = `rotateY(${(ease(o.cur) * 180).toFixed(2)}deg)`
    }
    const tick = (): void => {
      raf = 0
      let settled = true
      items.forEach((o) => {
        const t = reduce ? 0 : target(o)
        if (t < o.low) o.low = t
        if (o.cur === null) o.cur = t
        o.cur += (o.low - o.cur) * 0.16
        if (Math.abs(o.low - o.cur) < 0.001) o.cur = o.low
        else settled = false
        paint(o)
      })
      if (!settled && visible) raf = window.requestAnimationFrame(tick)
    }
    const kick = (): void => {
      if (!raf) raf = window.requestAnimationFrame(tick)
    }
    const onScroll = (): void => { if (visible) kick() }
    window.addEventListener('scroll', onScroll, { passive: true })
    let io: IntersectionObserver | null = null
    if (sec) {
      io = new IntersectionObserver(
        (entries) => {
          visible = entries[0].isIntersecting
          if (visible) kick()
        },
        { threshold: 0 },
      )
      io.observe(sec)
    }
    kick()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (io) io.disconnect()
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [])

  const list = services.industries.filter((i) => !i.quiet)
  return (
    <section id="industries" className="industries sec" aria-labelledby="industries-title" ref={secRef}>
      <div className="wrap">
        <header>
          <h2 className="sec-title ih-rv" id="industries-title">
            {`${services.industriesTitleLead} `}<em>{services.industriesTitleAccent}</em>
          </h2>
          <p className="sec-lede ih-rv">{services.industriesLede}</p>
        </header>
        <div className="fgrid">
          {list.map((ind, index) => (
            <div
              className="fc"
              key={ind.id}
              ref={(el) => { cardsRef.current[index] = el }}
            >
              <div className="fp fc-right"><picture><source srcSet={`${ART_AVIF[index % ART_AVIF.length]} 1x, ${ART_AVIF2X[index % ART_AVIF2X.length]} 2x`} type="image/avif" /><source srcSet={`${ART_WEBP[index % ART_WEBP.length]} 1x, ${ART_WEBP2X[index % ART_WEBP2X.length]} 2x`} type="image/webp" /><img src={ART[index % ART.length]} width={ART_DIMS[index % ART_DIMS.length][0]} height={ART_DIMS[index % ART_DIMS.length][1]} loading="lazy" decoding="async" alt="" aria-hidden="true" draggable={false} /></picture></div>
              <div className="fp fc-left">
                <div>
                  <h3 id={`industry-${ind.id}`}>{ind.title}</h3>
                  <p>{ind.line}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
