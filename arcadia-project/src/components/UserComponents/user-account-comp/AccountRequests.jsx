import { useState, useEffect, useCallback } from "react";
import { supabase } from "/src/supabaseClient.js";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useUser } from "../../../backend/UserContext";

const AccountRequests = () => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  const fetchReservations = useCallback(async () => {
    if (!user?.userID) {
      alert("Please log in to view your reservations.");
      setIsLoading(false);
      return;
    }
  
    try {
      setIsLoading(true);
      console.log("Fetching reservations for userID:", user.userID); // Debugging log
  
      const { data, error } = await supabase
        .from("book_reservation")
        .select("bookResID, status, date, details, book_titles(title)")
        .eq("userID", user.userID)
        .order("date", { ascending: false });
  
      if (error) throw error;
  
      console.log("Fetched reservations:", data); // Debugging log
      setReservations(data || []);
    } catch (error) {
      console.error("Error fetching reservations:", error.message);
    } finally {
      setIsLoading(false);
    }
  }, [user?.userID]);
  

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  return (
    <div className="uHero-cont max-w-[1200px] w-full p-6 bg-white rounded-lg border border-grey">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">My Book Reservations</h2>
        <button className="modifyButton" onClick={fetchReservations}>
          Refresh
        </button>
      </div>
      <p className="text-sm mb-4">
        These are all the book reservations you have made.
      </p>

      <div className="overflow-x-auto">
        <table className="min-w-full text-center">
          <thead className="border-b border-grey">
            <tr>
              <th className="px-4 py-2 text-xs font-medium text-gray-500">Book Title</th>
              <th className="px-4 py-2 text-xs font-medium text-gray-500">Status</th>
              <th className="px-4 py-2 text-xs font-medium text-gray-500">Date</th>
              <th className="px-4 py-2 text-xs font-medium text-gray-500">Details</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {isLoading ? (
              [...Array(5)].map((_, index) => (
                <tr key={index}>
                  <td><Skeleton height={20} /></td>
                  <td><Skeleton height={20} /></td>
                  <td><Skeleton height={20} /></td>
                  <td><Skeleton height={20} /></td>
                </tr>
              ))
            ) : reservations.length > 0 ? (
              reservations.map((reservation) => (
                <tr key={reservation.reservationID}>
                  <td className="px-4 py-2 text-sm">{reservation.book_titles?.title || "N/A"}</td>
                  <td className="px-4 py-2 text-sm">
                    <span
                      className={`px-4 py-1 rounded-full text-xs font-semibold ${
                        reservation.status === "Pending"
                          ? "bg-yellow"
                          : reservation.status === "Approved"
                          ? "bg-green"
                          : reservation.status === "Rejected"
                          ? "bg-red"
                          : "bg-gray-200"
                      }`}
                    >
                      {reservation.status || "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm">{reservation.date || "N/A"}</td>
                  <td className="px-4 py-2 text-sm">{reservation.details || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 py-4">
                  No book reservations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountRequests;
