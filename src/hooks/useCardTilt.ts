import { useEffect, useRef } from 'react'
import { initializeCardTilt } from '@/lib/cardTilt'

export function useCardTilt(glowColor: string) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    if (ref.current) return initializeCardTilt(ref.current, { glowColor })
  }, [glowColor])
  return ref
}
