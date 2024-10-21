import React from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import MainHeader from '../components/main-comp/MainHeader';
import Footer from '../components/main-comp/Footer';
import Copyright from '../components/main-comp/Copyright';
import AboutPage from '../components/admin-book-viewer-comp/AboutPage';
import Navbar from '../components/main-comp/Navbar'; 
import PastReviews from '../components/admin-book-viewer-comp/PastReviews';
import BookInfo from '../components/admin-book-viewer-comp/BookInfo';
import Analytics from '../components/admin-book-viewer-comp/Analytics';
import PopularAmong from '../components/admin-book-viewer-comp/PopularAmong';
import SimilarTo from '../components/admin-book-viewer-comp/SimilarTo';
import CompareTo from '../components/admin-book-viewer-comp/CompareTo';
import Title from '../components/main-comp/Title';

export default function ABViewer() {
  const location = useLocation(); // Get the location object
  const { selectedBook } = location.state || {}; // Extract the selected book from state

  return (
    <div className="min-h-screen bg-gray-100">
      <MainHeader />
      <Navbar />
      <Title>Book Viewer</Title>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-8">
            {/* Pass the selectedBook to BookInfo */}
            <BookInfo book={selectedBook} />
            <Analytics />
            <PastReviews />
          </div>
          {/* About Table */}
          <div className="lg:col-span-1 space-y-8">
            <AboutPage />
            <div className="w-full">
              <PopularAmong />  
            </div>
            <div className="w-full">
              <SimilarTo />
            </div>
            <div className="w-full">
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
