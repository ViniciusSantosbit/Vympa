import type { GrowthSimulation, SegmentId } from '@/types/content'
// Coordenadas demonstrativas em escala arbitrária, pendentes de validação editorial.
// Não são projeções financeiras ou resultados medidos.
export const simulacao: GrowthSimulation = {
  aprovacao: 'pendente',
  tradicional: [64, 53, 43, 34, 27, 22, 20, 21, 25, 32, 42, 38, 30],
  comIA: [28, 32, 40, 55, 78, 105, 132, 151, 162, 168, 170, 175, 184],
}
export const comparisonContent = {
  eyebrow: 'IA, AUTOMAÇÃO E CRESCIMENTO',
  title: 'Seu escritório pode ir além com IA.',
  description:
    'Explore dois cenários hipotéticos de evolução operacional em uma escala arbitrária. As trajetórias são demonstrativas e não representam previsões ou resultados reais.',
  contexts: {
    advocacia:
      'Explore um cenário ilustrativo de crescimento para seu escritório de advocacia com IA e automação.',
    contabilidade:
      'Explore um cenário ilustrativo de crescimento para sua operação contábil com IA e automação.',
    imobiliarias:
      'Explore um cenário ilustrativo de crescimento para sua imobiliária com IA e automação.',
  } satisfies Record<SegmentId, string>,
  traditional: 'Sem a automação considerada',
  automated: 'Com IA e automação',
  chartDescription:
    'Cenário demonstrativo em escala arbitrária: a linha verde cresce em S e termina em alta; a cinza começa acima, cai, se recupera parcialmente e volta a cair nos últimos meses. As curvas se cruzam entre os meses 2 e 3. Ausência de IA não comprova queda; seu uso não garante crescimento.',
  months: 'Meses',
  month: 'Mês',
  metric: 'Índice ilustrativo de evolução operacional',
  figureNotice:
    'Simulação conceitual. Não representa resultados reais nem garantia de crescimento. Dados demonstrativos pendentes de validação editorial.',
  inspect: 'Mês inspecionado',
  hint: 'Explore os meses pelo gráfico ou pelo seletor abaixo.',
  difference: 'Diferença entre cenários (pontos)',
  tableTitle: 'Consultar dados do gráfico',
  tableRegion: 'Tabela de evolução ilustrativa',
  tableCaption:
    'Escala arbitrária: os valores são coordenadas demonstrativas, não faturamento, lucro ou crescimento percentual real. Dados pendentes de validação editorial.',
  invalid: 'A visualização está temporariamente indisponível.',
}
