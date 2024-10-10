import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ABInventory from './admin-book-inventory/ABInventory.jsx'
import ABViewer from './admin-book-viewer/ABViewer.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ABViewer />
  </StrictMode>,
)
