import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import DuckDbProvider from './provider'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DuckDbProvider>
      <App />
    </DuckDbProvider>
  </React.StrictMode>
)
