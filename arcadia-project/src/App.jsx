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
      </Routes>
    </>
  )
}

export default App;