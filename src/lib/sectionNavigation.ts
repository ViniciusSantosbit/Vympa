import { getMotionPreference } from './motionPreference.ts'
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
function waitForDelay(
  milliseconds: number,
  signal: AbortSignal,
): Promise<void> {
  return new Promise((resolve) => {
    const finish = (): void => {
      clearTimeout(timer)
      signal.removeEventListener('abort', finish)
      resolve()
    }
    const timer = setTimeout(finish, milliseconds)
    if (signal.aborted) finish()
    else signal.addEventListener('abort', finish, { once: true })
  })
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
  const reducedMotion = getMotionPreference().matches
  const heroDelay =
    waitForHero && !reducedMotion
      ? waitForDelay(800, signal)
      : Promise.resolve()
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
  await heroDelay
  if (signal.aborted) return
  const section = document.getElementById(id)
  if (!section) {
    cancelSectionNavigation()
    return
  }
  // Anchors live on stable wrappers, outside reveal transforms. Hidden client
  // content is skipped so Results can start at its comparison introduction.
  const anchor = Array.from(
    section.querySelectorAll<HTMLElement>('[data-section-anchor]'),
  ).find((node) => node.getClientRects().length > 0)
  const target = id === 'inicio' ? section : (anchor ?? section)
  const heading = target.querySelector<HTMLElement>('h1, h2')
  const header = document.querySelector('.site-header')
  const offset = (header?.getBoundingClientRect().height ?? 0) + 16
  const maximum = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight,
  )
  const destination = Math.min(
    maximum,
    Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset),
  )
  scrolling = true
  if (reducedMotion) {
    window.scrollTo({ top: destination, behavior: 'instant' })
  } else {
    await animateScroll(destination, signal)
  }
  if (signal.aborted) return
  // Foco somente na chegada; preventScroll evita um segundo deslocamento.
  heading?.focus({ preventScroll: true })
  scrolling = false
  pending = undefined
  controller.abort()
}

function animateScroll(
  destination: number,
  signal: AbortSignal,
): Promise<void> {
  const origin = window.scrollY
  const distance = destination - origin
  if (Math.abs(distance) < 1) return Promise.resolve()
  const duration = Math.min(1200, Math.max(950, Math.abs(distance) * 0.8))
  return new Promise((resolve) => {
    let frame = 0
    let start: number | undefined
    const finish = () => {
      cancelAnimationFrame(frame)
      signal.removeEventListener('abort', finish)
      resolve()
    }
    const step = (timestamp: number) => {
      if (signal.aborted) {
        finish()
        return
      }
      start ??= timestamp
      const progress = Math.min(1, (timestamp - start) / duration)
      const eased =
        progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2
      window.scrollTo({ top: origin + distance * eased, behavior: 'instant' })
      if (progress < 1) frame = requestAnimationFrame(step)
      else finish()
    }
    signal.addEventListener('abort', finish, { once: true })
    if (signal.aborted) finish()
    else frame = requestAnimationFrame(step)
  })
}
