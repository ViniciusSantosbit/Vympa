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
  if (config.tradicional[0] !== 100 || config.comIA[0] !== 100)
    throw new RangeError('As duas séries devem partir da base 100.')
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
