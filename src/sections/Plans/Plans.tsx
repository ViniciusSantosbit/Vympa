import type { ReactElement } from 'react'
import { proposalsContent } from '@/content/navigation'
import { planos, plansLabels } from '@/content/planos'
import { useSegment } from '@/features/segment-selection/useSegment'
import { PlanCard } from './PlanCard'
import './plans.css'
export function Plans(): ReactElement {
  const { selectedSegment } = useSegment()
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
      <div className="plans-grid">
        {planos.map((service) => (
          <PlanCard
            key={service.id}
            service={service}
            segment={selectedSegment}
          />
        ))}
      </div>
      <div className="plans-notes">
        <p>{plansLabels.scope}</p>
        <p>{plansLabels.authorizedUse}</p>
      </div>
    </section>
  )
}
