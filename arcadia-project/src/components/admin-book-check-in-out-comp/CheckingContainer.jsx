import { useState, useEffect } from "react"
import { supabase } from "../../supabaseClient"
import BarcodeScanner from "./BarcodeScanner"

const CheckingContainer = () => {
  const [checkMode, setCheckMode] = useState("Check Out")
  const [isSubmitting, setIsSubmitting] = useState(false) // State for loading indicator
  const [emptyFields, setEmptyFields] = useState({}) // Track empty fields
  const [isDamaged, setIsDamaged] = useState(false) // Track if the book is marked as damaged
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const [scannedCode, setScannedCode] = useState("")

  // Add a new state to track borrower account type
  const [borrowerInfo, setBorrowerInfo] = useState({
    userAccountType: "",
    borrowedBooksCount: 0,
  })

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
    let daysToAdd = 3 // Default value

    const { userAccountType } = borrowerInfo
    const { college } = formData

    // Set days based on account type and college
    if (userAccountType === "Student") {
      if (["COECSA", "CITHM", "CAMS", "CON", "CBA", "Law", "IHS"].includes(college)) {
        daysToAdd = 5
      }
    } else if (userAccountType === "Faculty") {
      daysToAdd = 10
    }

    if (college === "ASP") {
      daysToAdd = 10
    } else if (college === "Graduate School") {
      // For Graduate School, return date is the next Saturday
      const dayOfWeek = date.getDay() // 0 = Sunday, 6 = Saturday
      daysToAdd = (6 - dayOfWeek) % 7 // Days until next Saturday
      if (daysToAdd === 0) daysToAdd = 7 // If today is Saturday, go to next Saturday
    }

    // Skip Sundays when calculating the deadline
    let daysAdded = 0
    while (daysAdded < daysToAdd) {
      date.setDate(date.getDate() + 1)
      // Skip Sunday (day 0)
      if (date.getDay() !== 0) {
        daysAdded++
      }
    }

    return formatDate(date)
  }

  const [formData, setFormData] = useState({
    schoolNo: "",
    name: "",
    college: "",
    department: "",
    bookBarcode: "",
    bookTitle: "",
    date: new Date().toISOString().split("T")[0], // Store date in YYYY-MM-DD format
    time: getLocalTime(), // Set the initial value to the PC's local time
    deadline: "", // Initialize deadline as empty
    userID: "",
  })

  const formatSchoolNo = (value) => {
    // Remove non-numeric characters
    let numericValue = value.replace(/\D/g, "")

    // Apply the XXXX-X-XXXXX format
    if (numericValue.length > 4) {
      numericValue = `${numericValue.slice(0, 4)}-${numericValue.slice(4)}`
    }
    if (numericValue.length > 6) {
      numericValue = `${numericValue.slice(0, 6)}-${numericValue.slice(6, 11)}`
    }
    return numericValue
  }

  const handleBarcodeScan = (barcode) => {
    console.log(barcode)
    setFormData((prev) => ({ ...prev, bookBarcode: barcode })) // Directly update bookBarcode
    setIsScannerOpen(false) // Close scanner after a successful scan
  }

  useEffect(() => {
    if (checkMode === "Check In") {
      setFormData((prev) => ({
        ...prev,
        time: getLocalTime(),
        deadline: "", // Clear deadline when "Check In" is selected
      }))
    }
  }, [checkMode])

  useEffect(() => {
    if (formData.schoolNo) {
      const formattedSchoolNo = formData.schoolNo.replace(/\D/g, "")

      const fetchUserData = async () => {
        try {
          // Fetch user account details
          const { data, error } = await supabase
            .from("user_accounts")
            .select("userFName, userLName, userCollege, userDepartment, userID, userAccountType")
            .eq("userLPUID", formattedSchoolNo)
            .single()

          if (error || !data) {
            setFormData((prev) => ({
              ...prev,
              name: "",
              college: "",
              department: "",
              userID: "",
            }))
            setBorrowerInfo({
              userAccountType: "",
              borrowedBooksCount: 0,
            })
          } else {
            setFormData((prev) => ({
              ...prev,
              name: `${data.userFName} ${data.userLName}`,
              college: data.userCollege,
              department: data.userDepartment,
              userID: data.userID,
            }))

            // Count borrowed books that haven't been returned yet
            const { data: borrowedBooks, error: countError } = await supabase
              .from("book_transactions")
              .select("transactionID")
              .eq("userID", data.userID)
              .eq("transactionType", "Borrowed")

            if (!countError) {
              setBorrowerInfo({
                userAccountType: data.userAccountType || "",
                borrowedBooksCount: borrowedBooks?.length || 0,
              })
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
        }
      }

      fetchUserData()
    } else {
      setFormData((prev) => ({
        ...prev,
        name: "",
        college: "",
        department: "",
      }))
      setBorrowerInfo({
        userAccountType: "",
        borrowedBooksCount: 0,
      })
    }
  }, [formData.schoolNo])

  const [bookCover, setBookCover] = useState("") // State for the book cover image URL

  useEffect(() => {
    if (formData.bookBarcode) {
      const fetchBookData = async () => {
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
      }

      fetchBookData()
    } else {
      setFormData((prev) => ({
        ...prev,
        bookTitle: "",
      }))
      setBookCover("") // Clear cover if no bookBarcode is provided
    }
  }, [formData.bookBarcode])

  const handleCheckChange = (e) => {
    setCheckMode(e.target.value)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => {
      const updatedFormData = { ...prev, [name]: value }

      if (name === "date") {
        updatedFormData.deadline = calculateDeadline(value) // Calculate and set the deadline
      }

      return updatedFormData
    })
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
      alert("Please fill in all required fields.")
      return // Prevent form submission if any required field is empty
    }

    // Check borrowing limits for Check Out operations
    if (checkMode === "Check Out") {
      const { userAccountType } = borrowerInfo

      // Fetch the CURRENT count of borrowed books to ensure accuracy
      const { data: currentBorrowedBooks, error: countError } = await supabase
        .from("book_transactions")
        .select("transactionID")
        .eq("userID", formData.userID)
        .eq("transactionType", "Borrowed")

      if (countError) {
        console.error("Error checking borrowed books count:", countError)
        alert("Unable to verify borrowing limits. Please try again.")
        return
      }

      const currentBorrowedCount = currentBorrowedBooks?.length || 0

      // Check borrowing limits based on account type
      if (userAccountType === "Student" && currentBorrowedCount >= 10) {
        alert("Students can only borrow up to 10 books at a time. Please return some books before borrowing more.")
        return
      } else if (userAccountType === "Faculty" && currentBorrowedCount >= 15) {
        alert(
          "Faculty members can only borrow up to 15 books at a time. Please return some books before borrowing more.",
        )
        return
      }
    }

    setIsSubmitting(true) // Set submitting state to true when form is being submitted
    setEmptyFields({}) // Reset empty fields before submission

    try {
      const { userID, bookBarcode, schoolNo, name, college, department, bookTitle, date, time, deadline } = formData
      const currentTime = getLocalTime()
      const transactionType = checkMode === "Check Out" ? "Borrowed" : "Returned"

      // If the mode is 'Check Out', perform the checkout logic
      if (checkMode === "Check Out") {
        const { data: existingTransaction, error: fetchError } = await supabase
          .from("book_transactions")
          .select("transactionType")
          .eq("bookBarcode", bookBarcode)
          .eq("transactionType", "Borrowed") // Check if the book is already borrowed
          .order("checkoutDate", { ascending: false })
          .limit(1)
          .single()

        if (fetchError) {
          console.error("Error fetching existing transaction:", fetchError)
        }

        // Prevent checkout if a "Borrowed" transaction exists
        if (existingTransaction) {
          alert("This book is already borrowed. You cannot check it out again.")
          return // Exit the function if the book is already borrowed
        }

        // Update the status to 'Unavailable' when checking out
        const { error: updateError } = await supabase
          .from("book_indiv")
          .update({ bookStatus: "Unavailable" })
          .eq("bookBarcode", bookBarcode)

        if (updateError) {
          console.error("Error updating book status to Unavailable:", updateError)
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
          alert("Error submitting the form. Please try again.")
        } else {
          console.log("Transaction successful:", data)
          alert("Transaction completed successfully!")
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
          alert("This book is not marked as borrowed or has already been checked in.")
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

        alert("Book checked in successfully and transaction updated!")
      }
    } catch (error) {
      console.error("Error processing transaction:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false) // Set submitting state back to false when done
    }
  }

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

              if (key === "userID") {
                divClassName = "flex items-center hidden" // Add 'hidden' class
              }

              if (key === "bookBarcode") {
                label = "Book Barcode"
                afterInput = (
                  <button
                    type="button"
                    onClick={() => {
                      if (isScannerOpen) return
                      setIsScannerOpen(true)
                    }}
                    className="px-3 py-1 ml-2 rounded-full border border-grey w-[calc(2/5*100%)] hover:bg-light-gray transition"
                  >
                    Scan Barcode
                  </button>
                )
              }
              if (key === "bookTitle") label = "Book Title"

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

              return (
                <div className={divClassName} key={key}>
                  {" "}
                  {/* Use the divClassName here */}
                  <label className="w-1/3 text-md capitalize">{label}:</label>
                  <div className="w-2/3 flex items-center">
                    <input
                      type={inputType}
                      name={key}
                      value={
                        key === "bookBarcode"
                          ? formData.bookBarcode
                          : key === "schoolNo"
                            ? formatSchoolNo(formData.schoolNo)
                            : value
                      }
                      onChange={handleInputChange}
                      placeholder={key === "schoolNo" ? "XXXX-X-XXXXX" : ""}
                      className={`px-3 py-1 rounded-full border ${emptyFields[key] ? "border-arcadia-red" : "border-grey"} ${key === "bookBarcode" ? "w-[calc(3/5*100%)]" : "w-full"}`}
                      required
                    />
                    {afterInput}
                  </div>
                </div>
              )
            })}
          </div>
          {isScannerOpen && <BarcodeScanner onScan={handleBarcodeScan} onClose={() => setIsScannerOpen(false)} />}
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
    </div>
  )
}

export default CheckingContainer

