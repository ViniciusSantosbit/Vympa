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
        <h2 id="como-funciona-title" tabIndex={-1}>
          {howItWorksContent.title}
        </h2>
        <p className="section-description">{howItWorksContent.introduction}</p>
        <ol className="how-steps">
          {howItWorksContent.steps.map((step) => (
            <li key={step.title}>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
