import React, { useState } from "react";
import TodayReserv from "../components/admin-reserv-comp/TodayReserv";
import MainHeader from "../components/main-comp/MainHeader";
import Title from "../components/main-comp/Title";
import ARoomBooking from "../components/admin-room-reserv-comp/ARoomBooking";
import ARoomReservations from "../components/admin-room-reserv-comp/ARoomReservations";


const AReserv = () => {
    const [events, setEvents] = useState([
        {
          id: "1",
          resourceId: "A701-A",
          title: "CS101 Group Study",
          start: "2024-12-07T09:00:00",
          end: "2024-12-07T10:00:00",
        },
        {
          id: "2",
          resourceId: "A701-B",
          title: "Team Meeting",
          start: "2024-12-07T11:00:00",
          end: "2024-12-07T12:00:00",
        },
      ]);
    
      const addReservation = (newEvent) => {
        setEvents((prevEvents) => [...prevEvents, newEvent]);
      };

    return (
    <div className="min-h-screen bg-gray-100">
        {/* Main header */}
        <MainHeader />
        <Title>Reservations</Title>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-2 space-y-8">
                        <div className="bg-white overflow-hidden rounded-lg w-full">
                        <ARoomBooking addReservation={addReservation} />
                        <ARoomReservations events={events} />
                        </div>
                    </div>
                    <div className="lg:col-span-1 space-y-8">
                        <TodayReserv />
                    </div>
                </div>
            </main>
    </div>
);
};

export default AReserv;