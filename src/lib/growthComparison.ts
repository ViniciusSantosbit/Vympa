import type { GrowthSimulation, ComparisonPoint } from '../types/content'
export function calculateGrowthPoints(
  config: GrowthSimulation,
): readonly ComparisonPoint[] {
  if (
    config.tradicional.length < 2 ||
    config.tradicional.length > 121 ||
    config.tradicional.length !== config.comIA.length
  )
    throw new RangeError(
      'As séries devem ter o mesmo horizonte, entre 1 e 120 meses.',
    )
  if (
    [...config.tradicional, ...config.comIA].some(
      (value) => !Number.isFinite(value) || value < 0 || value > 1000000,
    )
  )
    throw new RangeError('Índices inválidos.')
  return config.tradicional.map((tradicional, mes) => ({
    mes,
    tradicional,
    comIA: config.comIA[mes]!,
    diferenca: Number((config.comIA[mes]! - tradicional).toFixed(2)),
  }))
}
const number = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 })
export function formatIndex(value: number): string {
  if (!Number.isFinite(value)) throw new RangeError('Índice inválido.')
  return number.format(value)
}

/** Monotone cubic Hermite interpolation: passes through every sample,
 * with zero tangent at extrema and no overshoot between nonnegative samples. */
export function createSmoothPath(
  points: readonly { x: number; y: number }[],
): string {
  if (points.length === 0) return ''
  const slopes = points.slice(1).map((point, index) => {
    const previous = points[index]!
    if (point.x <= previous.x)
      throw new RangeError('As coordenadas X devem crescer.')
    return (point.y - previous.y) / (point.x - previous.x)
  })
  const tangents = points.map((_, index) => {
    if (index === 0) return slopes[0] ?? 0
    if (index === points.length - 1) return slopes[index - 1] ?? 0
    const before = slopes[index - 1]!,
      after = slopes[index]!
    if (before * after <= 0) return 0
    // Weighted harmonic mean supports unevenly spaced samples as well.
    const h0 = points[index]!.x - points[index - 1]!.x
    const h1 = points[index + 1]!.x - points[index]!.x
    const w0 = 2 * h1 + h0,
      w1 = h1 + 2 * h0
    return (w0 + w1) / (w0 / before + w1 / after)
  })
  return points
    .map((point, index) => {
      if (index === 0) return `M${point.x},${point.y}`
      const previous = points[index - 1]!
      const third = (point.x - previous.x) / 3
      return `C${previous.x + third},${previous.y + third * tangents[index - 1]!} ${point.x - third},${point.y - third * tangents[index]!} ${point.x},${point.y}`
    })
    .join(' ')
}
