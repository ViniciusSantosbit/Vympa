import { contatos } from '@/content/contatos'
import type { SegmentId, ServiceId } from '@/types/content'
import { validateInstagramUrl } from './instagram'
import { buildContactMessage, buildWhatsAppUrl } from './whatsapp'

export function commercialContact(
  segment: SegmentId | null,
  service: ServiceId | null = null,
): string | null {
  const message = buildContactMessage(segment, service)
  const whatsapp = buildWhatsAppUrl(contatos.whatsapp, message)
  if (whatsapp) return whatsapp
  const email = contatos.email?.trim()
  if (email && /^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(email)) {
    const params = new URLSearchParams({
      view: 'cm',
      fs: '1',
      to: email,
      su: 'Conversa sobre soluções VYMPA',
      body: message,
    })
    return 'https://mail.google.com/mail/?' + params.toString()
  }
  return validateInstagramUrl(contatos.instagram)
}
