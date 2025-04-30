import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"
import { useLocation } from "react-router-dom"

export const useOutstandingFines = (propUser) => {
  const [overdueBooks, setOverdueBooks] = useState([])
  const [damagedBooks, setDamagedBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  // Sorting and pagination states for overdue books
  const [overdueSortOrder, setOverdueSortOrder] = useState("Descending")
  const [overdueSortBy, setOverdueSortBy] = useState("fine_amount")
  const [overduePage, setOverduePage] = useState(1)
  const [overdueEntriesPerPage, setOverdueEntriesPerPage] = useState(5)

  // Sorting and pagination states for damaged books
  const [damagedSortOrder, setDamagedSortOrder] = useState("Descending")
  const [damagedSortBy, setDamagedSortBy] = useState("fine")
  const [damagedPage, setDamagedPage] = useState(1)
  const [damagedEntriesPerPage, setDamagedEntriesPerPage] = useState(5)

  // Extract user ID from various possible sources
  const getUserId = () => {
    // Try to get user from props first
    let user = propUser
    let userId = null

    // If no user in props, try location state
    if (!user && location.state) {
      user = location.state.user
    }

    // Try to extract userId from user object
    if (user) {
      userId = user.userId || user.userID || user.user_id
    }

    // If userId not found directly, check if it's in a nested user object
    if (!userId && user && user.user) {
      userId = user.user.userId || user.user.userID || user.user.user_id
    }

    // If still no userId, check location state directly
    if (!userId && location.state) {
      userId = location.state.userId || location.state.userID || location.state.user_id
    }

    return userId
  }

  // Fetch user's outstanding fines from Supabase
  useEffect(() => {
    const fetchUserFines = async () => {
      const userId = getUserId()

      if (!userId) {
        console.log("No user ID available from any source")
        setLoading(false)
        return
      }

      console.log("Fetching outstanding fines for user ID:", userId)
      setLoading(true)

      try {
        // Fetch overdue books
        const today = new Date()
        const { data: overdueData, error: overdueError } = await supabase
          .from("book_transactions")
          .select(`
            transactionID, 
            transactionType,
            userID, 
            bookBarcode, 
            book_indiv (
              bookBarcode,
              bookStatus,
              book_titles (
                titleID,
                title,
                price
              )
            ),
            checkoutDate, 
            checkoutTime, 
            deadline
          `)
          .eq("userID", userId)
          .not("deadline", "is.null")
          .lt("deadline", today.toISOString().split("T")[0])
          .neq("transactionType", "Returned")

        if (overdueError) {
          console.error("Error fetching overdue books:", overdueError)
        } else {
          const formattedOverdueData = overdueData.map((item) => {
            const deadline = item.deadline
            let overdue_days = 0

            // Calculate overdue days excluding Sundays
            for (let d = new Date(deadline); d < today; d.setDate(d.getDate() + 1)) {
              if (d.getDay() !== 0) {
                overdue_days++
              }
            }

            const fine_amount = overdue_days * 10
            const bookDetails = item.book_indiv || {}
            const bookTitles = bookDetails.book_titles || {}

            // Format date to "Month Day, Year" format
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

            // Format checkout date
            let formattedCheckoutDate = null
            if (item.checkoutDate) {
              const [year, month, day] = item.checkoutDate.split("-")
              const dateObj = new Date(year, month - 1, day)
              formattedCheckoutDate = dateObj.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            }

            return {
              transactionID: item.transactionID,
              bookTitle: bookTitles.title || "Unknown Title",
              bookBarcode: bookDetails.bookBarcode || item.bookBarcode || "N/A",
              titleID: bookTitles.titleID,
              checkoutDate: formattedCheckoutDate || "N/A",
              deadline: formattedDeadline || "N/A",
              overdue_days,
              fine_amount,
            }
          })

          console.log("Formatted overdue data:", formattedOverdueData)
          setOverdueBooks(formattedOverdueData)
        }

        // Fetch damaged books
        const { data: damageData, error: damageError } = await supabase
          .from("book_transactions")
          .select(`
    transactionID,
    userID,
    bookBarcode,
    book_indiv!inner (
      bookBarcode,
      bookStatus,
      book_titles (
        titleID,
        title,
        price
      )
    )
  `)
          .eq("userID", userId)
          .order("transactionID", { ascending: false })

        if (damageError) {
          console.error("Error fetching damaged books:", damageError)
        } else {
          // We'll store verified damaged books here
          const verifiedDamageData = []

          // Get all unique book barcodes from the user's transactions
          const uniqueBookBarcodes = [...new Set(damageData.map((item) => item.bookBarcode))]

          // For each unique book
          for (const barcode of uniqueBookBarcodes) {
            // 1. Check if the book is currently damaged
            const { data: bookStatus, error: bookStatusError } = await supabase
              .from("book_indiv")
              .select("bookStatus")
              .eq("bookBarcode", barcode)
              .single()

            if (bookStatusError) {
              console.error(`Error checking status for book ${barcode}:`, bookStatusError)
              continue
            }

            // Only proceed if the book is currently damaged
            if (bookStatus.bookStatus === "Damaged") {
              // 2. Check if this user was the last one to have the book
              const { data: latestTransaction, error: latestError } = await supabase
                .from("book_transactions")
                .select("userID, transactionID, book_indiv!inner(bookBarcode, book_titles(titleID, title, price))")
                .eq("bookBarcode", barcode)
                .order("transactionID", { ascending: false })
                .limit(1)

              if (!latestError && latestTransaction.length > 0) {
                // Only add to the user's fines if they were the last one to have the book
                if (latestTransaction[0].userID === userId) {
                  verifiedDamageData.push(latestTransaction[0])
                }
              }
            }
          }

          const formattedDamageData = verifiedDamageData.map((item) => {
            const bookDetails = item.book_indiv?.book_titles || {}
            return {
              transactionID: item.transactionID,
              bookBarcode: item.book_indiv.bookBarcode,
              bookTitle: bookDetails.title || "Unknown Title",
              titleID: bookDetails.titleID,
              fine: bookDetails.price || 0,
            }
          })

          console.log("Formatted damage data (verified current damages only):", formattedDamageData)
          setDamagedBooks(formattedDamageData)
        }
      } catch (error) {
        console.error("Unexpected error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserFines()
  }, [propUser, location.state]) // Re-run when propUser or location.state changes

  // Sort and paginate overdue books
  const sortedOverdueBooks = [...overdueBooks].sort((a, b) => {
    if (overdueSortOrder === "Descending") {
      return b[overdueSortBy] > a[overdueSortBy] ? 1 : -1
    } else {
      return a[overdueSortBy] > b[overdueSortBy] ? 1 : -1
    }
  })

  const overdueStartIndex = (overduePage - 1) * overdueEntriesPerPage
  const displayedOverdueBooks = sortedOverdueBooks.slice(overdueStartIndex, overdueStartIndex + overdueEntriesPerPage)

  // Sort and paginate damaged books
  const sortedDamagedBooks = [...damagedBooks].sort((a, b) => {
    if (damagedSortOrder === "Descending") {
      return b[damagedSortBy] > a[damagedSortBy] ? 1 : -1
    } else {
      return a[damagedSortBy] > b[damagedSortBy] ? 1 : -1
    }
  })

  const damagedStartIndex = (damagedPage - 1) * damagedEntriesPerPage
  const displayedDamagedBooks = sortedDamagedBooks.slice(damagedStartIndex, damagedStartIndex + damagedEntriesPerPage)

  // Calculate total fines
  const totalOverdueFines = overdueBooks.reduce((total, book) => total + book.fine_amount, 0)
  const totalDamageFines = damagedBooks.reduce((total, book) => total + book.fine, 0)
  const totalFines = totalOverdueFines + totalDamageFines

  const truncateTitle = (title, maxLength = 25) => {
    if (!title) return "Unknown Title"
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title
  }

  return {
    loading,
    overdueBooks,
    damagedBooks,
    overdueSortOrder,
    setOverdueSortOrder,
    overdueSortBy,
    setOverdueSortBy,
    overduePage,
    setOverduePage,
    overdueEntriesPerPage,
    setOverdueEntriesPerPage,
    displayedOverdueBooks,
    damagedSortOrder,
    setDamagedSortOrder,
    damagedSortBy,
    setDamagedSortBy,
    damagedPage,
    setDamagedPage,
    damagedEntriesPerPage,
    setDamagedEntriesPerPage,
    displayedDamagedBooks,
    truncateTitle,
    totalOverdueFines,
    totalDamageFines,
    totalFines,
  }
}
