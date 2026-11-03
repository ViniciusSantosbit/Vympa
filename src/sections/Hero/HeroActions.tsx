import type { ReactElement } from 'react'
import { heroContent } from '@/content/hero'
import { SectionLink } from '@/components/common/SectionLink'
export function HeroActions(): ReactElement {
  const { actions } = heroContent
  return (
    <div className="hero-actions-block">
      <div className="hero-actions">
        <SectionLink
          className="hero-action hero-action--primary"
          section="planos"
        >
          {actions.primary}
        </SectionLink>
        <SectionLink
          className="hero-action hero-action--secondary"
          section="como-funciona"
        >
          {actions.secondary}
          <span aria-hidden="true">↗</span>
        </SectionLink>
      </div>
    </div>
  )
}
