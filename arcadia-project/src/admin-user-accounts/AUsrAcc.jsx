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

        <div className="flex justify-center items-start space-x-2 pb-12 pt-8 px-12">
            <div className="flex-shrink-0 w-3/4 space-y-2">
                <RcntLibVisit />
                <ListOfUserAcc />
                <ListOfAdminAcc />
            </div>

            <div className="flex flex-col items-start flex-shrink-0 w-1/4 space-y-2 ">
                <AccessTable />
                <div className="space-y-2 w-full">
                <RecentReports />
                <RecentSupport />
                </div>
            </div>
        </div>
    </div>
);

export default AUsrAcc;