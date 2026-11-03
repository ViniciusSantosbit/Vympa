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
