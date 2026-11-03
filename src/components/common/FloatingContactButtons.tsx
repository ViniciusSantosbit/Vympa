import { contatos } from '@/content/contatos'
import { useSegment } from '@/features/segment-selection/useSegment'
import { buildContactMessage, buildWhatsAppUrl } from '@/lib/whatsapp'
import { validateInstagramUrl } from '@/lib/instagram'
import './floatingContacts.css'

export function FloatingContactButtons() {
  const { selectedSegment } = useSegment()
  const whatsapp = buildWhatsAppUrl(
    contatos.whatsapp,
    buildContactMessage(selectedSegment),
  )
  const instagram = validateInstagramUrl(contatos.instagram)
  if (!whatsapp && !instagram) return null
  return (
    <nav className="floating-contacts" aria-label="Canais oficiais de contato">
      {whatsapp && (
        <a
          className="floating-contact floating-whatsapp"
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Conversar com a VYMPA pelo WhatsApp"
          title="WhatsApp"
        >
          <svg
            viewBox="0 0 24 24"
            width="28"
            height="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M20.5 3.5a11 11 0 0 0-17.3 13L1.5 23l6.6-1.7a11 11 0 0 0 12.4-17.8Z" />
            <path d="m8 6 2 4-1.5 1.5a10 10 0 0 0 4 4L14 14l4 2c0 2-1.5 3-3 2.5A15 15 0 0 1 5.5 9C5 7.5 6 6 8 6Z" />
          </svg>
        </a>
      )}
      {instagram && (
        <a
          className="floating-contact floating-instagram"
          href={instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visitar o Instagram oficial da VYMPA"
          title="Instagram"
        >
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
            focusable="false"
          >
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle
              cx="17.5"
              cy="6.5"
              r="1"
              fill="currentColor"
              stroke="none"
            />
          </svg>
        </a>
      )}
    </nav>
  )
}
