import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/main-comp/Header';
import Navbar from './components/main-comp/Navbar';
import Footer from './components/main-comp/Footer';
import Copyright from './components/main-comp/Copyright';
import ProtectedRoute from './backend/ProtectedRoute.jsx';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
import ABCopies from './admin-book-copies/ABCopies.jsx';
import ARViewer from './admin-research-viewer/ARViewer';
import ABModify from './admin-book-modify/ABModify';
import ARModify from './admin-research-modify/ARModify';
import ASchedule from './admin-schedule-page/ASchedule'
import ASystemReports from './admin-system-reports-page/ASystemReport.jsx'
import AGenreMgmt from './admin-genre-mgmt/AGenreMgmt.jsx';
import AGAdd from './admin-genre-add/AGAdd.jsx';
import AGModify from './admin-genre-modify/AGModify.jsx';
import ABExport from './admin-book-export/ABExport.jsx';

// User Components
import UsrRegistration from './UserPages/user-registration-page/UsrRegistration';
import UFooter from './components/UserComponents/user-main-comp/UFooter';
import UHeader from './components/UserComponents/user-main-comp/UHeader';
import UHomePage from './UserPages/user-home-page/UHomePage';
import UCopyright from './components/UserComponents/user-main-comp/UCopyright';
import URsrchCatalog from './UserPages/user-rsrch-catalog-page/URsrchCatalog';

import UDiscussionReserv from './UserPages/user-room-reserv-page/UDiscussionReserv';
import UServices from './UserPages/user-services-page/UServices';
import USupport from './UserPages/user-support-page/USupport';
import USupportTix from './UserPages/user-support-tickets-page/USupportTix';
import UReports from './UserPages/user-report-page/UReports';
import AReportViewPage from './admin-report/AReportViewPage';
import ASupportViewPage from './admin-report/ASupportViewPage';
import ULogin from './UserPages/user-log-sign-page/ULogin';
import UBookView from './UserPages/user-book-view-page/UBookView.jsx';

import ErrorPage from './UserPages/ErrorPage';
import URegister from './UserPages/user-log-sign-page/URegister';
import AUAccView from './admin-user-account-view/AUAccView';
import AAccountView from './admin-account-view/AAccountView';
import UAccountProfile from './UserPages/user-account-page/UAccountProfile';
import UBkCatalog from './UserPages/user-book-catalog-page/UBkCatalog';
import AAccountSettings from './admin-account-page/AAccountSettings';
import UFAQs from './UserPages/user-freq-questions-page/UFAQs';
import UMostPop from './UserPages/user-most-popular-page/UMostPop';
import UHighlyRated from './UserPages/user-highly-rated-page/UHighlyRated';
import AReservView from './admin-reserv-page/AReservView';
import AdminErrorPage from './AdminErrorPage.jsx';
import URsrchView from './UserPages/user-rsrch-view-page/URsrchView.jsx';
import AuthComplete from './UserPages/AuthComplete.jsx';
import GenrePage from './components/UserComponents/user-genre-cat/GenrePage.jsx';
import ARExport from './admin-research-export/ARExport.jsx';

function App() {
  return (
    <>
    <ToastContainer />
    <Routes>
      <Route path="/user/login" element={<ULogin />}/>
      <Route path="/user/register" element={<URegister />} />
      <Route
        path="/*"
        element={
          <>
            <UHeader />
            <Routes>
              <Route path="/" element={<UHomePage />} />
              <Route path="/user/register" element={<UsrRegistration />} />
              <Route path="/user/bookmanagement" element={<UBkCatalog />} />
              <Route path="/user/researchmanagement" element={<URsrchCatalog />} />
              <Route path="/user/reservations" element={<ProtectedRoute><UDiscussionReserv /></ProtectedRoute>} />
              <Route path="/user/services" element={<ProtectedRoute><UServices /></ProtectedRoute>} />
              <Route path="/user/support" element={<USupport />} />  
              <Route path="/user/support/supportticket" element={<USupportTix />} />
              <Route path="/user/support/reportticket" element={<UReports />} />
              <Route path="/user/accountview" element={<UAccountProfile />} />
              <Route path="/user/faqs" element={<UFAQs />} />
              <Route path="/user/mostpopularbooks" element={<UMostPop />} />
              <Route path="/user/highlyratedbooks" element={<UHighlyRated />} />
              <Route path="/user/bookview" element={<UBookView />} />
              <Route path="/user/researchview" element={<URsrchView/>} />
              <Route path="*" element={<ErrorPage />} /> 
              <Route path="/auth-complete" element={<AuthComplete />} />
              <Route path="/genre/page" element={<GenrePage />} />
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
              <Route path="bookexport" element={<ABExport />} />
              <Route path="copymanagement" element={<ABCopies />} />
              <Route path="genremanagement" element={<AGenreMgmt />} />
              <Route path="genreadding" element={<AGAdd />} />
              <Route path="genremodify" element={<AGModify />} />
              <Route path="researchadding" element={<ARAdd />} />
              <Route path="researchexport" element={<ARExport />} />
              <Route path="abviewer" element={<ABViewer />} />
              <Route path="arviewer" element={<ARViewer />} />
              <Route path="bookmodify" element={<ABModify />} />
              <Route path="researchmodify" element={<ARModify />} />
              <Route path="reportticket" element={<AReportViewPage />} />
              <Route path="supportticket" element={<ASupportViewPage />} />
              <Route path="useraccounts/viewusers" element={<AUAccView />} />
              <Route path="useraccounts/viewadmins" element={<AAccountView />} />
              <Route path="accountview" element={<AAccountSettings />} />
              <Route path="reservationsview" element={<AReservView />} />
              <Route path="schedule" element={<ASchedule />} />
              <Route path="systemreports" element={<ASystemReports />} />
              <Route path="adminerrorpage" element={<AdminErrorPage />} />
              <Route path="*" element={<AdminErrorPage />} />
            </Routes>
            <Footer />
            <Copyright />
          </>
        }
      />
    </Routes>
    </>
  );
}

export default App;
