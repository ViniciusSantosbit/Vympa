import { useMemo, useState } from 'react'
import type { ReactNode, ReactElement } from 'react'
import type { SegmentId } from '@/types/content'
import { SegmentContext } from '@/features/segment-selection/SegmentContext'
export function SegmentProvider({
  children,
}: {
  children: ReactNode
}): ReactElement {
  const [selectedSegment, setSelectedSegment] = useState<SegmentId | null>(null)
  const value = useMemo(
    () => ({ selectedSegment, setSelectedSegment }),
    [selectedSegment],
  )
  return (
    <SegmentContext.Provider value={value}>{children}</SegmentContext.Provider>
  )
}
