import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'
import { selectTeamMembers, isTeamPhotoPath } from '../src/lib/team.ts'
const fixture = (ordem, extra = {}) => ({
  id: 'fixture-' + ordem,
  nome: 'Perfil de teste ' + ordem,
  cargo: 'Função de teste',
  descricao: 'Somente ambiente de testes.',
  fotoUrl: null,
  textoAlternativo: '',
  posicaoFoto: '50% 40%',
  ordem,
  status: 'pendente',
  ...extra,
})
test('perfis: ordem, duplicados e proteção de publicação', () => {
  const data = [fixture(4), fixture(2), fixture(1), fixture(3), fixture(1)]
  assert.deepEqual(
    selectTeamMembers(data, true).map((x) => x.ordem),
    [1, 2, 3, 4],
  )
  assert.deepEqual(selectTeamMembers(data, false), [])
  const approved = fixture(1, {
    fotoUrl: '/images/equipe/retrato-oficial.webp',
    textoAlternativo: 'Retrato de teste',
    status: 'publicado',
  })
  assert.equal(selectTeamMembers([approved], false).length, 1)
  for (const extra of [
    { nome: '' },
    { cargo: '' },
    { textoAlternativo: '' },
    { fotoUrl: null },
    { status: 'pendente' },
  ])
    assert.equal(
      selectTeamMembers([{ ...approved, ...extra }], false).length,
      0,
    )
  for (const path of [
    null,
    '',
    'https://example.com/foto.jpg',
    '/images/equipe/../outro.jpg',
  ])
    assert.equal(isTeamPhotoPath(path), false)
  assert.equal(isTeamPhotoPath('/images/equipe/retrato.webp'), true)
  assert.equal(isTeamPhotoPath('/images/equipe/retrato.jpg'), true)
})
test('time: quatro áreas vazias e dados opcionais, sem membros fictícios', async () => {
  const server = await createServer({
    cacheDir: 'node_modules/.vite-tests/team',
    server: { middlewareMode: true, watch: null, hmr: false, ws: false },
    appType: 'custom',
  })
  try {
    const { Team } = await server.ssrLoadModule('/src/sections/Team/Team.tsx')
    const { TeamMemberCard } = await server.ssrLoadModule(
      '/src/sections/Team/TeamMemberCard.tsx',
    )
    const html = renderToStaticMarkup(
      createElement(Team, { includeDrafts: true }),
    )
    assert.equal((html.match(/class="team-member"/g) || []).length, 4)
    assert.match(html, /Nosso Time:/)
    assert.match(html, /id="nosso-time"/)
    assert.doesNotMatch(html, /<img|<button|<h3|tabindex="0"|Perfil de teste/)
    assert.equal(
      renderToStaticMarkup(createElement(Team, { includeDrafts: false })),
      '',
    )
    const withData = renderToStaticMarkup(
      createElement(Team, { members: [fixture(1)], includeDrafts: true }),
    )
    assert.match(withData, /Perfil de teste 1/)
    assert.match(withData, /Função de teste/)
    assert.match(withData, /Somente ambiente de testes/)
    assert.doesNotMatch(withData, /<button|tabindex="0"/)
    const withPhoto = renderToStaticMarkup(
      createElement(TeamMemberCard, {
        member: fixture(1, {
          fotoUrl: '/images/equipe/retrato.webp',
          textoAlternativo: 'Retrato de teste',
          posicaoFoto: '50% 30%',
        }),
      }),
    )
    assert.match(withPhoto, /<img/)
    assert.match(withPhoto, /alt="Retrato de teste"/)
    assert.match(withPhoto, /object-position:50% 30%/)
  } finally {
    await server.close()
  }
})
