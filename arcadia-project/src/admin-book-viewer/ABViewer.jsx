import React from 'react';
import MainHeader from '../components/main-comp/MainHeader';
import BookViewer from '../components/admin-book-page-comp/BookViewer';
import Footer from '../components/main-comp/Footer';
import Copyright from '../components/main-comp/Copyright';
import AboutPage from '../components/admin-book-page-comp/AboutPage';
import Navbar from '../components/main-comp/Navbar'; // Include Navbar here for consistency
import PastReviews from '../components/admin-book-page-comp/PastReviews';
import BookCirculation from '../components/admin-book-page-comp/BookCirculation';
import BookInfo from '../components/admin-book-page-comp/BookInfo';
import Analytics from '../components/admin-book-page-comp/Analytics';


export default function ABViewer() { // Changed component name to match the route
  return (
    <div className="min-h-screen bg-gray-100">
      <MainHeader />
      <Navbar />
      <div>
      <div className="flex items-center mb-6">
        <img src="/placeholder.svg?height=24&width=24" alt="Book icon" className="h-6 w-6 mr-2" />
        <h2 className="text-2xl font-semibold">Book Viewer for Admin</h2>
      </div>
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
