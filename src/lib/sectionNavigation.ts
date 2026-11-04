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

// Roda do mouse: compartilha o cancelamento da navegação, sem afetar toque ou carrosséis.
export function initializeDesktopScroll(): () => void {
  let wheelDestination: number | undefined
  let wheelController: AbortController | undefined
  let wheelDirection = 0
  const startWheelMotion = (controller: AbortController) => {
    let frame = 0
    let previous: number | undefined
    const finish = () => {
      cancelAnimationFrame(frame)
      controller.signal.removeEventListener('abort', finish)
      if (pending === controller) {
        pending = undefined
        scrolling = false
      }
      if (wheelController === controller) {
        wheelController = undefined
        wheelDestination = undefined
        wheelDirection = 0
      }
    }
    const step = (timestamp: number) => {
      if (controller.signal.aborted) {
        finish()
        return
      }
      const elapsed =
        previous === undefined
          ? 16
          : Math.min(64, Math.max(0, timestamp - previous))
      previous = timestamp
      const remaining = (wheelDestination ?? window.scrollY) - window.scrollY
      if (Math.abs(remaining) < 1) {
        window.scrollTo({
          top: wheelDestination ?? window.scrollY,
          behavior: 'instant',
        })
        finish()
        controller.abort()
        return
      }
      // Interpolacao temporal continua: novos gestos atualizam apenas o destino.
      const blend = 1 - Math.exp(-elapsed / 150)
      window.scrollTo({
        top:
          window.scrollY +
          Math.sign(remaining) *
            Math.min(
              Math.abs(remaining),
              Math.max(1, Math.abs(remaining) * blend),
            ),
        behavior: 'instant',
      })
      frame = requestAnimationFrame(step)
    }
    controller.signal.addEventListener('abort', finish, { once: true })
    frame = requestAnimationFrame(step)
  }
  const desktop = window.matchMedia('(pointer: fine) and (hover: hover)')
  const reduced = getMotionPreference()
  const onWheel = (event: WheelEvent) => {
    if (
      !desktop.matches ||
      reduced.matches ||
      event.ctrlKey ||
      event.shiftKey ||
      !event.cancelable ||
      Math.abs(event.deltaX) > Math.abs(event.deltaY) ||
      event.deltaY === 0
    )
      return
    if (document.querySelector('#mobile-navigation[open]')) return
    const element = event.target instanceof Element ? event.target : null
    if (
      element?.closest(
        'input, textarea, select, [contenteditable="true"], [role="slider"]',
      )
    )
      return
    for (
      let node = element;
      node && node !== document.body;
      node = node.parentElement
    ) {
      const style = getComputedStyle(node)
      if (
        /(auto|scroll)/.test(style.overflowY) &&
        node.scrollHeight > node.clientHeight &&
        ((event.deltaY > 0 &&
          node.scrollTop + node.clientHeight < node.scrollHeight - 1) ||
          (event.deltaY < 0 && node.scrollTop > 0))
      )
        return
    }
    const maximum = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight,
    )
    const scale =
      event.deltaMode === 1
        ? 16
        : event.deltaMode === 2
          ? window.innerHeight
          : 1
    const active = wheelController && !wheelController.signal.aborted
    const direction = Math.sign(event.deltaY)
    const origin =
      active && direction === wheelDirection
        ? (wheelDestination ?? window.scrollY)
        : window.scrollY
    const target = Math.min(maximum, Math.max(0, origin + event.deltaY * scale))
    if (target === window.scrollY && !wheelController) return
    event.preventDefault()
    if (active) {
      wheelDestination = target
      wheelDirection = direction
      return
    }
    cancelSectionNavigation()
    const controller = new AbortController()
    wheelController = controller
    wheelDestination = target
    wheelDirection = direction
    pending = controller
    scrolling = true
    startWheelMotion(controller)
  }
  const stop = () => {
    cancelSectionNavigation()
    wheelController = undefined
    wheelDestination = undefined
  }
  const change = () => {
    if (!desktop.matches || reduced.matches) stop()
  }
  window.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('touchstart', stop, { passive: true })
  window.addEventListener('pointerdown', stop, { passive: true })
  const keydown = (event: KeyboardEvent) => {
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
      stop()
  }
  window.addEventListener('keydown', keydown)
  desktop.addEventListener('change', change)
  reduced.addEventListener('change', change)
  return () => {
    stop()
    window.removeEventListener('wheel', onWheel)
    window.removeEventListener('touchstart', stop)
    window.removeEventListener('pointerdown', stop)
    window.removeEventListener('keydown', keydown)
    desktop.removeEventListener('change', change)
    reduced.removeEventListener('change', change)
  }
}
