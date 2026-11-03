export type SectionId =
  'inicio' | 'planos' | 'como-funciona' | 'resultados' | 'nosso-time'
let pending: AbortController | undefined
let scrolling = false
export function cancelSectionNavigation(): void {
  pending?.abort()
  pending = undefined
  if (scrolling)
    window.scrollTo({
      top: window.scrollY,
      left: window.scrollX,
      behavior: 'instant',
    })
  scrolling = false
}
function nextFrame(signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    const finish = (): void => {
      signal.removeEventListener('abort', cancel)
      resolve()
    }
    const id = requestAnimationFrame(finish)
    const cancel = (): void => {
      cancelAnimationFrame(id)
      finish()
    }
    if (signal.aborted) cancel()
    else signal.addEventListener('abort', cancel, { once: true })
  })
}
function waitForAnimations(
  animations: Animation[],
  signal: AbortSignal,
): Promise<void> {
  return new Promise((resolve) => {
    const finish = (): void => {
      signal.removeEventListener('abort', finish)
      resolve()
    }
    if (signal.aborted) {
      finish()
      return
    }
    signal.addEventListener('abort', finish, { once: true })
    void Promise.allSettled(
      animations.map((animation) => animation.finished),
    ).then(finish)
  })
}
export async function navigateToSection(
  id: SectionId,
  waitForHero = false,
): Promise<void> {
  cancelSectionNavigation()
  const controller = new AbortController()
  pending = controller
  const { signal } = controller
  const cancel = (): void => {
    if (pending === controller) cancelSectionNavigation()
  }
  window.addEventListener('wheel', cancel, { passive: true, signal })
  window.addEventListener('touchstart', cancel, { passive: true, signal })
  window.addEventListener('pointerdown', cancel, { passive: true, signal })
  window.addEventListener(
    'keydown',
    (event) => {
      if (
        [
          'ArrowUp',
          'ArrowDown',
          'PageUp',
          'PageDown',
          'Home',
          'End',
          'Escape',
          'Tab',
          ' ',
        ].includes(event.key)
      )
        cancel()
    },
    { signal },
  )
  // Dois frames permitem o commit do segmento e o fechamento do dialog mobile.
  await nextFrame(signal)
  if (signal.aborted) return
  await nextFrame(signal)
  if (signal.aborted) return
  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches
  if (!reducedMotion) {
    const hero = waitForHero ? document.querySelector('.hero-background') : null
    const menu = document.querySelector('#mobile-navigation')
    await waitForAnimations(
      [
        ...(hero?.getAnimations?.({ subtree: true }) ?? []),
        ...(menu?.getAnimations?.({ subtree: true }) ?? []),
      ],
      signal,
    )
  }
  if (signal.aborted) return
  const section = document.getElementById(id)
  if (!section) {
    cancelSectionNavigation()
    return
  }
  const heading = section.querySelector<HTMLElement>('h1, h2')
  heading?.focus({ preventScroll: true })
  scrolling = true
  const finish = (): void => {
    if (pending !== controller) return
    scrolling = false
    pending = undefined
    controller.abort()
  }
  window.addEventListener('scrollend', finish, { once: true, signal })
  section.scrollIntoView({
    behavior: reducedMotion ? 'instant' : 'smooth',
    block: 'start',
  })
  if (reducedMotion) finish()
}
