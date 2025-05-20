import React, {useEffect} from "react";
import UNavbar from "../../components/UserComponents/user-main-comp/UNavbar";
import Title from "../../components/main-comp/Title";
import ArcOpHr from "../../components/UserComponents/user-home-comp/ArcOpHr";
import UpEvents from "../../components/UserComponents/user-home-comp/UpEvents";
import Services from "../../components/UserComponents/user-main-comp/Services";
import { UserCredentials } from "../../components/UserComponents/user-account-comp/UserCredentials";
import { UserInterests } from "../../components/UserComponents/user-account-comp/UserInterests";
import { AccountSettings } from "../../components/UserComponents/user-account-comp/AccountSettings";
import UserCirculationHistory from "../../components/UserComponents/user-account-comp/UserCirculationHistory";
import UserOutstandingFines from "../../components/UserComponents/user-account-comp/UserOutstandingFines";

const UAccountProfile = () => {
    useEffect(() => {
            document.title = "Arcadia | Account";
        }, []);
    return (
        <div className="min-h-screen bg-light-white">
            {/* <UNavbar/> */}
            <Title>User Account</Title>

            <div className="w-10/12 mx-auto py-8 userContent-container flex flex-col lg:flex-row justify-center justify-items-start">
                <div className="lg:w-1/4 lg:block md:hidden space-y-4">
                    <ArcOpHr />
                    <UpEvents />
                    <Services />
                </div>

                {/* Main Content */}
                <div className="userMain-content lg:w-3/4 md:w-full">
                    {/* Hero Section */}
                    <UserCredentials />
                    <UserInterests />
                    <AccountSettings />
                    <UserCirculationHistory />
                    <UserOutstandingFines />
                </div>
            </div>

        </div>
    )
};

export default UAccountProfile;