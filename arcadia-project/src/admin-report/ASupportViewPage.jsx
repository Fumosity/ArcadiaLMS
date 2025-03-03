import React from "react";
import Title from "../components/main-comp/Title";
import RecentSupport from "../components/admin-user-support-report-view-comp/RecentSupport";
import SupportView from "../components/admin-report-view-comp/SupportView"
import { useNavigate } from "react-router-dom"; // Import useNavigate
import RecentReports from "../components/admin-user-support-report-view-comp/RecentReports";

const ASupportViewPage = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    return(
    <div className="min-h-screen bg-white">
        <Title>User Support Ticket View</Title>
        <div className="flex justify-center items-start space-x-2 pb-12 pt-8 px-12">
            <div className="flex-shrink-0 w-3/4">
                <div className="flex justify-between w-full gap-2">
                    <button
                        className="add-book w-1/2 mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
                        onClick={() => navigate('/admin/support')}
                    >
                        Return to Support
                    </button>
                </div>
                <SupportView />
            </div>
            <div className="flex flex-col items-start flex-shrink-0 w-1/4 mt-12">
                <div className="w-full space-y-2">
                    <RecentReports />
                    <RecentSupport />
                </div>
            </div>
        </div>
    </div>
    )
};

export default ASupportViewPage;
