import { useEffect, useRef, useState } from 'react'
import type { ReactElement } from 'react'
import type { Client } from '@/types/content'
import { clientsContent } from '@/content/clientes'
import { clientLogoKey, getCarouselBounds } from '@/lib/clients'
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
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLUListElement>(null)
  const drag = useRef<{ x: number; left: number } | null>(null)
  const [bounds, setBounds] = useState({
    overflow: false,
    atStart: true,
    atEnd: true,
  })
  useEffect(() => {
    const viewport = viewportRef.current,
      track = trackRef.current
    if (!viewport || !track) return
    const measure = (): void => {
      const next = getCarouselBounds(
        viewport.scrollWidth,
        viewport.clientWidth,
        viewport.scrollLeft,
      )
      setBounds((previous) =>
        previous.overflow === next.overflow &&
        previous.atStart === next.atStart &&
        previous.atEnd === next.atEnd
          ? previous
          : next,
      )
    }
    const observer = new ResizeObserver(measure)
    observer.observe(viewport)
    observer.observe(track)
    viewport.addEventListener('scroll', measure, { passive: true })
    return () => {
      observer.disconnect()
      viewport.removeEventListener('scroll', measure)
    }
  }, [])
  const move = (direction: -1 | 1, edge = false): void => {
    const viewport = viewportRef.current
    if (!viewport) return
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)')
      .matches
      ? 'instant'
      : 'smooth'
    if (edge)
      viewport.scrollTo({
        left: direction === -1 ? 0 : viewport.scrollWidth,
        behavior,
      })
    else
      viewport.scrollBy({
        left: direction * viewport.clientWidth * 0.8,
        behavior,
      })
  }
  return (
    <div className="client-carousel">
      <div
        ref={viewportRef}
        className="clients-viewport"
        role="region"
        aria-label={clientsContent.carouselLabel}
        aria-roledescription={bounds.overflow ? 'carrossel' : undefined}
        tabIndex={bounds.overflow ? 0 : -1}
        data-overflow={bounds.overflow}
        onKeyDown={(event) => {
          if (!bounds.overflow) return
          if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
            event.preventDefault()
            move(
              event.key === 'ArrowLeft' || event.key === 'Home' ? -1 : 1,
              event.key === 'Home' || event.key === 'End',
            )
          }
        }}
        onPointerDown={(event) => {
          if (
            event.pointerType !== 'mouse' ||
            !bounds.overflow ||
            event.button !== 0
          )
            return
          drag.current = {
            x: event.clientX,
            left: event.currentTarget.scrollLeft,
          }
          event.currentTarget.setPointerCapture(event.pointerId)
        }}
        onPointerMove={(event) => {
          if (drag.current)
            event.currentTarget.scrollLeft =
              drag.current.left - (event.clientX - drag.current.x)
        }}
        onPointerUp={() => {
          drag.current = null
        }}
        onPointerCancel={() => {
          drag.current = null
        }}
        onLostPointerCapture={() => {
          drag.current = null
        }}
      >
        <ul ref={trackRef} className="clients-track">
          {clients.map((client, index) => (
            <ClientLogo
              key={clientLogoKey(client)}
              client={client}
              priority={index === 0}
              onLoad={() => onLoad(clientLogoKey(client))}
              onError={() => onError(clientLogoKey(client))}
            />
          ))}
        </ul>
      </div>
      {bounds.overflow && (
        <div className="clients-controls">
          <button
            type="button"
            aria-label={clientsContent.previous}
            disabled={bounds.atStart}
            onClick={() => move(-1)}
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            aria-label={clientsContent.next}
            disabled={bounds.atEnd}
            onClick={() => move(1)}
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      )}
    </div>
  )
}
