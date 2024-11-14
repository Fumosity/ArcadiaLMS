import React from "react";
import Title from "../components/main-comp/Title";
import UserReports from "../components/admin-user-support-report-view-comp/UserReports";
import SupportTicket from "../components/admin-user-support-report-view-comp/SupportTicket";
import RecentReports from "../components/admin-user-support-report-view-comp/RecentReports";
import RecentSupport from "../components/admin-user-support-report-view-comp/RecentSupport";


const ASupportPage = () => (
    <div className="min-h-screen bg-gray-100">
        {/* Main header */}
        <Title>Support</Title>

        {/* Main content section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2 space-y-8">
                    {/* Left side content */}
                    <div className="bg-white overflow-hidden p-6 rounded-lg shadow w-full">
                        <UserReports />
                    </div>
                    <div className="bg-white overflow-hidden p-6 rounded-lg shadow w-full">
                        <SupportTicket />
                    </div>
                </div>

                {/* Right side content */}
                <div className="lg:col-span-1 space-y-8">
                    <RecentReports />
                    <RecentSupport />
                </div>
            </div>
        </main>
    </div>
);

export default ASupportPage;
