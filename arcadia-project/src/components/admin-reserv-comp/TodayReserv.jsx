import React, { useEffect, useState } from "react";
import { supabase } from '../../supabaseClient';  // Adjust the path according to your project structure

const TodayReserv = () => {
  const [roomRes, setRoomRes] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      // Fetch reservations from the 'reservation' table and filter by date inside the reserve_data JSONB column
      const { data: reservations, error } = await supabase
        .from('reservation')
        .select('reserve_data, userID')
        .filter('reserve_data->>date', 'eq', '2024-12-10');  // Corrected query to extract date from JSON

      if (error) {
        console.error('Error fetching reservations:', error);
        return;
      }

      // Fetch booker names from 'user_accounts' table based on userID
      const updatedReservations = await Promise.all(
        reservations.map(async (reservation) => {
          const { data: user, error: userError } = await supabase
            .from('user_accounts')
            .select('userFName, userLName')
            .eq('userID', reservation.userID)
            .single();

          if (userError) {
            console.error('Error fetching user data:', userError);
            return null;
          }

          // Parse reserve_data JSON to extract the room and time range
          const { room, startTime, endTime } = reservation.reserve_data;
          const timeRange = `${startTime}-${endTime}`;
          const booker = `${user.userFName} ${user.userLName}`;

          return { room, time: timeRange, booker };
        })
      );

      // Filter out any null results in case of errors
      setRoomRes(updatedReservations.filter((reservation) => reservation !== null));
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
