import type { Client } from '@/types/content'
// Cadastrar somente clientes reais, com autorização expressa e logotipo oficial.
// logoUrl aponta para /images/clientes/; a autorização real deve ser obtida fora do código.
export const clientes: readonly Client[] = []
export const clientsContent = {
  eyebrow: 'QUEM CONFIA NA VYMPA',
  title: 'Empresas que fazem parte da nossa trajetória.',
  description: 'Conheça algumas das empresas que confiam em nossas soluções.',
  carouselLabel: 'Logotipos de clientes',
  previous: 'Clientes anteriores',
  next: 'Próximos clientes',
}
