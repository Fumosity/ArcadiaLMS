import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import AdminBookViewer from './AdminBookViewer/AdminBookViewer.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminBookViewer />
  </StrictMode>,
)
