export type SegmentId = 'advocacia' | 'contabilidade' | 'imobiliarias'
export interface Segment {
  id: SegmentId
  nome: string
  descricaoApoio: string | null
  referenciaVisual: string | null
  contextoWhatsApp: string | null
}
export type ServiceId = 'servico-ia' | 'automacao-processos'
export interface ServiceVariant {
  titulo: string
  descricao: string
  exemplos: readonly string[]
}
export interface Service {
  id: ServiceId
  nome: string
  descricao: string
  entregas: readonly string[]
  chamadaContato: string
  segmentos: Readonly<Record<SegmentId, ServiceVariant>>
}
export interface Client {
  id: string
  nome: string
  logoUrl: string | null
  textoAlternativo: string
  autorizadoParaDivulgacao: boolean
  segmento: SegmentId | null
}
export interface GrowthSimulation {
  aprovacao: 'pendente' | 'aprovada'
  tradicional: readonly number[]
  comIA: readonly number[]
}
export interface ComparisonPoint {
  mes: number
  tradicional: number
  comIA: number
  diferenca: number
}
export interface TeamMember {
  id: string
  nome: string
  cargo: string
  fotoUrl: string | null
  descricao: string
  textoAlternativo: string
  posicaoFoto: string
  ordem: number
  status: 'pendente' | 'publicado'
}
export interface Contacts {
  whatsapp: string | null
  instagram: string | null
  email: string | null
  mensagemGeral: string | null
}
