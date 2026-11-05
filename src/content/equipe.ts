import type { TeamMember } from '@/types/content'
// Quatro posições reais de sócios. Perfis pendentes aguardam fornecimento e validação.
export const equipe: readonly TeamMember[] = [
  {
    id: 'socio-01',
    nome: 'VINICIUS EDUARDO SANTOS',
    cargo: 'Diretor de Negócios',
    descricao: '',
    fotoUrl: '/images/equipe/vinicius-eduardo-santos-atual.webp',
    textoAlternativo: 'Vinicius Eduardo Santos, Diretor de Negócios da VYMPA',
    posicaoFoto: '50% 40%',
    ordem: 1,
    status: 'publicado',
  },
  {
    id: 'socio-02',
    nome: '',
    cargo: '',
    descricao: '',
    fotoUrl: null,
    textoAlternativo: '',
    posicaoFoto: '50% 40%',
    ordem: 2,
    status: 'pendente',
  },
  {
    id: 'socio-03',
    nome: '',
    cargo: '',
    descricao: '',
    fotoUrl: null,
    textoAlternativo: '',
    posicaoFoto: '50% 40%',
    ordem: 3,
    status: 'pendente',
  },
  {
    id: 'socio-04',
    nome: '',
    cargo: '',
    descricao: '',
    fotoUrl: null,
    textoAlternativo: '',
    posicaoFoto: '50% 40%',
    ordem: 4,
    status: 'pendente',
  },
]
export const teamContent = {
  title: 'Nosso Time:',
  photoAreaLabel: 'Área de fotografia do sócio',
}
