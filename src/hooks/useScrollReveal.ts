import { useEffect, useRef } from 'react'
import { initializeScrollReveal } from '@/lib/scrollReveal'

export function useScrollReveal() {
  const root = useRef<HTMLElement>(null)
  useEffect(() => {
    if (root.current) return initializeScrollReveal(root.current)
  }, [])
  return root
}
