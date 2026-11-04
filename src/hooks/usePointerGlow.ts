import { useEffect, useRef } from 'react'
import { initializePointerGlow } from '@/lib/pointerGlow'

export function usePointerGlow() {
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const cleanups = Array.from(
      root.current?.querySelectorAll<HTMLElement>('.process-card') ?? [],
      initializePointerGlow,
    )
    return () => cleanups.forEach((cleanup) => cleanup())
  }, [])
  return root
}
