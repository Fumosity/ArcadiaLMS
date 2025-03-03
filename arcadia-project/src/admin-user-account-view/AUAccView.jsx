import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Title from "../components/main-comp/Title";
import AUserCirc from "../components/admin-user-account-view-comp/AUserCirc";
import RecentReports from "../components/admin-user-support-report-view-comp/RecentReports";
import RecentSupport from "../components/admin-user-support-report-view-comp/RecentSupport";
import UserInformations from "../components/admin-user-account-view-comp/UserInformations";

const AUAccView = () => {
    const location = useLocation();
    const user = location.state?.user || {};
    const navigate = useNavigate(); // Initialize useNavigate

    console.log("user", user)

    return (
        <div className="min-h-screen bg-white">
            {user === "Student" || user === "Teacher" || user === "Intern" ? (
                <Title>User Account Viewer</Title>
            ) : user === "Admin" ? (
                <Title>Admin Account Viewer</Title>
            ) : null}


            <div className="flex justify-center items-start space-x-2 pb-12 pt-8 px-12">
                <div className="flex-shrink-0 w-3/4">
                    <div className="flex justify-between w-full gap-2">
                        <button
                            className="add-book w-1/2 mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
                            onClick={() => navigate('/admin/useraccounts')}
                        >
                            Return to User Accounts
                        </button>
                    </div>
                    <div className="space-y-2">
                        <UserInformations user={user} />
                        <AUserCirc user={user} />
                    </div>
                </div>

                <div className="flex flex-col items-start flex-shrink-0 w-1/4 mt-12">
                    <div className="w-full space-y-2">
                        <RecentReports user={user} />
                        <RecentSupport user={user} />
                    </div>
                </div>
            </div>
        </div>

    );
};

export default AUAccView;

