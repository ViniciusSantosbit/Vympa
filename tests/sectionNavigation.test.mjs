import assert from 'node:assert/strict'
import test from 'node:test'
import {
  navigateToSection,
  cancelSectionNavigation,
} from '../src/lib/sectionNavigation.ts'

test('navegação cancelável, foco e movimento reduzido', async (t) => {
  const originals = new Map(
    ['window', 'document', 'requestAnimationFrame', 'cancelAnimationFrame'].map(
      (k) => [k, Object.getOwnPropertyDescriptor(globalThis, k)],
    ),
  )
  let frames = new Map(),
    counter = 0,
    reduced = false,
    animations = [],
    calls = [],
    focused = []
  const win = new EventTarget()
  Object.assign(win, {
    scrollX: 0,
    scrollY: 100,
    scrollTo: () => {},
    matchMedia: () => ({ matches: reduced }),
  })
  globalThis.window = win
  globalThis.document = {
    querySelector: (selector) =>
      selector === '.hero-background'
        ? { getAnimations: () => animations }
        : null,
    getElementById: (id) =>
      id === 'resultados'
        ? null
        : {
            querySelector: () => ({ focus: (opts) => focused.push(opts) }),
            scrollIntoView: (opts) => calls.push({ id, ...opts }),
          },
  }
  globalThis.requestAnimationFrame = (cb) => {
    const id = ++counter
    frames.set(id, cb)
    return id
  }
  globalThis.cancelAnimationFrame = (id) => frames.delete(id)
  const render = async () => {
    for (let i = 0; i < 3; i++) {
      const batch = [...frames.values()]
      frames.clear()
      batch.forEach((cb) => cb(0))
      await Promise.resolve()
      await Promise.resolve()
    }
  }
  const reset = () => {
    cancelSectionNavigation()
    frames.clear()
    calls = []
    focused = []
    animations = []
    reduced = false
  }
  try {
    await t.test('não navega na importação', () =>
      assert.equal(calls.length, 0),
    )
    await t.test('aguarda a transição visual', async () => {
      reset()
      let finish
      animations = [{ finished: new Promise((r) => (finish = r)) }]
      const nav = navigateToSection('planos', true)
      await render()
      assert.equal(calls.length, 0)
      finish()
      await nav
      assert.equal(calls[0].behavior, 'smooth')
      assert.deepEqual(focused, [{ preventScroll: true }])
    })
    await t.test('somente a última ação navega', async () => {
      reset()
      animations = [{ finished: new Promise(() => {}) }]
      const first = navigateToSection('planos', true)
      await render()
      animations = []
      const last = navigateToSection('como-funciona')
      await render()
      await Promise.all([first, last])
      assert.deepEqual(
        calls.map((c) => c.id),
        ['como-funciona'],
      )
    })
    await t.test('preferência reduzida ignora animação pendente', async () => {
      reset()
      reduced = true
      animations = [{ finished: new Promise(() => {}) }]
      const nav = navigateToSection('planos', true)
      await render()
      await nav
      assert.equal(calls[0].behavior, 'instant')
    })
    await t.test('sem animações continua funcional', async () => {
      reset()
      const nav = navigateToSection('planos', true)
      await render()
      await nav
      assert.equal(calls.length, 1)
    })
    await t.test('rolagem manual cancela pedido pendente', async () => {
      reset()
      const nav = navigateToSection('planos', true)
      win.dispatchEvent(new Event('wheel'))
      await render()
      await nav
      assert.equal(calls.length, 0)
      assert.equal(frames.size, 0)
    })
    await t.test('destino inexistente não produz scroll', async () => {
      reset()
      const nav = navigateToSection('resultados')
      await render()
      await nav
      assert.equal(calls.length, 0)
    })
    await t.test('desmontagem cancela frames e pendências', async () => {
      reset()
      const nav = navigateToSection('planos')
      cancelSectionNavigation()
      await nav
      assert.equal(frames.size, 0)
      assert.equal(calls.length, 0)
    })
  } finally {
    cancelSectionNavigation()
    for (const [key, descriptor] of originals) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor)
      else delete globalThis[key]
    }
  }
})
