import React from "react";

import WeeklySched from "../components/admin-schedule-comp/WeeklySched";
import Title from "../components/main-comp/Title";
import CalendarEvents from "../components/admin-schedule-comp/CalendarEvents";
import ArcOpHr from "../components/UserComponents/user-home-comp/ArcOpHr";
import UpEvents from "../components/UserComponents/user-home-comp/UpEvents";
import OutstandingFines from "../components/admin-system-reports-comp/OutstandingFines";
import PenaltyReports from "../components/admin-system-reports-comp/PenaltyReports";
import SBOverdue from "../components/admin-system-reports-comp/SBOverdue";
import SBFines from "../components/admin-system-reports-comp/SBFines";

const ASystemReport = () => {
    return (
        <div className="min-h-screen bg-white">
            <Title>System Reports</Title>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Responsive Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-8">
                        <OutstandingFines />
                        <PenaltyReports />
                    </div>

                    {/* Preview section */}
                    <div className="md:col-span-1 space-y-8">
                        <SBFines />
                        <SBOverdue />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ASystemReport;
