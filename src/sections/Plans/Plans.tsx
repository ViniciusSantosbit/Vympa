import type { ReactElement } from 'react'
import { proposalsContent } from '@/content/navigation'
import { demonstracaoLabel, etapasLabels, jornadas } from '@/content/jornadas'
import { planos, plansLabels } from '@/content/planos'
import { useSegment } from '@/features/segment-selection/useSegment'
import { PlanCard } from './PlanCard'
import { SegmentVisualAccent } from './SegmentVisualAccent'
import './plans.css'
export function Plans(): ReactElement {
  const { selectedSegment } = useSegment()
  const journey = selectedSegment ? jornadas[selectedSegment] : null
  return (
    <section
      id="planos"
      className="proposals-section"
      aria-labelledby="planos-title"
      data-segment={selectedSegment ?? 'geral'}
    >
      <div className="section-copy" data-section-anchor>
        <p className="section-eyebrow">{proposalsContent.eyebrow}</p>
        <h2 data-reveal id="planos-title" tabIndex={-1}>
          {selectedSegment
            ? proposalsContent.titles[selectedSegment]
            : proposalsContent.title}
        </h2>
        <p data-reveal data-reveal-delay="90" className="section-description">
          {selectedSegment
            ? proposalsContent.descriptions[selectedSegment]
            : proposalsContent.description}
        </p>
      </div>
      {journey && (
        <section className="plans-demo" aria-labelledby="plans-demo-title">
          <p className="section-eyebrow">{demonstracaoLabel}</p>
          <h3 id="plans-demo-title">{journey.demonstracao}</h3>
          <ol>
            {journey.etapas.map((step, index) => (
              <li key={step}>
                <strong>{etapasLabels[index]}</strong>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </section>
      )}
      <div className="plans-grid">
        {planos.map((service) => (
          <PlanCard
            key={service.id}
            service={service}
            segment={selectedSegment}
          />
        ))}
        <SegmentVisualAccent segment={selectedSegment} />
      </div>
      <div className="plans-notes">
        <p>{plansLabels.scope}</p>
        <p>{plansLabels.authorizedUse}</p>
      </div>
    </section>
  )
}
