import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// The browser's own scroll restoration (default: 'auto') restores the
// scroll position from before a plain reload — so refreshing while
// scrolled down to Projects lands back at Projects instead of the top.
// Disabling it and handling scroll position explicitly instead (see
// App.jsx's home-route effect, which still restores scroll when going
// "back" from a project detail page — this only kills the browser's
// automatic, blanket version of that).
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
