import { getMotionPreference } from './motionPreference.ts'

export interface CardTiltOptions {
  enabled?: boolean
  maxAngle?: number
  perspective?: number
  glowOpacity?: number
  returnDuration?: number
  glowColor?: string
}

export function calculateCardTilt(
  rect: { left: number; top: number; width: number; height: number },
  clientX: number,
  clientY: number,
  maxAngle = 4,
) {
  const x = Math.max(
    0,
    Math.min(1, (clientX - rect.left) / Math.max(1, rect.width)),
  )
  const y = Math.max(
    0,
    Math.min(1, (clientY - rect.top) / Math.max(1, rect.height)),
  )
  return {
    x: x * 100,
    y: y * 100,
    rotateX: (0.5 - y) * 2 * maxAngle,
    rotateY: (x - 0.5) * 2 * maxAngle,
  }
}

export function initializeCardTilt(
  node: HTMLElement,
  options: CardTiltOptions = {},
): () => void {
  if (options.enabled === false) return () => {}
  const pointer = window.matchMedia('(hover: hover) and (pointer: fine)')
  const reduced = getMotionPreference()
  const bounds = node.parentElement ?? node
  let frame = 0
  let point: { x: number; y: number } | undefined
  const set = (name: string, value: string) =>
    node.style.setProperty(name, value)
  set('--tilt-perspective', `${options.perspective ?? 1100}px`)
  set('--tilt-return', `${options.returnDuration ?? 380}ms`)
  set('--tilt-glow-opacity', String(options.glowOpacity ?? 0.12))
  set('--tilt-glow-color', options.glowColor ?? '#68dda8')
  const reset = () => {
    cancelAnimationFrame(frame)
    frame = 0
    point = undefined
    node.removeAttribute('data-tilting')
    set('--tilt-x', '0deg')
    set('--tilt-y', '0deg')
    set('--tilt-lift', '0px')
  }
  const update = () => {
    frame = 0
    if (!point || !pointer.matches || reduced.matches) {
      reset()
      return
    }
    const position = calculateCardTilt(
      bounds.getBoundingClientRect(),
      point.x,
      point.y,
      options.maxAngle ?? 4,
    )
    node.setAttribute('data-tilting', 'true')
    set('--tilt-x', `${position.rotateX}deg`)
    set('--tilt-y', `${position.rotateY}deg`)
    set('--tilt-light-x', `${position.x}%`)
    set('--tilt-light-y', `${position.y}%`)
    set('--tilt-lift', '-2px')
  }
  const move = (event: PointerEvent) => {
    if (
      event.pointerType !== 'mouse' ||
      !pointer.matches ||
      reduced.matches ||
      node.contains(document.activeElement)
    ) {
      reset()
      return
    }
    point = { x: event.clientX, y: event.clientY }
    if (!frame) frame = requestAnimationFrame(update)
  }
  node.addEventListener('pointerenter', move)
  node.addEventListener('pointermove', move)
  node.addEventListener('pointerleave', reset)
  node.addEventListener('pointercancel', reset)
  node.addEventListener('focusin', reset)
  pointer.addEventListener('change', reset)
  reduced.addEventListener('change', reset)
  const observer =
    typeof ResizeObserver === 'undefined'
      ? undefined
      : new ResizeObserver(reset)
  observer?.observe(bounds)
  return () => {
    reset()
    observer?.disconnect()
    node.removeEventListener('pointerenter', move)
    node.removeEventListener('pointermove', move)
    node.removeEventListener('pointerleave', reset)
    node.removeEventListener('pointercancel', reset)
    node.removeEventListener('focusin', reset)
    pointer.removeEventListener('change', reset)
    reduced.removeEventListener('change', reset)
  }
}
