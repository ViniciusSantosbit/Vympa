import { useEffect } from 'react'
import type { ReactElement } from 'react'
import type { Client } from '@/types/content'
import { ClientShowcase } from './ClientShowcase'
import { GrowthComparison } from './GrowthComparison'
export function Results({
  clients,
  onAvailabilityChange,
}: {
  clients?: readonly Client[]
  onAvailabilityChange?: (available: boolean) => void
}): ReactElement {
  useEffect(() => {
    onAvailabilityChange?.(true)
  }, [onAvailabilityChange])
  return (
    <section id="resultados" aria-labelledby="comparison-title">
      <ClientShowcase {...(clients ? { clients } : {})} />
      <GrowthComparison />
    </section>
  )
}
