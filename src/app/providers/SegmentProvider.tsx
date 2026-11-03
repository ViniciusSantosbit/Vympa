import { useCallback, useMemo, useState } from 'react'
import type { ReactNode, ReactElement, Dispatch, SetStateAction } from 'react'
import type { SegmentId } from '@/types/content'
import { SegmentContext } from '@/features/segment-selection/SegmentContext'
export function SegmentProvider({
  children,
}: {
  children: ReactNode
}): ReactElement {
  const [selectedSegment, updateSelectedSegment] = useState<SegmentId | null>(
    null,
  )
  const [selectionRevision, setSelectionRevision] = useState(0)
  const setSelectedSegment: Dispatch<SetStateAction<SegmentId | null>> =
    useCallback((segment) => {
      updateSelectedSegment(segment)
      setSelectionRevision((revision) => revision + 1)
    }, [])
  const value = useMemo(
    () => ({ selectedSegment, setSelectedSegment, selectionRevision }),
    [selectedSegment, setSelectedSegment, selectionRevision],
  )
  return (
    <SegmentContext.Provider value={value}>{children}</SegmentContext.Provider>
  )
}
