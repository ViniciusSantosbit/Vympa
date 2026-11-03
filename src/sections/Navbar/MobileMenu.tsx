import type { ReactElement, RefObject } from 'react'
import { SegmentSelector } from './SegmentSelector'
import { InstitutionalNavigation } from './InstitutionalNavigation'
export function MobileMenu({
  resultsAvailable = false,
  dialogRef,
  onClose,
}: {
  resultsAvailable?: boolean
  dialogRef: RefObject<HTMLDialogElement | null>
  onClose: () => void
}): ReactElement {
  return (
    <dialog
      ref={dialogRef}
      id="mobile-navigation"
      className="mobile-menu"
      aria-labelledby="mobile-menu-title"
      onClose={onClose}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return
        const buttons = [
          ...event.currentTarget.querySelectorAll<HTMLElement>(
            'button, a[href]',
          ),
        ]
        const first = buttons[0]
        const last = buttons.at(-1)
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close()
      }}
    >
      <div className="mobile-menu-content">
        <div className="mobile-menu-heading">
          <h2 id="mobile-menu-title">Navegação</h2>
          <button
            type="button"
            className="menu-toggle"
            aria-label="Fechar menu"
            onClick={() => dialogRef.current?.close()}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <nav aria-label="Navegação mobile">
          <p className="mobile-label">Seu segmento</p>
          <SegmentSelector onSelect={() => dialogRef.current?.close()} />
          <div className="mobile-divider" />
          <InstitutionalNavigation
            resultsAvailable={resultsAvailable}
            onNavigate={() => dialogRef.current?.close()}
          />
        </nav>
      </div>
    </dialog>
  )
}
