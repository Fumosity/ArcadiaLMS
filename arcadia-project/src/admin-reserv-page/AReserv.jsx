import React from "react";
import RoomReserv from "../components/admin-lib-analytics-comp/RoomReserv";
import TodayReserv from "../components/admin-reserv-comp/TodayReserv";
import MainHeader from "../components/main-comp/MainHeader";
import Navbar from "../components/main-comp/Navbar";
import Title from "../components/main-comp/Title";
import Footer from "../components/main-comp/Footer";
import Copyright from "../components/main-comp/Copyright";

const AReserv = () => (
    <div className="min-h-screen bg-gray-100">
        {/* Main header */}
        <MainHeader />
        <Title>Reservations</Title>

        <main className="book-research-adding">
            <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2 space-y-8">
                    {/* Main content for adding research */}
                    <RoomReserv />
                </div>
                {/* Preview section */}
                <div className="lg:col-span-1 space-y-8">
                    <button 
                        className="add-book mb-4 px-4 py-2 rounded-full border-grey hover:bg-blue-600 transition"
                        onClick={() => navigate('/admin/bookadding')} // Navigate to ABAdd on click
                    >
                        Reserve a Room
                    </button>  
                        <TodayReserv />
                    </div>
            </div>
        </main>
    </div>
);

export default AReserv;