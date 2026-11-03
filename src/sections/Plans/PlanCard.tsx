import { useCardTilt } from '@/hooks/useCardTilt'
import './cardTilt.css'
import type { ReactElement } from 'react'
import type { SegmentId, Service } from '@/types/content'
import { contatos } from '@/content/contatos'
import { plansLabels } from '@/content/planos'
import { buildServiceMessage, buildWhatsAppUrl } from '@/lib/whatsapp'
export function PlanCard({
  service,
  segment,
}: {
  service: Service
  segment: SegmentId | null
}): ReactElement {
  const tiltRef = useCardTilt(
    service.id === 'servico-ia' ? '#16C8EC' : '#0BEC2F',
  )
  const variant = segment ? service.segmentos[segment] : null
  const title = variant?.titulo ?? service.nome
  const features = variant?.exemplos ?? service.entregas
  const contactUrl = buildWhatsAppUrl(
    contatos.whatsapp,
    buildServiceMessage(service.id, segment),
  )
  const titleId = service.id + '-title'
  const statusId = service.id + '-contact-status'
  return (
    <div
      className="plan-card-reveal"
      data-reveal
      data-reveal-delay={service.id === 'servico-ia' ? 0 : 100}
    >
      <article
        ref={tiltRef}
        className="plan-card"
        data-service={service.id}
        aria-labelledby={titleId}
      >
        <div className="plan-identity">
          <span>{service.nome}</span>
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {service.id === 'servico-ia' ? (
              <>
                <rect x="6" y="6" width="12" height="12" rx="3" />
                <path d="M9 1v3m6-3v3M9 20v3m6-3v3M1 9h3m-3 6h3m16-6h3m-3 6h3" />
                <path d="m12 8 1 3 3 1-3 1-1 3-1-3-3-1 3-1z" />
              </>
            ) : (
              <>
                <rect x="2" y="3" width="7" height="5" rx="1.5" />
                <rect x="15" y="16" width="7" height="5" rx="1.5" />
                <path d="M5.5 8v8a3 3 0 0 0 3 3H12m3-13h-3m3-3 3 3-3 3M9 5.5h9M12 16l3 3-3 3" />
              </>
            )}
          </svg>
        </div>
        <div className="plan-content">
          <h3 id={titleId}>{title}</h3>
          <p className="plan-description">
            {variant?.descricao ?? service.descricao}
          </p>
          <p className="plan-list-label">
            {variant ? plansLabels.applications : plansLabels.deliveries}
          </p>
          <ul className="plan-features">
            {features.map((feature) => (
              <li key={feature}>
                <span aria-hidden="true">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="plan-contact">
          {contactUrl ? (
            <a
              className="plan-cta"
              href={contactUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={service.chamadaContato + ': ' + title}
            >
              {service.chamadaContato}
              <span aria-hidden="true">↗</span>
            </a>
          ) : (
            <>
              <button
                className="plan-cta"
                type="button"
                disabled
                aria-label={service.chamadaContato + ': ' + title}
                aria-describedby={statusId}
              >
                {service.chamadaContato}
                <span aria-hidden="true">↗</span>
              </button>
              <p id={statusId} className="plan-contact-status">
                {plansLabels.unavailable}
              </p>
            </>
          )}
        </div>
      </article>
    </div>
  )
}
