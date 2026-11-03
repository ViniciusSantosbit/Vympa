import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'
import { validateClients, getCarouselBounds } from '../src/lib/clients.ts'
const fixture = (id, extra = {}) => ({
  id: 'teste-' + id,
  nome: 'Fixture de teste ' + id,
  logoUrl: '/images/clientes/teste-' + id + '.svg',
  textoAlternativo: 'Marca de teste ' + id,
  autorizadoParaDivulgacao: true,
  segmento: null,
  ...extra,
})
test('clientes: autorização, integridade e duplicação', () => {
  const first = fixture(1)
  assert.deepEqual(validateClients([]), [])
  for (const extra of [
    { autorizadoParaDivulgacao: false },
    { autorizadoParaDivulgacao: undefined },
    { id: '' },
    { id: '../x' },
    { nome: ' ' },
    { textoAlternativo: '' },
    { logoUrl: null },
    { logoUrl: 'https://example.com/logo.svg' },
    { logoUrl: '/images/clientes/../fora.svg' },
    { logoUrl: 'javascript:alert(1)' },
  ])
    assert.equal(validateClients([fixture(1, extra)]).length, 0)
  assert.equal(
    validateClients([
      first,
      first,
      fixture(2, { nome: first.nome }),
      fixture(3, { logoUrl: first.logoUrl }),
      fixture(4),
    ]).length,
    2,
  )
  for (const count of [1, 2, 3, 12])
    assert.equal(
      validateClients(Array.from({ length: count }, (_, i) => fixture(i)))
        .length,
      count,
    )
})
test('carrossel mede overflow e limites pela largura real', () => {
  assert.deepEqual(getCarouselBounds(190, 1200, 0), {
    overflow: false,
    atStart: true,
    atEnd: true,
  })
  assert.deepEqual(getCarouselBounds(324, 327, 0), {
    overflow: false,
    atStart: true,
    atEnd: true,
  })
  assert.deepEqual(getCarouselBounds(498, 327, 0), {
    overflow: true,
    atStart: true,
    atEnd: false,
  })
  assert.deepEqual(getCarouselBounds(498, 327, 90), {
    overflow: true,
    atStart: false,
    atEnd: false,
  })
  assert.deepEqual(getCarouselBounds(498, 327, 171), {
    overflow: true,
    atStart: false,
    atEnd: true,
  })
})
test('estado vazio, autorização e marcas aguardando imagem válida', async () => {
  const server = await createServer({
    cacheDir: 'node_modules/.vite-tests/clients',
    server: { middlewareMode: true, watch: null, hmr: false, ws: false },
    appType: 'custom',
  })
  try {
    const { ClientShowcase: Results } = await server.ssrLoadModule(
      '/src/sections/Results/ClientShowcase.tsx',
    )
    assert.equal(renderToStaticMarkup(createElement(Results)), '')
    assert.equal(
      renderToStaticMarkup(
        createElement(Results, {
          clients: [fixture(1, { autorizadoParaDivulgacao: false })],
        }),
      ),
      '',
    )
    const markup = renderToStaticMarkup(
      createElement(Results, { clients: [fixture(1), fixture(1)] }),
    )
    assert.match(markup, /hidden=""/)
    assert.doesNotMatch(markup, /id="resultados"/)
    assert.equal((markup.match(/class="client-logo"/g) || []).length, 1)
    assert.match(markup, /alt="Marca de teste 1"/)
    const { InstitutionalNavigation } = await server.ssrLoadModule(
      '/src/sections/Navbar/InstitutionalNavigation.tsx',
    )
    const { SegmentContext } = await server.ssrLoadModule(
      '/src/features/segment-selection/SegmentContext.ts',
    )
    for (const available of [false, true]) {
      const navigation = renderToStaticMarkup(
        createElement(
          SegmentContext.Provider,
          { value: { selectedSegment: null, setSelectedSegment: () => {} } },
          createElement(InstitutionalNavigation, {
            resultsAvailable: available,
          }),
        ),
      )
      assert.equal(navigation.includes('href="#resultados"'), available)
    }
  } finally {
    await server.close()
  }
})
