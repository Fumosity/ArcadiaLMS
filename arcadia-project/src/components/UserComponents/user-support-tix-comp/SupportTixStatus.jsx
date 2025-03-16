import { useState, useEffect, useCallback } from "react"
import { supabase } from "/src/supabaseClient.js"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { useUser } from "../../../backend/UserContext"

const SupportStatus = ({ onSupportSelect }) => {
  const [supportData, setSupportData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useUser()

  const fetchSupports = useCallback(async () => {
    if (!user?.userID) {
      alert("Please log in to view your supports.")
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from("support_ticket")
        .select("supportID, type, status, subject, date, time")
        .eq("userID", user.userID)

      if (error) throw error

      setSupportData(data || [])
    } catch (error) {
      console.error("Error fetching supports:", error.message)
    } finally {
      setIsLoading(false)
    }
  }, [user?.userID])

  useEffect(() => {
    fetchSupports()
  }, [fetchSupports])

  const handleSupportClick = (supportID) => {
    onSupportSelect(supportID)
  }

  return (
    <div className="uHero-cont max-w-[1200px] w-full p-6 bg-white rounded-lg border border-grey">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">User Support Status</h2>
        <button className="modifyButton" onClick={fetchSupports}>
          Refresh
        </button>
      </div>
      <p className="text-sm mb-4">
        These are all the user supports that you have made. Click on the support ID or subject to view the contents of the support and the ARC's reply.
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
              <th className="px-4 py-2 text-xs font-medium text-gray-500">Support ID</th>
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
                  <td><Skeleton height={20} /></td>
                  <td><Skeleton height={20} /></td>
                </tr>
              ))
            ) : supportData.length > 0 ? (
              supportData.map((support) => (
                <tr key={support.supportID}>
                  <td className="px-4 py-2 text-sm">
                    <div className="text-center border rounded-xl px-1 text-arcadia-red">{support.type || "N/A"}</div>
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <span
                      className={`px-4 py-1 rounded-full text-xs font-semibold ${support.status === "Ongoing"
                          ? "bg-yellow"
                          : support.status === "Resolved"
                          ? "bg-green"
                          : support.status === "Intended"
                          ? "bg-red"
                          : "bg-gray-200"
                        }`}
                    >
                      {support.status || "N/A"}
                    </span>
                  </td>

                  <td
                    className="px-4 py-2 text-sm text-arcadia-red font-medium hover:underline cursor-pointer"
                    onClick={() => handleSupportClick(support.supportID)}
                  >
                    {support.subject || "N/A"}
                  </td>

                  <td className="px-4 py-2 text-sm">{support.date || "N/A"}</td>
                  <td className="px-4 py-2 text-sm">{support.time || "N/A"}</td>

                  <td
                    className="px-4 py-2 text-sm text-arcadia-red font-medium hover:underline cursor-pointer"
                    onClick={() => handleSupportClick(support.supportID)}
                  >
                    {support.supportID || "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 py-4">
                  No supports found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SupportStatus
