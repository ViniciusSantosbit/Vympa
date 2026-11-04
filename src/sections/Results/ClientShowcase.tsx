import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactElement } from 'react'
import type { Client } from '@/types/content'
import { clientes, clientsContent } from '@/content/clientes'
import { clientLogoKey, validateClients } from '@/lib/clients'
import { ClientCarousel } from './ClientCarousel'
import './results.css'
export function ClientShowcase({
  clients = clientes,
  onAvailabilityChange,
}: {
  clients?: readonly Client[]
  onAvailabilityChange?: (available: boolean) => void
}): ReactElement | null {
  const valid = useMemo(() => validateClients(clients), [clients])
  const [loaded, setLoaded] = useState<ReadonlySet<string>>(() => new Set())
  const [failed, setFailed] = useState<ReadonlySet<string>>(() => new Set())
  const available = valid.filter((client) => !failed.has(clientLogoKey(client)))
  const visible = available.some((client) => loaded.has(clientLogoKey(client)))
  const onLoad = useCallback((key: string): void => {
    setLoaded((previous) =>
      previous.has(key) ? previous : new Set([...previous, key]),
    )
  }, [])
  const onError = useCallback((key: string): void => {
    setFailed((previous) =>
      previous.has(key) ? previous : new Set([...previous, key]),
    )
  }, [])
  useEffect(() => {
    onAvailabilityChange?.(visible)
  }, [visible, onAvailabilityChange])
  if (available.length === 0) return null
  return (
    <section
      data-reveal
      className="clients-section"
      hidden={!visible}
      aria-labelledby="clients-title"
    >
      <div className="clients-heading" data-section-anchor>
        <p className="clients-eyebrow">{clientsContent.eyebrow}</p>
        <h2 data-reveal id="clients-title" tabIndex={-1}>
          {clientsContent.title}
        </h2>
        <p className="clients-subtitle">
          {clientsContent.subtitle} <span>{clientsContent.subtitleBrand}</span>
        </p>
      </div>
      <ClientCarousel clients={available} onLoad={onLoad} onError={onError} />
    </section>
  )
}
