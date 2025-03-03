import React from "react";
import Title from "../components/main-comp/Title";
import RecentReports from "../components/admin-user-support-report-view-comp/RecentReports";
import ReportView from "../components/admin-report-view-comp/ReportView";


const AReportViewPage = () => (
    <div className="min-h-screen bg-white">
        <Title>User Report View</Title>

        <div className="flex justify-center items-start space-x-2 pb-12 pt-8 px-12">
            <div className="flex-shrink-0 w-3/4 space-y-2">
                <ReportView />
            </div>
            <div className="flex flex-col items-start flex-shrink-0 w-1/4 space-y-2">
                <RecentReports />
            </div>
        </div>
    </div>
);

export default AReportViewPage;
