import test from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'vite'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import {
  calculateGrowthPoints,
  formatIndex,
  createSmoothPath,
} from '../src/lib/growthComparison.ts'
test('índice conceitual: diferenças e formatação', () => {
  const points = calculateGrowthPoints({
    aprovacao: 'pendente',
    tradicional: [100, 100, 99, 95],
    comIA: [100, 120, 160, 220],
  })
  assert.deepEqual(points[0], {
    mes: 0,
    tradicional: 100,
    comIA: 100,
    diferenca: 0,
  })
  assert.equal(points[3].diferenca, 125)
  assert.equal(formatIndex(125.5), '125,5')
})
test('não aceita séries inválidas', () => {
  for (const config of [
    { tradicional: [], comIA: [] },
    { tradicional: [100], comIA: [100] },
    { tradicional: [100, 99], comIA: [100] },
    { tradicional: [100, -1], comIA: [100, 120] },
    { tradicional: [100, NaN], comIA: [100, Infinity] },
  ])
    assert.throws(
      () => calculateGrowthPoints({ aprovacao: 'pendente', ...config }),
      RangeError,
    )
})
test('gráfico único e conteúdo simplificado sem custos ou premissas', async () => {
  const server = await createServer({
    cacheDir: 'node_modules/.vite-tests/growth',
    server: { middlewareMode: true, watch: null, hmr: false, ws: false },
    appType: 'custom',
  })
  try {
    const { Results } = await server.ssrLoadModule(
      '/src/sections/Results/Results.tsx',
    )
    const { SegmentContext } = await server.ssrLoadModule(
      '/src/features/segment-selection/SegmentContext.ts',
    )
    const { simulacao } = await server.ssrLoadModule(
      '/src/content/simulacao.ts',
    )
    const points = calculateGrowthPoints(simulacao)
    assert.equal(points.length, 13)
    assert.ok(points[0].tradicional > points[0].comIA)
    assert.ok(points[2].diferenca < 0)
    assert.ok(points[3].diferenca > 0)
    assert.equal(
      Math.min(...points.map((p) => p.tradicional)),
      points[6].tradicional,
    )
    assert.equal(Math.max(...points.map((p) => p.comIA)), points[12].comIA)
    assert.ok(points[11].comIA > points[10].comIA)
    assert.ok(points[12].comIA > points[11].comIA)
    assert.ok(points[11].tradicional < points[10].tradicional)
    assert.ok(points[12].tradicional < points[11].tradicional)
    assert.ok(points[12].tradicional > points[6].tradicional)
    for (const selectedSegment of [
      null,
      'advocacia',
      'contabilidade',
      'imobiliarias',
    ]) {
      const html = renderToStaticMarkup(
        createElement(
          SegmentContext.Provider,
          { value: { selectedSegment, setSelectedSegment: () => {} } },
          createElement(Results),
        ),
      )
      assert.equal((html.match(/id="resultados"/g) || []).length, 1)
      assert.equal((html.match(/class="chart-line /g) || []).length, 2)
      assert.equal((html.match(/data-month=/g) || []).length, 13)
      assert.doesNotMatch(html, /base 100/)
      assert.match(html, /Escala arbitrária/)
      assert.match(html, /pendentes de validação editorial/)
      assert.match(
        html,
        /não representa resultados reais nem garantia de crescimento/i,
      )
      assert.doesNotMatch(
        html,
        /R\$|Premissas desta simulação|custo operacional|Investimento inicial|Ponto de equilíbrio|simulation-assumptions|simulation-status|comparison-summary/,
      )
      assert.match(html, /Sem a automação considerada/)
      assert.match(html, /Com IA e automação/)
    }
  } finally {
    await server.close()
  }
})

test('aceita inícios diferentes em escala arbitrária sem mudar as coordenadas', () => {
  const points = calculateGrowthPoints({
    aprovacao: 'pendente',
    tradicional: [64, 53],
    comIA: [28, 32],
  })
  assert.equal(points[0].diferenca, -36)
  assert.equal(points[1].diferenca, -21)
})

test('Bézier suave passa pelas amostras e não ultrapassa extremos entre meses', () => {
  const input = [
    { x: 0, y: 60 },
    { x: 1, y: 40 },
    { x: 2, y: 20 },
    { x: 3, y: 30 },
    { x: 4, y: 55 },
  ]
  const path = createSmoothPath(input)
  assert.ok(path.startsWith('M0,60'))
  const curves = [...path.matchAll(/C([^C]+)/g)]
  assert.equal(curves.length, input.length - 1)
  curves.forEach((curve, i) => {
    const [x1, y1, x2, y2, x3, y3] = curve[1].trim().split(/[ ,]+/).map(Number)
    const start = input[i],
      end = input[i + 1]
    assert.equal(x3, end.x)
    assert.equal(y3, end.y)
    assert.ok(x1 > start.x && x2 < end.x)
    for (let j = 0; j <= 100; j++) {
      const t = j / 100,
        u = 1 - t
      const y =
        u ** 3 * start.y + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t ** 3 * y3
      assert.ok(
        y >= Math.min(start.y, end.y) - 1e-8 &&
          y <= Math.max(start.y, end.y) + 1e-8,
      )
    }
  })
  assert.equal(createSmoothPath([]), '')
  assert.throws(
    () =>
      createSmoothPath([
        { x: 1, y: 1 },
        { x: 1, y: 2 },
      ]),
    RangeError,
  )
})
