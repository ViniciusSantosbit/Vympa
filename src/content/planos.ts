import type { Service } from '@/types/content'
export const plansLabels = {
  deliveries: 'Principais entregas',
  applications: 'Possibilidades de aplicação',
  scope:
    'Aplicações definidas conforme as necessidades da operação e o escopo contratado.',
  authorizedUse:
    'Análise funcional e reconstrução de funcionalidades autorizadas, respeitando direitos de terceiros e licenças aplicáveis.',
  unavailable: 'Contato oficial em configuração.',
}
export const planos: readonly Service[] = [
  {
    id: 'servico-ia',
    nome: 'Serviço + IA',
    descricao:
      'Analisamos os sistemas utilizados pela sua empresa e desenvolvemos uma solução personalizada, com a identidade da sua marca e inteligência artificial aplicada aos processos da operação.',
    entregas: [
      'Análise funcional dos sistemas e processos atuais.',
      'Identificação de funcionalidades essenciais.',
      'Desenvolvimento de solução personalizada.',
      'Aplicação da identidade visual do cliente.',
      'Integração de recursos de inteligência artificial adequados à operação.',
    ],
    chamadaContato: 'Conversar sobre esta solução',
    segmentos: {
      advocacia: {
        titulo: 'Sistema jurídico personalizado + IA',
        descricao:
          'Uma solução com a identidade do seu escritório para organizar a gestão jurídica e aplicar IA à consulta de informações e às atividades da operação.',
        exemplos: [
          'Organização de processos e informações jurídicas.',
          'Gestão de documentos e atividades.',
          'Assistente de IA para consulta de informações autorizadas.',
          'Painéis de acompanhamento operacional.',
        ],
      },
      contabilidade: {
        titulo: 'Sistema contábil personalizado + IA',
        descricao:
          'Uma solução com a identidade da sua marca para centralizar informações contábeis, organizar rotinas e aplicar IA aos processos do escritório.',
        exemplos: [
          'Centralização de documentos e informações contábeis.',
          'Gestão de rotinas e solicitações.',
          'Assistente inteligente para consulta de informações internas autorizadas.',
          'Painéis de acompanhamento de atividades.',
        ],
      },
      imobiliarias: {
        titulo: 'Sistema imobiliário personalizado + IA',
        descricao:
          'Uma solução com a identidade da sua imobiliária para organizar imóveis, reunir informações comerciais e aplicar IA ao contexto da operação.',
        exemplos: [
          'Organização de imóveis e cadastros.',
          'Centralização de informações comerciais.',
          'Assistente inteligente para consulta de dados internos autorizados.',
          'Painéis de acompanhamento da operação.',
        ],
      },
    },
  },
  {
    id: 'automacao-processos',
    nome: 'Automação e fluxo de processos',
    descricao:
      'Mapeamos atividades recorrentes da sua operação e desenvolvemos automações que conectam ferramentas, organizam informações e simplificam a execução dos processos.',
    entregas: [
      'Mapeamento de processos.',
      'Identificação de tarefas repetitivas.',
      'Integração de ferramentas compatíveis.',
      'Desenvolvimento de fluxos automatizados.',
      'Monitoramento operacional conforme o escopo contratado.',
    ],
    chamadaContato: 'Conversar sobre esta solução',
    segmentos: {
      advocacia: {
        titulo: 'Automação de processos jurídicos',
        descricao:
          'Mapeamos as rotinas do escritório e definimos fluxos para organizar documentos, encaminhar solicitações e conectar sistemas autorizados.',
        exemplos: [
          'Organização e classificação de documentos.',
          'Fluxos internos de aprovação.',
          'Encaminhamento de solicitações.',
          'Integração de sistemas autorizados.',
          'Automação de atividades administrativas recorrentes.',
        ],
      },
      contabilidade: {
        titulo: 'Automação de rotinas contábeis',
        descricao:
          'Mapeamos as atividades recorrentes da operação contábil para organizar solicitações, distribuir tarefas e integrar ferramentas compatíveis.',
        exemplos: [
          'Organização documental.',
          'Distribuição de atividades.',
          'Fluxos de solicitação de documentos.',
          'Integração de ferramentas contábeis compatíveis.',
          'Automação de tarefas administrativas.',
        ],
      },
      imobiliarias: {
        titulo: 'Automação da operação imobiliária',
        descricao:
          'Mapeamos as rotinas comerciais e administrativas para organizar contatos, encaminhar solicitações e conectar ferramentas de gestão compatíveis.',
        exemplos: [
          'Organização de contatos comerciais.',
          'Encaminhamento de solicitações.',
          'Fluxos de acompanhamento de atividades.',
          'Integração de ferramentas de gestão.',
          'Automação de rotinas comerciais e administrativas.',
        ],
      },
    },
  },
]
