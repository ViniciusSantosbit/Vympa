import type { ReactElement } from 'react'
import { howItWorksContent as content } from '@/content/navigation'
import { useSegment } from '@/features/segment-selection/useSegment'
import { usePointerGlow } from '@/hooks/usePointerGlow'
import './howItWorks.css'

export function HowItWorks(): ReactElement {
  const { selectedSegment } = useSegment()
  const glowRoot = usePointerGlow()
  return (
    <section
      id="como-funciona"
      className="how-section"
      aria-labelledby="como-funciona-title"
    >
      <div className="process-container">
        <div className="section-copy">
          <p data-reveal className="section-eyebrow">
            {content.eyebrow}
          </p>
          <h2
            data-reveal
            data-reveal-delay="80"
            id="como-funciona-title"
            tabIndex={-1}
          >
            {selectedSegment ? content.titles[selectedSegment] : content.title}
          </h2>
          <p
            data-reveal
            data-reveal-delay="160"
            className="section-description"
          >
            {content.introduction}
          </p>
        </div>
        <div
          ref={glowRoot}
          className="process-timeline"
          data-reveal
          data-reveal-group="process"
        >
          <div className="process-track" aria-hidden="true">
            <span
              data-reveal-part
              data-reveal-line
              data-reveal-delay="100"
              className="process-progress"
            />
          </div>
          <ol className="process-steps" role="list">
            {content.steps.map((step, index) => (
              <li
                key={step.title}
                className="process-step"
                data-reveal-part
                data-reveal-delay={index * 100}
              >
                <span className="process-marker" aria-hidden="true" />
                <article className="process-card">
                  <div className="process-card-heading">
                    <svg
                      className="process-icon"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      {index === 0 ? (
                        <>
                          <circle cx="10.5" cy="10.5" r="6.5" />
                          <path d="m16 16 5 5M8 10.5h5m-2.5-2.5v5" />
                        </>
                      ) : index === 1 ? (
                        <>
                          <rect x="8" y="2" width="8" height="6" rx="1.5" />
                          <path d="M12 8v5M5 17v-4h14v4" />
                          <rect x="2" y="17" width="6" height="5" rx="1" />
                          <rect x="16" y="17" width="6" height="5" rx="1" />
                        </>
                      ) : (
                        <>
                          <path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-14-2 16" />
                        </>
                      )}
                    </svg>
                    <span className="process-number" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
