import type { TeamMember } from '@/types/content'
// Quatro posições reais de sócios. Perfis pendentes aguardam fornecimento e validação.
export const equipe: readonly TeamMember[] = [
  {
    id: 'socio-01',
    nome: 'Vinicius Santos',
    cargo: 'Diretor de Negócios',
    descricao: '',
    fotoUrl: '/images/equipe/vinicius-eduardo-santos-atual.webp',
    textoAlternativo: 'Vinicius Santos, Diretor de Negócios da VYMPA',
    posicaoFoto: '50% 40%',
    ordem: 1,
    status: 'publicado',
  },
  {
    id: 'socio-02',
    nome: 'Miguel Sena',
    cargo: 'Diretor de Gestão',
    descricao: '',
    fotoUrl: '/images/equipe/miguel-sena.jpg',
    textoAlternativo: 'Miguel Sena, Diretor de Gestão da VYMPA',
    posicaoFoto: '50% 40%',
    ordem: 2,
    status: 'publicado',
  },
  {
    id: 'socio-03',
    nome: 'Paulo Vítor',
    cargo: 'Diretor de Desenvolvimento',
    descricao: '',
    fotoUrl: '/images/equipe/paulo-vitor.jpg',
    textoAlternativo: 'Paulo Vítor, Diretor de Desenvolvimento da VYMPA',
    posicaoFoto: '50% 40%',
    ordem: 3,
    status: 'publicado',
  },
  {
    id: 'socio-04',
    nome: 'Ronald Salomé',
    cargo: 'Diretor de Marketing',
    descricao: '',
    fotoUrl: '/images/equipe/ronald-salome.jpg',
    textoAlternativo: 'Ronald Salomé, Diretor de Marketing da VYMPA',
    posicaoFoto: '50% 40%',
    ordem: 4,
    status: 'publicado',
  },
]
export const teamContent = {
  title: 'Nosso Time:',
  photoAreaLabel: 'Área de fotografia do sócio',
}
