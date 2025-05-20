import React, { useEffect} from "react";
import UNavbar from "../../components/UserComponents/user-main-comp/UNavbar";
import UsearchBar from "../../components/UserComponents/user-main-comp/USearchBar";
import Title from "../../components/main-comp/Title";

import SimBooks from "../../components/UserComponents/user-book-search-comp/SimBooks";

import ArcOpHr from "../../components/UserComponents/user-home-comp/ArcOpHr";
import UpEvents from "../../components/UserComponents/user-home-comp/UpEvents";
import Services from "../../components/UserComponents/user-main-comp/Services";
import UHero from "../../components/UserComponents/user-home-comp/UHero";
import LibServ from "../../components/UserComponents/user-serv-comp/LibServ";
import ServicesHero from "../../components/UserComponents/user-home-comp/ServicesHero";

const UServices = () => {
    useEffect(() => {
        document.title = "Arcadia | Services";
    }, []);
    return (
        <div className="min-h-screen bg-light-white">
            {/* <UNavbar/> */}

            <Title>Library Services</Title>

                {/* Content Container */}
                <div className="w-10/12 mx-auto py-8 userContent-container flex flex-col lg:flex-row justify-center justify-items-start">
                    {/* Sidebar */}
                    <div className="lg:w-1/4 lg:block md:hidden space-y-4">
                        <ArcOpHr />
                        <UpEvents />
                        <Services />
                    </div>
                    {/* Main Content */}
                    <div className="userMain-content lg:w-3/4 md:w-full">
                        {/* Hero Section */}
                        <ServicesHero />
                        <LibServ />
                    </div>
                </div>

        </div>
    )
};

export default UServices;