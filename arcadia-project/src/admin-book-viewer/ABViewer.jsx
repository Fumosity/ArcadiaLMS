import React from 'react';
import MainHeader from '../components/main-comp/MainHeader';
import Footer from '../components/main-comp/Footer';
import Copyright from '../components/main-comp/Copyright';
import AboutPage from '../components/admin-book-viewer-comp/AboutPage';
import Navbar from '../components/main-comp/Navbar'; // Include Navbar here for consistency
import PastReviews from '../components/admin-book-viewer-comp/PastReviews';
import BookInfo from '../components/admin-book-viewer-comp/BookInfo';
import Analytics from '../components/admin-book-viewer-comp/Analytics';
import BookViewer from '../components/admin-book-viewer-comp/BookViewer';


export default function ABViewer() { // Changed component name to match the route
  return (
    <div className="min-h-screen bg-gray-100">
      <MainHeader />
      <Navbar />
      <BookViewer />
      <div>
      
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          <BookInfo />
          <Analytics />
          
          <PastReviews />
        </div>
        <div className="col-span-1">
          <AboutPage />
        </div>
      </div>
    </div>

      <footer className="bg-light-gray mt-12 py-8">
        <Footer />
      </footer>
      <Copyright />
    </div>
  );
}
