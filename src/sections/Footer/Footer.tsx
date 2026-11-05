import { footerContent as content } from '@/content/footer'
import { contatos } from '@/content/contatos'
import { validateInstagramUrl } from '@/lib/instagram'
import { buildContactMessage, buildWhatsAppUrl } from '@/lib/whatsapp'
import { useSegment } from '@/features/segment-selection/useSegment'
import { navigateToSection } from '@/lib/sectionNavigation'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import './footer.css'

export function Footer() {
  const revealRoot = useScrollReveal()
  const { selectedSegment } = useSegment()
  const instagram = validateInstagramUrl(contatos.instagram)
  const whatsapp = buildWhatsAppUrl(
    contatos.whatsapp,
    buildContactMessage(selectedSegment),
  )
  const email = contatos.email?.trim()
  const emailUrl =
    email && /^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(email)
      ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`
      : null
  const channels = [
    { label: 'Instagram', href: instagram },
    { label: 'WhatsApp', href: whatsapp },
    { label: 'E-mail', href: emailUrl },
  ].filter((channel) => channel.href)

  return (
    <footer
      ref={revealRoot}
      className="site-footer"
      aria-labelledby="footer-title"
    >
      <div className="footer-container">
        <div className="footer-heading" data-reveal>
          <p className="footer-eyebrow">{content.eyebrow}</p>
          <h2 id="footer-title">{content.title}</h2>
          <p>{content.description}</p>
        </div>
        <div className="footer-grid">
          {content.cards.map((card, index) => (
            <article
              key={card.id}
              className={`footer-card footer-card-${card.id}`}
              data-reveal
            >
              <div className="footer-art" aria-hidden="true">
                {card.imageUrl && (
                  <img src={card.imageUrl} alt="" loading="lazy" />
                )}
                {card.id === 'contato' && (
                  <div className="footer-conversation">
                    <span>Olá, VYMPA.</span>
                    <span>Vamos conversar?</span>
                  </div>
                )}
              </div>
              <div className="footer-card-top">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <span className="footer-card-arrow" aria-hidden="true">
                  ↗
                </span>
              </div>
              <div className="footer-card-copy">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                {card.id === 'projeto' && (
                  <div className="footer-evidence">
                    <a
                      href={content.evidence.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {content.evidence.label} <span aria-hidden="true">↗</span>
                    </a>
                    <small>{content.evidence.notice}</small>
                  </div>
                )}
                {card.id === 'contato' && channels.length > 0 && (
                  <nav
                    className="footer-channels"
                    aria-label="Contato com a VYMPA"
                  >
                    {channels.map((channel) => (
                      <a
                        key={channel.label}
                        href={channel.href!}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {channel.label} <span aria-hidden="true">↗</span>
                      </a>
                    ))}
                  </nav>
                )}
              </div>
            </article>
          ))}
        </div>
        <div className="footer-bottom">
          <div className="footer-brand">
            <img
              src="/images/vympa-logo.png"
              width="44"
              height="44"
              alt=""
              loading="lazy"
            />
            <div>
              <strong>VYMPA</strong>
              <p>{content.tagline}</p>
            </div>
          </div>
          <small>
            © {new Date().getFullYear()} {content.rights}
          </small>
          <a
            href="#inicio"
            onClick={(event) => {
              event.preventDefault()
              void navigateToSection('inicio')
            }}
          >
            {content.backToTop} <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
