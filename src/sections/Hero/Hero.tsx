import { getMotionPreference } from '@/lib/motionPreference'
import { useEffect, useLayoutEffect, useRef } from 'react'
import type { ReactElement } from 'react'
import { heroContent } from '@/content/hero'
import { segmentos } from '@/content/segmentos'
import { useSegment } from '@/features/segment-selection/useSegment'
import { HeroBackground } from './HeroBackground'
import { HeroActions } from './HeroActions'
import './hero.css'
export function Hero(): ReactElement {
  const { selectedSegment, selectionRevision } = useSegment()
  const contentRef = useRef<HTMLDivElement>(null)
  const motionRef = useRef<Animation | null>(null)
  useEffect(() => () => motionRef.current?.cancel(), [])
  useLayoutEffect(() => {
    const content = contentRef.current
    const shell = content?.parentElement
    if (!content || !shell) return
    const targetPosition = () => {
      const style = getComputedStyle(shell)
      return selectedSegment === 'contabilidade' && window.innerWidth >= 600
        ? Math.max(
            0,
            shell.clientWidth -
              parseFloat(style.paddingLeft) -
              parseFloat(style.paddingRight) -
              content.offsetWidth,
          )
        : 0
    }
    const from = getComputedStyle(content).transform
    motionRef.current?.cancel()
    const target = targetPosition()
    const destination = `translateX(${target}px)`
    content.style.transform = destination
    if (selectedSegment && !getMotionPreference().matches) {
      const currentX = from === 'none' ? 0 : new DOMMatrixReadOnly(from).m41
      const trail = target >= currentX ? -1 : 1
      motionRef.current = content.animate(
        [
          { transform: from, filter: 'drop-shadow(0 0 0 transparent)' },
          {
            filter: `drop-shadow(${trail * 12}px 0 1px rgb(127 251 253 / 35%)) drop-shadow(${trail * 28}px 0 3px rgb(127 251 253 / 18%))`,
            offset: 0.4,
          },
          { transform: destination, filter: 'drop-shadow(0 0 0 transparent)' },
        ],
        { duration: 700, easing: 'cubic-bezier(0.45, 0, 0.2, 1)' },
      )
    }
    const resize = () => {
      motionRef.current?.cancel()
      content.style.transform = `translateX(${targetPosition()}px)`
    }
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [selectedSegment, selectionRevision])
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
        <div className="hero-content" ref={contentRef}>
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
