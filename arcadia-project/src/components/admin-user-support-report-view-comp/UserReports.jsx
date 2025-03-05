"use client"

import React, { useState, useEffect } from "react"
import { supabase } from "/src/supabaseClient.js"
import { Link } from "react-router-dom"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { useNavigate } from "react-router-dom";

const UserReports = () => {
  const [reports, setReports] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("Ascending");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();

  function checkStatusColor(status) {
    switch (status) {
      case 'Resolved':
        return "bg-resolved"
      case 'Ongoing':
        return "bg-ongoing"
      case 'Intended':
        return "bg-intended"
      default:
        return "bg-grey"
    }
  }

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("report_ticket")
          .select(`
            reportID, type, status, subject, date, time, content, 
            user_accounts:userID (userFName, userLName)
          `);

        if (error) throw error;

        setReports(data || []);
      } catch (error) {
        console.error("Error fetching reports:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [supabase]); // Add `supabase` if needed, otherwise leave as `[]`

  const totalPages = Math.ceil(reports.length / entriesPerPage);

  // Handle sorting
  const sortedData = [...reports].sort((a, b) => {
    if (sortOrder === "Ascending") {
      return String(a.reportID).localeCompare(String(b.reportID));
    } else {
      return String(b.reportID).localeCompare(String(a.reportID));
    }
  });  

  // Handle filtering and searching
  const filteredData = sortedData.filter((reports) => {
    const matchesType =
      typeFilter === "All" || reports.type === typeFilter;

    const matchesStatus =
      statusFilter === "All" || reports.status === statusFilter;

    const matchesSearch =
      reports.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reports.reportID.includes(searchTerm);

    return matchesType && matchesStatus && matchesSearch;
  });

  // Pagination logic
  const startIndex = (currentPage - 1) * entriesPerPage;
  const displayedReports = filteredData.slice(startIndex, startIndex + entriesPerPage);

  // Log `reports` when it updates
  useEffect(() => {
    console.log("Updated reports:", reports);
  }, [reports]);

  const handleReportClick = (report) => {
    console.log("report", report)
    navigate("/admin/reportticket", {
      state: { ticket: report },
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-white p-4 rounded-lg border-grey border h-fit">
      <h3 className="text-2xl font-semibold mb-4">User Reports</h3>

      {/* Controls for sort, filter, and search */}
      <div className="mb-4 flex flex-wrap justify-between space-x-4">
        <div className="flex gap-4">
          {/* Sort By */}
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">Sort:</span>
            <button
              onClick={() =>
                setSortOrder(sortOrder === "Ascending" ? "Descending" : "Ascending")
              }
              className="sort-by bg-gray-200 py-1 px-3 rounded-lg text-sm w-28"
            >
              {sortOrder}
            </button>
          </div>

          {/* Filter By */}
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">Type:</span>
            <select
              className="bg-gray-200 py-1 px-3 border rounded-lg text-sm w-32"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="System">System</option>
              <option value="Feedback">Feedback</option>
              <option value="Book">Book</option>
              <option value="Research">Research</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">Status:</span>
            <select
              className="bg-gray-200 py-1 px-3 border rounded-lg text-sm w-32"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Intended">Intended</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
        {/* Search */}
        <div className="flex items-center space-x-2">
          <label htmlFor="search" className="font-medium text-sm">Search:</label>
          <input
            type="text"
            id="search"
            className="border border-gray-300 rounded-md py-1 px-2 text-sm w-64"
            placeholder="Subject or report ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Type</th>
            <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Status</th>
            <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-3/12">Subject</th>
            <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-3/12">User</th>
            <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Date</th>
            <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Time</th>
            <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Report ID</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {isLoading ? (
            <tr>
              <td className="text-center py-4 w-1/12">
                <Skeleton />
              </td>
              <td className="text-center py-4 w-1/12">
                <Skeleton />
              </td>
              <td className="text-center py-4 w-3/12">
                <Skeleton />
              </td>
              <td className="text-center py-4 w-3/12">
                <Skeleton />
              </td>
              <td className="text-center py-4 w-2/12">
                <Skeleton />
              </td>
              <td className="text-center py-4 w-1/12">
                <Skeleton />
              </td>
              <td className="text-center py-4 w-1/12">
                <Skeleton />
              </td>
            </tr>
          ) : displayedReports.length > 0 ? (
            displayedReports.map((report, index) => (
              <tr key={index} className="hover:bg-light-gray cursor-pointer">
                <td className="px-4 py-2 text-sm text-gray-900 text-center w-1/12">
                  <div className={`py-1 px-3 rounded-full bg-grey font-semibold`}>
                    {report.type || "N/A"}
                  </div>
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 text-center w-1/12">
                  <div className={`py-1 px-3 rounded-full font-semibold ${checkStatusColor(report.status)}`}>
                    {report.status || "N/A"}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-arcadia-red font-semibold truncate text-left w-3/12">
                  <button
                    onClick={() => handleReportClick(report)}
                    className="text-blue-500 hover:underline"
                  >
                    {report.subject}
                  </button>
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 text-center w-3/12">
                  {report.user_accounts.userFName} {report.user_accounts.userLName}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 text-center w-2/12">
                  {report.date}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 text-center w-1/12">
                  {report.time}
                </td>
                <td className="px-4 py-2 text-sm  text-arcadia-red font-semibold text-center w-1/12">
                  <button
                    onClick={() => handleReportClick(report)}
                    className="text-blue-500 hover:underline"
                  >
                    {report.reportID}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="text-center text-zinc-600 py-4" colSpan="7">
                No reports found.
              </td>
            </tr>
          )}
        </tbody>
        
      </table>
      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-2 space-x-4">
          <button className={`uPage-btn ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-grey"}`} onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            Previous Page
          </button>
          <span className="text-xs text-arcadia-red">Page {currentPage}</span>
          <button className={`uPage-btn ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-grey"}`} onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
            Next Page
          </button>
        </div>
    </div>
  )
}

export default UserReports