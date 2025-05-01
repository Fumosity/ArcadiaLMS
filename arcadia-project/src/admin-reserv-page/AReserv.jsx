import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient"; // Adjust the path as needed
import TodayReserv from "../components/admin-reserv-comp/TodayReserv";
import Title from "../components/main-comp/Title";
import ARoomBooking from "../components/admin-room-reserv-comp/ARoomBooking";
import { ToastContainer } from "react-toastify";
import RoomReserv from "../components/admin-lib-analytics-comp/RoomReserv";
import ACurrentReserv from "./ACurrentReserv";

const AReserv = () => {
  useEffect(() => {
    document.title = "Arcadia | Room Reservation";
}, []);
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
          const { reservationData } = reservation;
          return {
            resourceId: reservationData.room,
            title: reservationData.title,
            start: `${reservationData.date}T${reservationData.startTime}`,
            end: `${reservationData.date}T${reservationData.endTime}`,
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
    <div className="min-h-screen bg-white">
      <Title>Reservations</Title>
      <div className="flex justify-center items-start space-x-2 pb-12 pt-8 px-12">
        <div className="flex-shrink-0 w-3/4 space-y-3">
          <div id="room-booking">
            <ARoomBooking addReservation={addReservation} />
          </div>
          <div id="reserved-rooms">
            <ACurrentReserv/>
          </div>
          <div id="reserved-rooms">
            <RoomReserv />
          </div>
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
