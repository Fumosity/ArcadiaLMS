import React from "react";

import { AdminSettings } from "../components/admin-account-settings-comp/AdminSettings";
import { AdminCredentials } from "../components/admin-account-settings-comp/AdminCredentials";
import Title from "../components/main-comp/Title";

const AAccountSettings = () => {
    return (
        <div className="min-h-screen bg-white">
            <Title>Account Settings </Title>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Content Container */}
                <div className="userContent-container flex flex-col lg:flex-row gap-8 justify-center items-start">
                    {/* Main Content */}
                    <div className="userMain-content lg:w-3/4 w-full ml-5">
                        {/* Hero Section */}
                        <AdminCredentials />
                        <AdminSettings />



                    </div>
                </div>
            </main>

        </div>
    )
};

export default AAccountSettings;