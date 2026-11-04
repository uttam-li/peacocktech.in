import { Component, type ReactNode } from 'react'
import { T } from '@data/site'

interface State {
  failed: boolean
}

/** Last-resort translated UI. Never leave the visitor on a blank page. */
export default class ErrorCatcher extends Component<{ children: ReactNode }, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  private async freshReload(): Promise<void> {
    try {
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations()
        await Promise.all(regs.map((r) => r.unregister()))
        const keys = await caches.keys()
        await Promise.all(keys.map((k) => caches.delete(k)))
      }
    } catch {
      /* best effort: reload anyway */
    }
    window.location.reload()
  }

  render(): ReactNode {
    if (!this.state.failed) return this.props.children
    return (
      <div className="error-fallback" role="alert">
        <p>{T('Something went wrong loading this page.', 'આ પેજ લોડ થવામાં કંઈક ખોટું થયું.', 'इस पेज को लोड करने में कुछ गलत हुआ।')}</p>
        <div className="error-fallback__row">
          <button type="button" onClick={() => this.setState({ failed: false })}>
            {T('Try again', 'ફરી પ્રયાસ કરો', 'पुनः प्रयास करें')}
          </button>
          <button type="button" onClick={() => void this.freshReload()}>
            {T('Reload fresh', 'નવેસરથી લોડ કરો', 'ताज़ा लोड करें')}
          </button>
          <a href="mailto:support@peacocktech.in">{T('Contact us', 'સંપર્ક કરો', 'संपर्क करें')}</a>
        </div>
      </div>
    )
  }
}
