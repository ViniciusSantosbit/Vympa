import { useRef, useState } from 'react'
import type { ReactElement } from 'react'
import type { Client } from '@/types/content'
import { clientsContent } from '@/content/clientes'
import { clientLogoKey } from '@/lib/clients'
import { ClientLogo } from './ClientLogo'
export function ClientCarousel({
  clients,
  onLoad,
  onError,
}: {
  clients: readonly Client[]
  onLoad: (key: string) => void
  onError: (key: string) => void
}): ReactElement {
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const drag = useRef<{ x: number; y: number } | null>(null)
  const dragged = useRef(false)
  const active = Math.max(
    0,
    clients.findIndex((client) => clientLogoKey(client) === selectedKey),
  )
  const multiple = clients.length > 1
  const select = (index: number) => {
    const client = clients[(index + clients.length) % clients.length]
    if (client) setSelectedKey(clientLogoKey(client))
  }
  const move = (direction: -1 | 1) => select(active + direction)
  return (
    <div className="client-carousel" data-single={!multiple}>
      <div
        className="clients-viewport"
        role="region"
        aria-label={clientsContent.carouselLabel}
        aria-roledescription={multiple ? 'carrossel' : undefined}
        tabIndex={multiple ? 0 : -1}
        onKeyDown={(event) => {
          if (!multiple) return
          if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
            event.preventDefault()
            if (event.key === 'Home') select(0)
            else if (event.key === 'End') select(clients.length - 1)
            else move(event.key === 'ArrowLeft' ? -1 : 1)
          }
        }}
        onPointerDown={(event) => {
          if (!multiple || event.button !== 0) return
          dragged.current = false
          drag.current = { x: event.clientX, y: event.clientY }
        }}
        onPointerMove={(event) => {
          const start = drag.current
          if (
            start &&
            Math.abs(event.clientX - start.x) > 10 &&
            Math.abs(event.clientX - start.x) >
              Math.abs(event.clientY - start.y)
          ) {
            event.currentTarget.setPointerCapture(event.pointerId)
          }
        }}
        onPointerUp={(event) => {
          const start = drag.current
          drag.current = null
          if (!start) return
          const dx = event.clientX - start.x,
            dy = event.clientY - start.y
          if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
            dragged.current = true
            move(dx < 0 ? 1 : -1)
          }
        }}
        onClickCapture={(event) => {
          if (dragged.current) {
            event.preventDefault()
            event.stopPropagation()
            dragged.current = false
          }
        }}
        onPointerCancel={() => {
          drag.current = null
        }}
        onLostPointerCapture={() => {
          drag.current = null
        }}
      >
        <ul className="clients-track" role="list">
          {clients.map((client, index) => {
            let offset = (index - active + clients.length) % clients.length
            if (offset > clients.length / 2) offset -= clients.length
            return (
              <ClientLogo
                key={clientLogoKey(client)}
                client={client}
                priority={index === 0}
                offset={offset}
                multiple={multiple}
                onSelect={() => select(index)}
                onLoad={() => onLoad(clientLogoKey(client))}
                onError={() => onError(clientLogoKey(client))}
              />
            )
          })}
        </ul>
      </div>
      {multiple && (
        <>
          <p
            className="clients-position"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <span>{String(active + 1).padStart(2, '0')}</span>
            <small> / {String(clients.length).padStart(2, '0')}</small>
          </p>
          <div className="clients-controls">
            <button
              type="button"
              aria-label={clientsContent.previous}
              onClick={() => move(-1)}
            >
              <span aria-hidden="true">‹</span>
            </button>
            <div className="clients-pagination">
              {clients.map((client, index) => (
                <button
                  key={client.id}
                  type="button"
                  aria-label={`Mostrar logo de ${client.nome}`}
                  aria-current={index === active ? 'true' : undefined}
                  onClick={() => select(index)}
                >
                  <span aria-hidden="true" />
                </button>
              ))}
            </div>
            <button
              type="button"
              aria-label={clientsContent.next}
              onClick={() => move(1)}
            >
              <span aria-hidden="true">›</span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
