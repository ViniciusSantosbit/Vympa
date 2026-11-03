import type { ReactElement } from 'react'
import type { SegmentId } from '@/types/content'
import { heroContent } from '@/content/hero'
export function HeroBackground({
  selectedSegment,
}: {
  selectedSegment: SegmentId | null
}): ReactElement {
  const { image } = heroContent
  return (
    <div className="hero-background" aria-hidden="true">
      <picture>
        <source srcSet={image.src} type="image/webp" />
        <img
          className="hero-photo"
          src={image.fallback}
          alt=""
          width={image.width}
          height={image.height}
          fetchPriority="high"
          decoding="async"
        />
      </picture>
      {(['advocacia', 'contabilidade', 'imobiliarias'] as const).map((id) => (
        <div
          key={id}
          className={`hero-defocus hero-defocus--${id}`}
          data-active={selectedSegment === id}
        />
      ))}
      <div className="hero-shade" />
      {(['advocacia', 'contabilidade', 'imobiliarias'] as const).map((id) => (
        <div
          key={id}
          className={`hero-focus hero-focus--${id}`}
          data-active={selectedSegment === id}
        />
      ))}
    </div>
  )
}
