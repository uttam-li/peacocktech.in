import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'
import { registerSw } from '@lib/registerSw'
import { applyLowPower } from '@lib/lowPower'

document.documentElement.classList.add('js')
registerSw()
applyLowPower()

const root = document.getElementById('root')
if (!root) throw new Error('Missing #root mount point')
if (root.firstElementChild && !root.querySelector('.boot-fallback')) hydrateRoot(root, <App />)
else createRoot(root).render(<App />)