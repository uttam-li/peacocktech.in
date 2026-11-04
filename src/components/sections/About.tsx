import { useLayoutEffect, useRef, useState } from 'react'
import { site } from '@data/site'
import { useReveal } from '@hooks/useReveal'

export default function About() {
  const { about, principles } = site
  const ref = useReveal()
  const [openIndex, setOpenIndex] = useState(0)
  const listRef = useRef<HTMLDivElement | null>(null)
  const copyRefs = useRef<Array<HTMLParagraphElement | null>>([])

  // Reserve the tallest copy height before paint. Equal panel sizes keep the
  // list height steady while one answer closes and the next opens, so Contact
  // below never shifts during the animation.
  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return undefined

    const updateHeight = (): void => {
      const heights = copyRefs.current
        .filter((node): node is HTMLParagraphElement => node !== null)
        .map((node) => node.scrollHeight)
      const tallest = Math.max(0, ...heights)
      list.style.setProperty('--principle-copy-height', `${tallest}px`)
    }

    updateHeight()
    const resize = new ResizeObserver(updateHeight)
    resize.observe(list)
    copyRefs.current.forEach((node) => { if (node) resize.observe(node) })
    return () => resize.disconnect()
  }, [])

  return (
    <section id="about" className="sec" aria-labelledby="about-title" ref={ref}>
      <div className="wrap about">
        <div className="about__head">
          <h2 className="sec-title ab-rv" id="about-title">
            {`${about.titleLead} `}<em>{about.titleAccent}</em>
          </h2>
          <p className="sec-lede ab-rv">{about.lede}</p>
        </div>
        <div className="principle-list" ref={listRef} data-r>
          {principles.map((principle, index) => {
            const open = openIndex === index
            const panelId = `principle-panel-${principle.num}`
            const triggerId = `principle-trigger-${principle.num}`

            return (
              <div className="principle-item" key={principle.num}>
                <h3 className="principle-heading">
                  <button
                    type="button"
                    className="principle-summary"
                    id={triggerId}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(index)}
                  >
                    <span className="mono-label principle-summary__num">{principle.num}</span>
                    <span className="principle-summary__title">{principle.title}</span>
                    <span className="principle-summary__icon" aria-hidden="true" />
                  </button>
                </h3>
                <div
                  className="principle-panel"
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  aria-hidden={!open}
                  data-open={open}
                  inert={!open ? true : undefined}
                >
                  <div className="principle-panel__clip">
                    <div className="principle-panel__sizer">
                      <p
                        className="principle-copy"
                        ref={(node) => { copyRefs.current[index] = node }}
                      >
                        {principle.body}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
