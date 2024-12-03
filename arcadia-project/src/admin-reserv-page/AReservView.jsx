import React from "react";
import TodayReserv from "../components/admin-reserv-comp/TodayReserv";
import MainHeader from "../components/main-comp/MainHeader";
import Title from "../components/main-comp/Title";
import ARoomBooking from "../components/admin-room-reserv-comp/ARoomBooking";
import ARoomReservations from "../components/admin-room-reserv-comp/ARoomReservations";
import ReservInformation from "../components/admin-room-reserv-comp/ReservInformation";


const AReservView = () => (
    <div className="min-h-screen bg-gray-100">
        {/* Main header */}
        <MainHeader />
        <Title>Reservations View</Title>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-2 space-y-8">
                        {/* Main content for adding research */}
                        
                        <div className="bg-white overflow-hidden rounded-lg w-full">
                        <ReservInformation />
                        </div>
                            

                    </div>

                    {/* Preview section */}
                    <div className="lg:col-span-1 space-y-8">

                            <TodayReserv />
                    </div>
                </div>
            </main>
    </div>
);

export default AReservView;