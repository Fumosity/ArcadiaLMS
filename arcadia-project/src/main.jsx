import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ABInventory from './admin-book-inventory/ABInventory.jsx'
import ABViewer from './admin-book-viewer/ABViewer.jsx'
import ABCirculationPage from './admin-book-circulation-page/ABCirculationPage.jsx'
import ARAdd from './admin-research-add/ARAdd.jsx'
import ABAdd from './admin-book-add/ABAdd.jsx'
import ARoomBook from './admin-room-booking/ARoomBook.jsx'
import ALibAnal from './admin-lib-analytics/ALibAnal.jsx'
import AUsrAcc from './admin-user-accounts/AUsrAcc.jsx'
import ASupportPage from './admin-support/ASupportPage.jsx'
import ABCheckOut from './admin-book-checkout/ABCheckOut.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ABCheckOut />
  </StrictMode>,
)
