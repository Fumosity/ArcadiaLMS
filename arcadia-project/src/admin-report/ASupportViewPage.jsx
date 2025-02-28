import React from "react";
import Title from "../components/main-comp/Title";
import RecentSupport from "../components/admin-user-support-report-view-comp/RecentSupport";
import SupportView from "../components/admin-report-view-comp/SupportView"

const ASupportViewPage = () => (
    <div className="">
        {/* Main header */}
        <Title>User Support Ticket View</Title>

        {/* Main content section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Left side content */}
                    <div className="bg-white p-6 rounded-lg shadow w-full">
                        <SupportView/>
                    </div>
                </div>

                {/* Right side content */}
                <div className="lg:col-span-1 space-y-8">
                    <RecentSupport />
                </div>
            </div>
        </main>
    </div>
);

export default ASupportViewPage;
