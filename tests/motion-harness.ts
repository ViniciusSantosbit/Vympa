import { getMotionPreference } from '../src/lib/motionPreference'
import '../src/main'

const page = document.documentElement
page.dataset.motionEnvironment = JSON.stringify({
  width: window.innerWidth,
  effectiveReduced: getMotionPreference().matches,
  siteMode: document.documentElement.dataset.motion,
  reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  fine: window.matchMedia('(pointer: fine)').matches,
  hover: window.matchMedia('(hover: hover)').matches,
})
let recording = false
function record() {
  if (recording) return
  recording = true
  const start = performance.now()
  const positions: [number, number][] = []
  const sample = (time: number) => {
    positions.push([Math.round(time - start), window.scrollY])
    page.dataset.motionSamples = JSON.stringify(positions)
    if (time - start < 2300) requestAnimationFrame(sample)
    else recording = false
  }
  requestAnimationFrame(sample)
}
window.addEventListener('wheel', (event) => {
  page.dataset.motionWheel = JSON.stringify({
    delta: event.deltaY,
    cancelable: event.cancelable,
    prevented: event.defaultPrevented,
  })
  record()
})
window.addEventListener('click', record)
