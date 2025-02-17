import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient"; // Adjust the path as needed
import TodayReserv from "../components/admin-reserv-comp/TodayReserv";
import MainHeader from "../components/main-comp/MainHeader";
import Title from "../components/main-comp/Title";
import ARoomBooking from "../components/admin-room-reserv-comp/ARoomBooking";
import ARoomReservations from "../components/admin-room-reserv-comp/ARoomReservations";
import { ToastContainer } from "react-toastify";

const AReserv = () => {
  const [events, setEvents] = useState([]);

  // Fetch reservations from Supabase
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const { data, error } = await supabase.from("reservation").select("*");
        if (error) {
          console.error("Error fetching reservations:", error.message);
        } else {
          // Transform data into the format required by your calendar
          const formattedEvents = data.map((reservation) => {
            const { reserve_data } = reservation;
            return {
              resourceId: reserve_data.room,
              title: reserve_data.title,
              start: `${reserve_data.date}T${reserve_data.startTime}`,
              end: `${reserve_data.date}T${reserve_data.endTime}`,
            };
          });
          setEvents(formattedEvents);
        }
      } catch (error) {
        console.error("Error fetching reservations:", error.message);
      }
    };

    fetchReservations();
  }, []);

  const addReservation = (newEvent) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Title>Reservations</Title>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-8">
            <div className="bg-white overflow-hidden rounded-lg w-full">
              <ToastContainer />
              <ARoomBooking addReservation={addReservation} />
            </div>
            <div className="bg-white overflow-hidden rounded-lg w-full border border-grey">
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
