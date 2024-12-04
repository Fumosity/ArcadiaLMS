import React from "react";
import { useLocation } from "react-router-dom";
import MainHeader from "../components/main-comp/MainHeader";
import Navbar from "../components/main-comp/Navbar";
import Footer from "../components/main-comp/Footer";
import Copyright from "../components/main-comp/Copyright";
import Title from "../components/main-comp/Title";
import Blacklist from "../components/admin-user-acc-comp/Blacklist";
import Whitelist from "../components/admin-user-acc-comp/Whitelist";
import AUserCirc from "../components/admin-user-account-view-comp/AUserCirc";
import RecentReports from "../components/admin-user-support-report-view-comp/RecentReports";
import RecentSupport from "../components/admin-user-support-report-view-comp/RecentSupport";
import UserInformations from "../components/admin-user-account-view-comp/UserInformations";

const AUAccView = () => {
    const location = useLocation();
    const user = location.state?.user || {};

    console.log("user", user)
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Main header */}
            <Title>User Account Viewer</Title>

            {/* Main content section */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-2 space-y-8">
                        {/* Left side content */}
                        <div className="bg-white overflow-hidden p-6 rounded-lg shadow w-full">
                            <UserInformations user={user} />
                        </div>
                        <AUserCirc user={user} />
                    </div>

                    {/* Right side content */}
                    <div className="lg:col-span-1 space-y-8">
                        <Blacklist />
                        <Whitelist />
                        <RecentReports user={user} />
                        <RecentSupport user={user} />   
                    </div>
                </div>
            </main>

        </div>
    );
};

export default AUAccView;

