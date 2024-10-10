import React from 'react';
import { FiSearch, FiUser, FiChevronRight } from 'react-icons/fi';
import Header from './components/main-components/Header';
import BookCirculationTable from './components/admin-home-page/BookCirculationTable';
import LibraryAnalyticsChart from './components/admin-home-page/LibraryAnalyticsChart';
import ReservationsTable from './components/admin-home-page/ReservationsTable';
import PopularBooksTable from './components/admin-home-page/PopularBooksTable';
import Navbar from './components/main-components/Navbar';
import HighestRatedBooksTable from './components/admin-home-page/HighestRatedBooksTable';
import AccessTable from './components/admin-home-page/AccessTable';
import Footer from './components/main-components/Footer';
import Copyright from './components/main-components/Copyright';
import SearchBar from './components/main-components/SearchBar';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Navbar />
      <SearchBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Circulation - Full width on large screens */}
          <div className="lg:col-span-2">
            <BookCirculationTable />
            {/* Move LibraryAnalyticsChart here directly below BookCirculationTable */}
            <div className="mt-4">
              <LibraryAnalyticsChart />
            </div>
          </div>

          {/* Access Table and other sections on the right */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <AccessTable />
            </div>

            {/* Reservations */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Reservations</h3>
                <button className="text-arcadia-red text-sm flex items-center">
                  See more <FiChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="w-full">
                <ReservationsTable />
              </div>
            </div>

            {/* Popular Books */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Popular Books</h3>
                <button className="text-arcadia-red text-sm flex items-center">
                  See more <FiChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="w-full">
                <PopularBooksTable />
              </div>
            </div>

            {/* Highest Rated Books */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Highest Rated Books</h3>
                <button className="text-arcadia-red text-sm flex items-center">
                  See more <FiChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="w-full">
                <HighestRatedBooksTable />
              </div>
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
