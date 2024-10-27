import React from 'react';
import Header from './components/main-comp/Header';
import Navbar from './components/main-comp/Navbar';
import AHomePage from './admin-home-page/AHomePage';
import ALibAnal from './admin-lib-analytics/ALibAnal';
import { Route, Routes } from 'react-router-dom';
import ABCirculationPage from './admin-book-circulation-page/ABCirculationPage';
import ABInventory from './admin-book-inventory/ABInventory';
import ASupportPage from './admin-support/ASupportPage';
import AReserv from './admin-reserv-page/AReserv';
import ARInventory from './admin-research-inventory/ARInventory';
import AUsrAcc from './admin-user-accounts/AUsrAcc';
import Footer from './components/main-comp/Footer';
import Copyright from './components/main-comp/Copyright';
import ABChecking from './admin-book-checking-in-out/ABChecking';
import ABAdd from './admin-book-add/ABAdd';
import ARAdd from './admin-research-add/ARAdd';
import ABViewer from './admin-book-viewer/ABViewer';
import ARViewer from './admin-research-viewer/ARViewer';

function App() {
  return (
    <>
      <Header/>
      <Navbar />
      <Routes>
        <Route path="/" element={<AHomePage />} />
        <Route path="/analytics" element={<ALibAnal />} />
        <Route path="/circulatoryhistory" element={<ABCirculationPage />} />
        <Route path="/bookmanagement" element={<ABInventory />} />
        <Route path="/researchmanagement" element={<ARInventory />} />
        <Route path="/useraccounts" element={<AUsrAcc />} />
        <Route path="/support" element={<ASupportPage />} />
        <Route path="/reservations" element={<AReserv />} />
        <Route path="/abcirculationpage" element={<ABCirculationPage />} />
        <Route path="/bookcheckinout" element={<ABChecking />} />
        <Route path="/bookadding" element={<ABAdd />} />
        <Route path="/researchadding" element={<ARAdd />} />
        <Route path="/abviewer" element={<ABViewer />}/>
        <Route path="/arviewer" element={<ARViewer />}/>
      </Routes>
      
      <Footer />
      <Copyright />
      
    </>
  )
}

export default App;