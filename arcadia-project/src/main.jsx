import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ABInventory from './admin-book-inventory/ABInventory.jsx'
import ABViewer from './admin-book-viewer/ABViewer.jsx'
import ABCirculationPage from './admin-book-circulation-page/ABCirculationPage.jsx'
import ARAdd from './admin-research-add/ARAdd.jsx'
import ABAdd from './admin-book-add/ABAdd.jsx'
import ABChecking from './admin-book-checking-in-out/ABChecking.jsx'
import ARViewer from './admin-research-viewer/ARViewer.jsx'
import ASupportPage from './admin-support/ASupportPage.jsx'
import AHomePage from './admin-home-page/AHomePage.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
