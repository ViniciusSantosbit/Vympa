import type { SegmentId, ServiceId } from '../types/content'
const segmentContext: Record<SegmentId, string> = {
  advocacia: 'meu escritório de advocacia',
  contabilidade: 'meu escritório de contabilidade',
  imobiliarias: 'minha imobiliária',
}
export function buildServiceMessage(
  serviceId: ServiceId,
  segment: SegmentId | null,
): string {
  const context = segment ? segmentContext[segment] : 'minha empresa'
  return serviceId === 'servico-ia'
    ? 'Olá! Conheci a VYMPA pelo site e gostaria de conversar sobre uma solução de sistema personalizado com IA para ' +
        context +
        '.'
    : 'Olá! Conheci a VYMPA pelo site e gostaria de saber mais sobre automação de processos para ' +
        context +
        '.'
}
export function buildWhatsAppUrl(
  phone: string | null,
  message: string,
): string | null {
  if (!phone || !/^\+?[\d\s().-]+$/.test(phone.trim())) return null
  const normalized = phone.replace(/\D/g, '')
  // Formato internacional E.164: código do país, sem prefixo 00 ou zero inicial.
  if (!/^[1-9]\d{7,14}$/.test(normalized)) return null
  return 'https://wa.me/' + normalized + '?text=' + encodeURIComponent(message)
}
