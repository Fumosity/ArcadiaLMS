import { useState, useEffect, useCallback } from "react"
import { supabase } from "../../supabaseClient"
import { toast, ToastContainer } from "react-toastify" // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"
import ScanBarcodeModal from "../../z_modals/ScanBarcodeModal"
import { useUser } from "../../backend/UserContext"
const CheckingContainer = () => {
  const [checkMode, setCheckMode] = useState("Check Out")
  const [isSubmitting, setIsSubmitting] = useState(false) // State for loading indicator
  const [emptyFields, setEmptyFields] = useState({}) // Track empty fields
  const [isDamaged, setIsDamaged] = useState(false) // Track if the book is marked as damaged
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const [bookSuggestions, setBookSuggestions] = useState([]) // Store search results
  const [isSearching, setIsSearching] = useState(false) // Loading state for search
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isViewOpen, setViewOpen] = useState("")
  const [scanResult, setScanResult] = useState("") // Store scanned barcode

  const { user } = useUser()
  console.log(user)
  const username = user.userFName + " " + user.userLName
  console.log(username)

  const handleBarcodeScan = (barcode) => {
    setScanResult(barcode) // Update the scanned barcode
  }

  // Function to get the PC's current local time
  const getLocalTime = () => {
    const now = new Date()
    return now.toTimeString().slice(0, 5) // Returns in "HH:MM" format
  }

  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Manila" }
    return new Date(date).toLocaleDateString("en-PH", options)
  }

  // Function to calculate deadline 3 days ahead of the given date
  const calculateDeadline = (selectedDate) => {
    const date = new Date(selectedDate)
    date.setDate(date.getDate() + 3) // Add 3 days
    return formatDate(date) // Return formatted date
  }

  const [formData, setFormData] = useState({
    schoolNo: "",
    name: "",
    college: "",
    department: "",
    bookTitle: "",
    bookBarcode: "",
    date: new Date().toISOString().split("T")[0], // Store date in YYYY-MM-DD format
    time: getLocalTime(), // Set the initial value to the PC's local time
    deadline: "", // Initialize deadline as empty
    userID: "",
  })

  useEffect(() => {
    if (checkMode === "Check In") {
      setFormData((prev) => ({
        ...prev,
        time: getLocalTime(),
        deadline: "", // Clear deadline when "Check In" is selected
      }))

      // Clear book suggestions when switching to Check In mode
      setBookSuggestions([])

      // Also clear book title and barcode when switching modes
      setFormData((prev) => ({
        ...prev,
        bookTitle: "",
        bookBarcode: "",
      }))
      setBookCover("")
    } else {
      // Clear book suggestions when switching to Check Out mode
      setBookSuggestions([])

      // Also clear book title and barcode when switching modes
      setFormData((prev) => ({
        ...prev,
        bookTitle: "",
        bookBarcode: "",
      }))
      setBookCover("")
    }
  }, [checkMode])

  useEffect(() => {
    const fetchUserData = async () => {
      // Clear fields immediately when schoolNo changes
      setFormData((prev) => ({
        ...prev,
        name: "",
        college: "",
        department: "",
        userID: "",
      }))

      // Only fetch data if schoolNo is not empty and matches a complete ID pattern
      if (formData.schoolNo && formData.schoolNo.length >= 10) {
        try {
          const { data, error } = await supabase
            .from("user_accounts")
            .select("userFName, userLName, userCollege, userDepartment, userID")
            .eq("userLPUID", formData.schoolNo)
            .single()

          if (!error && data) {
            setFormData((prev) => ({
              ...prev,
              name: `${data.userFName} ${data.userLName}`,
              college: data.userCollege,
              department: data.userDepartment,
              userID: data.userID,
            }))
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
        }
      }
    }

    fetchUserData()
  }, [formData.schoolNo])

  const [bookCover, setBookCover] = useState("") // State for the book cover image URL

  useEffect(() => {
    const fetchBookData = async () => {
      if (formData.bookBarcode) {
        try {
          // Fetch title and cover from the book_titles table using titleID from book_indiv
          const { data, error } = await supabase
            .from("book_indiv")
            .select("book_titles(title, cover)") // Include the cover field
            .eq("bookBarcode", formData.bookBarcode)
            .single()

          if (error || !data) {
            setFormData((prev) => ({
              ...prev,
              bookTitle: "",
            }))
            setBookCover("") // Clear cover if no book data found
          } else {
            setFormData((prev) => ({
              ...prev,
              bookTitle: data.book_titles.title, // Set the title value
            }))
            setBookCover(data.book_titles.cover) // Set the cover URL
          }
        } catch (error) {
          console.error("Error fetching book data:", error)
        }
      } else {
        setFormData((prev) => ({
          ...prev,
          bookTitle: "",
        }))
        setBookCover("") // Clear cover if no bookBarcode is provided
      }
    }

    fetchBookData()
  }, [formData.bookBarcode])

  const handleCheckChange = (e) => {
    setCheckMode(e.target.value)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => {
      const updatedFormData = { ...prev, [name]: value }

      if (name === "bookTitle") {
        if (value.trim() === "") {
          updatedFormData.bookBarcode = "" // Clear barcode when title is empty
        }
        setShowSuggestions(true) // Show suggestions when typing
      }

      if (name === "date") {
        updatedFormData.deadline = calculateDeadline(value)
      }

      return updatedFormData
    })
  }

  // Function to fetch available book copies by titleID
  const fetchAvailableBookCopies = async (titleID) => {
    try {
      const { data, error } = await supabase
        .from("book_indiv")
        .select("bookBarcode, bookStatus")
        .eq("titleID", titleID)
        .eq("bookStatus", "Available")

      if (error) {
        console.error("Error fetching available book copies:", error)
        return null
      }

      return data.length > 0 ? data : null
    } catch (error) {
      console.error("Error in fetchAvailableBookCopies:", error)
      return null
    }
  }

  // Function to fill form data from a reservation
  const fillFormFromReservation = async (reservation) => {
    if (!reservation) return

    try {
      // Set check mode to "Check Out" for reservations
      setCheckMode("Check Out")

      // Fill user information
      const userInfo = reservation.user_accounts
      if (userInfo) {
        // Fetch the user's school ID (LPUID) from user_accounts
        const { data: userData, error: userError } = await supabase
          .from("user_accounts")
          .select("userLPUID")
          .eq("userID", userInfo.userID)
          .single()

        if (userError) {
          console.error("Error fetching user LPUID:", userError)
        } else if (userData) {
          // Set the school number which will trigger the useEffect to fill other user fields
          setFormData((prev) => ({
            ...prev,
            schoolNo: userData.userLPUID,
          }))
        }
      }

      // Get book information
      const bookInfo = reservation.book
      if (bookInfo) {
        // Find available copies of the book
        const availableCopies = await fetchAvailableBookCopies(bookInfo.titleID)

        if (availableCopies && availableCopies.length > 0) {
          // If multiple copies are available, show a selection dialog or use the first one
          if (availableCopies.length > 1) {
            // Create a custom dialog to select from available copies
            const copySelection = window.confirm(
              `${availableCopies.length} copies of this book are available. Click OK to use barcode: ${availableCopies[0].bookBarcode} or Cancel to select manually.`,
            )

            if (copySelection) {
              // Use the first available copy
              setFormData((prev) => ({
                ...prev,
                bookBarcode: availableCopies[0].bookBarcode,
                // The useEffect will fill bookTitle and set the book cover
              }))
            } else {
              // Set just the title and let the user select a barcode manually
              // First, fetch the book title
              const { data: titleData, error: titleError } = await supabase
                .from("book_titles")
                .select("title")
                .eq("titleID", bookInfo.titleID)
                .single()

              if (!titleError && titleData) {
                setFormData((prev) => ({
                  ...prev,
                  bookTitle: titleData.title,
                  bookBarcode: "", // Clear barcode so user can select
                }))

                // Show available barcodes
                const barcodeList = availableCopies.map((copy) => copy.bookBarcode).join(", ")
                toast.info(`Available barcodes: ${barcodeList}`)
              }
            }
          } else {
            // Only one copy available, use it directly
            setFormData((prev) => ({
              ...prev,
              bookBarcode: availableCopies[0].bookBarcode,
              // The useEffect will fill bookTitle and set the book cover
            }))
          }
        } else {
          // If no available copy, just set the title without a barcode
          // First, fetch the book title
          const { data: titleData, error: titleError } = await supabase
            .from("book_titles")
            .select("title")
            .eq("titleID", bookInfo.titleID)
            .single()

          if (!titleError && titleData) {
            setFormData((prev) => ({
              ...prev,
              bookTitle: titleData.title,
              bookBarcode: "", // No available copy
            }))
            toast.error("No available copies of this book found.", {
              position: "bottom-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: false,
            })
          }
        }
      }

      // Set current date and time
      const currentDate = new Date().toISOString().split("T")[0]
      setFormData((prev) => ({
        ...prev,
        date: currentDate,
        time: getLocalTime(),
        deadline: calculateDeadline(currentDate),
      }))
    } catch (error) {
      console.error("Error filling form from reservation:", error)
    }
  }

  // Export the fillFormFromReservation function to be used by parent components
  // This is needed to expose the function to the parent component
  if (typeof window !== "undefined") {
    window.fillFormFromReservation = fillFormFromReservation
  }

  // Function to check if user has reached borrowing limit
  const checkBorrowingLimit = async (userID) => {
    try {
      const { data, error, count } = await supabase
        .from("book_transactions")
        .select("*", { count: "exact" })
        .eq("userID", userID)
        .eq("transactionType", "Borrowed")
        .is("checkinDate", null)

      if (error) {
        console.error("Error checking borrowing limit:", error)
        return false
      }

      console.log("Current borrowed books count:", count)
      return count >= 5 // Return true if limit reached
    } catch (error) {
      console.error("Error in checkBorrowingLimit:", error)
      return false
    }
  }

  const handleSubmit = async () => {
    // Check if all required fields are filled
    const requiredFields = ["userID", "bookBarcode", "date", "time", "schoolNo", "name", "college", "bookTitle"]

    // Only require 'department' if the college is 'COECSA'
    if (formData.college === "COECSA") {
      requiredFields.push("department")
    }

    const emptyFields = {}
    for (const field of requiredFields) {
      if (!formData[field]) {
        emptyFields[field] = true // Mark field as empty
      }
    }

    if (Object.keys(emptyFields).length > 0) {
      setEmptyFields(emptyFields) // Set empty fields state
      console.log(emptyFields)
      toast.error("Please fill in all required fields.", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      })
      return // Prevent form submission if any required field is empty
    }

    setIsSubmitting(true) // Set submitting state to true when form is being submitted
    setEmptyFields({}) // Reset empty fields before submission

    try {
      const { userID, bookBarcode, schoolNo, name, college, department, bookTitle, date, time, deadline } = formData
      const currentTime = getLocalTime()
      const transactionType = checkMode === "Check Out" ? "Borrowed" : "Returned"

      // If the mode is 'Check Out', perform the checkout logic
      if (checkMode === "Check Out") {
        // Check if user has reached borrowing limit
        const limitReached = await checkBorrowingLimit(userID)

        if (limitReached) {
          toast.error("You have reached the maximum limit of 5 borrowed books.")
          setIsSubmitting(false)
          return // Exit the function if limit reached
        }

        const { data: existingTransaction, error: fetchError } = await supabase
          .from("book_transactions")
          .select("transactionType")
          .eq("bookBarcode", bookBarcode)
          .eq("transactionType", "Borrowed") // Check if the book is already borrowed
          .is("checkinDate", null)
          .order("checkoutDate", { ascending: false })
          .limit(1)
          .single()

        if (fetchError) {
          console.error("Error fetching existing transaction:", fetchError)
        }

        // Prevent checkout if a "Borrowed" transaction exists
        if (existingTransaction) {
          toast.error("This book is already borrowed. You cannot check it out again.")
          setIsSubmitting(false)
          return // Exit the function if the book is already borrowed
        }

        // Update the status to 'Unavailable' when checking out
        const { error: updateError } = await supabase
          .from("book_indiv")
          .update({ bookStatus: "Unavailable" })
          .eq("bookBarcode", bookBarcode)

        if (updateError) {
          console.error("Error updating book status to Unavailable:", updateError)
          toast.error("Error updating book status. Please try again.")
          setIsSubmitting(false)
          return // Exit if there's an error updating the status
        }

        // Insert a new transaction for Check Out
        const transactionData = {
          userID: userID,
          bookBarcode: bookBarcode,
          checkoutDate: date,
          checkoutTime: time,
          deadline: deadline,
          transactionType: transactionType,
        }

        const { data, error } = await supabase.from("book_transactions").insert([transactionData])

        if (error) {
          console.error("Error inserting transaction:", error)
          toast.error("Error submitting the form. Please try again.")
        } else {
          console.log("Transaction successful:", data)


          const printData = {
            schoolNo: formData.schoolNo,
            name: formData.name,
            college: formData.college,
            department: formData.department,
            bookTitle: formData.bookTitle,
            bookBarcode: formData.bookBarcode,
            date: formatDate(formData.date), // Format the date for printing
            time: formData.time,
            deadline: formatDate(formData.deadline), // Format the deadline for printing
          };

          // Format the data for printing
          const printContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Book Check Out Slip</title>
            <style type="text/css" media="print">
              body {
                font-family: sans-serif;
                font-size: 10pt;
              }
              h3 {
                margin-top: 12px;
                font-size: 14pt;
              }
              p {
                margin-bottom: 2px;
              }
              strong {
                font-weight: bold;
              }
              .note {
                margin-top: 12px;
                font-size: 8pt;
                font-style: italic;
              }
              .center {
                text-align: center;
                margin-bottom: 0;
              }
              .small {
                font-size: 8pt;
              }
            </style>
          </head>
          <body>
            <p class="center">Lyceum of the Philippines University - Cavite</p>
            <p class="center small">Governors Drive, Brgy. Manggahan, General Trias, Cavite 4107</p>
            <h3 class="center">Book Check Out Slip</h3>
            <br />
            <p><strong>School ID:</strong> ${printData.schoolNo}</p>
            <p><strong>Name:</strong> ${printData.name}</p>
            <p><strong>College:</strong> ${printData.college} ${printData.department ? `- ${printData.department}` : ''}</p>
            <p><strong>Book Title:</strong> ${printData.bookTitle}</p>
            <p><strong>Book Barcode:</strong> ${printData.bookBarcode}</p>
            <p><strong>Check Out Date:</strong> ${printData.date}</p>
            <p><strong>Check Out Time:</strong> ${printData.time}</p>
            <p><strong>Return Deadline:</strong> ${printData.deadline}</p>
            <br />
            <p><strong>Served by:</strong> ${username}</p>
            <br />
            <p class="note">This slip serves as your temporary record. Please return the book by the deadline, else a fine of P10 per day will be incurred for each school day that passes.</p>
          </body>
          </html>
        `;

          const printWindow = window.open('', '_blank');
          if (printWindow) {
            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.print();
          } else {
            toast.error("Failed to open print window.");
          }

          toast.success("Book checked out successfully!")
          // Reset form for a new transaction
          resetForm()
        }
      }

      // If the mode is 'Check In', perform the check-in logic
      if (checkMode === "Check In") {
        const { data: existingTransaction, error: fetchError } = await supabase
          .from("book_transactions")
          .select("*")
          .eq("bookBarcode", bookBarcode)
          .eq("userID", userID)
          .eq("transactionType", "Borrowed") // Only allow check-in if the book is borrowed
          .order("checkoutDate", { ascending: false })
          .limit(1)
          .single()

        if (fetchError) {
          console.error("Error fetching existing transaction:", fetchError)
        }

        // Prevent check-in if the book is not currently borrowed
        if (!existingTransaction) {
          toast.error("This book is not marked as borrowed or has already been checked in.")
          return // Exit the function if the book is not currently borrowed
        }

        // Update the transaction with check-in details (checkin_date and checkin_time)
        const { error: updateTransactionError } = await supabase
          .from("book_transactions")
          .update({
            checkinDate: date,
            checkinTime: time,
            transactionType: "Returned", // Change transaction type to 'Returned'
          })
          .eq("transactionID", existingTransaction.transactionID) // Use the existing transactionID

        if (updateTransactionError) {
          console.error("Error updating transaction:", updateTransactionError)
          return // Exit if there's an error updating the transaction
        }

        // If the book is marked as damaged, update the status to 'Damaged'
        const updatedStatus = isDamaged ? "Damaged" : "Available"

        // Update the book status to 'Available' or 'Damaged' when checking in
        const { error: checkinUpdateError } = await supabase
          .from("book_indiv")
          .update({ bookStatus: updatedStatus })
          .eq("bookBarcode", bookBarcode)

        if (checkinUpdateError) {
          console.error("Error updating book status:", checkinUpdateError)
          return // Exit if there's an error updating the status
        }

        toast.success("Book checked in successfully and transaction updated!")
        // Reset form for a new transaction
        resetForm()
      }
    } catch (error) {
      console.error("Error processing transaction:", error)
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false) // Set submitting state back to false when done
    }
  }

  // Add this function after handleSubmit
  const resetForm = () => {
    // Reset form data to initial state
    setFormData({
      schoolNo: "",
      name: "",
      college: "",
      department: "",
      bookTitle: "",
      bookBarcode: "",
      date: new Date().toISOString().split("T")[0], // Current date
      time: getLocalTime(), // Current time
      deadline: "", // Initialize deadline as empty
      userID: "",
    })

    // Reset other states
    setEmptyFields({})
    setIsDamaged(false)
    setBookCover("")
    setBookSuggestions([])

    // Optionally, you can reset the check mode to "Check Out" if needed
    // setCheckMode("Check Out");
  }

  const fetchBookTitles = useCallback(async () => {
    if (formData.bookTitle.length < 2) {
      // Prevent excessive API calls
      setBookSuggestions([])
      return
    }

    setIsSearching(true)
    try {
      // Different query based on check mode
      if (checkMode === "Check In") {
        // For Check In, we want to search for books that are currently borrowed
        // First, get the user's borrowed books from transactions
        if (!formData.userID) {
          setBookSuggestions([])
          setIsSearching(false)
          return
        }

        const { data: borrowedBooks, error: borrowedError } = await supabase
          .from("book_transactions")
          .select("bookBarcode")
          .eq("userID", formData.userID)
          .eq("transactionType", "Borrowed")
          .is("checkinDate", null)

        if (borrowedError || !borrowedBooks || borrowedBooks.length === 0) {
          console.error("Error fetching borrowed books or no books found:", borrowedError)
          setBookSuggestions([])
          setIsSearching(false)
          return
        }

        // Get the barcodes of borrowed books
        const borrowedBarcodes = borrowedBooks.map((book) => book.bookBarcode)

        // Now fetch book details for these barcodes that match the search term
        const { data: bookDetails, error: detailsError } = await supabase
          .from("book_indiv")
          .select("bookBarcode, book_titles!inner(title)")
          .in("bookBarcode", borrowedBarcodes)
          .ilike("book_titles.title", `%${formData.bookTitle}%`)

        if (detailsError) {
          console.error("Error fetching book details:", detailsError)
          setBookSuggestions([])
        } else {
          console.log("Fetched borrowed books:", bookDetails)
          setBookSuggestions(bookDetails || [])
        }
      } else {
        // For Check Out, we want available books
        const { data, error } = await supabase
          .from("book_indiv")
          .select("bookBarcode, book_titles!inner(title)")
          .eq("bookStatus", "Available") // Only show available books for checkout
          .ilike("book_titles.title", `%${formData.bookTitle}%`)
          .limit(5)

        if (error) {
          console.error("Error fetching book titles:", error)
          setBookSuggestions([])
        } else {
          console.log("Fetched available books:", data)
          setBookSuggestions(data || [])
        }
      }
    } catch (error) {
      console.error("Error fetching books:", error)
      setBookSuggestions([])
    }
    setIsSearching(false)
  }, [formData.bookTitle, checkMode, formData.userID])

  useEffect(() => {
    fetchBookTitles()
  }, [fetchBookTitles])

  const barcodeEffect = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      bookBarcode: scanResult || prev.bookBarcode, // Use scanResult if available, else keep existing value
    }))
  }, [scanResult])

  useEffect(() => {
    barcodeEffect()
  }, [barcodeEffect])

  return (
    <div className="bg-white p-4 rounded-lg border-grey border">
      <h3 className="text-2xl font-semibold mb-4">Book Checking</h3>

      <div className="flex">
        <div className="flex-col w-2/3">
          <div className="flex items-center mb-3">
            <label className="mr-2">
              <input
                type="radio"
                name="check"
                value="Check Out"
                className="mr-1"
                checked={checkMode === "Check Out"}
                onChange={handleCheckChange}
              />{" "}
              Checking Out
            </label>
            <label className="mr-2">
              <input
                type="radio"
                name="check"
                value="Check In"
                className="mr-1"
                checked={checkMode === "Check In"}
                onChange={handleCheckChange}
              />{" "}
              Checking In
            </label>
          </div>

          <div className="grid grid-cols-1 gap-2 mb-4">
            {Object.entries(formData).map(([key, value]) => {
              let label = key.replace(/([A-Z])/g, " $1")
              let inputType = "text"
              let afterInput = null
              let divClassName = "flex items-center" // Default class for the div
              let isReadOnly = false
              if (key === "name" || key === "college" || key === "department") {
                isReadOnly = true
              }

              if (key === "userID") {
                divClassName = "flex items-center hidden" // Add 'hidden' class
              }

              if (key === "bookBarcode") {
                label = "Book Barcode"
                // Ensure the value updates when scanResult changes but is also editable
                afterInput = (
                  <button
                    className="px-3 py-1 ml-2 rounded-full border border-grey w-[calc(2/5*100%)] hover:bg-light-gray transition"
                    onClick={() => setViewOpen(true)}
                  >
                    Scan Barcode
                  </button>
                )
              }

              if (key === "bookTitle") {
                const handleBookSelection = (book) => {
                  setFormData((prev) => ({
                    ...prev,
                    bookTitle: book.book_titles?.title || "",
                    bookBarcode: book.bookBarcode || "",
                  }))
                  setShowSuggestions(false) // Hide suggestions after selection
                }

                return (
                  <div className="flex items-center">
                    {/* Label Section */}
                    <label className="w-1/3 text-md capitalize">Book Title:</label>

                    {/* Input and Dropdown Wrapper */}
                    <div className="relative w-2/3">
                      {/* Book Title Input */}
                      <input
                        type="text"
                        name="bookTitle"
                        value={formData.bookTitle}
                        onChange={handleInputChange}
                        placeholder={
                          checkMode === "Check In" ? "Search your borrowed books..." : "Search available books..."
                        }
                        className="px-3 py-1 w-full rounded-full border border-grey"
                        onFocus={() => {
                          if (bookSuggestions.length > 0) setShowSuggestions(true)
                        }}
                        onBlur={() => {
                          setTimeout(() => setShowSuggestions(false), 200)
                        }}
                      />

                      {/* Dropdown (aligned with input) */}
                      {showSuggestions && bookSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-grey rounded-md shadow-md z-10">
                          {bookSuggestions.map((book, index) => (
                            <div
                              key={book.bookBarcode || `fallback-key-${index}`}
                              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                              onMouseDown={() => handleBookSelection(book)}
                            >
                              {book.book_titles?.title || "Unknown Title"} - {book.bookBarcode || "No Barcode"}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              }

              if (key === "date") {
                label = checkMode === "Check In" ? "Check In Date" : "Check Out Date"
                inputType = "date"
              } else if (key === "time") {
                label = checkMode === "Check In" ? "Check In Time" : "Check Out Time"
                inputType = "time"
              }

              if (key === "deadline" && checkMode === "Check In") {
                return null
              }
              if (key === "deadline") {
                inputType = "date"
              }

              if (key === "schoolNo") {
                label = "School ID" // Changed from 'School No' to 'School ID'
              }

              return (
                <div className={divClassName} key={key}>
                  {" "}
                  {/* Use the divClassName here */}
                  <label className="w-1/3 text-md capitalize">{label}:</label>
                  <div className="w-2/3 flex items-center">
                    <input
                      type={inputType}
                      name={key}
                      value={value}
                      onChange={handleInputChange}
                      placeholder={key === "schoolNo" ? "XXXX-X-XXXXX" : ""}
                      className={`px-3 py-1 rounded-full border ${emptyFields[key] ? "border-arcadia-red" : "border-grey"} ${key === "bookBarcode" ? "w-[calc(3/5*100%)]" : "w-full"}`}
                      required
                      readOnly={isReadOnly}
                    />
                    {afterInput}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="w-full flex justify-end">
            {" "}
            {/* Add flex and justify-end */}
            {checkMode === "Check In" && (
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isDamaged}
                  onChange={() => setIsDamaged(!isDamaged)}
                  className="" // Remove right-full; not needed
                />
                <span className="ml-2">Mark as Damaged</span> {/* Add margin for spacing */}
              </label>
            )}
          </div>
        </div>
        {/* Book Cover Image Section */}
        <div className="flex flex-col items-center px-2 w-1/3">
          <label className="text-md mb-2">Book Cover:</label>
          {formData.bookBarcode && formData.bookTitle && (
            <div className="border border-grey p-4 w-5/6 rounded-lg flex justify-center">
              <img
                src={bookCover || "/placeholder.svg"}
                alt="Book Cover"
                className="h-[400px] object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center m-4">
        <button
          onClick={handleSubmit}
          className="add-book w-1/4 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>

      {/* Add ToastContainer here */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <ScanBarcodeModal isOpen={isViewOpen} onClose={() => setViewOpen(false)} onScan={handleBarcodeScan} />
    </div>
  )
}

export default CheckingContainer
