import type { ReactElement } from 'react'
import type { GrowthSimulation, ComparisonPoint } from '@/types/content'
import { simulacao, comparisonContent as text } from '@/content/simulacao'
import { useSegment } from '@/features/segment-selection/useSegment'
import { calculateGrowthPoints, formatIndex } from '@/lib/growthComparison'
import { ComparisonChart } from './ComparisonChart'
import './comparison.css'
export function GrowthComparison({
  config = simulacao,
}: {
  config?: GrowthSimulation
}): ReactElement {
  const { selectedSegment } = useSegment()
  let points: readonly ComparisonPoint[] | null = null
  try {
    points = calculateGrowthPoints(config)
  } catch {
    /* Não renderizar índices inválidos. */
  }
  return (
    <div className="growth-comparison">
      <div className="comparison-heading">
        <p className="clients-eyebrow">{text.eyebrow}</p>
        <h2 id="comparison-title" tabIndex={-1}>
          {text.title}
        </h2>
        <p className="comparison-intro">
          {selectedSegment ? text.contexts[selectedSegment] : text.description}
        </p>
      </div>
      {points ? (
        <>
          <ComparisonChart points={points} />
          <details className="comparison-table-details">
            <summary>{text.tableTitle}</summary>
            <div
              className="comparison-table-scroll"
              role="region"
              aria-label={text.tableRegion}
              tabIndex={0}
            >
              <table>
                <caption>{text.tableCaption}</caption>
                <thead>
                  <tr>
                    <th scope="col">{text.month}</th>
                    <th scope="col">{text.traditional}</th>
                    <th scope="col">{text.automated}</th>
                    <th scope="col">{text.difference}</th>
                  </tr>
                </thead>
                <tbody>
                  {points.map((point) => (
                    <tr key={point.mes} data-month={point.mes}>
                      <th scope="row">{point.mes}</th>
                      <td>{formatIndex(point.tradicional)}</td>
                      <td>{formatIndex(point.comIA)}</td>
                      <td>{formatIndex(point.diferenca)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </>
      ) : (
        <p role="status">{text.invalid}</p>
      )}
    </div>
  )
}
