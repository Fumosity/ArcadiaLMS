import React from "react";
import { useLocation } from "react-router-dom";
import MainHeader from "../components/main-comp/MainHeader";
import Navbar from "../components/main-comp/Navbar";
import Footer from "../components/main-comp/Footer";
import Copyright from "../components/main-comp/Copyright";
import Title from "../components/main-comp/Title";
import AABooking from "../components/admin-account-view-comp/AdminInformations";
import Blacklist from "../components/admin-user-acc-comp/Blacklist";
import Whitelist from "../components/admin-user-acc-comp/Whitelist";
import AAListAdmin from "../components/admin-account-view-comp/AAListAdmin";
import AdminInformations from "../components/admin-account-view-comp/AdminInformations";

const AAccountView = () => {
    const location = useLocation();
    const user = location.state?.user || {};

    console.log("admin", user)

    return (
        <div className="min-h-screen bg-white">
            {/* Main header */}

            <Title>Admin Account Viewer</Title>

            {/* Main content section */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-2 space-y-8">
                        {/* Left side content */}
                        <div className="bg-white overflow-hidden p-6 rounded-lg shadow w-full">
                            <AdminInformations user={user} />
                        </div>
                        <AAListAdmin user={user} />
                    </div>

                    {/* Right side content */}
                    <div className="lg:col-span-1 space-y-8">
                        
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AAccountView;
