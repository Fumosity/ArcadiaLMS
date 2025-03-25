import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

const TodayReserv = () => {
  const [roomRes, setRoomRes] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate();

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
    setIsLoading(false)
  }, []);

  return (
    <div className="bg-white border border-grey p-4 rounded-lg w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold">Today's Reservations</h3>
      </div>
      <div className="overflow-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
            <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
            <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Booker</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {isLoading ? (
            [...Array(5)].map((_, index) => (
              <tr key={index} className="hover:bg-light-gray cursor-pointer">
                <td className="px-4 py-2 text-center text-sm truncate">
                  <Skeleton />
                </td>
                <td className="px-4 py-2 text-center text-sm truncate">
                  <Skeleton />
                </td>
                <td className="px-4 py-2 text-center text-sm truncate">
                  <Skeleton />
                </td>
              </tr>
            ))
          ) : roomRes.length > 0 ? (
            roomRes.map((room, index) => (
              <tr key={index} className="hover:bg-light-gray cursor-pointer">
                <td className="px-3 py-2 text-left text-sm text-black">{room.room}</td>
                <td className="px-3 py-2 text-left text-sm text-black">{room.time}</td>
                <td className="px-3 py-2 text-left text-sm text-black">{room.booker}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="px-4 py-2 text-center text-sm">No reservations found for today</td>
            </tr>
          )}
        </tbody>
      </table>
      </div>

    </div>
  );
};

export default TodayReserv;
