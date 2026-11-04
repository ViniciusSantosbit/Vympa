import test from 'node:test'
import assert from 'node:assert/strict'
import { initializePointerGlow } from '../src/lib/pointerGlow.ts'
import { motionSettings } from '../src/content/motion.ts'

function setup(t) {
  const originalMode = motionSettings.mode
  motionSettings.mode = 'system'
  const keys = ['window', 'requestAnimationFrame', 'cancelAnimationFrame']
  const originals = keys.map((key) => [
    key,
    Object.getOwnPropertyDescriptor(globalThis, key),
  ])
  const fine = Object.assign(new EventTarget(), { matches: true })
  const reduced = Object.assign(new EventTarget(), { matches: false })
  globalThis.window = {
    matchMedia: (query) =>
      query.includes('pointer: fine')
        ? fine
        : query === 'not all'
          ? Object.assign(new EventTarget(), { matches: false })
          : reduced,
  }
  const frames = new Map()
  let id = 0
  globalThis.requestAnimationFrame = (cb) => {
    frames.set(++id, cb)
    return id
  }
  globalThis.cancelAnimationFrame = (id) => frames.delete(id)
  t.after(() => {
    motionSettings.mode = originalMode
    for (const [key, descriptor] of originals) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor)
      else delete globalThis[key]
    }
  })
  const node = () =>
    Object.assign(new EventTarget(), {
      styles: new Map(),
      attributes: new Map(),
      reads: 0,
      style: {
        setProperty(key, value) {
          this.owner.styles.set(key, value)
        },
      },
      setAttribute(key, value) {
        this.attributes.set(key, value)
      },
      removeAttribute(key) {
        this.attributes.delete(key)
      },
      getBoundingClientRect() {
        this.reads++
        return { left: 100, top: 50, width: 300, height: 200 }
      },
    })
  const make = () => {
    const n = node()
    n.style.owner = n
    return n
  }
  const move = (n, x, y, pointerType = 'mouse', type = 'pointermove') => {
    n.dispatchEvent(
      Object.assign(new Event(type), { clientX: x, clientY: y, pointerType }),
    )
  }
  const flush = () => {
    const callbacks = [...frames.values()]
    frames.clear()
    callbacks.forEach((cb) => cb())
  }
  return { make, move, flush, frames, fine, reduced }
}

test('movimento completo mantém glow mesmo com sistema reduzido', (t) => {
  const h = setup(t)
  h.reduced.matches = true
  motionSettings.mode = 'full'
  const node = h.make()
  const cleanup = initializePointerGlow(node)
  h.move(node, 150, 100)
  h.flush()
  assert.equal(node.attributes.get('data-pointer-glow'), 'true')
  cleanup()
})

test('glow independente, coordenadas relativas e eventos agrupados em um frame', (t) => {
  const h = setup(t),
    first = h.make(),
    second = h.make()
  const clean = [initializePointerGlow(first), initializePointerGlow(second)]
  h.move(first, 100, 50, 'mouse', 'pointerenter')
  h.move(first, 400, 250)
  assert.equal(h.frames.size, 1)
  h.flush()
  assert.equal(first.reads, 1)
  assert.equal(first.styles.get('--pointer-x'), '300px')
  assert.equal(first.styles.get('--pointer-y'), '200px')
  assert.equal(second.attributes.size, 0)
  h.move(first, 250, 150)
  h.flush()
  assert.equal(first.styles.get('--pointer-x'), '150px')
  first.dispatchEvent(new Event('pointerleave'))
  assert.equal(first.attributes.size, 0)
  h.move(second, 100, 50)
  h.flush()
  assert.equal(second.attributes.has('data-pointer-glow'), true)
  clean.forEach((fn) => fn())
})

test('saída rápida, cancelamento e desmontagem não deixam frames ou efeito ativos', (t) => {
  const h = setup(t),
    node = h.make(),
    cleanup = initializePointerGlow(node)
  h.move(node, 110, 70)
  node.dispatchEvent(new Event('pointerleave'))
  assert.equal(h.frames.size, 0)
  h.move(node, 110, 70)
  h.flush()
  node.dispatchEvent(new Event('pointercancel'))
  assert.equal(node.attributes.size, 0)
  h.move(node, 110, 70)
  cleanup()
  h.move(node, 110, 70)
  assert.equal(h.frames.size, 0)
})

test('touch, ponteiro impreciso e preferência reduzida mantêm borda estática', (t) => {
  const h = setup(t),
    node = h.make(),
    cleanup = initializePointerGlow(node)
  h.move(node, 110, 70, 'touch')
  assert.equal(h.frames.size, 0)
  h.fine.matches = false
  h.move(node, 110, 70)
  assert.equal(h.frames.size, 0)
  h.fine.matches = true
  h.move(node, 110, 70)
  h.flush()
  h.reduced.matches = true
  h.reduced.dispatchEvent(new Event('change'))
  assert.equal(node.attributes.size, 0)
  h.move(node, 110, 70)
  assert.equal(h.frames.size, 0)
  cleanup()
})
