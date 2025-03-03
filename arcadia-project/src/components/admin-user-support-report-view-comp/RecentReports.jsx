"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "/src/supabaseClient.js"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const RecentReports = () => {
  const [recentReports, setRecentReports] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate();

  const fetchRecentReports = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("report_ticket")
        .select(`
                    *,
                    user_accounts:userID (
                        userID,
                        userFName,
                        userLName
                    )
                `)
        .order("date", { ascending: false })
        .order("time", { ascending: false })
        .limit(5)

      if (error) {
        throw error
      }

      setRecentReports(data)
    } catch (error) {
      console.error("Error fetching recent reports:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchRecentReports()
  }, [fetchRecentReports])

  // Set up real-time subscription
  useEffect(() => {
    const subscription = supabase
      .channel("report_ticket_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "report_ticket",
        },
        () => {
          fetchRecentReports()
        },
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchRecentReports])

  const handleReportClick = (report) => {
    console.log("report", report)
    navigate("/admin/reportticket", {
      state: { ticket: report },
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUserClick = (report) => {
    navigate("/admin/useraccounts/viewusers", {
      state: { userId: report.user_accounts.userID },
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-white border border-grey p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold">Recent Reports</h3>
        <button onClick={fetchRecentReports} className="rounded-full py-1 px-3 text-sm border border-grey hover:bg-light-gray">
          Refresh
        </button>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
            <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Report ID</th>
            <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
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
              </tr>
            ))
          ) : recentReports.length > 0 ? (
            recentReports.map((report, index) => (
              <tr key={index} className="hover:bg-light-gray cursor-pointer">
                <td className="px-4 py-2 text-left text-sm  text-arcadia-red font-semibold">
                  <button
                    onClick={() => handleUserClick(report)}
                    className="text-blue-500 hover:underline"
                  >
                    {report.user_accounts.userFName} {report.user_accounts.userLName}
                  </button>
                </td>
                <td className="px-4 py-2 text-center text-sm truncate">{report.reportID}</td>
                <td
                  className="px-4 py-2 text-arcadia-red font-semibold text-center text-sm truncate hover:underline"
                  onClick={() => handleReportClick(report)}
                >
                  View
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="py-4 text-center text-gray-500">
                No recent reports found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default RecentReports

