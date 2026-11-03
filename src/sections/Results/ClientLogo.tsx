import type { ReactElement } from 'react'
import type { Client } from '@/types/content'
export function ClientLogo({
  client,
  priority,
  onLoad,
  onError,
}: {
  client: Client
  priority: boolean
  onLoad: () => void
  onError: () => void
}): ReactElement {
  return (
    <li className="client-logo">
      <img
        src={client.logoUrl ?? ''}
        alt={client.textoAlternativo}
        width="190"
        height="104"
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
        onLoad={(event) => {
          if (event.currentTarget.naturalWidth > 0) onLoad()
          else onError()
        }}
        onError={onError}
      />
    </li>
  )
}
