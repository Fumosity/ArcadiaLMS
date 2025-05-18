import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../supabaseClient"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

const TopBorrower = () => {
  const [topBorrowers, setTopBorrowers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState("allTime") // "allTime" or "monthly"
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const navigate = useNavigate()

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  useEffect(() => {
    if (viewMode === "allTime") {
      fetchTopBorrowersAllTime()
        .then((data) => {
          setTopBorrowers(data)
          setIsLoading(false)
        })
        .catch((error) => {
          console.error("Error fetching data:", error)
          setIsLoading(false)
        })
    } else {
      fetchTopBorrowersMonthly(selectedMonth, selectedYear)
        .then((data) => {
          setTopBorrowers(data)
          setIsLoading(false)
        })
        .catch((error) => {
          console.error("Error fetching data:", error)
          setIsLoading(false)
        })
    }
  }, [viewMode, selectedMonth, selectedYear])

  const fetchTopBorrowersAllTime = async () => {
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

  const fetchTopBorrowersMonthly = async (month, year) => {
    try {
      // Calculate start and end dates for the selected month
      const startDate = new Date(year, month, 1).toISOString()
      const endDate = new Date(year, month + 1, 0, 23, 59, 59).toISOString()

      // Fetch transactions for the selected month
      const { data: transactions, error: transactionError } = await supabase
        .from("book_transactions")
        .select("userID, transactionType, checkoutDate")
        .gte("checkoutDate", startDate)
        .lte("checkoutDate", endDate)

      if (transactionError) throw transactionError

      if (!transactions || transactions.length === 0) {
        console.log(`No transactions found for ${months[month]} ${year}`)
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

      // Get unique userIDs that have borrowed books in this month
      const userIDs = Object.keys(borrowCounts)

      if (userIDs.length === 0) {
        console.log(`No users with borrows found for ${months[month]} ${year}`)
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

      console.log(`Top 5 borrowers for ${months[month]} ${year}:`, sortedUsers)
      return sortedUsers
    } catch (error) {
      console.error("Error fetching top borrowers for month:", error)
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

  const handlePreviousMonth = () => {
    setIsLoading(true)
    if (selectedMonth === 0) {
      setSelectedMonth(11)
      setSelectedYear(selectedYear - 1)
    } else {
      setSelectedMonth(selectedMonth - 1)
    }
  }

  const handleNextMonth = () => {
    setIsLoading(true)
    if (selectedMonth === 11) {
      setSelectedMonth(0)
      setSelectedYear(selectedYear + 1)
    } else {
      setSelectedMonth(selectedMonth + 1)
    }
  }

  const toggleViewMode = (mode) => {
    if (mode !== viewMode) {
      setIsLoading(true)
      setViewMode(mode)
    }
  }

  return (
    <div className="bg-white border border-grey p-4 rounded-lg w-full">
      <div className="overflow-auto flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h3 className="text-2xl font-semibold mb-2 sm:mb-0">
          {viewMode === "allTime"
            ? "Top Borrowers (All Time)"
            : `Top Borrowers (${months[selectedMonth]} ${selectedYear})`}
        </h3>

        <div className="flex gap-2">
          <button
            onClick={() => toggleViewMode("allTime")}
            className={`px-3 py-1 rounded text-sm ${
              viewMode === "allTime" ? "bg-arcadia-red text-white" : "bg-grey text-gray-700 hover:bg-gray-300"
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => toggleViewMode("monthly")}
            className={`px-3 py-1 rounded text-sm ${
              viewMode === "monthly" ? "bg-arcadia-red text-white" : "bg-grey text-gray-700 hover:bg-gray-300"
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {viewMode === "monthly" && (
        <div className="flex items-center justify-center mb-4 gap-2 ">
          <button onClick={handlePreviousMonth} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">
            &lt;
          </button>
          <span className="text-sm font-medium">
            {months[selectedMonth]} {selectedYear}
          </span>
          <button onClick={handleNextMonth} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">
            &gt;
          </button>
        </div>
      )}

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
