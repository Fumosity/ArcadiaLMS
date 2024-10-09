import React from 'react';
import MainHeader from '../components/MainHeader';
import BookViewer from '../components/AdminBookPage/BookViewer';
import Footer from '../components/Footer';
import Copyright from '../components/Copyright';
import AboutPage from '../components/AdminBookPage/AboutPage';
import Navbar from '../components/Navbar'; // Include Navbar here for consistency
import PastReviews from '../components/AdminBookPage/PastReviews';
import BookCirculation from '../components/AdminBookPage/BookCirculation';
import BookInfo from '../components/AdminBookPage/BookInfo';
import Analytics from '../components/AdminBookPage/Analytics';


export default function AdminBookViewer() { // Changed component name to match the route
  return (
    <div className="min-h-screen bg-gray-100">
      <MainHeader />
      <Navbar />
      <div>
      <div className="flex items-center mb-6">
        <img src="/placeholder.svg?height=24&width=24" alt="Book icon" className="h-6 w-6 mr-2" />
        <h2 className="text-2xl font-semibold">Book Viewer</h2>
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
