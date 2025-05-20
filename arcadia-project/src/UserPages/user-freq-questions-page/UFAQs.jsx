import React from "react";
import UNavbar from "../../components/UserComponents/user-main-comp/UNavbar";
import Title from "../../components/main-comp/Title";
import ArcOpHr from "../../components/UserComponents/user-home-comp/ArcOpHr";
import UpEvents from "../../components/UserComponents/user-home-comp/UpEvents";
import Services from "../../components/UserComponents/user-main-comp/Services";
import UHero from "../../components/UserComponents/user-home-comp/UHero";
import FAQSection from "../../components/UserComponents/user-faq-comp/FAQSection";
import USearchBar from "../../components/UserComponents/user-main-comp/USearchBar";

const UFAQs = () => {
    return (
        <div className="min-h-screen bg-light-white">
            {/* <UNavbar/> */}
            <Title>Frequently Asked Questions</Title>

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
                        <UHero />
                        <FAQSection />


                    </div>
                </div>

        </div>
    )
};

export default UFAQs;