import { useCallback, useEffect, useRef, useState } from 'react'
import type { SyntheticEvent } from 'react'
import { assets } from '@lib/assets'
import { T } from '@data/site'
import { cssVars } from '@lib/style'
import { isSaveData, isSlowNetwork } from '@lib/network'
import { MEDIA_QUERIES } from '@constants/index'


/** Every path that can release the page. New callers extend this union. */
type IntroRevealReason =
  | 'skip'
  | 'ended'
  | 'error'
  | 'source-error'
  | 'autoplay-blocked'
  | 'reduced-motion'
  | 'timeout'
  | 'slow-network'
  | 'no-video'

type IntroPhase = 'playing' | 'ending' | 'fading' | 'gone'

interface IntroProps {
  onReveal: () => void
  onDone: () => void
}

/**
 * Full-screen studio film. It never traps the page: skip, autoplay refusal,
 * a media error, reduced-motion, and a 10s stall all reveal the site.
 */
export default function Intro({ onReveal, onDone }: IntroProps) {
  const wideRef = useRef<HTMLVideoElement | null>(null)
  const portraitRef = useRef<HTMLVideoElement | null>(null)
  const introRef = useRef<HTMLDivElement | null>(null)
  const activeRef = useRef<HTMLVideoElement | null>(null)
  const pendingSeek = useRef(0)
  const fillCanvas = useRef<HTMLCanvasElement | null>(null)
  const fillContext = useRef<CanvasRenderingContext2D | null>(null)
  const fillFrame = useRef(0)
  const lastFill = useRef(0)
  const finished = useRef(false)
  const stallTimer = useRef(0)
  const timers = useRef<number[]>([])
  const onRevealRef = useRef(onReveal)
  const onDoneRef = useRef(onDone)
  const [phase, setPhase] = useState<IntroPhase>('playing')
  const [progress, setProgress] = useState(0)
  const [clock, setClock] = useState('00:04')
  const [status, setStatus] = useState(T('Studio intro playing. A skip control is available.', 'સ્ટુડિયો ઇન્ટ્રો ચાલી રહ્યો છે. સ્કિપ ઉપલબ્ધ છે.', 'स्टूडियो इंट्रो चल रहा है। स्किप उपलब्ध है.'))

  useEffect(() => {
    onRevealRef.current = onReveal
    onDoneRef.current = onDone
  }, [onReveal, onDone])

  const reveal = useCallback((reason: IntroRevealReason): void => {
    if (finished.current) return
    finished.current = true

    if (stallTimer.current) window.clearTimeout(stallTimer.current)
    stallTimer.current = 0
    timers.current.forEach((timer) => window.clearTimeout(timer))
    timers.current = []

    setProgress(1)
    setStatus(T('Intro complete. The site is ready.', 'ઇન્ટ્રો પૂર્ણ. સાઇટ તૈયાર છે.', 'इंट्रो पूरा। साइट तैयार है.'))

    const reduce = window.matchMedia(MEDIA_QUERIES.reduce).matches
    const naturalEnd = reason === 'ended' && !reduce
    setPhase(naturalEnd ? 'ending' : 'fading')
    onRevealRef.current?.()

    const hold = naturalEnd ? 150 : 0
    const fadeOut = window.setTimeout(() => setPhase('fading'), hold)
    const finish = window.setTimeout(() => {
      setPhase('gone')
      onDoneRef.current?.()
    }, hold + (reduce ? 0 : 750))

    timers.current.push(fadeOut, finish)
  }, [])

  const setClockFrom = useCallback((el: HTMLVideoElement): void => {
    if (!Number.isFinite(el.duration)) return
    setClock(`00:${String(Math.max(1, Math.ceil(el.duration))).padStart(2, '0')}`)
  }, [])

  const syncFill = useCallback((): void => {
    const el = activeRef.current
    const context = fillContext.current
    const overlay = introRef.current
    if (!el || !context || !overlay || el.readyState < 2) return

    const now = performance.now()
    if (now - lastFill.current < 100) return
    lastFill.current = now

    try {
      context.drawImage(el, 8, 8, 8, 8, 0, 0, 1, 1)
      const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data
      if (a) overlay.style.setProperty('--intro-fill', `rgb(${r} ${g} ${b})`)
    } catch {
      // A blocked frame should leave the white ground in place.
    }
  }, [])

  const followFill = useCallback(function follow(): void {
    fillFrame.current = 0
    const el = activeRef.current
    if (!el || el.paused || el.ended || finished.current) return
    syncFill()
    fillFrame.current = window.requestAnimationFrame(follow)
  }, [syncFill])

  const clearStall = useCallback((): void => {
    if (stallTimer.current) window.clearTimeout(stallTimer.current)
    stallTimer.current = 0
  }, [])

  const watchStall = useCallback((): void => {
    clearStall()
    stallTimer.current = window.setTimeout(() => {
      if (!finished.current) reveal('timeout')
    }, 3000)
  }, [clearStall, reveal])

  const startPlayback = useCallback((): void => {
    const el = activeRef.current
    if (!el) {
      reveal('no-video')
      return
    }

    el.preload = 'auto'

    if (pendingSeek.current > 0) {
      const seek = (): void => {
        const end = Number.isFinite(el.duration) ? el.duration - 0.06 : 0
        try {
          el.currentTime = Math.max(0, Math.min(pendingSeek.current, end))
        } catch {
          // Leave the cut at its start if the frame cannot be located.
        }
        pendingSeek.current = 0
      }

      if (el.readyState >= 1) seek()
      else el.addEventListener('loadedmetadata', seek, { once: true })
    }

    try {
      const playback = el.play()
      if (playback && typeof playback.catch === 'function') {
        playback.catch(() => {
          if (finished.current) return
          const timer = window.setTimeout(() => reveal('autoplay-blocked'), 1000)
          timers.current.push(timer)
        })
      }
    } catch {
      const timer = window.setTimeout(() => reveal('autoplay-blocked'), 100)
      timers.current.push(timer)
    }
  }, [reveal])

  useEffect(() => {
    fillCanvas.current = document.createElement('canvas')
    fillCanvas.current.width = 1
    fillCanvas.current.height = 1
    fillContext.current = fillCanvas.current.getContext('2d', { willReadFrequently: true })

    const small = window.matchMedia(MEDIA_QUERIES.small)
    const reduce = window.matchMedia(MEDIA_QUERIES.reduce)
    activeRef.current = small.matches ? portraitRef.current : wideRef.current

    if (reduce.matches) {
      setProgress(1)
      setStatus(T('Reduced motion: showing the studio mark. The site will open shortly.', 'ઓછી ગતિ: સ્ટુડિયો માર્ક બતાવી રહ્યા છીએ. સાઇટ થોડીવારમાં ખૂલશે.', 'कम गति: स्टूडियो चिह्न दिखा रहे हैं। साइट थोड़ी देर में खुलेगी.'))
      const timer = window.setTimeout(() => reveal('reduced-motion'), 1200)
      timers.current.push(timer)
    } else if (isSaveData()) {
      const timer = window.setTimeout(() => reveal('slow-network'), 900)
      timers.current.push(timer)
    } else if (isSlowNetwork()) {
      // 2G-class without Save-Data: poster frame only for 3s, no video
      // bytes at all — then straight home. (3G still gets the full film;
      // the stall guard below covers buffering.)
      const timer = window.setTimeout(() => reveal('slow-network'), 3000)
      timers.current.push(timer)
    } else if (document.visibilityState === 'hidden') {
      const timer = window.setTimeout(() => reveal('timeout'), 3000)
      timers.current.push(timer)
    } else {
      startPlayback()
    }

    const switchCut = (): void => {
      if (finished.current || reduce.matches) return
      const next = small.matches ? portraitRef.current : wideRef.current
      if (!next || next === activeRef.current) return

      pendingSeek.current = Number.isFinite(activeRef.current?.currentTime)
        ? (activeRef.current?.currentTime ?? 0)
        : 0

      try { activeRef.current?.pause() } catch { /* no-op */ }
      if (fillFrame.current) window.cancelAnimationFrame(fillFrame.current)
      fillFrame.current = 0

      activeRef.current = next
      introRef.current?.style.setProperty('--intro-fill', 'var(--color-white)')
      startPlayback()
    }

    small.addEventListener('change', switchCut)

    const hardTimer = window.setTimeout(() => reveal('timeout'), 10000)
    timers.current.push(hardTimer)

    return () => {
      timers.current.forEach((timer) => window.clearTimeout(timer))
      timers.current = []
      if (stallTimer.current) window.clearTimeout(stallTimer.current)
      stallTimer.current = 0
      if (fillFrame.current) window.cancelAnimationFrame(fillFrame.current)
      fillFrame.current = 0
      small.removeEventListener('change', switchCut)
      ;[wideRef.current, portraitRef.current].forEach((el) => {
        try { el?.pause() } catch { /* no-op */ }
      })
    }
  }, [reveal, startPlayback])

  if (phase === 'gone') return null

  const isActive = (event: SyntheticEvent<HTMLVideoElement>): boolean =>
    event.currentTarget === activeRef.current

  return (
    <div
      ref={introRef}
      className={`intro${phase === 'ending' ? ' is-ending' : ''}${phase === 'fading' ? ' is-fading' : ''}`}
      role="region"
      aria-label={T('Peacock Technotrics studio intro', 'Peacock Technotrics સ્ટુડિયો ઇન્ટ્રો', 'Peacock Technotrics स्टूडियो इंट्रो')}
      aria-hidden={phase !== 'playing'}
      inert={phase !== 'playing' ? true : undefined}
    >
      <video
        ref={wideRef}
        className="intro__video intro__video--wide"
        muted
        playsInline
        preload="none"
        poster={assets.loaderPosterWide}
        aria-hidden="true"
        tabIndex={-1}
        disablePictureInPicture
        onLoadedMetadata={(event) => {
          if (isActive(event)) setClockFrom(event.currentTarget)
        }}
        onLoadedData={(event) => {
          if (isActive(event)) syncFill()
        }}
        onTimeUpdate={(event) => {
          if (!isActive(event)) return
          clearStall()
          const el = event.currentTarget
          if (!Number.isFinite(el.duration) || el.duration <= 0) return
          setProgress(Math.min(1, Math.max(0, el.currentTime / el.duration)))
        }}
        onPlaying={(event) => {
          if (!isActive(event) || fillFrame.current) return
          clearStall()
          fillFrame.current = window.requestAnimationFrame(followFill)
        }}
        onWaiting={(event) => {
          if (isActive(event)) watchStall()
        }}
        onPause={(event) => {
          if (!isActive(event)) return
          if (fillFrame.current) window.cancelAnimationFrame(fillFrame.current)
          fillFrame.current = 0
        }}
        onEnded={(event) => { if (isActive(event)) reveal('ended') }}
        onError={(event) => { if (isActive(event)) reveal('error') }}
      >
        <source
          src={assets.loaderWideWebm}
          type="video/webm"
        />
        <source
          src={assets.loaderWide}
          type="video/mp4"
          onError={(event) => {
            if (event.currentTarget.parentElement === activeRef.current) reveal('source-error')
          }}
        />
      </video>

      <video
        ref={portraitRef}
        className="intro__video intro__video--portrait"
        muted
        playsInline
        preload="none"
        poster={assets.loaderPosterPortrait}
        aria-hidden="true"
        tabIndex={-1}
        disablePictureInPicture
        onLoadedMetadata={(event) => {
          if (isActive(event)) setClockFrom(event.currentTarget)
        }}
        onLoadedData={(event) => {
          if (isActive(event)) syncFill()
        }}
        onTimeUpdate={(event) => {
          if (!isActive(event)) return
          const el = event.currentTarget
          if (!Number.isFinite(el.duration) || el.duration <= 0) return
          setProgress(Math.min(1, Math.max(0, el.currentTime / el.duration)))
        }}
        onPlaying={(event) => {
          if (!isActive(event) || fillFrame.current) return
          clearStall()
          fillFrame.current = window.requestAnimationFrame(followFill)
        }}
        onWaiting={(event) => {
          if (isActive(event)) watchStall()
        }}
        onPause={(event) => {
          if (!isActive(event)) return
          if (fillFrame.current) window.cancelAnimationFrame(fillFrame.current)
          fillFrame.current = 0
        }}
        onEnded={(event) => { if (isActive(event)) reveal('ended') }}
        onError={(event) => { if (isActive(event)) reveal('error') }}
      >
        <source
          src={assets.loaderPortraitWebm}
          type="video/webm"
        />
        <source
          src={assets.loaderPortrait}
          type="video/mp4"
          onError={(event) => {
            if (event.currentTarget.parentElement === activeRef.current) reveal('source-error')
          }}
        />
      </video>

      <div className="intro__chrome intro__chrome--top" aria-hidden="true">
        <span>Peacock Technotrics</span>
        <span>{`${T('Studio intro', 'સ્ટુડિયો ઇન્ટ્રો', 'स्टूडियो इंट्रो')} `}<b>{clock}</b></span>
      </div>

      <div className="intro__chrome intro__chrome--bottom" aria-hidden="true">
        <span>{T('Software studio', 'સોફ્ટવેર સ્ટુડિયો', 'सॉफ़्टवेयर स्टूडियो')} · Surat, India</span>
      </div>

      <button className="intro__skip" type="button" onClick={() => reveal('skip')}>
        <span>{T('Skip intro', 'ઇન્ટ્રો છોડો', 'इंट्रो छोड़ें')}</span>
        <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path d="M3 13 13 3M6 3h7v7" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
        </svg>
      </button>

      <div
        className="intro__progress"
        aria-hidden="true"
        style={cssVars({ '--intro-progress': progress })}
      >
        <i />
      </div>

      <p className="sr-only" role="status">{status}</p>
    </div>
  )
}
