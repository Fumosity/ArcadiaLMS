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
import RcntLibVisit from '../components/admin-user-acc-comp/RcntLibVisit';
import LibBookCirc from '../components/admin-lib-analytics-comp/LibBookCirc';
import RoomReserv from '../components/admin-lib-analytics-comp/RoomReserv';
import MostPop from '../components/admin-lib-analytics-comp/MostPop';
import HighRates from '../components/admin-lib-analytics-comp/HighRates';
import Title from '../components/main-comp/Title';
import RecentReports from '../components/admin-user-support-report-view-comp/RecentReports';
import RecentSupport from '../components/admin-user-support-report-view-comp/RecentSupport';

const AHomePage = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  return (
    <div className="min-h-screen bg-gray-100">
      <Title>Home</Title>

      <div className="flex justify-center items-start space-x-2 pb-12 pt-8 px-12">
        <div className="flex-shrink-0 w-3/4 space-y-2">
          <BCHistory />
          <LibBookCirc />
          <RoomReserv />
        </div>

        <div className="flex flex-col items-start flex-shrink-0 w-1/4 space-y-2">
          <AccessTable />

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Reservations</h3>
              <button
                className="text-arcadia-red text-sm flex items-center"
                onClick={() => navigate('/reservations')}
              >
                See more <FiChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            <div className="w-full">
              <ReservationsTable />
            </div>
          </div>

          <MostPop />
          <HighRates />
          <div className="space-y-2 w-full">
            <RecentReports />
            <RecentSupport />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AHomePage;
