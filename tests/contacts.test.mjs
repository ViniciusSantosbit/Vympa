import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'
import {
  buildContactMessage,
  buildServiceMessage,
  buildWhatsAppUrl,
  normalizeWhatsAppPhone,
} from '../src/lib/whatsapp.ts'
import { validateInstagramUrl } from '../src/lib/instagram.ts'

test('normalização explícita internacional e codificação', () => {
  assert.equal(normalizeWhatsAppPhone(' +55 (11) 99999-9999 '), '5511999999999')
  for (const phone of [
    null,
    '',
    '11999999999',
    '551199',
    '5500999999999',
    '5511888888888',
    '++5511999999999',
    '55/11/999999999',
    '0012025550123',
    'tel:12025550123',
  ]) {
    // Número local sem código internacional não deve ser corrigido automaticamente.
    assert.equal(normalizeWhatsAppPhone(phone), null)
  }
  const message = 'Olá! IA & automação? + # 😀'
  const url = new URL(buildWhatsAppUrl('+1 (202) 555-0123', message))
  assert.equal(url.searchParams.get('text'), message)
  assert.equal(url.pathname, '/12025550123')
})

test('12 mensagens distintas e alternâncias sem estado', () => {
  const messages = new Set()
  for (const service of [null, 'servico-ia', 'automacao-processos']) {
    for (const segment of [
      null,
      'advocacia',
      'contabilidade',
      'imobiliarias',
    ]) {
      const message = buildContactMessage(segment, service)
      assert.ok(message.startsWith('Olá! Conheci a VYMPA pelo site e '))
      if (service) assert.equal(message, buildServiceMessage(service, segment))
      if (segment === 'advocacia')
        assert.doesNotMatch(message, /contabilidade|imobiliári/)
      if (segment === 'contabilidade')
        assert.doesNotMatch(message, /jurídico|advocacia|imobiliári/)
      if (segment === 'imobiliarias')
        assert.doesNotMatch(message, /jurídico|advocacia|contabilidade/)
      if (!service)
        assert.doesNotMatch(message, /personalizado|fluxo de processos/)
      messages.add(message)
    }
  }
  assert.equal(messages.size, 12)
  assert.equal(
    buildContactMessage(null),
    'Olá! Conheci a VYMPA pelo site e gostaria de saber mais sobre as soluções de inteligência artificial e automação para empresas.',
  )
  const first = buildContactMessage('advocacia', 'servico-ia')
  buildContactMessage('imobiliarias', 'automacao-processos')
  assert.equal(buildContactMessage('advocacia', 'servico-ia'), first)
})

test('Instagram permite apenas perfil HTTPS no domínio oficial', () => {
  for (const value of [
    null,
    '',
    'https://instagram.com',
    'https://instagram.com/',
    'http://instagram.com/teste',
    'https://instagram.com.evil.com/teste',
    'https://evil.com/teste',
    'javascript:alert(1)',
    'https://instagram.com/accounts/',
    'https://instagram.com/p/123',
    'https://user:pass@instagram.com/teste',
    'https://instagram.com/teste?next=evil',
    'https://instagram.com/../',
    'https://instagram.com/a..b',
  ])
    assert.equal(validateInstagramUrl(value), null)
  assert.equal(
    validateInstagramUrl('https://www.instagram.com/perfil_de_teste/'),
    'https://www.instagram.com/perfil_de_teste/',
  )
})

test('canais flutuantes e CTAs compartilham configuração e segmento', async () => {
  const server = await createServer({
    cacheDir: 'node_modules/.vite-tests/contacts',
    server: { middlewareMode: true, watch: null, hmr: false, ws: false },
    appType: 'custom',
  })
  try {
    const { FloatingContactButtons } = await server.ssrLoadModule(
      '/src/components/common/FloatingContactButtons.tsx',
    )
    const { SegmentContext } = await server.ssrLoadModule(
      '/src/features/segment-selection/SegmentContext.ts',
    )
    const { contatos } = await server.ssrLoadModule('/src/content/contatos.ts')
    const { PlanCard } = await server.ssrLoadModule(
      '/src/sections/Plans/PlanCard.tsx',
    )
    const { planos } = await server.ssrLoadModule('/src/content/planos.ts')
    const original = { ...contatos }
    const render = (segment) =>
      renderToStaticMarkup(
        createElement(
          SegmentContext.Provider,
          { value: { selectedSegment: segment, setSelectedSegment() {} } },
          createElement(FloatingContactButtons),
        ),
      )
    try {
      for (const [whatsapp, instagram, count] of [
        [null, null, 0],
        ['invalid', 'invalid', 0],
        ['+1 (202) 555-0123', null, 1],
        [null, 'https://instagram.com/perfil_de_teste/', 1],
        ['+1 (202) 555-0123', 'https://instagram.com/perfil_de_teste/', 2],
      ]) {
        Object.assign(contatos, { whatsapp, instagram })
        for (const segment of [
          null,
          'advocacia',
          'contabilidade',
          'imobiliarias',
          'advocacia',
        ]) {
          const html = render(segment)
          assert.equal((html.match(/<a /g) ?? []).length, count)
          if (!count) assert.equal(html, '')
          assert.doesNotMatch(html, /href=""/)
          if (whatsapp?.startsWith('+'))
            assert.ok(
              html.includes(
                encodeURIComponent(buildContactMessage(segment)).replaceAll(
                  '&',
                  '&amp;',
                ),
              ),
            )
          assert.equal(
            (html.match(/rel="noopener noreferrer"/g) ?? []).length,
            count,
          )
          for (const service of planos) {
            const card = renderToStaticMarkup(
              createElement(PlanCard, { service, segment }),
            )
            if (whatsapp?.startsWith('+'))
              assert.ok(
                card.includes(
                  encodeURIComponent(buildServiceMessage(service.id, segment)),
                ),
              )
            else {
              assert.match(card, /disabled=""/)
              assert.match(card, /aria-describedby=/)
            }
          }
        }
      }
    } finally {
      Object.assign(contatos, original)
    }
  } finally {
    await server.close()
  }
})
