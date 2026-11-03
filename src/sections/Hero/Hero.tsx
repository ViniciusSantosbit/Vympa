import type { ReactElement } from 'react'
import { heroContent } from '@/content/hero'
import { segmentos } from '@/content/segmentos'
import { useSegment } from '@/features/segment-selection/useSegment'
import { HeroBackground } from './HeroBackground'
import { HeroActions } from './HeroActions'
import './hero.css'
export function Hero(): ReactElement {
  const { selectedSegment } = useSegment()
  const currentSegment = segmentos.find(
    (segment) => segment.id === selectedSegment,
  )
  return (
    <section
      id="inicio"
      className="hero"
      aria-labelledby="hero-title"
      data-segment={selectedSegment ?? 'geral'}
    >
      <HeroBackground selectedSegment={selectedSegment} />
      <div className="hero-shell">
        <div className="hero-content">
          <p className="hero-eyebrow">{heroContent.eyebrow}</p>
          <h1 id="hero-title" tabIndex={-1}>
            {heroContent.title} <span>{heroContent.titleHighlight}</span>
          </h1>
          <p className="hero-description">{heroContent.description}</p>
          <HeroActions />
          <div className="hero-context" data-active={selectedSegment !== null}>
            <div className="hero-context-visual" aria-hidden="true">
              {segmentos.map((segment) => (
                <div
                  className="hero-context-item"
                  key={segment.id}
                  data-active={selectedSegment === segment.id}
                >
                  <p className="hero-context-label">{segment.nome}</p>
                  <p className="hero-context-message">
                    {segment.descricaoApoio}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <p
            className="sr-only"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {currentSegment
              ? currentSegment.nome + '. ' + currentSegment.descricaoApoio
              : ''}
          </p>
        </div>
      </div>
    </section>
  )
}
