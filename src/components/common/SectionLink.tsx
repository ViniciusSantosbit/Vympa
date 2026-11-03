import type { ReactElement, ReactNode } from 'react'
import type { SectionId } from '@/lib/sectionNavigation'
import { useSectionNavigation } from '@/hooks/useSectionNavigation'
export function SectionLink({
  section,
  children,
  className,
  onNavigate,
}: {
  section: SectionId
  children: ReactNode
  className?: string
  onNavigate?: (() => void) | undefined
}): ReactElement {
  const { scrollToSection } = useSectionNavigation()
  return (
    <a
      href={`#${section}`}
      className={className}
      onClick={(event) => {
        if (
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        )
          return
        event.preventDefault()
        onNavigate?.()
        void scrollToSection(section)
      }}
    >
      {children}
    </a>
  )
}
