import { Link } from "react-router-dom"
import { useState, useEffect, useCallback } from "react"
import { supabase } from "/src/supabaseClient.js"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { useNavigate } from "react-router-dom"

const RecentSupport = () => {
  const [recentSupports, setRecentSupports] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  const fetchRecentSupports = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("support_ticket")
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

      setRecentSupports(data)
    } catch (error) {
      console.error("Error fetching recent supports:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchRecentSupports()
  }, [fetchRecentSupports])

  // Set up real-time subscription
  useEffect(() => {
    const subscription = supabase
      .channel("support_ticket_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "support_ticket",
        },
        () => {
          fetchRecentSupports()
        },
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchRecentSupports])

  const handleSupportClick = (support) => {
    navigate("/admin/supportticket", {
      state: { support: support },
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleUserClick = (support) => {
    navigate("/admin/useraccounts/viewusers", {
      state: { userId: support.user_accounts.userID },
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="bg-white border border-grey p-4 rounded-lg w-full">
      <div className="flex justify-between items-center mb-4 overflow-hidden">
        <h3 className="text-2xl font-semibold">Recent Tickets</h3>
        
        <Link
          to="/admin/support#support-tickets"
          className="rounded-full py-1 px-3 text-sm border border-grey hover:bg-light-gray whitespace-nowrap"
          onClick={() => {
            // Navigate to the page first
            setTimeout(() => {
              // After navigation, find and scroll to the element
              const element = document.getElementById("support-tickets")
              if (element) {
                element.scrollIntoView({ behavior: "smooth" })
              }
            }, 100)
          }}
        >

          See More
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                User
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Details
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              [...Array(5)].map((_, index) => (
                <tr key={index} className="hover:bg-light-gray cursor-pointer">
                  <td className="px-4 py-2 text-center truncate">
                    <Skeleton />
                  </td>
                  <td className="px-4 py-2 text-center truncate">
                    <Skeleton />
                  </td>
                </tr>
              ))
            ) : recentSupports.length > 0 ? (
              recentSupports.map((support, index) => (
                <tr key={index} className="hover:bg-light-gray cursor-pointer">
                  <td className="w-2/3 px-4 py-2 text-left text-sm text-arcadia-red font-semibold">
                    <button
                      onClick={() => handleUserClick(support)}
                      className="text-blue-500 hover:underline"
                    >
                      {support.user_accounts.userFName} {support.user_accounts.userLName}
                    </button>
                  </td>
                  <td className="px-4 py-2 text-center text-sm">
                    <button
                      onClick={() => handleSupportClick(support)}
                      className="border border-grey px-2 rounded-full hover:bg-grey"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="py-4 text-center text-sm text-gray-500">
                  No recent tickets found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

  )
}

export default RecentSupport

