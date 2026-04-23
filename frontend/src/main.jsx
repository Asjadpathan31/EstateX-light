import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster position="top-right" toastOptions={{
        duration: 3500,
        style: { background:'#fff', color:'#0a1628', border:'1px solid #e4e8f0', fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'0.875rem', borderRadius:'12px', padding:'12px 16px', boxShadow:'0 8px 28px rgba(10,22,40,0.12)' },
        success: { iconTheme: { primary:'#d4a843', secondary:'#fff' } },
        error:   { iconTheme: { primary:'#dc2626', secondary:'#fff' } },
      }} />
    </BrowserRouter>
  </StrictMode>
)
