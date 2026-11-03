import { getMotionPreference } from './motionPreference.ts'
export function initializeScrollReveal(root: HTMLElement): () => void {
  if (typeof IntersectionObserver === 'undefined') return () => {}
  const preference = getMotionPreference()
  if (preference.matches) return () => {}
  const seen = new WeakSet<Element>()
  const animations = new Map<HTMLElement, Animation>()
  let observer: IntersectionObserver | undefined
  let mutations: MutationObserver | undefined
  const finish = () => {
    observer?.disconnect()
    mutations?.disconnect()
    for (const animation of animations.values()) animation.cancel()
    animations.clear()
  }
  const reveal = (node: HTMLElement) => {
    observer?.unobserve(node)
    if (seen.has(node)) return
    seen.add(node)
    if (preference.matches || node.contains(document.activeElement)) return
    try {
      const delay = Math.min(
        300,
        Math.max(0, Number(node.dataset.revealDelay) || 0),
      )
      const animation = node.animate(
        [
          { opacity: 0, translate: '0 24px' },
          { opacity: 1, translate: '0 0' },
        ],
        {
          duration: 700,
          delay,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          fill: 'backwards',
        },
      )
      animations.set(node, animation)
      void animation.finished
        .catch(() => {})
        .finally(() => {
          if (animations.get(node) === animation) animations.delete(node)
        })
    } catch {
      /* HTML permanece visível se Web Animations falhar. */
    }
  }
  const focus = (event: FocusEvent) => {
    for (const [node, animation] of animations) {
      if (event.target instanceof Node && node.contains(event.target)) {
        animation.cancel()
        animations.delete(node)
      }
    }
  }
  const change = () => {
    if (preference.matches) finish()
  }
  try {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) reveal(entry.target as HTMLElement)
      },
      { threshold: 0.12, rootMargin: '0px 0px -48px 0px' },
    )
    const scan = () => {
      for (const node of root.querySelectorAll<HTMLElement>('[data-reveal]')) {
        if (!seen.has(node)) observer?.observe(node)
      }
    }
    scan()
    mutations = new MutationObserver(scan)
    mutations.observe(root, { childList: true, subtree: true })
    root.addEventListener('focusin', focus)
    preference.addEventListener('change', change)
  } catch {
    finish()
  }
  return () => {
    finish()
    root.removeEventListener('focusin', focus)
    preference.removeEventListener('change', change)
  }
}
