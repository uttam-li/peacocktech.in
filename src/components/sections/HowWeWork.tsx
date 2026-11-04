import { site, T } from '@data/site'
import { useReveal } from '@hooks/useReveal'
import { cssVars } from '@lib/style'

/** Every glyph the pipeline can draw. New glyphs extend the switch below. */
type PipeGlyph = 'dot' | 'box' | 'check' | 'doc'

interface PipeEnd {
  label: string
  glyph: PipeGlyph
}

interface PipeNodeProps extends PipeEnd {
  x: number
  y: number
  accent: string
}

function PipeGlyphMark({ x, y, accent, glyph }: PipeNodeProps) {
  switch (glyph) {
    case 'dot':
      return <circle cx={x + 38} cy={y + 15} r="6" fill={accent} />
    case 'box':
      return <rect x={x + 32} y={y + 9} width="12" height="12" rx="2" fill={accent} />
    case 'check':
      return <path d={`M${x + 32} ${y + 15}l4.5 4.5L${x + 45} ${y + 8}`} stroke={accent} strokeWidth="2.4" strokeLinecap="square" />
    case 'doc':
      return <path d={`M${x + 33} ${y + 8}h8l4 4v10h-12z`} stroke={accent} strokeWidth="1.8" strokeLinejoin="round" />
    default: {
      const _exhaustive: never = glyph
      return _exhaustive
    }
  }
}

function PipeNode({ x, y, accent, label, glyph }: PipeNodeProps) {
  return (
    <g>
      <rect x={x} y={y} width="76" height="48" rx="11" fill="color-mix(in srgb, var(--color-pearl) 5%, transparent)" stroke={accent} strokeWidth="1.6" />
      <PipeGlyphMark x={x} y={y} accent={accent} label={label} glyph={glyph} />
      <text x={x + 38} y={y + 39} textAnchor="middle" fill="var(--color-pearl)" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600" letterSpacing="1">{label}</text>
    </g>
  )
}

interface PipeFlowData {
  accent: string
  input: PipeEnd
  center: PipeEnd
  /** A pipeline always splits into exactly two outputs. */
  outs: [PipeEnd, PipeEnd]
}

interface PipeFlowProps {
  accent: string
  flow: Pick<PipeFlowData, 'input' | 'center' | 'outs'>
}

function PipeFlow({ accent, flow }: PipeFlowProps) {
  return (
    <svg className="pw-pipe" viewBox="0 0 300 190" fill="none" style={cssVars({ '--pipe': accent })} role="img" aria-label={T('Sample working flow', 'નમૂનાનો કાર્યપ્રવાહ', 'नमूना कार्यप्रवाह')}>
      <path className="pw-pipe__flow" d="M84 95 H112" stroke="var(--pipe)" strokeWidth="1.6" />
      <circle cx="98" cy="95" r="4" stroke="var(--pipe)" strokeWidth="1.6" />
      <path className="pw-pipe__flow" d="M188 95 H204 V51 H216" stroke="var(--pipe)" strokeWidth="1.6" />
      <path className="pw-pipe__flow" d="M188 95 H204 V139 H216" stroke="var(--pipe)" strokeWidth="1.6" />
      <circle cx="204" cy="95" r="4" fill="var(--pipe)" />
      <PipeNode x={8} y={71} accent={accent} label={flow.input.label} glyph={flow.input.glyph} />
      <PipeNode x={112} y={71} accent={accent} label={flow.center.label} glyph={flow.center.glyph} />
      <PipeNode x={216} y={27} accent={accent} label={flow.outs[0].label} glyph={flow.outs[0].glyph} />
      <PipeNode x={216} y={115} accent={accent} label={flow.outs[1].label} glyph={flow.outs[1].glyph} />
    </svg>
  )
}


export default function HowWeWork() {
  const ref = useReveal()
  const { process } = site
  const pipeFlows: PipeFlowData[] = [
    { accent: 'var(--color-green-deep)', input: { label: T('INBOX', 'ઇનબોક્સ', 'इनबॉक्स'), glyph: 'dot' }, center: { label: T('MAP', 'મેપ', 'मैप'), glyph: 'box' }, outs: [{ label: T('FIELDS', 'ફીલ્ડ', 'फ़ील्ड'), glyph: 'check' }, { label: T('PLAN', 'પ્લાન', 'प्लान'), glyph: 'doc' }] },
    { accent: 'var(--color-green-deep)', input: { label: T('SPECS', 'સ્પેક', 'स्पेक'), glyph: 'doc' }, center: { label: T('BUILD', 'બિલ્ડ', 'बिल्ड'), glyph: 'box' }, outs: [{ label: T('TEST', 'ટેસ્ટ', 'टेस्ट'), glyph: 'check' }, { label: T('SHIP', 'શિપ', 'शिप'), glyph: 'dot' }] },
    { accent: 'var(--color-green-deep)', input: { label: T('SYSTEM', 'સિસ્ટમ', 'सिस्टम'), glyph: 'box' }, center: { label: T('HANDOVER', 'હેન્ડઓવર', 'हैंडओवर'), glyph: 'dot' }, outs: [{ label: T('DOCS', 'ડોક્સ', 'डॉक्स'), glyph: 'doc' }, { label: T('RUN', 'રન', 'रन'), glyph: 'check' }] },
  ]
  return (
    <section id="process" className="sec" aria-labelledby="process-title" ref={ref}>
      <div className="wrap pw-pil">
        <div className="pw-head">
          <h2 className="sec-title pw-rv" id="process-title">
            {`${process.titleLead} `}<em>{process.titleAccent}</em>
          </h2>
          <p className="sec-lede pw-rv">{process.lede}</p>
        </div>
        <div className="pw-cols">
          {process.steps.map((s, i) => (
            <article key={s.title} className="pw-col" data-r style={cssVars({ '--i': i + 2 })}>
              <PipeFlow accent={pipeFlows[i].accent} flow={pipeFlows[i]} />
              <span className="pw-pipe__cap" aria-hidden="true">{T('Sample flow', 'નમૂનાનો પ્રવાહ', 'नमूना प्रवाह')}</span>
              <span className="pw-col__n" aria-hidden="true">{`0${i + 1}`}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
