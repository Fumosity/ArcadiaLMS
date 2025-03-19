import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { supabase } from "../supabaseClient"

export const useUserReport = (propUser) => {
  const [sortOrder, setSortOrder] = useState("Descending")
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [typeFilter, setTypeFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [dateRange, setDateRange] = useState("All Time")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [reportData, setReportData] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  function checkStatusColor(status) {
    switch (status) {
      case "Resolved":
        return "bg-resolved text-white"
      case "Ongoing":
        return "bg-ongoing"
      case "Intended":
        return "bg-intended text-white"
      default:
        return "bg-grey"
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Get userId from multiple possible sources
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

        console.log("Fetching report data for user ID:", userId)

        const { data, error } = await supabase
          .from("report_ticket")
          .select(`
            reportID, 
            type, 
            status, 
            subject, 
            date, 
            time, 
            content, 
            userID,
            user_accounts (
              userFName,
              userLName
            )
          `)
          .eq("userID", userId)

        if (error) {
          console.error("Error fetching report data:", error.message)
        } else {
          const formattedData = data.map((item) => {
            // Format date to "Month Day, Year" format
            let formattedDate = null
            if (item.date) {
              const [year, month, day] = item.date.split("-")
              const dateObj = new Date(year, month - 1, day)
              formattedDate = dateObj.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            }

            // Format time if available
            let formattedTime = null
            if (item.time) {
              // Ensure time is in the format HH:mm (24-hour format)
              const timeString = item.time.includes(":") ? item.time : `${item.time.slice(0, 2)}:${item.time.slice(2)}`

              // Convert time into 12-hour format with AM/PM
              formattedTime = new Date(`1970-01-01T${timeString}`).toLocaleString("en-PH", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })
            }

            return {
              id: item.reportID,
              type: item.type,
              status: item.status,
              subject: item.subject,
              rawDate: item.date,
              date: formattedDate,
              rawTime: item.time,
              time: formattedTime,
              content: item.content,
              user_id: item.userID,
              userName: `${item.user_accounts.userFName} ${item.user_accounts.userLName}`,
              statusColor: checkStatusColor(item.status),
            }
          })

          setReportData(formattedData)
        }
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [propUser, location.state])

  // Filter by type
  const filterByType = (data) => {
    if (typeFilter === "All") return data
    return data.filter((item) => item.type === typeFilter)
  }

  // Filter by status
  const filterByStatus = (data) => {
    if (statusFilter === "All") return data
    return data.filter((item) => item.status === statusFilter)
  }

  // Filter by date range
  const filterByDateRange = (data) => {
    if (dateRange === "All Time") return data

    return data.filter((item) => {
      if (!item.rawDate) return false

      const itemDate = new Date(item.rawDate)
      const today = new Date()

      switch (dateRange) {
        case "Last 7 Days":
          const sevenDaysAgo = new Date()
          sevenDaysAgo.setDate(today.getDate() - 7)
          return itemDate >= sevenDaysAgo
        case "Last 30 Days":
          const thirtyDaysAgo = new Date()
          thirtyDaysAgo.setDate(today.getDate() - 30)
          return itemDate >= thirtyDaysAgo
        case "Last 90 Days":
          const ninetyDaysAgo = new Date()
          ninetyDaysAgo.setDate(today.getDate() - 90)
          return itemDate >= ninetyDaysAgo
        case "This Year":
          const startOfYear = new Date(today.getFullYear(), 0, 1)
          return itemDate >= startOfYear
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
      (item) =>
        (item.subject && item.subject.toLowerCase().includes(searchLower)) ||
        (item.id && item.id.toString().includes(searchLower)),
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
    let processed = reportData
    processed = filterByType(processed)
    processed = filterByStatus(processed)
    processed = filterByDateRange(processed)
    processed = filterBySearch(processed)
    processed = sortData(processed)
    return processed
  }

  const processedData = processData()
  const totalEntries = processedData.length
  const totalPages = Math.ceil(totalEntries / entriesPerPage)
  const paginatedData = processedData.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage)

  const handleReportClick = (report) => {
    navigate("/admin/reportticket", {
      state: { ticket: report },
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const truncateText = (text, maxLength = 25) => {
    if (!text) return "Unknown"
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

  const setTypeFilterValue = (value) => {
    setTypeFilter(value)
    setCurrentPage(1) // Reset to first page when changing filter
  }

  const setStatusFilterValue = (value) => {
    setStatusFilter(value)
    setCurrentPage(1) // Reset to first page when changing filter
  }

  return {
    sortOrder,
    setSortOrder,
    entriesPerPage,
    setEntriesPerPage,
    typeFilter,
    setTypeFilter: setTypeFilterValue,
    statusFilter,
    setStatusFilter: setStatusFilterValue,
    dateRange,
    setDateRange,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    paginatedData,
    totalPages,
    loading,
    handleReportClick,
    truncateText,
    totalEntries,
    checkStatusColor,
  }
}

