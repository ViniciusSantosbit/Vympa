import type { Contacts, SegmentId, ServiceId } from '../types/content'
export const contatos: Contacts = {
  whatsapp: null,
  instagram: 'https://www.instagram.com/vympadev',
  email: null,
  mensagemGeral:
    'Olá! Conheci a VYMPA pelo site e gostaria de saber mais sobre as soluções de inteligência artificial e automação para empresas.',
}

export const mensagensComerciais: Readonly<
  Record<ServiceId | 'geral', Readonly<Record<SegmentId | 'geral', string>>>
> = {
  geral: {
    geral: contatos.mensagemGeral!,
    advocacia:
      'Olá! Conheci a VYMPA pelo site e gostaria de saber mais sobre as soluções para escritórios de advocacia.',
    contabilidade:
      'Olá! Conheci a VYMPA pelo site e gostaria de saber mais sobre as soluções para escritórios de contabilidade.',
    imobiliarias:
      'Olá! Conheci a VYMPA pelo site e gostaria de saber mais sobre as soluções para empresas imobiliárias.',
  },
  'servico-ia': {
    geral:
      'Olá! Conheci a VYMPA pelo site e gostaria de conversar sobre o serviço de sistemas personalizados com inteligência artificial.',
    advocacia:
      'Olá! Conheci a VYMPA pelo site e tenho interesse em desenvolver um sistema jurídico personalizado com inteligência artificial para meu escritório.',
    contabilidade:
      'Olá! Conheci a VYMPA pelo site e gostaria de conversar sobre um sistema personalizado com inteligência artificial para meu escritório de contabilidade.',
    imobiliarias:
      'Olá! Conheci a VYMPA pelo site e tenho interesse em um sistema imobiliário personalizado com recursos de inteligência artificial.',
  },
  'automacao-processos': {
    geral:
      'Olá! Conheci a VYMPA pelo site e gostaria de saber mais sobre o serviço de automação e fluxo de processos.',
    advocacia:
      'Olá! Conheci a VYMPA pelo site e gostaria de conhecer soluções para automatizar processos e atividades do meu escritório de advocacia.',
    contabilidade:
      'Olá! Conheci a VYMPA pelo site e tenho interesse em automatizar processos e rotinas do meu escritório de contabilidade.',
    imobiliarias:
      'Olá! Conheci a VYMPA pelo site e gostaria de conversar sobre automação de processos para minha imobiliária.',
  },
}
