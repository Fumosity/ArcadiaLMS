import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../supabaseClient"

export const useUserCirculation = (propUser) => {
  const [sortOrder, setSortOrder] = useState("Descending")
  const [entries, setEntries] = useState(10)
  const [typeOrder, setTypeOrder] = useState("All")
  const [dateRange, setDateRange] = useState("After 2020")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [bkhistoryData, setBkhistoryData] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Normalize the user ID from different possible sources
        const userId = propUser?.userId || propUser?.userID

        if (!userId) {
          console.error("No user ID available")
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from("book_transactions")
          .select(`
            transactionType, 
            checkinDate, 
            checkinTime, 
            checkoutDate, 
            checkoutTime, 
            userID, 
            bookBarcode, 
            book_indiv(
              bookBarcode,
              bookStatus,
              book_titles (
                titleID,
                title,
                price
              )
            ),
            user_accounts (
              userFName,
              userLName,
              userLPUID
            )`)
          .eq("userID", userId)

        if (error) {
          console.error("Error fetching data: ", error.message)
        } else {
          const formattedData = data.map((item) => {
            const date = item.checkinDate || item.checkoutDate
            const time = item.checkinTime || item.checkoutTime

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
              date,
              time: formattedTime,
              borrower: `${item.user_accounts.userFName} ${item.user_accounts.userLName}`,
              bookTitle: bookDetails.title,
              bookBarcode: item.bookBarcode,
              user_id: item.userID,
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
  }, [propUser])

  // Filter by type
  const filterByType = (data) => {
    if (typeOrder === "All") return data
    return data.filter((book) => book.type === typeOrder)
  }

  // Filter by search term
  const filterBySearch = (data) => {
    if (!searchTerm) return data
    return data.filter((book) => book.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()))
  }

  // Sort data
  const sortData = (data) => {
    return [...data].sort((a, b) => {
      const dateA = new Date(a.date + "T" + (a.time || "00:00"))
      const dateB = new Date(b.date + "T" + (b.time || "00:00"))
      return sortOrder === "Descending" ? dateB - dateA : dateA - dateB
    })
  }

  // Process data through filters and sorting
  const processData = () => {
    let processed = bkhistoryData
    processed = filterByType(processed)
    processed = filterBySearch(processed)
    processed = sortData(processed)
    return processed
  }

  const processedData = processData()
  const totalEntries = processedData.length
  const totalPages = Math.ceil(totalEntries / entries)
  const paginatedData = processedData.slice((currentPage - 1) * entries, currentPage * entries)

  const handleUserClick = (book) => {
    navigate("/admin/useraccounts/viewusers", {
      state: { userId: book.user_id },
    })
  }

  const truncateTitle = (title, maxLength = 25) => {
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title
  }

  const setTypeFilter = (value) => {
    setTypeOrder(value)
    setCurrentPage(1) // Reset to first page when changing filter
  }

  return {
    sortOrder,
    setSortOrder,
    entries,
    setEntries,
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
  }
}

