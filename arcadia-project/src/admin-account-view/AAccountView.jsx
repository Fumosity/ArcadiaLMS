import React from "react";
import MainHeader from "../components/main-comp/MainHeader";
import Navbar from "../components/main-comp/Navbar";
import Footer from "../components/main-comp/Footer";
import Copyright from "../components/main-comp/Copyright";
import Title from "../components/main-comp/Title";
import AABooking from "../components/admin-account-view-comp/AABooking";
import Blacklist from "../components/admin-user-acc-comp/Blacklist";
import Whitelist from "../components/admin-user-acc-comp/Whitelist";
import AAListAdmin from "../components/admin-account-view-comp/AAListAdmin";

const AAccountView = () => (
    <div className="min-h-screen bg-gray-100">
        {/* Main header */}
        <MainHeader />
        <Navbar />
        <Title>Admin Account Viewer</Title>

        {/* Main content section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2 space-y-8">
                    {/* Left side content */}
                    <div className="bg-white overflow-hidden p-6 rounded-lg shadow w-full">
                        <AABooking />
                    </div>
                    <div className="bg-white overflow-hidden p-6 rounded-lg shadow w-full">
                        <AAListAdmin />
                    </div>
                </div>

                {/* Right side content */}
                <div className="lg:col-span-1 space-y-8">
                    <Blacklist />
                    <Whitelist/>
                </div>
            </div>
        </main>
    </div>
);

export default AAccountView;
