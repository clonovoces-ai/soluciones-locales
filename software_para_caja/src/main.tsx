import React from 'react'
import ReactDOM from 'react-dom/client'
import { POSProvider } from './context/POSContext'
import { AppContent } from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <POSProvider>
      <AppContent />
    </POSProvider>
  </React.StrictMode>,
)
