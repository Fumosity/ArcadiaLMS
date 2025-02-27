
import { useState, useEffect, useCallback } from "react"
import { supabase } from "/src/supabaseClient.js"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { Link } from "react-router-dom";

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
        <div className="bg-white border border-grey p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold">Recent Tickets</h3>
            <button onClick={fetchRecentSupports} className="rounded-full py-1 px-3 text-sm border border-grey hover:bg-light-gray">
              Refresh
            </button>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
          <thead>
              <tr>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
            <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
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
                     ) : recentSupports.length > 0 ? (
                      recentSupports.map((support, index) => (
                         <tr key={index} className="hover:bg-light-gray cursor-pointer">
                           <td className="px-4 py-2 text-center text-sm truncate">{support.user}</td>
                           <td className="px-4 py-2 text-center text-sm truncate">{support.supportID}</td>
                           <td className="px-4 py-2 text-arcadia-red font-semibold text-center text-sm truncate">
                             <Link
                               to={`/admin/support`}
                               className="text-blue-600 hover:underline"
                             >
                               View
                             </Link>
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
};

export default RecentSupport;
