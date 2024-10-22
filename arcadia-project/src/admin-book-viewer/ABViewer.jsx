import React from 'react';
import MainHeader from '../components/main-comp/MainHeader';
import Footer from '../components/main-comp/Footer';
import Copyright from '../components/main-comp/Copyright';
import AboutPage from '../components/admin-book-viewer-comp/AboutPage';
import Navbar from '../components/main-comp/Navbar'; // Include Navbar here for consistency
import PastReviews from '../components/admin-book-viewer-comp/PastReviews';
import BookInfo from '../components/admin-book-viewer-comp/BookInfo';
import Analytics from '../components/admin-book-viewer-comp/Analytics';
import PopularAmong from '../components/admin-book-viewer-comp/PopularAmong';
import SimilarTo from '../components/admin-book-viewer-comp/SimilarTo';
import CompareTo from '../components/admin-book-viewer-comp/CompareTo';
import Title from '../components/main-comp/Title';


export default function ABViewer() { // Changed component name to match the route
  return (
    <div className="min-h-screen bg-gray-100">
      <MainHeader />
      <Navbar />
      <Title>Book Viewer</Title>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-8">
            <BookInfo />
            <Analytics />

            <PastReviews />
          </div>
          {/* About Table */}
          <div className="lg:col-span-1 space-y-8">
            <AboutPage />

            {/* Popular Among Table */}
            <div className="w-full">
              <PopularAmong />  
            </div>
            
            <div className="w-full">
            {/* Similar To Table */}
            <SimilarTo />
            </div>

            <div className="w-full">
            {/* Compare To Table */}
            <CompareTo />
            </div>

          </div>
        </div>

      </main>


      <footer className="bg-light-gray mt-12 py-8">
        <Footer />
      </footer>
      <Copyright />
    </div>
  );
}
