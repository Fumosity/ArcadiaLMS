import React, { useState, useEffect } from "react";
import { supabase } from "/src/supabaseClient.js";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate } from "react-router-dom";

const BookRequests = () => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("book_reservation")
          .select(`
            bookResID, date, status, details, 
            user_accounts:userID (userFName, userLName), 
            book:titleID (title)
          `);

        if (error) throw error;

        setReservations(data || []);
      } catch (error) {
        console.error("Error fetching reservations:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const totalPages = Math.ceil(reservations.length / entriesPerPage);

  const filteredData = reservations.filter((reservation) => {
    const matchesStatus = statusFilter === "All" || reservation.status === statusFilter;
    const matchesSearch =
      reservation.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(reservation.bookResID).includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const startIndex = (currentPage - 1) * entriesPerPage;
  const displayedReservations = filteredData.slice(startIndex, startIndex + entriesPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow text-black";
      case "Approved":
        return "bg-green text-black";
      case "Rejected":
        return "bg-red text-black";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const handleUserClick = (user) => {
    console.log("userid", book.userId, "user", book.borrower, book)
    navigate("/admin/useraccounts/viewusers", {
      state: { userId: user.userID, user: user },
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBookClick = (book) => {
    navigate("/admin/bookinventory/viewbook", {
      state: { titleID: book.titleID, book: book },
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-white p-4 rounded-lg border-grey border h-fit">
      <h3 className="text-2xl font-semibold mb-4">User Book Requests</h3>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-sm">Status:</span>
          <select
            className="bg-gray-200 py-1 px-3 border rounded-lg text-sm w-32"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="search" className="font-medium text-sm">Search:</label>
          <input
            type="text"
            id="search"
            className="border border-gray-300 rounded-md py-1 px-2 text-sm w-auto sm:w-[420px]"
            placeholder="Details or Reservation ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-black">
          <thead>
            <tr>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase">Reservation ID</th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase">Book Title</th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-grey">
            {isLoading ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  <Skeleton count={5} />
                </td>
              </tr>
            ) : displayedReservations.length > 0 ? (
              displayedReservations.map((reservation, index) => (
                <tr key={index} className="hover:bg-light-gray cursor-pointer">
                  <td className="px-4 py-2 text-sm text-black text-center">{reservation.bookResID}</td>
                  <td
                    className="px-4 py-2 text-sm text-black text-center cursor-pointer text-blue-600 hover:underline"
                    onClick={() => handleUserClick(reservation.user_accounts)}
                  >
                    {reservation.user_accounts.userFName} {reservation.user_accounts.userLName}
                  </td>
                  <td
                    className="px-4 py-2 text-sm text-black text-center cursor-pointer text-blue-600 hover:underline"
                    onClick={() => handleBookClick(reservation.book)}
                  >
                    {reservation.book.title}
                  </td>
                  <td className="px-4 py-2 text-sm text-black text-center">{reservation.date}</td>
                  <td className={`flex items-center justify-center mt-2 mb-2 text-sm font-medium rounded-full px-1 py-2 ${getStatusColor(reservation.status)}`}>
                    {reservation.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-zinc-600">No reservations found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookRequests;
