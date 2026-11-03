import { createContext } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { SegmentId } from '@/types/content'
export interface SegmentContextValue {
  selectionRevision?: number
  selectedSegment: SegmentId | null
  setSelectedSegment: Dispatch<SetStateAction<SegmentId | null>>
}
export const SegmentContext = createContext<SegmentContextValue | undefined>(
  undefined,
)
