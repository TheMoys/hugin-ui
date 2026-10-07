import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import FantasmometroControl from './components/FantasmometroControl.jsx'

const isFantasmometroControl = window.location.pathname.replace(/\/+$/, '') === '/fantasmometro'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isFantasmometroControl ? <FantasmometroControl /> : <App />}
  </StrictMode>,
)
