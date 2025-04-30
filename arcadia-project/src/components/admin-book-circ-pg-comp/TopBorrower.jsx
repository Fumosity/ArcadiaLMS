import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../supabaseClient"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

const TopBorrower = () => {
  const [topBorrowers, setTopBorrowers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchTopBorrowers()
      .then((data) => {
        setTopBorrowers(data)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching data:", error)
        setIsLoading(false)
      })
  }, [])

  const fetchTopBorrowers = async () => {
    try {
      // Fetch all borrowing transactions (historical, not just current)
      const { data: transactions, error: transactionError } = await supabase
        .from("book_transactions")
        .select("userID, transactionType")

      if (transactionError) throw transactionError

      if (!transactions || transactions.length === 0) {
        console.log("No transactions found")
        return []
      }

      // Count transactions by userID
      const borrowCounts = {}
      transactions.forEach(({ userID }) => {
        if (!borrowCounts[userID]) {
          borrowCounts[userID] = 0
        }
        borrowCounts[userID] += 1
      })

      // Get unique userIDs that have borrowed books
      const userIDs = Object.keys(borrowCounts)

      if (userIDs.length === 0) {
        console.log("No users with borrows found")
        return []
      }

      // Fetch user details for users who have borrowed books
      const { data: users, error: userError } = await supabase
        .from("user_accounts")
        .select("userID, userFName, userLName, userLPUID")
        .in("userID", userIDs)

      if (userError) {
        console.error("Error fetching user details:", userError)
        throw userError
      }

      if (!users || users.length === 0) {
        console.log("No user details found for borrowers")
        return []
      }

      // Combine user details with borrow counts
      const usersWithBorrowCounts = users.map((user) => {
        return {
          ...user,
          borrowCount: borrowCounts[user.userID] || 0,
          fullName: `${user.userFName} ${user.userLName}`,
        }
      })

      // Sort by borrow count (highest first) and take top 5
      const sortedUsers = usersWithBorrowCounts.sort((a, b) => b.borrowCount - a.borrowCount).slice(0, 5)

      console.log("Top 5 borrowers of all time:", sortedUsers)
      return sortedUsers
    } catch (error) {
      console.error("Error fetching top borrowers:", error)
      return []
    }
  }

  const handleUserClick = (user) => {
    navigate("/admin/useraccounts/viewusers", {
      state: { userId: user.userID },
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const truncateName = (name, maxLength = 20) => {
    if (!name) return "Unknown"
    return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name
  }

  return (
    <div className="bg-white border border-grey p-4 rounded-lg w-full">
      <h3 className="text-2xl font-semibold">Top Borrowers (All Time)</h3>
      <div className="overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="w-2/3 px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Borrower
              </th>
              <th className="w-1/3 px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Borrows
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              [...Array(5)].map((_, index) => (
                <tr key={index} className="hover:bg-light-gray cursor-pointer">
                  <td className="w-2/3 px-4 py-2 text-center text-sm truncate">
                    <Skeleton />
                  </td>
                  <td className="w-1/3 px-4 py-2 text-center text-sm truncate">
                    <Skeleton />
                  </td>
                </tr>
              ))
            ) : topBorrowers.length > 0 ? (
              topBorrowers.map((user, index) => (
                <tr key={index} className="hover:bg-light-gray cursor-pointer">
                  <td className="w-2/3 px-4 py-2 text-left text-sm text-arcadia-red font-semibold">
                    <button onClick={() => handleUserClick(user)} className="text-blue-500 hover:underline">
                      {truncateName(user.fullName)}
                    </button>
                  </td>
                  <td className="w-1/3 px-4 py-2 text-center text-sm truncate">{user.borrowCount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="py-4 text-center text-sm text-gray-500">
                  No borrowers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TopBorrower
