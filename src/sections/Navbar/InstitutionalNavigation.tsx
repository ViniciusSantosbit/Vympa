import type { ReactElement } from 'react'
import { SectionLink } from '@/components/common/SectionLink'
export function InstitutionalNavigation({
  onNavigate,
}: {
  onNavigate?: () => void
}): ReactElement {
  return (
    <ul className="institutional-links">
      <li>
        <SectionLink
          section="planos"
          className="nav-item"
          onNavigate={onNavigate}
        >
          Soluções
        </SectionLink>
      </li>
      <li>
        <SectionLink
          section="como-funciona"
          className="nav-item"
          onNavigate={onNavigate}
        >
          Como funciona
        </SectionLink>
      </li>
      <li>
        <span className="nav-item" aria-disabled="true">
          Resultados<span className="sr-only"> — disponível em breve</span>
        </span>
      </li>
    </ul>
  )
}
