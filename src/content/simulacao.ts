import type { GrowthSimulation, SegmentId } from '@/types/content'
// Trajetórias conceituais, base 100. Não são projeções financeiras ou resultados medidos.
export const simulacao: GrowthSimulation = {
  aprovacao: 'pendente',
  tradicional: [100, 100, 100, 100, 99, 98, 97, 95, 93, 91, 88, 85, 82],
  comIA: [100, 106, 115, 129, 148, 173, 205, 245, 295, 356, 430, 520, 630],
}
export const comparisonContent = {
  eyebrow: 'IA, AUTOMAÇÃO E CRESCIMENTO',
  title: 'Seu escritório pode ir além com IA.',
  description:
    'Visualize um cenário de crescimento com IA e automação em contraste com uma operação que permanece estagnada e perde ritmo.',
  contexts: {
    advocacia:
      'Explore um cenário ilustrativo de crescimento para seu escritório de advocacia com IA e automação.',
    contabilidade:
      'Explore um cenário ilustrativo de crescimento para sua operação contábil com IA e automação.',
    imobiliarias:
      'Explore um cenário ilustrativo de crescimento para sua imobiliária com IA e automação.',
  } satisfies Record<SegmentId, string>,
  traditional: 'Sem IA e automação',
  automated: 'Com IA e automação',
  chartDescription:
    'Comparação conceitual: linha verde crescente com IA e automação; linha cinza estável e depois decrescente sem IA e automação. Ambas começam no índice 100. Não são resultados comprovados.',
  months: 'Meses',
  month: 'Mês',
  metric: 'Índice ilustrativo de evolução · base 100',
  figureNotice:
    'Simulação conceitual. Não representa resultados reais nem garantia de crescimento.',
  inspect: 'Mês inspecionado',
  hint: 'Explore os meses pelo gráfico ou pelo seletor abaixo.',
  difference: 'Diferença entre cenários (pontos)',
  tableTitle: 'Consultar dados do gráfico',
  tableRegion: 'Tabela de evolução ilustrativa',
  tableCaption:
    'Trajetórias hipotéticas em índice base 100. Não correspondem a faturamento, lucro ou produtividade medidos.',
  invalid: 'A visualização está temporariamente indisponível.',
}
