import React from "react";
import UNavbar from "../../components/UserComponents/user-main-comp/UNavbar";
import UsearchBar from "../../components/UserComponents/user-main-comp/USerachBar";
import Title from "../../components/main-comp/Title";

import ArcOpHr from "../../components/UserComponents/user-home-comp/ArcOpHr";
import UpEvents from "../../components/UserComponents/user-home-comp/UpEvents";
import Services from "../../components/UserComponents/user-main-comp/Services";
import CurrentReservations from "../../components/UserComponents/user-room-reser-comp/CurrentReservations";
import ReservHero from "../../components/UserComponents/user-room-reser-comp/ReservHero";
import RoomBooking from "../../components/UserComponents/user-room-reser-comp/RoomBooking";

const UDiscussionReserv = () => {
    return (
        <div className="min-h-screen bg-light-white">
            <UNavbar />
            <UsearchBar />
            <Title>Discussion Room Reservations</Title>

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
                        <ReservHero />
                        <CurrentReservations />
                        <RoomBooking />


                    </div>
                </div>
            </main>

        </div>
    )
};

export default UDiscussionReserv;