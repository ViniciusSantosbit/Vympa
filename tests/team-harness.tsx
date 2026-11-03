import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import type { TeamMember } from '../src/types/content'
import { Team } from '../src/sections/Team/Team'
import '../src/styles/globals.css'
const fixtures: readonly TeamMember[] = Array.from({ length: 4 }, (_, i) => ({
  id: 'teste-' + i,
  nome: 'Perfil de teste ' + (i + 1),
  cargo: 'Função de teste',
  descricao: 'Dados exclusivos para validar o overlay.',
  fotoUrl: null,
  textoAlternativo: '',
  posicaoFoto: '50% 40%',
  ordem: i + 1,
  status: 'pendente',
}))
export function TeamHarness() {
  const [showData, setShowData] = useState(true)
  return (
    <>
      <header style={{ padding: 24 }}>
        <h1 style={{ fontSize: 20 }}>
          Teste S07 — dados sintéticos, sem integrantes reais
        </h1>
        <button
          type="button"
          style={{ marginTop: 16, padding: 12, border: '1px solid #7ffbfd' }}
          onClick={() => setShowData(!showData)}
        >
          Alternar dados de teste
        </button>
      </header>
      <Team {...(showData ? { members: fixtures } : {})} includeDrafts />
    </>
  )
}
createRoot(document.getElementById('root')!).render(<TeamHarness />)
