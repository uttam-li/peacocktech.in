import { useEffect, useRef } from 'react'

/**
 * Plumage: a live canvas peacock fan. Two rows of feathers grow from the
 * centre outward, then lean toward the pointer. All continuous values live in
 * refs and the draw loop, never React state. Reduced motion draws one settled
 * frame. The loop pauses off-screen and waits for `ready` (intro finished).
 */

type RGB = [number, number, number]

const hex = (v: string): RGB => {
  const n = parseInt(v.trim().replace('#', ''), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

interface PlumageProps {
  ready: boolean
}

export default function Plumage({ ready }: PlumageProps) {
  const cvRef = useRef<HTMLCanvasElement>(null)
  const readyRef = useRef(ready)
  readyRef.current = ready

  useEffect(() => {
    const cv = cvRef.current!
    const host = cv.parentElement!
    const x = cv.getContext('2d')!

    const css = getComputedStyle(document.documentElement)
    const tok = (n: string): RGB => hex(css.getPropertyValue(n))
    const PAL: RGB[] = [tok('--color-forest'), tok('--color-green'), tok('--color-lime'), tok('--color-yellow')]
    const YEL = tok('--color-yellow').join(',')
    const EYE: Array<[number, number, string]> = [
      [2, 1.65, css.getPropertyValue('--color-yellow')],
      [1.62, 1.28, css.getPropertyValue('--color-lime')],
      [1.22, 0.95, css.getPropertyValue('--color-green')],
      [0.74, 0.55, css.getPropertyValue('--color-forest')],
      [0.3, 0.22, css.getPropertyValue('--color-ink-deep')],
    ]
    const RM = matchMedia('(prefers-reduced-motion: reduce)').matches
    // Weak phones get fewer, simpler feathers at 1x pixel ratio. They keep the interaction.
    const nav = navigator as Navigator & { deviceMemory?: number }
    const LITE = Boolean((nav.deviceMemory && nav.deviceMemory <= 4) || (nav.hardwareConcurrency && nav.hardwareConcurrency <= 4))
    const mixc = (u: number, a: number): string => {
      u = Math.max(0, Math.min(1, u)) * 3
      const i = Math.min(2, u | 0), f = u - i, p = PAL[i], q = PAL[i + 1]
      return `rgba(${p.map((v, k) => (v + (q[k] - v) * f) | 0)},${a})`
    }
    const ease = (u: number): number => 1 - Math.pow(1 - Math.min(1, Math.max(0, u)), 3)

    let W = 0, H = 0, mx = 0, my = 0, hv = 0, th = 0, t = RM ? 6 : 0, vis = true, raf = 0
    // Responsive feather budget (from the responsive prototype): counts scale
    // with aspect so narrow phones draw far fewer feathers, segments drop
    // below 700px, and length is fitted to the width. Theme palette untouched.
    let S1 = 3, S2 = 2.55, N1 = 23, N2 = 34, LEN = 600, B = 96, EK = 1
    const COARSE = matchMedia('(hover: none)').matches
    let touching = false
    const clamp = (v: number, a: number, b: number): number => Math.max(a, Math.min(b, v))

    function size(): void {
      const d = LITE ? 1 : Math.min(devicePixelRatio || 1, 2)
      W = cv.clientWidth; H = cv.clientHeight
      if (!W || !H) return
      cv.width = W * d; cv.height = H * d
      x.setTransform(d, 0, 0, d, 0, 0)
      const asp = W / H
      S1 = clamp(1.5 + ((asp - 0.6) / 0.9) * 1.5, 1.5, 3)
      S2 = S1 * 0.85
      N1 = Math.round(clamp(S1 * 7.7, 12, 23))
      N2 = Math.round(N1 * 1.48)
      const want = Math.min(H * 0.9, Math.max(W * 0.78, H * 0.6))
      let worst = 0.01
      for (let c = 0; c <= 1.001; c += 0.05) worst = Math.max(worst, (0.74 + 0.26 * (1 - c * c)) * 1.02 * Math.sin((c * S1) / 2))
      LEN = Math.min(want, ((W / 2) * 0.9) / worst)
      B = LITE ? 40 : W < 700 ? 56 : 96
      EK = W < 700 ? 1.3 : 1
    }

    function feather(bx: number, by: number, a: number, L: number, i: number, sw: number, al: number): void {
      if (L < 4) return
      const tx = bx + Math.cos(a) * L, ty = by + Math.sin(a) * L
      const cx = bx + Math.cos(a + sw) * L * 0.55, cy = by + Math.sin(a + sw) * L * 0.55
      const tg = [Math.cos(a), Math.sin(a)], nx = -tg[1], ny = tg[0], P: Array<[number, number, number]> = []
      for (let k = 0; k <= B; k++) {
        const u = k / B, p = (1 - u) * (1 - u), q = 2 * (1 - u) * u, r = u * u
        P.push([p * bx + q * cx + r * tx, p * by + q * cy + r * ty,
          L * 0.12 * (Math.sin(Math.min(u, 0.96) * Math.PI * 0.9) * 0.65 + 0.35) * (0.78 + 0.22 * Math.sin(k * 12.9 + i * 3))])
      }
      x.beginPath()
      for (let k = 0; k <= B; k++) { const q = P[k]; x[k ? 'lineTo' : 'moveTo'](q[0] - nx * q[2] * 0.9, q[1] - ny * q[2] * 0.9) }
      for (let k = B; k >= 0; k--) { const q = P[k]; x.lineTo(q[0] + nx * q[2] * 0.9, q[1] + ny * q[2] * 0.9) }
      x.closePath(); x.fillStyle = mixc(0.3 + 0.2 * Math.sin(t + i), 0.2 * al); x.fill()
      x.lineWidth = 1
      for (let b = 0; b < 6; b++) {
        x.beginPath()
        for (let k = Math.floor((b * B) / 6); k <= Math.floor(((b + 1) * B) / 6); k++) {
          const [px, py, w] = P[k]
          for (const sd of [-1, 1]) { x.moveTo(px, py); x.lineTo(px + sd * nx * w + tg[0] * w * 0.6, py + sd * ny * w + tg[1] * w * 0.6) }
        }
        const u = (b + 0.5) / 6
        x.strokeStyle = mixc(u * 0.72 + 0.1 * Math.sin(t * 1.1 + i * 0.6 + u * 4), al * (0.4 + 0.4 * u)); x.stroke()
      }
      x.strokeStyle = `rgba(${YEL},${0.5 * al})`; x.lineWidth = 1.3
      x.beginPath(); x.moveTo(bx, by); x.quadraticCurveTo(cx, cy, tx, ty); x.stroke()
      const R = L * 0.036 * EK, g = x.createRadialGradient(tx, ty, 0, tx, ty, R * 3.6)
      g.addColorStop(0, `rgba(${YEL},${0.3 * al})`); g.addColorStop(1, `rgba(${YEL},0)`)
      x.fillStyle = g; x.beginPath(); x.arc(tx, ty, R * 3.6, 0, 7); x.fill()
      x.globalAlpha = al
      for (const [a1, b1, c] of EYE) { x.fillStyle = c; x.beginPath(); x.ellipse(tx, ty, R * a1, R * b1, a, 0, 7); x.fill() }
      x.fillStyle = `rgba(${YEL},.4)`
      x.beginPath(); x.ellipse(tx - tg[0] * R * 0.12, ty - tg[1] * R * 0.12, R * 0.34, R * 0.22, a, 0, 7); x.fill()
      x.globalAlpha = 1
    }

    function row(n: number, spread: number, len: number, al: number, off: number, t0: number): void {
      const bx = W / 2, by = H * 1.01, ca = Math.atan2(my - by, mx - bx)
      for (let i = 0; i < n; i++) {
        const u = i / (n - 1), c = Math.abs(u - 0.5) * 2, g = ease((t - t0 - c * 1.1) / 1.7)
        let a = -Math.PI / 2 + (u - 0.5) * spread + off
        const d = a - ca
        a += hv * d * Math.exp(-d * d * 9) * 0.4
        const sw = Math.sin(t * 0.7 + i * 0.5 + off * 9) * 0.05 + (mx / W - 0.5) * 0.2 * hv
        feather(bx, by, a, len * (0.74 + 0.26 * (1 - c * c)) * (0.9 + 0.12 * Math.sin(i * 2.7 + off * 20)) * g, i, sw, al)
      }
    }

    function frame(): void {
      if (vis || RM) {
        if (COARSE && !touching) {
          mx = W / 2 + Math.sin(t * 0.55) * W * 0.38
          my = H * (0.42 + 0.1 * Math.sin(t * 0.4))
          th = 0.8
        }
        hv += (th - hv) * 0.06
        x.clearRect(0, 0, W, H)
        if (W) {
          row(LITE ? Math.min(N2, 16) : N2, S1, LEN * 0.78, 0.55, 0.045, 0.1)
          row(LITE ? Math.min(N1, 11) : N1, S2, LEN, 1, 0, 0.35)
        }
      }
      if (!RM && readyRef.current && vis) t += 0.016
      if (!RM) raf = requestAnimationFrame(frame)
    }

    const onMove = (e: PointerEvent): void => { const r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; th = 1 }
    const onLeave = (): void => { th = 0 }
    const onDown = (e: PointerEvent): void => { if (e.pointerType !== 'mouse') touching = true }
    const onUp = (): void => { touching = false; th = 0 }
    const io = new IntersectionObserver((e) => { vis = e[0].isIntersecting })
    const ro = new ResizeObserver(() => { size(); if (RM) frame() })

    size(); io.observe(host); ro.observe(host)
    host.addEventListener('pointermove', onMove); host.addEventListener('pointerleave', onLeave)
    host.addEventListener('pointerdown', onDown)
    host.addEventListener('pointerup', onUp); host.addEventListener('pointercancel', onUp)
    frame()
    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect()
      host.removeEventListener('pointermove', onMove); host.removeEventListener('pointerleave', onLeave)
      host.removeEventListener('pointerdown', onDown)
      host.removeEventListener('pointerup', onUp); host.removeEventListener('pointercancel', onUp)
    }
  }, [])

  return <canvas ref={cvRef} className="plumage" aria-hidden="true" />
}
