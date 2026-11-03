import { useEffect, useRef, useState } from 'react'
import type { ReactElement } from 'react'
import type { ComparisonPoint } from '@/types/content'
import { comparisonContent as text } from '@/content/simulacao'
import { formatIndex } from '@/lib/growthComparison'
export function ComparisonChart({
  points,
}: {
  points: readonly ComparisonPoint[]
}): ReactElement {
  const container = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(900)
  const [month, setMonth] = useState(0)
  useEffect(() => {
    const node = container.current
    if (!node) return
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setWidth(Math.max(200, entry.contentRect.width))
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  const point = points[Math.min(month, points.length - 1)]!
  const horizon = points.length - 1
  const tickStep = Math.max(1, Math.ceil(horizon / (width < 500 ? 6 : 12)))
  const height = width <= 500 ? 260 : 360,
    left = 68,
    right = width - 18,
    top = 30,
    bottom = height - 48
  const maximum = Math.max(
    1,
    ...points.flatMap((p) => [p.tradicional, p.comIA]),
  )
  const order = 10 ** Math.floor(Math.log10(maximum / 4))
  const ceiling = Math.ceil(maximum / 4 / order) * order * 4
  const x = (m: number): number => left + (m / horizon) * (right - left)
  const y = (value: number): number =>
    bottom - (value / ceiling) * (bottom - top)
  const path = (series: 'tradicional' | 'comIA'): string =>
    points
      .map((p, i) => (i === 0 ? 'M' : 'L') + x(p.mes) + ',' + y(p[series]))
      .join(' ')
  return (
    <figure data-reveal className="comparison-figure">
      <figcaption className="chart-metric">
        {text.metric}
        <span>{text.figureNotice}</span>
      </figcaption>
      <div ref={container} className="comparison-canvas">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-labelledby="comparison-chart-title comparison-chart-desc"
          onPointerMove={(event) => {
            const box = event.currentTarget.getBoundingClientRect()
            const position = ((event.clientX - box.left) * width) / box.width
            setMonth(
              Math.max(
                0,
                Math.min(
                  horizon,
                  Math.round(((position - left) / (right - left)) * horizon),
                ),
              ),
            )
          }}
          onPointerDown={(event) => {
            const box = event.currentTarget.getBoundingClientRect()
            setMonth(
              Math.max(
                0,
                Math.min(
                  horizon,
                  Math.round(
                    ((((event.clientX - box.left) * width) / box.width - left) /
                      (right - left)) *
                      horizon,
                  ),
                ),
              ),
            )
          }}
        >
          <title id="comparison-chart-title">{text.metric}</title>
          <desc id="comparison-chart-desc">{text.chartDescription}</desc>
          {Array.from({ length: 5 }, (_, i) => {
            const value = (ceiling * i) / 4
            return (
              <g key={i}>
                <line
                  className="chart-grid"
                  x1={left}
                  x2={right}
                  y1={y(value)}
                  y2={y(value)}
                />
                <text
                  className="chart-axis"
                  x={left - 10}
                  y={y(value) + 4}
                  textAnchor="end"
                >
                  {formatIndex(value)}
                </text>
              </g>
            )
          })}
          {points.map((p) => (
            <g key={p.mes}>
              {(p.mes % tickStep === 0 || p.mes === horizon) && (
                <text
                  className="chart-axis"
                  x={x(p.mes)}
                  y={bottom + 24}
                  textAnchor="middle"
                >
                  {p.mes}
                </text>
              )}
              <circle
                className="chart-dot-traditional"
                cx={x(p.mes)}
                cy={y(p.tradicional)}
                r="2.5"
              />
              <circle
                className="chart-dot-ia"
                cx={x(p.mes)}
                cy={y(p.comIA)}
                r="2.5"
              />
            </g>
          ))}
          <path
            className="chart-line chart-line--traditional"
            d={path('tradicional')}
          />
          <path className="chart-line chart-line--ia" d={path('comIA')} />
          <line
            className="chart-cursor"
            x1={x(point.mes)}
            x2={x(point.mes)}
            y1={top}
            y2={bottom}
          />
          <circle
            className="chart-dot-traditional"
            cx={x(point.mes)}
            cy={y(point.tradicional)}
            r="5"
          />
          <circle
            className="chart-dot-ia"
            cx={x(point.mes)}
            cy={y(point.comIA)}
            r="5"
          />
          <text
            className="chart-axis"
            x={right}
            y={height - 3}
            textAnchor="end"
          >
            {text.months}
          </text>
        </svg>
      </div>
      <div className="comparison-legend">
        <span>
          <i className="legend-traditional" aria-hidden="true" />
          {text.traditional}
        </span>
        <span>
          <i className="legend-ia" aria-hidden="true" />
          {text.automated}
        </span>
      </div>
      <div className="chart-inspector">
        <label htmlFor="comparison-month">
          {text.inspect}: {point.mes}
        </label>
        <input
          id="comparison-month"
          type="range"
          min="0"
          max={horizon}
          step="1"
          value={point.mes}
          onChange={(event) => setMonth(Number(event.target.value))}
          aria-valuetext={`Mês ${point.mes}. Tradicional: ${formatIndex(point.tradicional)}. Com IA: ${formatIndex(point.comIA)}. Diferença: ${formatIndex(point.diferenca)}.`}
        />
        <p className="chart-help">{text.hint}</p>
        <dl
          data-reveal
          data-reveal-delay="90"
          className="chart-tooltip"
          aria-label={`Valores do mês ${point.mes}`}
        >
          <div>
            <dt>{text.traditional}</dt>
            <dd>{formatIndex(point.tradicional)}</dd>
          </div>
          <div>
            <dt>{text.automated}</dt>
            <dd>{formatIndex(point.comIA)}</dd>
          </div>
          <div>
            <dt>{text.difference}</dt>
            <dd>{formatIndex(point.diferenca)}</dd>
          </div>
        </dl>
      </div>
    </figure>
  )
}
