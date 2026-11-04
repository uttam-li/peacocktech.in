import { assets } from '@lib/assets'

function markLoaded(el: HTMLImageElement | null): void {
  if (el && el.complete && el.naturalWidth > 0) el.classList.add('is-in')
}

/** Brand logo that fades in whether it loads before or after hydration. */
export default function BrandLogo({ alt, className }: { alt: string; className?: string }) {
  return (
    <picture>
      <source srcSet={assets.logo480Webp} type="image/webp" />
      <img
        src={assets.logo480Png}
        alt={alt}
        width="480"
        height="206"
        decoding="async"
        fetchPriority="high"
        className={className}
        ref={markLoaded}
        onLoad={(e) => e.currentTarget.classList.add('is-in')}
      />
    </picture>
  )
}
