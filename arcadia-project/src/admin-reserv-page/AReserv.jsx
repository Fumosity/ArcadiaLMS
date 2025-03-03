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

  useEffect(() => {
    fetchReservations();
  }, []);

  const addReservation = (newEvent) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  const handleRefresh = () => {
    fetchReservations();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Title>Reservations</Title>
      <div className="flex justify-center items-start space-x-2 pb-12 pt-8 px-12">

        <div className="flex-shrink-0 w-3/4 space-y-2">
            <ARoomBooking addReservation={addReservation} />
            <ARoomReservations events={events} />
            <ToastContainer />
        </div>

        <div className="flex flex-col items-start flex-shrink-0 w-1/4 space--2">
          <TodayReserv />
        </div>

      </div>
    </div>
  );
};

export default AReserv;
