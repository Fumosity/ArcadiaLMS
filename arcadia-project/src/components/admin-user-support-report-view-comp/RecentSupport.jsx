
import { useState, useEffect, useCallback } from "react"
import { supabase } from "/src/supabaseClient.js"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

const RecentSupport = () => {
    const [recentSupports, setRecentSupports] = useState([])
      const [isLoading, setIsLoading] = useState(true)
    
      const fetchRecentSupports = useCallback(async () => {
        try {
          const { data, error } = await supabase
            .from("support_ticket")
            .select(`
                        supportID,
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
          const formattedData = data.map((support) => ({
            user: `${support.user_accounts.userFName} ${support.user_accounts.userLName}`,
            userID: support.user_accounts.userID,
            supportID: support.supportID,
            dateTime: `${support.date} ${support.time}`,
          }))
    
          setRecentSupports(formattedData)
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
    
      return (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Recent User Supports</h3>
            <button onClick={fetchRecentSupports} className="bg-grey rounded-xl p-1 text-sm text-gray-500 hover:text-white">
              Refresh
            </button>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="font-semibold pb-1 border-b border-grey">User</th>
                <th className="font-semibold pb-1 border-b border-grey">User ID</th>
                <th className="font-semibold pb-1 border-b border-grey">Support ID</th>
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
              ) : recentSupports.length > 0 ? (
                recentSupports.map((support, index) => (
                  <tr key={index} className="border-b border-grey hover:bg-gray-50">
                    <td className="py-2">{support.user}</td>
                    <td className="py-2">{support.userID}</td>
                    <td className="py-2">{support.supportID}</td>
                    {/* <td className="py-2">{support.dateTime}</td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-500">
                    No recent supports found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )
};

export default RecentSupport;
