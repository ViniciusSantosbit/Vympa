import test from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'vite'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import {
  calculateGrowthPoints,
  formatIndex,
} from '../src/lib/growthComparison.ts'
test('índice conceitual: base comum, crescimento e retração', () => {
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
    { tradicional: [0, 99], comIA: [100, 120] },
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
    assert.equal(points[0].tradicional, points[0].comIA)
    for (let i = 1; i < points.length; i++) {
      assert.ok(points[i].comIA > points[i - 1].comIA)
      assert.ok(points[i].tradicional <= points[i - 1].tradicional)
    }
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
      assert.match(html, /base 100/)
      assert.match(
        html,
        /não representa resultados reais nem garantia de crescimento/i,
      )
      assert.doesNotMatch(
        html,
        /R\$|Premissas desta simulação|custo operacional|Investimento inicial|Ponto de equilíbrio|simulation-assumptions|simulation-status|comparison-summary/,
      )
      assert.match(html, /Sem IA e automação/)
      assert.match(html, /Com IA e automação/)
    }
  } finally {
    await server.close()
  }
})
