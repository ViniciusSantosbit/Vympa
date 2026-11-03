import { useSegment } from '@/features/segment-selection/useSegment'
import type { SegmentId } from '@/types/content'
import { navigateToSection } from '@/lib/sectionNavigation'
export function useSectionNavigation() {
  const { setSelectedSegment } = useSegment()
  return {
    scrollToSection: navigateToSection,
    selectSegmentAndNavigate: (segment: SegmentId): void => {
      setSelectedSegment(segment)
      void navigateToSection('planos', true)
    },
  }
}
