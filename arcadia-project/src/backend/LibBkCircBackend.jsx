import { supabase } from "../supabaseClient"

export const fetchBookCirculationData = async () => {
  try {
    const { data, error } = await supabase
      .from("book_transactions")
      .select(
        `transactionType, checkinDate, checkinTime, checkoutDate, checkoutTime, userID, bookBarcode, book_indiv(book_titles(title, price)), user_accounts(userFName, userLName, userLPUID)`,
      )

    if (error) {
      console.error("Error fetching data: ", error.message)
      return []
    }

    return data.map((item) => ({
      type: item.transactionType,
      checkoutDate: item.checkoutDate,
      checkoutTime: item.checkoutTime
        ? new Date(`1970-01-01T${item.checkoutTime}`).toLocaleString("en-PH", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })
        : "",
      checkinDate: item.checkinDate,
      checkinTime: item.checkinTime
        ? new Date(`1970-01-01T${item.checkinTime}`).toLocaleString("en-PH", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })
        : "",
      borrower: `${item.user_accounts.userFName} ${item.user_accounts.userLName}`,
      bookTitle: item.book_indiv?.book_titles?.title || "",
      bookBarcode: item.bookBarcode,
    }))
  } catch (error) {
    console.error("Error: ", error)
    return []
  }
}

export const processData = (data, selectedTimeFrame) => {
  const filteredTableData = filterDataByTimeFrame(data, selectedTimeFrame)
  const chartData = generateChartData(data, selectedTimeFrame)
  return { filteredTableData, chartData }
}

const filterDataByTimeFrame = (data, selectedTimeFrame) => {
  const currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0) // Set to start of day

  return data.filter((entry) => {
    let entryDate
    if (entry.type === "Borrowed") {
      entryDate = new Date(entry.checkoutDate)
    } else {
      entryDate = new Date(entry.checkinDate)
    }
    entryDate.setHours(0, 0, 0, 0) // Set to start of day for comparison

    if (selectedTimeFrame === "day") {
      return isSameDay(entryDate, currentDate)
    } else if (selectedTimeFrame === "week") {
      return isInCurrentWeek(entryDate, currentDate)
    } else if (selectedTimeFrame === "month") {
      return isSameMonth(entryDate, currentDate)
    }
    return true
  })
}

const generateChartData = (data, selectedTimeFrame) => {
  const timeLabels = getTimeLabels(selectedTimeFrame)
  const chartData = initializeChartData(timeLabels)

  // Create a map to track borrowed books with their original borrow dates
  const borrowedBooks = new Map()

  // First pass: Process all transactions
  data.forEach((entry) => {
    let date
    let timeLabel

    if (entry.checkoutDate) {
      date = new Date(entry.checkoutDate)
      if (selectedTimeFrame === "day") {
        timeLabel = `${date.getHours()}:00`
      } else {
        timeLabel = formatTimeLabel(date, selectedTimeFrame)
      }

      if (chartData[timeLabel]) {
        chartData[timeLabel].borrowed += 1
        // Track this book as borrowed with its original borrow date
        borrowedBooks.set(entry.bookBarcode, { date, timeLabel })
      }
    }

    if (entry.type === "Returned" && entry.checkinDate) {
      date = new Date(entry.checkinDate)
      if (selectedTimeFrame === "day") {
        timeLabel = `${date.getHours()}:00`
      } else {
        timeLabel = formatTimeLabel(date, selectedTimeFrame)
      }

      if (chartData[timeLabel]) {
        chartData[timeLabel].returned += 1
      }
    }
  })

  // Second pass: Ensure borrowed books are counted in their original borrow period
  borrowedBooks.forEach((borrowInfo, bookBarcode) => {
    const borrowTimeLabel = borrowInfo.timeLabel
    if (chartData[borrowTimeLabel]) {
      // We don't need to increment here because it was already done in the first pass
      // chartData[borrowTimeLabel].borrowed += 1
    }
  })

  return Object.keys(chartData)
    .sort((a, b) => {
      if (selectedTimeFrame === "week" || selectedTimeFrame === "month") {
        return new Date(a) - new Date(b)
      }
      if (selectedTimeFrame === "day") {
        return Number.parseInt(a) - Number.parseInt(b)
      }
      return 0
    })
    .map((key) => ({
      name: key,
      borrowed: chartData[key].borrowed,
      returned: chartData[key].returned,
    }))
}

const isSameDay = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

const isInCurrentWeek = (date, currentDate) => {
  const startOfWeek = new Date(currentDate)
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())
  startOfWeek.setHours(0, 0, 0, 0)

  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  endOfWeek.setHours(23, 59, 59, 999)

  return date >= startOfWeek && date <= endOfWeek
}

const isSameMonth = (date1, date2) => {
  return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear()
}

const getTimeLabels = (selectedTimeFrame) => {
  const currentDate = new Date()
  const labels = []

  if (selectedTimeFrame === "day") {
    for (let hour = 0; hour < 24; hour++) {
      labels.push(`${hour.toString().padStart(2, "0")}:00`)
    }
  } else if (selectedTimeFrame === "week") {
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      labels.push(day.toLocaleDateString())
    }
  } else if (selectedTimeFrame === "month") {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      labels.push(date.toLocaleDateString())
    }
  }

  return labels
}

const initializeChartData = (labels) => {
  const data = {}
  labels.forEach((label) => {
    data[label] = { borrowed: 0, returned: 0 }
  })
  return data
}

const formatTimeLabel = (date, selectedTimeFrame) => {
  if (selectedTimeFrame === "day") {
    return `${date.getHours()}:00`
  } else if (selectedTimeFrame === "week" || selectedTimeFrame === "month") {
    return date.toLocaleDateString()
  }
  return ""
}

