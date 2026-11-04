import { motionSettings } from '../src/content/motion.ts'
import test from 'node:test'
import assert from 'node:assert/strict'
import { initializeScrollReveal } from '../src/lib/scrollReveal.ts'

function setup(t, { reduced = false, fail = false } = {}) {
  motionSettings.mode = 'system'
  const keys = [
    'window',
    'document',
    'IntersectionObserver',
    'MutationObserver',
  ]
  const originals = keys.map((key) => [
    key,
    Object.getOwnPropertyDescriptor(globalThis, key),
  ])
  const media = new EventTarget()
  media.matches = reduced
  globalThis.window = { matchMedia: () => media }
  globalThis.document = { activeElement: null }
  const played = [],
    unobserved = []
  let callback,
    disconnected = 0,
    canceled = 0,
    scans = 0
  globalThis.IntersectionObserver = class {
    constructor(cb, options) {
      if (fail) throw Error('unavailable')
      callback = cb
      assert.equal(options.threshold, 0.12)
    }
    observe() {
      scans++
    }
    unobserve(node) {
      unobserved.push(node)
    }
    disconnect() {
      disconnected++
    }
  }
  globalThis.MutationObserver = class {
    observe() {}
    disconnect() {}
  }
  const node = {
    dataset: { revealDelay: '100' },
    contains: () => false,
    animate: (keyframes, options) => {
      played.push({ keyframes, options })
      return {
        finished: new Promise(() => {}),
        cancel() {
          canceled++
        },
      }
    },
  }
  const root = new EventTarget()
  root.querySelectorAll = () => [node]
  t.after(() => {
    for (const [key, descriptor] of originals) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor)
      else delete globalThis[key]
    }
  })
  return {
    root,
    node,
    media,
    played,
    unobserved,
    emit: () => callback([{ target: node, isIntersecting: true }]),
    counts: () => ({ disconnected, canceled, scans }),
  }
}

test('revela uma vez, com escalonamento, e limpa observer e animações', (t) => {
  const h = setup(t)
  const cleanup = initializeScrollReveal(h.root)
  assert.equal(h.played.length, 0)
  h.emit()
  h.emit()
  assert.equal(h.played.length, 1)
  assert.equal(h.played[0].options.delay, 100)
  assert.equal(h.played[0].options.duration, 700)
  assert.equal(h.played[0].keyframes[0].translate, '0 24px')
  assert.equal(h.played[0].keyframes[1].opacity, 1)
  cleanup()
  assert.ok(h.counts().disconnected > 0)
  assert.equal(h.counts().canceled, 1)
})

test('movimento reduzido e observer ausente mantêm HTML visível sem animação', (t) => {
  const h = setup(t, { reduced: true })
  initializeScrollReveal(h.root)()
  assert.equal(h.counts().scans, 0)
  h.media.matches = false
  delete globalThis.IntersectionObserver
  initializeScrollReveal(h.root)()
  assert.equal(h.played.length, 0)
})

test('falha de inicialização não altera a visibilidade do conteúdo', (t) => {
  const h = setup(t, { fail: true })
  assert.doesNotThrow(() => initializeScrollReveal(h.root)())
  assert.equal(h.played.length, 0)
  assert.equal(h.node.style, undefined)
})

test('mudança para movimento reduzido interrompe efeitos em curso', (t) => {
  const h = setup(t)
  const cleanup = initializeScrollReveal(h.root)
  h.emit()
  h.media.matches = true
  h.media.dispatchEvent(new Event('change'))
  assert.equal(h.counts().canceled, 1)
  cleanup()
})

test('timeline usa o observer existente, revela uma vez e acompanha o último card', (t) => {
  const h = setup(t)
  h.node.dataset = { revealGroup: 'process' }
  h.node.closest = () => ({})
  const parts = [0, 100, 200].map((delay) => ({
    ...h.node,
    dataset: { revealDelay: String(delay) },
  }))
  const line = { ...h.node, dataset: { revealLine: '', revealDelay: '100' } }
  h.node.querySelectorAll = () => [...parts, line]
  const cleanup = initializeScrollReveal(h.root)
  h.emit()
  h.emit()
  assert.equal(h.played.length, 4)
  assert.deepEqual(
    h.played.slice(0, 3).map((x) => x.options.delay),
    [0, 100, 200],
  )
  const lastCard = h.played[2].options
  const progress = h.played[3]
  assert.equal(
    progress.options.delay + progress.options.duration,
    lastCard.delay + lastCard.duration,
  )
  assert.equal(progress.keyframes[1].scale, '1 1')
  cleanup()
  assert.equal(h.counts().canceled, 4)
})

test('seção de processo respeita o sistema mesmo com movimento global completo', (t) => {
  const h = setup(t)
  motionSettings.mode = 'full'
  h.node.closest = () => ({})
  const system = Object.assign(new EventTarget(), { matches: true })
  globalThis.window.matchMedia = (query) =>
    query.includes('prefers-reduced-motion') ? system : h.media
  const cleanup = initializeScrollReveal(h.root)
  h.emit()
  assert.equal(h.played.length, 0)
  cleanup()
})
