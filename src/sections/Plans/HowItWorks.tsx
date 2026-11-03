import type { ReactElement } from 'react'
import { howItWorksContent } from '@/content/navigation'
export function HowItWorks(): ReactElement {
  return (
    <section
      id="como-funciona"
      className="how-section"
      aria-labelledby="como-funciona-title"
    >
      <div className="section-copy">
        <p className="section-eyebrow">{howItWorksContent.eyebrow}</p>
        <h2 data-reveal id="como-funciona-title" tabIndex={-1}>
          {howItWorksContent.title}
        </h2>
        <p data-reveal data-reveal-delay="90" className="section-description">
          {howItWorksContent.introduction}
        </p>
        <ol className="how-steps">
          {howItWorksContent.steps.map((step, index) => (
            <li key={step.title} data-reveal data-reveal-delay={index * 90}>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
