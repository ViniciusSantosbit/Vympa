import type { CSSProperties, ReactElement } from 'react'
import type { Client } from '@/types/content'
export function ClientLogo({
  client,
  priority,
  onLoad,
  onError,
  offset = 0,
  multiple = false,
  onSelect,
}: {
  client: Client
  priority: boolean
  onLoad: () => void
  onError: () => void
  offset?: number
  multiple?: boolean
  onSelect?: () => void
}): ReactElement {
  const depth = Math.abs(offset)
  const image = (
    <img
      src={client.logoUrl ?? ''}
      alt={client.textoAlternativo}
      width="714"
      height="324"
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      onLoad={(event) => {
        if (event.currentTarget.naturalWidth > 0) onLoad()
        else onError()
      }}
      onError={onError}
    />
  )
  return (
    <li
      className="client-logo"
      data-active={offset === 0}
      data-depth={Math.min(depth, 3)}
      aria-hidden={depth > 2 ? true : undefined}
      style={
        {
          '--client-offset': offset,
          '--client-depth': depth,
          '--client-scale': Math.max(0.65, 1 - depth * 0.14),
          '--client-rotation': `${offset === 0 ? 0 : offset > 0 ? -8 : 8}deg`,
          zIndex: 10 - Math.min(depth, 9),
        } as CSSProperties
      }
    >
      {multiple ? (
        <button
          type="button"
          className="client-brand-stage"
          aria-label={`Mostrar logo de ${client.nome}`}
          aria-current={offset === 0 ? 'true' : undefined}
          tabIndex={offset === 0 ? 0 : -1}
          onClick={onSelect}
        >
          {image}
        </button>
      ) : (
        <div className="client-brand-stage">{image}</div>
      )}
    </li>
  )
}
