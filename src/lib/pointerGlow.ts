/** Decorative interaction, independent of the plans tilt and global motion mode. */
export function initializePointerGlow(node: HTMLElement): () => void {
  const pointer = window.matchMedia('(hover: hover) and (pointer: fine)')
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
  let frame = 0
  let point: { x: number; y: number } | undefined
  const reset = () => {
    cancelAnimationFrame(frame)
    frame = 0
    point = undefined
    node.removeAttribute('data-pointer-glow')
  }
  const update = () => {
    frame = 0
    if (!point || !pointer.matches || reduced.matches) {
      reset()
      return
    }
    // Read once per frame so scrolling and reveal transforms cannot stale the bounds.
    const rect = node.getBoundingClientRect()
    const x = Math.max(0, Math.min(rect.width, point.x - rect.left))
    const y = Math.max(0, Math.min(rect.height, point.y - rect.top))
    node.style.setProperty('--pointer-x', `${x}px`)
    node.style.setProperty('--pointer-y', `${y}px`)
    node.setAttribute('data-pointer-glow', 'true')
  }
  const move = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse' || !pointer.matches || reduced.matches) {
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
  pointer.addEventListener('change', reset)
  reduced.addEventListener('change', reset)
  return () => {
    reset()
    node.removeEventListener('pointerenter', move)
    node.removeEventListener('pointermove', move)
    node.removeEventListener('pointerleave', reset)
    node.removeEventListener('pointercancel', reset)
    pointer.removeEventListener('change', reset)
    reduced.removeEventListener('change', reset)
  }
}
