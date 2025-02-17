import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import SearchBar from '../components/main-comp/SearchBar';
import BookCirculationTable from '../components/admin-home-page-comp/BookCirculationTable';
import LibraryAnalyticsChart from '../components/admin-home-page-comp/LibraryAnalyticsChart';
import AccessTable from '../components/admin-home-page-comp/AccessTable';
import ReservationsTable from '../components/admin-home-page-comp/ReservationsTable';
import HighestRatedBooksTable from '../components/admin-home-page-comp/HighestRatedBooksTable';
import PopularBooksTable from '../components/admin-home-page-comp/PopularBooksTable';
import BCHistory from '../components/admin-book-circ-pg-comp/BCHistory';

const AHomePage = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <BCHistory />
            <div className="mt-4">
              <LibraryAnalyticsChart />
            </div>
          </div>

          {/* Access Table and other sections on the right */}
          <div className="lg:col-span-1 space-y-8">
              <AccessTable />

            {/* Reservations */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Reservations</h3>
                <button
                  className="text-arcadia-red text-sm flex items-center"
                  onClick={() => navigate('/reservations')} // Navigate to Reservations page
                >
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
                <button
                  className="text-arcadia-red text-sm flex items-center"
                  onClick={() => navigate('/popular-books-page')} // Navigate to Popular Books page
                >
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
                <button
                  className="text-arcadia-red text-sm flex items-center"
                  onClick={() => navigate('/highest-rated-books-page')} // Navigate to Highest Rated Books page
                >
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
    </div>
  );
}

export default AHomePage;
