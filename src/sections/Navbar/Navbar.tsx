import { useEffect, useRef, useState } from 'react'
import type { ReactElement } from 'react'
import { SegmentSelector } from './SegmentSelector'
import { InstitutionalNavigation } from './InstitutionalNavigation'
import { SectionLink } from '@/components/common/SectionLink'
import { MobileMenu } from './MobileMenu'
import './navbar.css'
export function Navbar({
  resultsAvailable = false,
}: {
  resultsAvailable?: boolean
}): ReactElement {
  const [scrolled, setScrolled] = useState(() => window.scrollY > 24)
  const [menuOpen, setMenuOpen] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > 24)
    const desktop = window.matchMedia('(min-width: 1100px)')
    const onResize = (): void => {
      if (desktop.matches) dialogRef.current?.close()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    desktop.addEventListener('change', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      desktop.removeEventListener('change', onResize)
    }
  }, [])
  return (
    <>
      <a className="skip-link" href="#main-content">
        Pular para o conteúdo
      </a>
      <header className={scrolled ? 'site-header is-scrolled' : 'site-header'}>
        <div className="navbar">
          <SectionLink className="brand" section="inicio">
            <span className="brand-symbol">
              <img
                src="/images/vympa-logo.png"
                alt=""
                width="500"
                height="500"
              />
            </span>
            <span className="brand-name">VYMPA</span>
          </SectionLink>
          <nav className="desktop-navigation" aria-label="Navegação principal">
            <SegmentSelector />
            <span className="navbar-divider" aria-hidden="true" />
            <InstitutionalNavigation resultsAvailable={resultsAvailable} />
          </nav>
          <button
            ref={toggleRef}
            type="button"
            className="menu-toggle mobile-toggle"
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-haspopup="dialog"
            onClick={() => {
              dialogRef.current?.showModal()
              setMenuOpen(true)
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </header>
      <MobileMenu
        resultsAvailable={resultsAvailable}
        dialogRef={dialogRef}
        onClose={() => {
          setMenuOpen(false)
          if (window.innerWidth < 1100) toggleRef.current?.focus()
        }}
      />
    </>
  )
}
