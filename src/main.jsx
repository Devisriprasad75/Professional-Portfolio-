import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// Apply saved theme before paint to avoid a flash of the wrong theme.
const savedTheme = localStorage.getItem('dsp-theme')
if (savedTheme === 'light') document.documentElement.classList.add('light')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
