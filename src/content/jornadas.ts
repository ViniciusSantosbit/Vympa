import type { SegmentId } from '@/types/content'

export const jornadas = {
  advocacia: {
    titulo: 'Encontre os documentos de cada caso',
    destaque: 'e saiba o que ainda falta.',
    descricao:
      'A VYMPA desenvolve fluxos para organizar documentos recebidos, preparar dados para revisão e encaminhar pendências à equipe responsável.',
    chamada: 'Quero avaliar uma rotina do meu escritório',
    demonstracao: 'Da chegada do documento à revisão pela equipe',
    etapas: [
      'Um documento chega por um canal integrado e é associado ao caso.',
      'A IA sugere a categoria e extrai dados para conferência.',
      'A equipe revisa a sugestão e o sistema encaminha a pendência ao responsável.',
    ],
  },
  contabilidade: {
    titulo: 'Saiba quais clientes ainda precisam enviar',
    destaque: 'documentos para o fechamento.',
    descricao:
      'A VYMPA desenvolve fluxos para organizar documentos por cliente e competência, acompanhar pendências e automatizar lembretes.',
    chamada: 'Quero organizar a cobrança de documentos',
    demonstracao: 'Do recebimento ao controle do fechamento',
    etapas: [
      'O cliente envia um documento pelo canal definido pelo escritório.',
      'A IA sugere o tipo de documento e a equipe pode corrigir a classificação.',
      'O sistema atualiza a lista por competência e lembra os clientes com pendências.',
    ],
  },
  imobiliarias: {
    titulo: 'Veja quais interessados em imóveis',
    destaque: 'ainda esperam retorno.',
    descricao:
      'A VYMPA desenvolve fluxos para conectar a entrada de interessados, o atendimento dos corretores e o acompanhamento de visitas.',
    chamada: 'Quero ver se integra com meu CRM',
    demonstracao: 'Do portal imobiliário à visita agendada',
    etapas: [
      'Um interessado chega por um portal integrado, com a origem registrada.',
      'A IA resume o interesse e a automação encaminha o contato a um corretor.',
      'O painel sinaliza quem espera retorno e registra a visita quando o corretor agenda.',
    ],
  },
} satisfies Record<
  SegmentId,
  {
    titulo: string
    destaque: string
    descricao: string
    chamada: string
    demonstracao: string
    etapas: readonly string[]
  }
>

export const contatoInicial =
  'Conte qual rotina você quer melhorar e quais ferramentas usa. A VYMPA avalia com você por onde começar.'

export const demonstracaoLabel = 'Exemplo ilustrativo de aplicação'
export const etapasLabels = [
  'O que chega',
  'IA e automação',
  'O que a equipe acompanha',
]
