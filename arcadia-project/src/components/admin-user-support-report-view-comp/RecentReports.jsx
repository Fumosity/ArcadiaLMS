"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "/src/supabaseClient.js"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

const RecentReports = () => {
  const [recentReports, setRecentReports] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchRecentReports = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("report_ticket")
        .select(`
                    reportID,
                    date,
                    time,
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

      // Transform the data to match our needs
      const formattedData = data.map((report) => ({
        user: `${report.user_accounts.userFName} ${report.user_accounts.userLName}`,
        userID: report.user_accounts.userID,
        reportID: report.reportID,
        dateTime: `${report.date} ${report.time}`,
      }))

      setRecentReports(formattedData)
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

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Recent User Reports</h3>
        <button onClick={fetchRecentReports} className="bg-grey rounded-xl p-1 text-sm text-gray-500 hover:text-white">
          Refresh
        </button>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="font-semibold pb-1 border-b border-grey">User</th>
            <th className="font-semibold pb-1 border-b border-grey">User ID</th>
            <th className="font-semibold pb-1 border-b border-grey">Report ID</th>
            {/* <th className="font-semibold pb-1 border-b border-grey">Date & Time</th> */}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            [...Array(5)].map((_, index) => (
              <tr key={index} className="border-b border-grey">
                <td className="py-2">
                  <Skeleton />
                </td>
                <td className="py-2">
                  <Skeleton />
                </td>
                <td className="py-2">
                  <Skeleton />
                </td>
                <td className="py-2">
                  <Skeleton />
                </td>
              </tr>
            ))
          ) : recentReports.length > 0 ? (
            recentReports.map((report, index) => (
              <tr key={index} className="border-b border-grey hover:bg-gray-50">
                <td className="py-2">{report.user}</td>
                <td className="py-2">{report.userID}</td>
                <td className="py-2">{report.reportID}</td>
                {/* <td className="py-2">{report.dateTime}</td> */}
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

