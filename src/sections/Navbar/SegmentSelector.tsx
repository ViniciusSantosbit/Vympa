import type { ReactElement } from 'react'
import { useSectionNavigation } from '@/hooks/useSectionNavigation'
import { segmentos } from '@/content/segmentos'
import { useSegment } from '@/features/segment-selection/useSegment'
export function SegmentSelector({
  onSelect,
}: {
  onSelect?: () => void
}): ReactElement {
  const { selectedSegment } = useSegment()
  const { selectSegmentAndNavigate } = useSectionNavigation()
  return (
    <div
      className="segment-selector"
      role="group"
      aria-label="Selecione seu segmento"
    >
      {segmentos.map((segment) => (
        <button
          key={segment.id}
          type="button"
          className="nav-item segment-item"
          aria-pressed={selectedSegment === segment.id}
          onClick={() => {
            selectSegmentAndNavigate(segment.id)
            onSelect?.()
          }}
        >
          {segment.nome}
        </button>
      ))}
    </div>
  )
}
