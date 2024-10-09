import React from 'react';
import { FiSearch, FiUser, FiChevronRight } from 'react-icons/fi';
import Header from './components/Header';
import BookCirculationTable from './components/BookCirculationTable';
import LibraryAnalyticsChart from './components/LibraryAnalyticsChart';
import ReservationsTable from './components/ReservationsTable';
import PopularBooksTable from './components/PopularBooksTable';
import Navbar from './components/Navbar';
import HighestRatedBooksTable from './components/HighestRatedBooksTable';
import AccessTable from './components/AccessTable';
import Footer from './components/Footer';
import Copyright from './components/Copyright';
import SearchBar from './components/SearchBar';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Navbar />
      <SearchBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Circulation - Full width on large screens */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Book Circulation</h3>
              <button className="text-arcadia-red text-sm flex items-center">
                See more <FiChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            <div className="max-h-full">
              <BookCirculationTable />
            </div>
          </div>
          
          {/* Yung table sa taas ng Reservations Table sa Figma */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="max-h-full">
                <AccessTable /> 
              </div>
            </div>

            {/* Reservations & Popular Books - Stack these on the right */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Reservations</h3>
                <button className="text-arcadia-red text-sm flex items-center">
                  See more <FiChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="max-h-full">
                <ReservationsTable />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Popular Books</h3>
                <button className="text-arcadia-red text-sm flex items-center">
                  See more <FiChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="max-h-full">
                <PopularBooksTable />
              </div>
            </div>

            {/* Highest Rated Books - Placed directly below Popular Books */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Highest Rated Books</h3>
                <button className="text-arcadia-red text-sm flex items-center">
                  See more <FiChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="max-h-full">
                <HighestRatedBooksTable />
              </div>
            </div>
          </div>
        </div>

        {/* Library Analytics - Full width on large screens */}
        <div className="mt-8 lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Library Analytics</h3>
              <button className="text-arcadia-red text-sm flex items-center">
                See more <FiChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            <LibraryAnalyticsChart />
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
