export type SegmentId = 'advocacia' | 'contabilidade' | 'imobiliarias'
export interface Segment {
  id: SegmentId
  nome: string
  descricaoApoio: string | null
  referenciaVisual: string | null
  contextoWhatsApp: string | null
}
export interface Service {
  id: 'servico-ia' | 'automacao-processos'
  nome: string
  descricao: string | null
  entregas: readonly string[]
  chamadaContato: string | null
}
export interface Client {
  id: string
  nome: string
  logoUrl: string | null
  segmento: SegmentId | null
}
export interface Simulation {
  descricao: string | null
  premissas: readonly string[]
  resultado: number | null
  unidade: string | null
}
export interface TeamMember {
  id: string
  nome: string
  cargo: string
  fotoUrl: string | null
}
export interface Contacts {
  whatsapp: string | null
  email: string | null
  mensagemGeral: string | null
}
