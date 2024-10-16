import React from "react";
import MainHeader from "../components/main-comp/MainHeader";
import Navbar from "../components/main-comp/Navbar";
import Title from "../components/main-comp/Title";
import SUserReports from "../components/admin-support-page-comp/SUserReports";
import SupportTickets from "../components/admin-support-page-comp/SupportTickets";
import AccessTable from "../components/admin-home-page-comp/AccessTable";
import Blacklist from "../components/admin-user-acc-comp/Blacklist";
import Whitelist from "../components/admin-user-acc-comp/Whitelist";
import RecentSupportTix from "../components/admin-support-page-comp/RecentSupportTix";
import LatestSupportTix from "../components/admin-support-page-comp/LatestSupportTix";

const ASupportPage = () => (
    <div className="min-h-screen bg-gray-100">
            <MainHeader />
            <Title>Support</Title>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-2 space-y-8">
                        {/* Main content for adding research */}
                        <SUserReports />
                        <SupportTickets />
                    </div>

                    <div className="lg:col-span-1 space-y-8">
                            <AccessTable />
                            <Blacklist />
                            <Whitelist />
                            <RecentSupportTix />
                            <LatestSupportTix />
                    </div>

                </div>
            </main>
    </div>
)
export default ASupportPage;