import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateCardTilt, initializeCardTilt } from '../src/lib/cardTilt.ts'
import { motionSettings } from '../src/content/motion.ts'

test('centro, quatro extremos e limites de inclinacao', () => {
  const rect = { left: 100, top: 50, width: 200, height: 400 }
  assert.deepEqual(calculateCardTilt(rect, 200, 250), {
    x: 50,
    y: 50,
    rotateX: 0,
    rotateY: 0,
  })
  assert.equal(calculateCardTilt(rect, 100, 250).rotateY, -4)
  assert.equal(calculateCardTilt(rect, 300, 250).rotateY, 4)
  assert.equal(calculateCardTilt(rect, 200, 50).rotateX, 4)
  assert.equal(calculateCardTilt(rect, 200, 450).rotateX, -4)
  assert.deepEqual(calculateCardTilt(rect, -1000, 9999), {
    x: 0,
    y: 100,
    rotateX: -4,
    rotateY: -4,
  })
})

function setup(t, { reduced = false, fine = true } = {}) {
  const keys = [
    'window',
    'document',
    'requestAnimationFrame',
    'cancelAnimationFrame',
    'ResizeObserver',
  ]
  const originals = keys.map((key) => [
    key,
    Object.getOwnPropertyDescriptor(globalThis, key),
  ])
  const previousMode = motionSettings.mode
  motionSettings.mode = 'system'
  globalThis.window = {
    matchMedia: (query) =>
      Object.assign(new EventTarget(), {
        matches: query.includes('pointer: fine') ? fine : reduced,
      }),
  }
  globalThis.document = { activeElement: null }
  globalThis.ResizeObserver = undefined
  const frames = new Map()
  let index = 0
  globalThis.requestAnimationFrame = (cb) => {
    frames.set(++index, cb)
    return index
  }
  globalThis.cancelAnimationFrame = (id) => frames.delete(id)
  const node = () => {
    const element = new EventTarget(),
      styles = new Map(),
      attributes = new Map()
    return Object.assign(element, {
      style: { setProperty: (key, value) => styles.set(key, value) },
      styles,
      attributes,
      setAttribute: (key, value) => attributes.set(key, value),
      removeAttribute: (key) => attributes.delete(key),
      parentElement: {
        getBoundingClientRect: () => ({
          left: 0,
          top: 0,
          width: 200,
          height: 400,
        }),
      },
      contains: () => false,
    })
  }
  const move = (element, x, y, pointerType = 'mouse') => {
    const event = new Event('pointermove')
    Object.assign(event, { clientX: x, clientY: y, pointerType })
    element.dispatchEvent(event)
  }
  const render = () => {
    const batch = [...frames.values()]
    frames.clear()
    batch.forEach((cb) => cb())
  }
  t.after(() => {
    motionSettings.mode = previousMode
    for (const [key, descriptor] of originals) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor)
      else delete globalThis[key]
    }
  })
  return { node, move, render, frames }
}

test('cada card e independente e atualiza uma vez por frame', (t) => {
  const h = setup(t),
    first = h.node(),
    second = h.node()
  const cleanup = initializeCardTilt(first),
    cleanupSecond = initializeCardTilt(second)
  h.move(first, 10, 20)
  h.move(first, 200, 400)
  assert.equal(h.frames.size, 1)
  h.render()
  assert.equal(first.styles.get('--tilt-y'), '4deg')
  assert.equal(first.styles.get('--tilt-x'), '-4deg')
  assert.equal(first.styles.get('--tilt-light-x'), '100%')
  assert.equal(second.attributes.has('data-tilting'), false)
  first.dispatchEvent(new Event('pointerleave'))
  assert.equal(first.styles.get('--tilt-x'), '0deg')
  assert.equal(first.styles.get('--tilt-y'), '0deg')
  assert.equal(first.attributes.has('data-tilting'), false)
  cleanup()
  cleanupSecond()
})

test('saida rapida cancela frame, foco cancela tilt e desmontagem remove listeners', (t) => {
  const h = setup(t),
    node = h.node(),
    cleanup = initializeCardTilt(node)
  h.move(node, 10, 20)
  node.dispatchEvent(new Event('pointerleave'))
  assert.equal(h.frames.size, 0)
  h.move(node, 10, 20)
  h.render()
  node.dispatchEvent(new Event('focusin'))
  assert.equal(node.attributes.has('data-tilting'), false)
  cleanup()
  h.move(node, 10, 20)
  assert.equal(h.frames.size, 0)
})

for (const options of [{ reduced: true }, { fine: false }]) {
  test(`efeito desativado: ${JSON.stringify(options)}`, (t) => {
    const h = setup(t, options),
      node = h.node(),
      cleanup = initializeCardTilt(node)
    h.move(node, 10, 20)
    h.render()
    assert.equal(node.attributes.has('data-tilting'), false)
    cleanup()
  })
}
test('touch nao inicia inclinacao e opcoes podem desativar o efeito', (t) => {
  const h = setup(t),
    node = h.node(),
    cleanup = initializeCardTilt(node)
  h.move(node, 10, 20, 'touch')
  assert.equal(h.frames.size, 0)
  cleanup()
  initializeCardTilt(node, { enabled: false })()
  h.move(node, 10, 20)
  assert.equal(h.frames.size, 0)
})
