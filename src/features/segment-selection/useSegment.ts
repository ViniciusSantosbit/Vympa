import { useContext } from 'react'
import { SegmentContext } from './SegmentContext'
import type { SegmentContextValue } from './SegmentContext'
export function useSegment(): SegmentContextValue {
  const context = useContext(SegmentContext)
  if (context === undefined)
    throw new Error('useSegment deve ser usado dentro de SegmentProvider')
  return context
}
