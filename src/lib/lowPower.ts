/**
 * Old / mid-range phones never turn on "reduce motion", but they still
 * choke on always-on loops (pit physics, auto-typing, ambient CSS loops).
 * Detect them once per page load and park a `low-power` flag on <html>:
 * CSS kills ambient loops, JS settles physics instantly instead of looping.
 * Same thresholds as the Plumage lite budget, plus update:slow + Save-Data.
 */
export function isLowPowerDevice(): boolean {
  try {
    if (window.matchMedia('(update: slow)').matches) return true
    const nav = navigator as Navigator & {
      deviceMemory?: number
      connection?: { saveData?: boolean }
    }
    if (nav.connection && nav.connection.saveData) return true
    if (nav.deviceMemory && nav.deviceMemory <= 4) return true
    if (nav.hardwareConcurrency && nav.hardwareConcurrency <= 4) return true
  } catch {
    /* storage/privacy modes: stay full-power */
  }
  return false
}

export function applyLowPower(): void {
  try {
    if (isLowPowerDevice()) document.documentElement.classList.add('low-power')
  } catch {
    /* never break boot for a perf hint */
  }
}
