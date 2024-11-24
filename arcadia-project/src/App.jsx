import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
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
import ASchedule from './admin-schedule-page/ASchedule'

// User Components
import UsrRegistration from './UserPages/user-registration-page/UsrRegistration';
import UFooter from './components/UserComponents/user-main-comp/UFooter';
import UHeader from './components/UserComponents/user-main-comp/UHeader';
import UHomePage from './UserPages/user-home-page/UHomePage';
import UCopyright from './components/UserComponents/user-main-comp/UCopyright';
import UBkCatalog from './UserPages/user-book-catalog-page/UBkCatalog';
import URsrchCatalog from './UserPages/user-rsrch-catalog-page/URsrchCatalog';
import UNewsNUpd from './UserPages/user-news-and-updates-page/UNewsNUpd';
import UDiscussionReserv from './UserPages/user-room-reserv-page/UDiscussionReserv';
import UServices from './UserPages/user-services-page/UServices';
import USupport from './UserPages/user-support-page/USupport';
import USupportTix from './UserPages/user-support-tickets-page/USupportTix';
import UReports from './UserPages/user-report-page/UReports';
import AReportViewPage from './admin-report/AReportViewPage';
import ASupportViewPage from './admin-report/ASupportViewPage';
import ULogin from './UserPages/user-log-sign-page/ULogin';

// Testing modals
import ModalTest from './z_modals/ModalTest';
import ErrorPage from './UserPages/ErrorPage';
import URegister from './UserPages/user-log-sign-page/URegister';

function App() {
  return (
    <Routes>
      {/* User Route */}
      {/* <Route path="*" element={<UHomePage/>}/> */}

      <Route
        path="/*"
        element={
          <>
            <UHeader />
            <Routes>
<<<<<<< HEAD
              <Route path="/" element={<UHomePage />} />
              <Route path="/user/register" element={<UsrRegistration />} />
=======
              <Route path="/" element={<ModalTest />} />
>>>>>>> fd9e7641a7898faaea3d124dd59715180bd8d1eb
              <Route path="/user/login" element={<ULogin />} />
              <Route path="/user/register" element={<URegister />} />
              <Route path="/user/bookmanagement" element={<UBkCatalog />} />
              <Route path="/user/researchmanagement" element={<URsrchCatalog />} />
              <Route path="/user/newsupdates" element={<UNewsNUpd />} />
              <Route path="/user/reservations" element={<UDiscussionReserv />} />
              <Route path="/user/services" element={<UServices />} />
              <Route path="/user/support" element={<USupport />} />
              <Route path="/user/support/supportticket" element={<USupportTix />} />
              <Route path="/user/support/reportticket" element={<UReports />} />

            </Routes>
            <UFooter />
            <UCopyright />
          </>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <>
            <Header />
            <Navbar />
            <Routes>
              <Route path="/" element={<AHomePage />} />
              <Route path="analytics" element={<ALibAnal />} />
              <Route path="circulatoryhistory" element={<ABCirculationPage />} />
              <Route path="bookmanagement" element={<ABInventory />} />
              <Route path="researchmanagement" element={<ARInventory />} />
              <Route path="useraccounts" element={<AUsrAcc />} />
              <Route path="support" element={<ASupportPage />} />
              <Route path="reservations" element={<AReserv />} />
              <Route path="abcirculationpage" element={<ABCirculationPage />} />
              <Route path="bookcheckinout" element={<ABChecking />} />
              <Route path="bookadding" element={<ABAdd />} />
              <Route path="researchadding" element={<ARAdd />} />
              <Route path="abviewer" element={<ABViewer />} />
              <Route path="arviewer" element={<ARViewer />} />
              <Route path="bookmodify" element={<ABModify />} />
              <Route path="reportticket" element={<AReportViewPage />} />
              <Route path="supportticket" element={<ASupportViewPage />} />
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
