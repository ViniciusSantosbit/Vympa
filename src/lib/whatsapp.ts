import type { SegmentId, ServiceId } from '../types/content'
import { mensagensComerciais } from '../content/contatos.ts'
export function buildContactMessage(
  segment: SegmentId | null,
  serviceId: ServiceId | null = null,
): string {
  return mensagensComerciais[serviceId ?? 'geral'][segment ?? 'geral']
}
export function buildServiceMessage(
  serviceId: ServiceId,
  segment: SegmentId | null,
): string {
  return buildContactMessage(segment, serviceId)
}
export function normalizeWhatsAppPhone(phone: string | null): string | null {
  if (!phone || !/^\+?[\d\s().-]+$/.test(phone.trim())) return null
  const normalized = phone.replace(/\D/g, '')
  if (!/^[1-9]\d{7,14}$/.test(normalized)) return null
  if (normalized.startsWith('1') && !/^1[2-9]\d{2}[2-9]\d{6}$/.test(normalized))
    return null
  // Exige código internacional explícito; nunca adiciona 55.
  if (normalized.startsWith('55')) {
    const local = normalized.slice(2)
    if (
      !/^(?:1[1-9]|2[12478]|3[1-578]|4[1-9]|5[1345]|6[1-9]|7[134579]|8[1-9]|9[1-9])$/.test(
        local.slice(0, 2),
      ) ||
      !/^\d{2}(?:[2-5]\d{7}|9\d{8})$/.test(local)
    )
      return null
  }
  return normalized
}
export function buildWhatsAppUrl(
  phone: string | null,
  message: string,
): string | null {
  const normalized = normalizeWhatsAppPhone(phone)
  if (!normalized) return null
  return 'https://wa.me/' + normalized + '?text=' + encodeURIComponent(message)
}
