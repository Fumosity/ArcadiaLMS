import React from 'react';
import MainHeader from './components/MainHeader';
import BookViewer from './components/AdminBookPage/BookViewer';
import Footer from './components/Footer';
import Copyright from './components/Copyright';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <MainHeader />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          

          <div className="max-h-full">
              <BookViewer />
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
