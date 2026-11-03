import type { SegmentId } from '@/types/content'
export const proposalsContent = {
  eyebrow: 'SOLUÇÕES VYMPA',
  title: 'Soluções para transformar sua operação',
  titles: {
    advocacia: 'Soluções para escritórios de advocacia',
    contabilidade: 'Soluções para escritórios de contabilidade',
    imobiliarias: 'Soluções para empresas imobiliárias',
  } satisfies Record<SegmentId, string>,
  description:
    'Sistemas personalizados com inteligência artificial e automação de processos e fluxos operacionais, com soluções alinhadas às necessidades da sua operação.',
}
export const howItWorksContent = {
  eyebrow: 'COMO FUNCIONA',
  title: 'Da sua rotina à solução sob medida',
  introduction:
    'Nossa abordagem parte do entendimento da operação para definir uma solução personalizada. O desenvolvimento e a integração seguem o escopo contratado.',
  steps: [
    {
      title: 'Entender a operação',
      description:
        'Conhecer os processos, os sistemas utilizados e as necessidades do escritório.',
    },
    {
      title: 'Definir a solução',
      description:
        'Estabelecer as personalizações, os recursos de IA e as automações adequadas ao contexto.',
    },
    {
      title: 'Desenvolver e integrar',
      description:
        'Construir e integrar a solução conforme o escopo acordado com o cliente.',
    },
  ],
}
