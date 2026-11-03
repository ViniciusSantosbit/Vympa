import { motionSettings } from '../content/motion.ts'

export function getMotionPreference(): MediaQueryList {
  // "not all" nunca corresponde: a preferência explícita habilita movimento só neste site.
  return window.matchMedia(
    motionSettings.mode === 'system'
      ? '(prefers-reduced-motion: reduce)'
      : 'not all',
  )
}
