import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import AccessTable from '../components/admin-home-page-comp/AccessTable';
import TodayReserv from '../components/admin-reserv-comp/TodayReserv';
import BCHistory from '../components/admin-book-circ-pg-comp/BCHistory';
import RoomReserv from '../components/admin-lib-analytics-comp/RoomReserv';
import MostPop from '../components/admin-lib-analytics-comp/MostPop';
import HighRates from '../components/admin-lib-analytics-comp/HighRates';
import LowRates from '../components/admin-lib-analytics-comp/LowRates';
import Title from '../components/main-comp/Title';
import RecentReports from '../components/admin-user-support-report-view-comp/RecentReports';
import RecentSupport from '../components/admin-user-support-report-view-comp/RecentSupport';
import SBFines from '../components/admin-system-reports-comp/SBFines';
import SBOverdue from '../components/admin-system-reports-comp/SBOverdue';

const AHomePage = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  return (
    <div className="min-h-screen bg-white">
      <Title>Home</Title>

      <div className="flex justify-center items-start space-x-2 pb-12 pt-8 px-12">

        <div className="flex-shrink-0 w-3/4 space-y-2">
          <BCHistory />
          <RoomReserv />
        </div>

        <div className="flex flex-col items-start flex-shrink-0 w-1/4 space-y-2">
          <AccessTable />
          <TodayReserv />
          <MostPop />
          <LowRates />
          <HighRates />
          <div className="space-y-2 w-full">
            <RecentReports />
            <RecentSupport />
          </div>
          <SBFines />
          <SBOverdue />
        </div>

      </div>
    </div>
  );
}

export default AHomePage;
