import { useState, useEffect, useCallback } from "react"
import { supabase } from "/src/supabaseClient.js"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { useUser } from "../../../backend/UserContext" // Adjust this path as needed

const ReportStatus = ({ onReportSelect }) => {
  const [reportData, setReportData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useUser() // Get logged-in user info

  const fetchReports = useCallback(async () => {
    if (!user?.userID) {
      alert("Please log in to view your reports.")
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from("report_ticket")
        .select("reportID, type, status, subject, date, time")
        .eq("userID", user.userID) // Filter by user ID

      if (error) throw error

      setReportData(data || [])
    } catch (error) {
      console.error("Error fetching reports:", error.message)
    } finally {
      setIsLoading(false)
    }
  }, [user?.userID])

  // Fetch reports on component mount
  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  const handleReportClick = (reportID) => {
    onReportSelect(reportID)
  }

  return (
    <div className="uHero-cont max-w-[1200px] w-full p-6 bg-white rounded-lg border border-grey">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">User Report Status</h2>
        <button className="modifyButton" onClick={fetchReports}>
          Refresh
        </button>
      </div>
      <p className="text-sm mb-4">
        These are all the user reports that you have made. Click on the report ID to view the contents of the report and
        the ARC's reply.
      </p>

      <div className="overflow-x-auto">
        <table className="min-w-full text-center">
          <thead className="border-b border-grey">
            <tr>
              <th className="px-4 py-2 text-xs font-medium text-gray-500">Type</th>
              <th className="px-4 py-2 text-xs font-medium text-gray-500">Status</th>
              <th className="px-4 py-2 text-xs font-medium text-gray-500">Subject</th>
              <th className="px-4 py-2 text-xs font-medium text-gray-500">Date</th>
              <th className="px-4 py-2 text-xs font-medium text-gray-500">Time</th>
              <th className="px-4 py-2 text-xs font-medium text-gray-500">Report ID</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {isLoading ? (
              [...Array(5)].map((_, index) => (
                <tr key={index}>
                  <td>
                    <Skeleton height={20} />
                  </td>
                  <td>
                    <Skeleton height={20} />
                  </td>
                  <td>
                    <Skeleton height={20} />
                  </td>
                  <td>
                    <Skeleton height={20} />
                  </td>
                  <td>
                    <Skeleton height={20} />
                  </td>
                  <td>
                    <Skeleton height={20} />
                  </td>
                </tr>
              ))
            ) : reportData.length > 0 ? (
              reportData.map((report) => (
                <tr key={report.reportID}>
                  <td className="px-4 py-2 text-sm">
                    <div className="text-center px-1 border rounded-xl text-arcadia-red">{report.type || "N/A"}</div>
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <span
                      className={`px-4 py-1 rounded-full text-xs font-semibold ${report.status === "Ongoing" ? "bg-yellow" : report.status === "Resolved" ? "bg-green" : report.status === "Intended" ? "bg-red" : "bg-gray-200"}`}
                    >
                      {report.status || "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm">{report.subject || "N/A"}</td>
                  <td className="px-4 py-2 text-sm">{report.date || "N/A"}</td>
                  <td className="px-4 py-2 text-sm">{report.time || "N/A"}</td>
                  <td className="px-4 py-2 text-sm text-red-600 font-medium hover:underline cursor-pointer">
                    <span onClick={() => handleReportClick(report.reportID)}>{report.reportID || "N/A"}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 py-4">
                  No reports found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ReportStatus

