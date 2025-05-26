import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { supabase } from "../supabaseClient"
import { useUser } from "./UserContext"

export const useUserCirculation = (propUser) => {
  const [sortOrder, setSortOrder] = useState("Descending")
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [typeOrder, setTypeOrder] = useState("All")
  const [dateRange, setDateRange] = useState("All Time")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [bkhistoryData, setBkhistoryData] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  const { user } = useUser()
  console.log(user)
  const username = user.userFName + " " + user.userLName
  console.log(username)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Get userId from multiple possible sources
        // 1. From props directly
        // 2. From location state (navigation)
        // 3. From nested objects in either source
        let userId = null

        // Try to get userId from props
        if (propUser) {
          userId = propUser.userId || propUser.userID || propUser.user_id

          // Check if userId is in a nested object
          if (!userId && propUser.user) {
            userId = propUser.user.userId || propUser.user.userID || propUser.user.user_id
          }
        }

        // If not found in props, try location state
        if (!userId && location.state) {
          userId = location.state.userId || location.state.userID || location.state.user_id

          // Check if userId is in a nested object in location state
          if (!userId && location.state.user) {
            userId = location.state.user.userId || location.state.user.userID || location.state.user.user_id
          }
        }

        if (!userId) {
          console.error("No user ID available from any source")
          setLoading(false)
          return
        }

        console.log("Fetching circulation data for user ID:", userId)

        const { data, error } = await supabase
          .from("book_transactions")
          .select(`
            transactionID,
                        transactionType, 
                        checkinDate, 
                        checkinTime, 
                        checkoutDate, 
                        checkoutTime,
                        deadline, 
                        userID, 
                        bookBarcode, 
                        book_indiv(
                            bookBarcode,
                            bookStatus,
                            book_titles (
                                titleID,
                                title,
                                price,
                                location
                            )
                        ),
                        user_accounts (
                            userFName,
                            userLName,
                            userLPUID,
                            userCollege,
                            userDepartment
                        )`)
          .eq("userID", userId)

        if (error) {
          console.error("Error fetching data: ", error.message)
        } else {
          const formattedData = data.map((item) => {
            const dateIn = item.checkinDate
            const dateOut = item.checkoutDate
            const deadline = item.deadline
            const time = item.checkinTime || item.checkoutTime

            // Format dateIn to "Month Day, Year" format
            let formattedDateIn = null
            if (dateIn) {
              const [year, month, day] = dateIn.split("-")
              const dateObj = new Date(year, month - 1, day)
              formattedDateIn = dateObj.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            }

            // Format dateOut to "Month Day, Year" format
            let formattedDateOut = null
            if (dateOut) {
              const [year, month, day] = dateOut.split("-")
              const dateObj = new Date(year, month - 1, day)
              formattedDateOut = dateObj.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            }

            // Format deadline to "Month Day, Year" format
            let formattedDeadline = null
            if (deadline) {
              const [year, month, day] = deadline.split("-")
              const dateObj = new Date(year, month - 1, day)
              formattedDeadline = dateObj.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            }

            let formattedTime = null
            if (time) {
              // Ensure time is in the format HH:mm (24-hour format)
              const timeString = time.includes(":") ? time : `${time.slice(0, 2)}:${time.slice(2)}`

              // Convert time into 12-hour format with AM/PM, no 'Z' for local time
              formattedTime = new Date(`1970-01-01T${timeString}`).toLocaleString("en-PH", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })
            }

            const bookDetails = item.book_indiv?.book_titles || {}

            return {
              type: item.transactionType,
              transNo: item.transactionID,
              dateIn: formattedDateIn,
              dateOut: formattedDateOut,
              date: item.transactionType === "Borrowed" ? formattedDateOut : formattedDateIn, // Use appropriate date based on type
              time: formattedTime,
              checkoutTime: item.checkoutTime,
              checkinTime: item.checkinTime,
              borrower: `${item.user_accounts.userFName} ${item.user_accounts.userLName}`,
              schoolNo: item.user_accounts.userLPUID,
              college: item.user_accounts.userCollege,
              department: item.user_accounts.userDepartment,
              bookTitle: bookDetails.title,
              bookBarcode: item.book_indiv.bookBarcode,
              location: bookDetails.location,
              userId: item.userID,
              deadline: formattedDeadline,
              titleID: bookDetails.titleID,
            }
          })

          setBkhistoryData(formattedData)
        }
      } catch (error) {
        console.error("Error: ", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [propUser, location.state]) // Add location.state as a dependency to react to navigation changes

  // Filter by type
  const filterByType = (data) => {
    if (typeOrder === "All") return data
    return data.filter((book) => book.type === typeOrder)
  }

  // Filter by date range
  const filterByDateRange = (data) => {
    if (dateRange === "All Time") return data

    return data.filter((book) => {
      if (!book.rawDate) return false

      const bookDate = new Date(book.rawDate)
      const today = new Date()

      switch (dateRange) {
        case "Last 7 Days":
          const sevenDaysAgo = new Date()
          sevenDaysAgo.setDate(today.getDate() - 7)
          return bookDate >= sevenDaysAgo
        case "Last 30 Days":
          const thirtyDaysAgo = new Date()
          thirtyDaysAgo.setDate(today.getDate() - 30)
          return bookDate >= thirtyDaysAgo
        case "Last 90 Days":
          const ninetyDaysAgo = new Date()
          ninetyDaysAgo.setDate(today.getDate() - 90)
          return bookDate >= ninetyDaysAgo
        case "This Year":
          const startOfYear = new Date(today.getFullYear(), 0, 1)
          return bookDate >= startOfYear
        default:
          return true
      }
    })
  }

  // Filter by search term
  const filterBySearch = (data) => {
    if (!searchTerm) return data
    const searchLower = searchTerm.toLowerCase()
    return data.filter(
      (book) =>
        (book.bookTitle && book.bookTitle.toLowerCase().includes(searchLower)) ||
        (book.borrower && book.borrower.toLowerCase().includes(searchLower)) ||
        (book.bookBarcode && book.bookBarcode.toLowerCase().includes(searchLower)),
    )
  }

  // Sort data
  const sortData = (data) => {
    return [...data].sort((a, b) => {
      // Create date objects for comparison
      const dateA = new Date(a.rawDate)
      const dateB = new Date(b.rawDate)

      // If dates are the same, compare times
      if (dateA.getTime() === dateB.getTime()) {
        // Default time if not available
        const timeA = a.rawTime || "00:00"
        const timeB = b.rawTime || "00:00"

        // Compare times
        return sortOrder === "Descending" ? timeB.localeCompare(timeA) : timeA.localeCompare(timeB)
      }

      // Compare dates
      return sortOrder === "Descending" ? dateB - dateA : dateA - dateB
    })
  }

  // Process data through filters and sorting
  const processData = () => {
    let processed = bkhistoryData
    processed = filterByType(processed)
    processed = filterByDateRange(processed)
    processed = filterBySearch(processed)
    processed = sortData(processed)
    return processed
  }

  const processedData = processData()
  const totalEntries = processedData.length
  const totalPages = Math.ceil(totalEntries / entriesPerPage)
  const paginatedData = processedData.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage)

  const handleUserClick = (book) => {
    navigate("/admin/useraccounts/viewusers", {
      state: { userId: book.user_id },
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const truncateTitle = (title, maxLength = 25) => {
    if (!title) return "Unknown"
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title
  }

  const setTypeFilter = (value) => {
    setTypeOrder(value)
    setCurrentPage(1) // Reset to first page when changing filter
  }

  return {
    sortOrder,
    setSortOrder,
    entriesPerPage,
    setEntriesPerPage,
    typeOrder,
    setTypeFilter,
    dateRange,
    setDateRange,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    paginatedData,
    totalPages,
    loading,
    handleUserClick,
    truncateTitle,
    totalEntries,
    username
  }
}
