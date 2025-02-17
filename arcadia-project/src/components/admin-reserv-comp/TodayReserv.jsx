import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

const TodayReserv = () => {
  const [roomRes, setRoomRes] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      const today = new Date().toISOString().split("T")[0]; // Get today's date (YYYY-MM-DD)
      console.log("Today's Date:", today);

      const { data: reservations, error } = await supabase
        .from("reservation")
        .select("reservationData, userID") 
        .eq("reservationData->>date", today);   

      if (error) {
        console.error("Error fetching reservations:", error);
        return;
      }

      console.log("Fetched reservations:", reservations); // Check if data is fetched

      if (!reservations || reservations.length === 0) {
        console.warn("No reservations found for today.");
        setRoomRes([]); // Set empty if no data
        return;
      }

      // Fetch booker names based on userID
      const updatedReservations = await Promise.all(
        reservations.map(async (reservation) => {
          const { data: user, error: userError } = await supabase
            .from("user_accounts")
            .select("userFName, userLName")
            .eq("userID", reservation.userID)
            .single();

          if (userError) {
            console.error("Error fetching user data:", userError);
            return null;
          }

          // Extract data from reservationData JSONB
          const { room, startTime, endTime } = reservation.reservationData;
          return {
            room,
            time: `${startTime}-${endTime}`,
            booker: `${user.userFName} ${user.userLName}`,
          };
        })
      );

      setRoomRes(updatedReservations.filter((r) => r !== null)); // Remove null values
    };

    fetchReservations();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">Today's Reservations</h3>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="font-semibold pb-1 border-b border-grey">Room</th>
            <th className="font-semibold pb-1 border-b border-grey">Time</th>
            <th className="font-semibold pb-1 border-b border-grey">Booker</th>
          </tr>
        </thead>
        <tbody>
          {roomRes.length > 0 ? (
            roomRes.map((room, index) => (
              <tr key={index} className="border-b border-grey">
                <td className="py-2">{room.room}</td>
                <td className="py-2">{room.time}</td>
                <td className="py-2">{room.booker}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="py-2 text-center">No reservations found for today</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TodayReserv;
