import React from 'react';
import MainHeader from '../components/main-components/MainHeader';
import BookViewer from '../components/admin-book-page/BookViewer';
import Footer from '../components/main-components/Footer';
import Copyright from '../components/main-components/Copyright';
import AboutPage from '../components/admin-book-page/AboutPage';
import Navbar from '../components/main-components/Navbar'; // Include Navbar here for consistency
import PastReviews from '../components/admin-book-page/PastReviews';
import BookCirculation from '../components/admin-book-page/BookCirculation';
import BookInfo from '../components/admin-book-page/BookInfo';
import Analytics from '../components/admin-book-page/Analytics';


export default function ABViewer() { // Changed component name to match the route
  return (
    <div className="min-h-screen bg-gray-100">
      <MainHeader />
      <Navbar />
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
