import type { SegmentId } from '@/types/content'
export const proposalsContent = {
  eyebrow: 'SOLUÇÕES VYMPA',
  title: 'Soluções desenvolvidas para a sua operação.',
  description:
    'Da modernização dos seus sistemas à automação de processos, desenvolvemos soluções adaptadas às necessidades do seu negócio.',
  titles: {
    advocacia: 'Tecnologia sob medida para o seu escritório de advocacia.',
    contabilidade: 'Mais eficiência para a sua operação contábil.',
    imobiliarias: 'Soluções inteligentes para sua operação imobiliária.',
  } satisfies Record<SegmentId, string>,
  descriptions: {
    advocacia:
      'Da gestão de informações jurídicas aos fluxos administrativos, desenvolvemos sistemas e automações adaptados à rotina do seu escritório.',
    contabilidade:
      'Da organização de documentos à integração de rotinas, desenvolvemos sistemas e automações alinhados aos processos do seu escritório contábil.',
    imobiliarias:
      'Da centralização de informações comerciais à organização de operações, desenvolvemos sistemas e automações para o contexto da sua imobiliária.',
  } satisfies Record<SegmentId, string>,
}
export const howItWorksContent = {
  eyebrow: 'COMO FUNCIONA',
  title: 'Da sua operação à solução sob medida.',
  titles: {
    advocacia: 'Da rotina jurídica à solução sob medida.',
    contabilidade: 'Da rotina contábil à solução sob medida.',
    imobiliarias: 'Da operação imobiliária à solução sob medida.',
  } satisfies Record<SegmentId, string>,
  introduction:
    'Entendemos os desafios da sua operação, planejamos a solução e desenvolvemos tecnologias adaptadas às necessidades do seu negócio.',
  steps: [
    {
      title: 'Diagnóstico',
      description:
        'Conhecemos os sistemas, processos e desafios da sua operação para identificar oportunidades de melhoria.',
    },
    {
      title: 'Planejamento',
      description:
        'Definimos a solução personalizada, as funcionalidades, os recursos de IA e as automações adequadas ao negócio.',
    },
    {
      title: 'Implementação',
      description:
        'Desenvolvemos, personalizamos e integramos a solução conforme o escopo definido com o cliente.',
    },
  ],
}
