import { Route, Routes } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
//Outlet
import UserLayout from './UserLayout';
import AdminLayout from './AdminLayout';

import ProtectedRoute from './backend/ProtectedRoute.jsx';
import { ToastContainer } from "react-toastify";
// Admin Components
import AHomePage from './admin-home-page/AHomePage';
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
import ADPAPage from './ADPAPage.jsx';
import ACollegeMgmt from './admin-college-mgmt/ACollegeMgmt.jsx';
import ALibSecMgmt from './admin-section-mgmt/ALibSecMgmt.jsx';

// User Components
import UsrRegistration from './UserPages/user-registration-page/UsrRegistration';
import UHomePage from './UserPages/user-home-page/UHomePage';
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
import ForgotPassword from './components/forgot-password-comp/ForgotPassword.jsx';
import ResetPassword from './components/reset-password-comp/ResetPassword.jsx';

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
import DPAPage from './UserPages/DPAPage.jsx';
import BookReservation from './components/UserComponents/user-book-view-comp/BookReservation.jsx';
import AServices from './admin-lib-services/AServices.jsx';


function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route path="/user/login" element={<ULogin />} />
        <Route path="/user/forgotpassword" element={<ForgotPassword />} />
        <Route path="/user/resetpassword" element={<ResetPassword />} />
        <Route path="/user/register" element={<URegister />} />

        {/* User Layout Routes */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<UHomePage />} />
          <Route path="user/register" element={<UsrRegistration />} />
          <Route path="user/bookmanagement" element={<UBkCatalog />} />
          <Route path="user/bookreservation" element={<BookReservation />} />
          <Route path="user/researchmanagement" element={<URsrchCatalog />} />
          <Route path="user/reservations" element={<ProtectedRoute><UDiscussionReserv /></ProtectedRoute>} />
          <Route path="user/services" element={<ProtectedRoute><UServices /></ProtectedRoute>} />
          <Route path="user/support" element={<USupport />} />
          <Route path="user/support/supportticket" element={<USupportTix />} />
          <Route path="user/support/reportticket" element={<UReports />} />
          <Route path="user/accountview" element={<UAccountProfile />} />
          <Route path="user/faqs" element={<UFAQs />} />
          <Route path="user/mostpopularbooks" element={<UMostPop />} />
          <Route path="user/highlyratedbooks" element={<UHighlyRated />} />
          <Route path="user/bookview" element={<UBookView />} />
          <Route path="user/researchview" element={<URsrchView />} />
          <Route path="auth-complete" element={<AuthComplete />} />
          <Route path="genre/page" element={<GenrePage />} />
          <Route path="user/privacypolicy" element={<DPAPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>

        {/* Admin Layout Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<ProtectedRoute><AHomePage /></ProtectedRoute>} />
          <Route path="adminservices" element={<AServices />} />
          <Route path="circulationhistory" element={<ABCirculationPage />} />
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
          <Route path="collegemanagement" element={<ACollegeMgmt />} />
          <Route path="libsecmanagement" element={<ALibSecMgmt />} />
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
          <Route path="data-privacy" element={<ADPAPage />} />
          <Route path="*" element={<AdminErrorPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;