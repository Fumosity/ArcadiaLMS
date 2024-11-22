import React from "react";
import UNavbar from "../../components/UserComponents/user-main-comp/UNavbar";
import UsearchBar from "../../components/UserComponents/user-main-comp/USerachBar";
import Title from "../../components/main-comp/Title";

import SimBooks from "../../components/UserComponents/user-book-catalog-comp/SimBooks";

import ArcOpHr from "../../components/UserComponents/user-home-comp/ArcOpHr";
import UpEvents from "../../components/UserComponents/user-home-comp/UpEvents";
import Services from "../../components/UserComponents/user-main-comp/Services";
import UHero from "../../components/UserComponents/user-home-comp/UHero";
import LibServ from "../../components/UserComponents/user-serv-comp/LibServ";

const UServices = () => {
    return (
        <div className="min-h-screen bg-light-white">
            <UNavbar />
            <UsearchBar />
            <Title>Library Services</Title>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Content Container */}
                <div className="userContent-container flex flex-col lg:flex-row gap-8 justify-center items-start">
                    {/* Sidebar */}
                    <div className="lg:w-1/4 md:w-1/3 w-full space-y-8 mr-5">
                        <ArcOpHr />
                        <UpEvents />
                        <Services />
                    </div>

                    {/* Main Content */}
                    <div className="userMain-content lg:w-3/4 w-full ml-5">
                        {/* Hero Section */}
                        <UHero />
                        <LibServ />


                    </div>
                </div>
            </main>

        </div>
    )
};

export default UServices;