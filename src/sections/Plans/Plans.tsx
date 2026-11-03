import type { ReactElement } from 'react'
import { proposalsContent } from '@/content/navigation'
import { segmentos } from '@/content/segmentos'
import { useSegment } from '@/features/segment-selection/useSegment'
import './plans.css'
export function Plans(): ReactElement {
  const { selectedSegment } = useSegment()
  const segment = segmentos.find((item) => item.id === selectedSegment)
  return (
    <section
      id="planos"
      className="proposals-section"
      aria-labelledby="planos-title"
      data-segment={selectedSegment ?? 'geral'}
    >
      <div className="section-copy">
        <p className="section-eyebrow">{proposalsContent.eyebrow}</p>
        <h2 id="planos-title" tabIndex={-1}>
          {selectedSegment
            ? proposalsContent.titles[selectedSegment]
            : proposalsContent.title}
        </h2>
        <p className="section-description">{proposalsContent.description}</p>
        {segment && (
          <p className="proposals-context">{segment.descricaoApoio}</p>
        )}
      </div>
    </section>
  )
}
