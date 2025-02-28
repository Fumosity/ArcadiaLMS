import React from "react";
import Title from "../components/main-comp/Title";
import UserReports from "../components/admin-user-support-report-view-comp/UserReports";
import SupportTicket from "../components/admin-user-support-report-view-comp/SupportTicket";
import RecentReports from "../components/admin-user-support-report-view-comp/RecentReports";
import RecentSupport from "../components/admin-user-support-report-view-comp/RecentSupport";


const ASupportPage = () => (
    <div className="min-h-screen bg-gray-100">
        <Title>Support Tickets and Reports</Title>

        TODO: ADD GRAPHS AND COMPLETION

        <div className="flex justify-center items-start space-x-2 pb-12 pt-8 px-12">
            <div className="flex-shrink-0 w-3/4 space-y-2">
                <UserReports />
                <SupportTicket />
            </div>

            <div className="flex flex-col items-start flex-shrink-0 w-1/4 space-y-2">
                <div className="space-y-2 w-full">
                    <RecentReports />
                    <RecentSupport />
                </div>
            </div>
        </div>
    </div>
);

export default ASupportPage;
