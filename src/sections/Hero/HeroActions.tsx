import type { ReactElement } from 'react'
import { heroContent } from '@/content/hero'
import { contatoInicial, jornadas } from '@/content/jornadas'
import { commercialContact } from '@/lib/commercialContact'
import type { SegmentId } from '@/types/content'
import { SectionLink } from '@/components/common/SectionLink'
export function HeroActions({
  segment,
}: {
  segment: SegmentId | null
}): ReactElement {
  const { actions } = heroContent
  const contactUrl = segment ? commercialContact(segment) : null
  return (
    <div className="hero-actions-block">
      <div className="hero-actions">
        {contactUrl && segment ? (
          <a
            className="hero-action hero-action--primary"
            href={contactUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-describedby="hero-contact-note"
          >
            {jornadas[segment].chamada}
          </a>
        ) : (
          <SectionLink
            className="hero-action hero-action--primary"
            section="planos"
          >
            {actions.primary}
          </SectionLink>
        )}
        <SectionLink
          className="hero-action hero-action--secondary"
          section={segment ? 'planos' : 'como-funciona'}
        >
          {segment ? 'Ver exemplo' : actions.secondary}
          <span aria-hidden="true">↗</span>
        </SectionLink>
      </div>
      {contactUrl && (
        <p id="hero-contact-note" className="hero-contact-note">
          {contatoInicial}
        </p>
      )}
    </div>
  )
}
