import { motionSettings } from '../src/content/motion.ts'
import assert from 'node:assert/strict'
import test from 'node:test'
import {
  initializeDesktopScroll,
  navigateToSection,
  cancelSectionNavigation,
} from '../src/lib/sectionNavigation.ts'

function harness(t, reduced = false, desktop = false) {
  motionSettings.mode = 'system'
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const keys = [
    'Element',
    'window',
    'document',
    'requestAnimationFrame',
    'cancelAnimationFrame',
  ]
  const originals = keys.map((key) => [
    key,
    Object.getOwnPropertyDescriptor(globalThis, key),
  ])
  const frames = new Map(),
    calls = [],
    focus = []
  let count = 0,
    time = 0
  globalThis.Element = class {}
  const win = new EventTarget()
  Object.assign(win, {
    scrollY: 0,
    scrollX: 0,
    innerHeight: 900,
    matchMedia: (query) =>
      Object.assign(new EventTarget(), {
        matches: query.includes('pointer: fine') ? desktop : reduced,
      }),
    scrollTo: (options) => {
      calls.push(options.top)
      win.scrollY = options.top
    },
  })
  globalThis.window = win
  globalThis.document = {
    documentElement: { scrollHeight: 4000 },
    querySelector: (selector) =>
      selector === '.site-header'
        ? { getBoundingClientRect: () => ({ height: 84 }) }
        : null,
    getElementById: (id) =>
      id === 'resultados'
        ? null
        : {
            getBoundingClientRect: () => ({
              top: (id === 'planos' ? 1000 : 2000) - win.scrollY,
            }),
            querySelector: () => ({ focus: (options) => focus.push(options) }),
          },
  }
  globalThis.requestAnimationFrame = (callback) => {
    const id = ++count
    frames.set(id, callback)
    return id
  }
  globalThis.cancelAnimationFrame = (id) => frames.delete(id)
  const step = async (advance = 100) => {
    time += advance
    const batch = [...frames.values()]
    frames.clear()
    batch.forEach((callback) => callback(time))
    for (let i = 0; i < 8; i++) await Promise.resolve()
  }
  const render = async () => {
    await step(16)
    await step(16)
    await step(16)
  }
  const complete = async () => {
    for (let i = 0; i < 16; i++) await step()
  }
  t.after(() => {
    cancelSectionNavigation()
    for (const [key, descriptor] of originals) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor)
      else delete globalThis[key]
    }
  })
  return { win, frames, calls, focus, render, step, complete }
}

test('seleção espera 800ms e percorre posições intermediárias com offset real', async (t) => {
  const h = harness(t)
  const nav = navigateToSection('planos', true)
  await h.render()
  t.mock.timers.tick(799)
  await h.step()
  assert.equal(h.calls.length, 0)
  t.mock.timers.tick(1)
  await h.step()
  await h.complete()
  await nav
  assert.ok(h.calls.some((y) => y > 0 && y < 900))
  assert.equal(h.calls.at(-1), 900)
  assert.ok(h.calls.every((y, i) => i === 0 || y >= h.calls[i - 1]))
  assert.deepEqual(h.focus, [{ preventScroll: true }])
  assert.equal(h.frames.size, 0)
})

test('última seleção reinicia o timer e vence a navegação anterior', async (t) => {
  const h = harness(t)
  const first = navigateToSection('planos', true)
  await h.render()
  t.mock.timers.tick(500)
  const last = navigateToSection('como-funciona', true)
  await h.render()
  t.mock.timers.tick(799)
  await h.step()
  assert.equal(h.calls.length, 0)
  t.mock.timers.tick(1)
  await h.step()
  await h.complete()
  await Promise.all([first, last])
  assert.equal(h.calls.at(-1), 1900)
  assert.equal(h.focus.length, 1)
})

for (const event of ['wheel', 'touchstart', 'pointerdown']) {
  test(`${event} interrompe rolagem em curso`, async (t) => {
    const h = harness(t)
    const nav = navigateToSection('planos')
    await h.render()
    await h.step()
    h.win.dispatchEvent(new Event(event))
    const count = h.calls.length
    await h.complete()
    await nav
    assert.equal(h.calls.length, count)
    assert.equal(h.frames.size, 0)
    assert.equal(h.focus.length, 0)
  })
}

test('movimento reduzido navega imediatamente sem timer decorativo', async (t) => {
  const h = harness(t, true)
  const nav = navigateToSection('planos', true)
  await h.render()
  await nav
  assert.deepEqual(h.calls, [900])
})

test('destino ausente e desmontagem não produzem navegação', async (t) => {
  const h = harness(t)
  const missing = navigateToSection('resultados')
  await h.render()
  await missing
  assert.equal(h.calls.length, 0)
  const nav = navigateToSection('planos', true)
  cancelSectionNavigation()
  await h.render()
  await nav
  assert.equal(h.calls.length, 0)
  assert.equal(h.frames.size, 0)
})

function wheel(win, delta, extras = {}) {
  const event = new Event('wheel', { cancelable: true })
  Object.assign(event, {
    deltaY: delta,
    deltaX: 0,
    deltaMode: 0,
    ctrlKey: false,
    shiftKey: false,
    ...extras,
  })
  win.dispatchEvent(event)
  return event
}
test('roda desktop tem percurso intermediario e acumula entradas', async (t) => {
  const h = harness(t, false, true)
  const cleanup = initializeDesktopScroll()
  assert.equal(wheel(h.win, 120).defaultPrevented, true)
  await h.step(16)
  await h.step(100)
  assert.ok(h.win.scrollY > 0 && h.win.scrollY < 120)
  wheel(h.win, 120)
  await h.complete()
  assert.equal(h.win.scrollY, 240)
  cleanup()
  assert.equal(h.frames.size, 0)
})
for (const [name, reduced, desktop] of [
  ['mobile', false, false],
  ['movimento reduzido', true, true],
]) {
  test(`roda nativa preservada: ${name}`, (t) => {
    const h = harness(t, reduced, desktop)
    const cleanup = initializeDesktopScroll()
    assert.equal(wheel(h.win, 120).defaultPrevented, false)
    assert.equal(h.frames.size, 0)
    cleanup()
  })
}
test('zoom e gesto horizontal nao sao interceptados no desktop', (t) => {
  const h = harness(t, false, true)
  const cleanup = initializeDesktopScroll()
  assert.equal(wheel(h.win, 120, { ctrlKey: true }).defaultPrevented, false)
  assert.equal(wheel(h.win, 10, { deltaX: 100 }).defaultPrevented, false)
  cleanup()
})

test('giros sucessivos mantem um unico frame e inversao descarta inercia anterior', async (t) => {
  const h = harness(t, false, true)
  const cleanup = initializeDesktopScroll()
  wheel(h.win, 300)
  await h.step(16)
  await h.step(100)
  wheel(h.win, 200)
  assert.equal(h.frames.size, 1)
  const position = h.win.scrollY
  wheel(h.win, -40)
  assert.equal(h.frames.size, 1)
  await h.complete()
  assert.equal(h.win.scrollY, Math.max(0, position - 40))
  cleanup()
})
test('inercia termina tambem com arredondamento a pixels inteiros', async (t) => {
  const h = harness(t, false, true)
  const write = h.win.scrollTo
  h.win.scrollTo = (options) =>
    write({ ...options, top: Math.round(options.top) })
  const cleanup = initializeDesktopScroll()
  wheel(h.win, 120)
  await h.complete()
  assert.equal(h.win.scrollY, 120)
  assert.equal(h.frames.size, 0)
  cleanup()
})
