import React from "react";
import RcntLibVisit from "../components/admin-user-acc-comp/RcntLibVisit";
import AccessTable from "../components/admin-home-page-comp/AccessTable";
import Title from "../components/main-comp/Title";
import ListOfAdminAcc from "../components/admin-user-acc-comp/ListOfAdminAcc";
import ListOfUserAcc from "../components/admin-user-acc-comp/ListOfUserAcc";
import RecentReports from "../components/admin-user-support-report-view-comp/RecentReports";
import RecentSupport from "../components/admin-user-support-report-view-comp/RecentSupport";

const AUsrAcc = () => (

        <div className="min-h-screen bg-gray-100">
            <Title>User Accounts</Title>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-2 space-y-8">
                        {/* Main content for adding research */}
                        <div className="bg-white overflow-hidden p-6 rounded-lg shadow w-full">
                            <RcntLibVisit />
                        </div>
                        <ListOfUserAcc />
                        <ListOfAdminAcc />

                    </div>

                    {/* Preview section */}
                    <div className="lg:col-span-1 space-y-8">
                            <AccessTable />
                            <RecentReports />
                            <RecentSupport />
                    </div>
                </div>
            </main>
        </div>
);

export default AUsrAcc;