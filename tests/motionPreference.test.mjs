import test from 'node:test'
import assert from 'node:assert/strict'
import { motionSettings } from '../src/content/motion.ts'
import { getMotionPreference } from '../src/lib/motionPreference.ts'

test('preferência explícita da VYMPA habilita movimento mesmo com sistema reduzido', (t) => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'window')
  const mode = motionSettings.mode
  t.after(() => {
    motionSettings.mode = mode
    if (original) Object.defineProperty(globalThis, 'window', original)
    else delete globalThis.window
  })
  globalThis.window = {
    matchMedia: (query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
    }),
  }
  motionSettings.mode = 'system'
  assert.equal(getMotionPreference().matches, true)
  motionSettings.mode = 'full'
  assert.equal(getMotionPreference().matches, false)
})
