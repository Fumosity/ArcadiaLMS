import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/main-comp/Header';
import Navbar from './components/main-comp/Navbar';
import Footer from './components/main-comp/Footer';
import Copyright from './components/main-comp/Copyright';

// Admin Components
import AHomePage from './admin-home-page/AHomePage';
import ALibAnal from './admin-lib-analytics/ALibAnal';
import ABCirculationPage from './admin-book-circulation-page/ABCirculationPage';
import ABInventory from './admin-book-inventory/ABInventory';
import ASupportPage from './admin-support/ASupportPage';
import AReserv from './admin-reserv-page/AReserv';
import ARInventory from './admin-research-inventory/ARInventory';
import AUsrAcc from './admin-user-accounts/AUsrAcc';
import ABChecking from './admin-book-checking-in-out/ABChecking';
import ABAdd from './admin-book-add/ABAdd';
import ARAdd from './admin-research-add/ARAdd';
import ABViewer from './admin-book-viewer/ABViewer';
import ARViewer from './admin-research-viewer/ARViewer';
import ABModify from './admin-book-modify/ABModify';

// User Components
// import UsrRegistration from './UserPages/user-registration-page/UsrRegistration';
import UFooter from './components/UserComponents/user-main-comp/UFooter';
import UHeader from './components/UserComponents/user-main-comp/UHeader';
import UHomePage from './UserPages/user-home-page/UHomePage';
import UCopyright from './components/UserComponents/user-main-comp/UCopyright';

// Testing modals
import ModalTest from './z_modals/ModalTest';
import UBkCatalog from './UserPages/user-book-catalog-page/UBkCatalog';

function App() {
  return (
    <Routes>
      {/* User Route */}
      <Route
        path="/*" 
        element={
          <>
            <UHeader />
            <Routes>
              <Route path="/" element={<UBkCatalog />} />
            </Routes>
            <UFooter />
            <UCopyright />
          </>
        }
      />
      
      {/* Admin Routes */}
      <Route
        path="/*"
        element={
          <>
            <Header />
            <Navbar />
            <Routes>
              <Route path="/" element={<ModalTest />} />
              <Route path="/ahomepage" element={<AHomePage />} />
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
              <Route path="/abviewer" element={<ABViewer />} />
              <Route path="/arviewer" element={<ARViewer />} />
              <Route path="/bookmodify" element={<ABModify />} />
            </Routes>
            <Footer />
            <Copyright />
          </>
        }
      />
    </Routes>
  );
}

export default App;
