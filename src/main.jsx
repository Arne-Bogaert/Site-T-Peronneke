import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Reservatiebeheer from './pages/Reservatiebeheer.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/reservatiebeheer" element={<Reservatiebeheer />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
