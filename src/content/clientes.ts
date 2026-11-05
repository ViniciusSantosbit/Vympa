import type { Client } from '@/types/content'
// Cadastrar somente clientes reais, com autorização expressa e logotipo oficial.
// logoUrl aponta para /images/clientes/; a autorização real deve ser obtida fora do código.
export const clientes: readonly Client[] = [
  {
    id: 'montezuma-conde',
    nome: 'Montezuma & Conde',
    logoUrl: '/images/clientes/montezuma-conde.png',
    textoAlternativo:
      'Montezuma & Conde — primeira empresa atendida pela VYMPA',
    autorizadoParaDivulgacao: true,
    segmento: 'advocacia',
    especialidade: 'Advocacia',
    experiencia: 'Primeira empresa atendida pela VYMPA',
  },
]
export const clientsContent = {
  eyebrow: 'QUEM CONFIA NA VYMPA',
  title: 'Nossa tecnologia presente em empresas reais.',
  subtitle: 'Conheça empresas que contam com a',
  subtitleBrand: 'VYMPA',
  subtitleSuffix:
    'para modernizar processos, desenvolver sistemas e impulsionar suas operações.',
  carouselLabel: 'Empresas atendidas pela VYMPA',
  specialtyLabel: 'Especialidade',
  experienceLabel: 'Experiência',
  missingDetail: 'Não informado',
  clientLabel: 'CLIENTE VYMPA',
  previous: 'Clientes anteriores',
  next: 'Próximos clientes',
}
