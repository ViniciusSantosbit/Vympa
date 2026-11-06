import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'
import { buildServiceMessage, buildWhatsAppUrl } from '../src/lib/whatsapp.ts'

test('mensagens contextualizadas e número de contato', () => {
  for (const service of ['servico-ia', 'automacao-processos']) {
    for (const segment of [
      null,
      'advocacia',
      'contabilidade',
      'imobiliarias',
    ]) {
      const message = buildServiceMessage(service, segment)
      assert.match(
        message,
        service === 'servico-ia' ? /inteligência artificial/ : /automa[çt]/,
      )
      assert.match(
        message,
        segment === 'advocacia'
          ? /jurídico|advocacia/
          : segment === 'contabilidade'
            ? /escritório de contabilidade/
            : segment === 'imobiliarias'
              ? /imobiliári[oa]/
              : /serviço/,
      )
      assert.equal(buildWhatsAppUrl(null, message), null)
    }
  }
  for (const phone of [
    '',
    'pendente',
    'javascript:alert(1)',
    '00123456789',
    '+0123456789',
    '123',
    '1234567890123456',
    '5511999999999?text=outro',
  ]) {
    assert.equal(buildWhatsAppUrl(phone, 'Olá!'), null)
  }
  // Número sintético reservado para teste; não é contato da VYMPA nem é aberto.
  const url = new URL(
    buildWhatsAppUrl('+1 (202) 555-0123', 'Olá! IA & automação?'),
  )
  assert.equal(url.origin, 'https://wa.me')
  assert.equal(url.pathname, '/12025550123')
  assert.equal(url.searchParams.get('text'), 'Olá! IA & automação?')
})

test('renderização dos dois serviços e contratos de planos', async (t) => {
  const server = await createServer({
    cacheDir: 'node_modules/.vite-tests/plans',
    server: { middlewareMode: true, watch: null, hmr: false, ws: false },
    appType: 'custom',
  })
  try {
    const { Plans } = await server.ssrLoadModule(
      '/src/sections/Plans/Plans.tsx',
    )
    const { SegmentContext } = await server.ssrLoadModule(
      '/src/features/segment-selection/SegmentContext.ts',
    )
    const { planos } = await server.ssrLoadModule('/src/content/planos.ts')
    for (const selectedSegment of [
      null,
      'advocacia',
      'contabilidade',
      'imobiliarias',
    ]) {
      await t.test(selectedSegment ?? 'visão geral', () => {
        const html = renderToStaticMarkup(
          createElement(
            SegmentContext.Provider,
            { value: { selectedSegment, setSelectedSegment: () => {} } },
            createElement(Plans),
          ),
        )
        assert.equal((html.match(/<article /g) || []).length, 2)
        assert.match(html, /id="planos"/)
        assert.match(html, /id="planos-title"/)
        assert.doesNotMatch(html, /R\$|wa\.me|href=""/)
        assert.doesNotMatch(html, /disabled=""|Contato oficial em configuração/)
        assert.equal(
          (html.match(/href="https:\/\/mail\.google\.com\/mail\//g) || [])
            .length,
          2,
        )
        assert.equal(
          html.includes('Exemplo ilustrativo de aplicação'),
          Boolean(selectedSegment),
        )
        for (const service of planos) {
          const variant = selectedSegment
            ? service.segmentos[selectedSegment]
            : null
          assert.ok(html.includes(variant?.titulo ?? service.nome))
          assert.ok(html.includes(variant?.descricao ?? service.descricao))
          for (const feature of variant?.exemplos ?? service.entregas)
            assert.ok(html.includes(feature))
        }
      })
    }
  } finally {
    await server.close()
  }
})
