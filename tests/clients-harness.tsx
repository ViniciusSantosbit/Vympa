import { Results as CombinedResults } from '../src/sections/Results/Results'
import { SegmentProvider } from '../src/app/providers/SegmentProvider'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import type { Client } from '../src/types/content'
import { ClientShowcase as Results } from '../src/sections/Results/ClientShowcase'
import '../src/styles/globals.css'
const fixture = (id: number, extra: Partial<Client> = {}): Client => ({
  id: 'teste-' + id,
  nome: 'Fixture de teste ' + id,
  logoUrl: '/images/clientes/teste-' + id + '.svg',
  textoAlternativo: 'Marca de teste ' + id,
  autorizadoParaDivulgacao: true,
  segmento: null,
  ...extra,
})
export function Harness() {
  const [scenario, setScenario] = useState('0')
  const [withComparison, setWithComparison] = useState(false)
  const [available, setAvailable] = useState(false)
  const counts = ['0', '1', '2', '3', '12']
  const records = counts.includes(scenario)
    ? Array.from({ length: Number(scenario) }, (_, i) => fixture(i + 1))
    : scenario === 'unauthorized'
      ? [fixture(1, { autorizadoParaDivulgacao: false })]
      : scenario === 'invalid'
        ? [fixture(1, { logoUrl: null })]
        : scenario === 'broken'
          ? [fixture(1, { logoUrl: '/images/clientes/erro.svg' })]
          : scenario === 'mixed'
            ? [fixture(1, { logoUrl: '/images/clientes/erro.svg' }), fixture(2)]
            : [
                fixture(1),
                fixture(1),
                fixture(2, { nome: 'Fixture de teste 1' }),
                fixture(3, { autorizadoParaDivulgacao: false }),
              ]
  return (
    <>
      <header style={{ padding: 24, borderBottom: '1px solid #26374d' }}>
        <h1 style={{ fontSize: 20 }}>
          Ambiente de testes S05 — marcas sintéticas
        </h1>
        <p>
          Dados exclusivos de teste. Nenhuma empresa real está sendo
          apresentada.
        </p>
        <div
          style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 16 }}
        >
          {[
            ...counts,
            'unauthorized',
            'invalid',
            'broken',
            'mixed',
            'duplicates',
          ].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setScenario(value)}
              style={{ padding: 8, border: '1px solid #7ffbfd' }}
            >
              {value}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setWithComparison(!withComparison)}
        >
          Alternar comparação S06
        </button>
        <p role="status">Resultados disponíveis: {available ? 'sim' : 'não'}</p>
      </header>
      {withComparison ? (
        <CombinedResults
          clients={records}
          onAvailabilityChange={setAvailable}
        />
      ) : (
        <Results clients={records} onAvailabilityChange={setAvailable} />
      )}
      <p style={{ padding: 24 }}>Fim do ambiente de testes.</p>
    </>
  )
}
createRoot(document.getElementById('root')!).render(
  <SegmentProvider>
    <Harness />
  </SegmentProvider>,
)
