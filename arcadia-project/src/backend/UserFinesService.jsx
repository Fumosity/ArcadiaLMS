import { supabase } from "/src/supabaseClient.js"

export const UserFinesService = {
  /**
   * Get the current logged in user from localStorage
   * @returns {Object|null} - User object or null if not logged in
   */
  getCurrentUser() {
    try {
      const storedUser = localStorage.getItem("user")
      if (!storedUser) return null

      const user = JSON.parse(storedUser)
      return user && user.userID ? user : null
    } catch (error) {
      console.error("Error getting current user:", error)
      return null
    }
  },

  /**
   * Fetch overdue fines for the current user
   * @returns {Promise<Array>} - Formatted overdue fines data
   */
  async fetchOverdueFines() {
    const currentUser = this.getCurrentUser()
    if (!currentUser) {
      console.log("No user logged in")
      return []
    }

    try {
      const today = new Date()
      const { data, error } = await supabase
        .from("book_transactions")
        .select(`
          transactionID, 
          transactionType,
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
        .eq("userID", currentUser.userID)
        .not("deadline", "is.null")
        .lt("deadline", today.toISOString().split("T")[0])
        .neq("transactionType", "Returned")

      if (error) {
        console.error("Error fetching overdue fines:", error.message)
        return []
      }

      console.log(`Fetched ${data.length} overdue transactions for user ${currentUser.userID}`)

      // Process and format the data
      const formattedData = data.map((item) => {
        const deadline = item.deadline
        let overdue_days = 0

        // Calculate overdue days excluding Sundays
        for (let d = new Date(deadline); d < today; d.setDate(d.getDate() + 1)) {
          if (d.getDay() !== 0) {
            // 0 is Sunday
            overdue_days++
          }
        }

        const fine_amount = overdue_days * 10 // ₱10 per day
        const bookDetails = item.book_indiv?.book_titles || {}

        return {
          transaction_id: item.transactionID,
          book_title: bookDetails.title || "Unknown Title",
          book_title_id: bookDetails.titleID,
          book_barcode: item.bookBarcode,
          checkout_date: item.checkoutDate,
          deadline: item.deadline,
          overdue_days,
          fine_amount,
        }
      })

      // Filter out items with no fine amount
      const filteredData = formattedData.filter((item) => item.fine_amount > 0)
      console.log(`Processed ${filteredData.length} overdue fines with amounts > 0`)

      return filteredData
    } catch (error) {
      console.error("Unexpected error in fetchOverdueFines:", error)
      return []
    }
  },

  /**
   * Fetch damage fines for the current user
   * @returns {Promise<Array>} - Formatted damage fines data
   */
  async fetchDamageFines() {
    const currentUser = this.getCurrentUser()
    if (!currentUser) {
      console.log("No user logged in")
      return []
    }

    try {
      const { data, error } = await supabase
        .from("book_transactions")
        .select(`
          transactionID,
          bookBarcode,
          book_indiv (
            bookBarcode,
            bookStatus,
            book_titles (
              titleID,
              title,
              price
            )
          )
        `)
        .eq("userID", currentUser.userID)
        .eq("book_indiv.bookStatus", "Damaged")

      if (error) {
        console.error("Error fetching damage fines:", error.message)
        return []
      }

      console.log(`Fetched ${data.length} damage transactions for user ${currentUser.userID}`)

      // Get only the latest transaction per damaged book
      const latestDamageData = Object.values(
        data.reduce((acc, item) => {
          if (!acc[item.bookBarcode] || new Date(item.transactionID) > new Date(acc[item.bookBarcode].transactionID)) {
            acc[item.bookBarcode] = item
          }
          return acc
        }, {}),
      )

      // Process and format the data
      const formattedData = latestDamageData.map((item) => {
        const bookDetails = item.book_indiv?.book_titles || {}
        return {
          transaction_id: item.transactionID,
          book_barcode: item.bookBarcode,
          book_title: bookDetails.title || "Unknown Title",
          book_title_id: bookDetails.titleID,
          fine: bookDetails.price || 0,
        }
      })

      // Filter out items with no fine amount
      const filteredData = formattedData.filter((item) => item.fine > 0)
      console.log(`Processed ${filteredData.length} damage fines with amounts > 0`)

      return filteredData
    } catch (error) {
      console.error("Unexpected error in fetchDamageFines:", error)
      return []
    }
  },

  /**
   * Calculate total fines from overdue and damage fines
   * @param {Array} overdueFines - Array of overdue fines
   * @param {Array} damageFines - Array of damage fines
   * @returns {Object} - Object containing total fines
   */
  calculateTotalFines(overdueFines, damageFines) {
    const totalOverdueFines = overdueFines.reduce((sum, item) => sum + item.fine_amount, 0)
    const totalDamageFines = damageFines.reduce((sum, item) => sum + item.fine, 0)
    const totalFines = totalOverdueFines + totalDamageFines

    return {
      totalOverdueFines,
      totalDamageFines,
      totalFines,
      hasFines: totalFines > 0,
    }
  },
}

