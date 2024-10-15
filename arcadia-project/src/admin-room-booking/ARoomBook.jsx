import React from "react";
import MainHeader from "../components/main-comp/MainHeader";
import Navbar from "../components/main-comp/Navbar";
import Title from "../components/main-comp/Title";
import BookingForm from "../components/admin-room-booking-comp/BookingForm";
import RoomReserv from "../components/admin-lib-analytics-comp/RoomReserv";
import TodayReserv from "../components/admin-reserv-comp/TodayReserv";
import Footer from "../components/main-comp/Footer";
import Copyright from "../components/main-comp/Copyright";

const ARoomBook = () => (
    <div className="min-h-screen bg-gray-100 flex flex-col">
        <MainHeader />
        <Navbar />
        <Title>Reserve a Room</Title>
        <main className="flex-grow flex items-center justify-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-2 space-y-8">
                        <BookingForm />

                        <RoomReserv />
                    </div>

                    <div className="lg:col-span-1 space-y-8">
                        <TodayReserv />
                    </div>
                </div>
            </div>
        </main>

        <footer className="bg-light-gray mt-12 py-8">
            <Footer />
        </footer>
        <Copyright />
    </div>
);

export default ARoomBook;
