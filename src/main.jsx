import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const rootElement = document.getElementById('root')

if (!rootElement) {
  document.body.innerHTML = '<div style="color: white; background: #020202; height: 100vh; display: flex; align-items: center; justify-content: center; font-family: sans-serif;">Critical Error: Root element not found.</div>'
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

window.onerror = function(message, source, lineno, colno, error) {
  console.error("Global Error Caught:", message, error);
  return false;
};
