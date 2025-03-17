import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import SnglBkCrcltn from "./SnglBkCrcltn"
import { supabase } from "/src/supabaseClient.js"

const Analytics = ({ titleID }) => {
  const [timeFrame, setTimeFrame] = useState("month")
  const [circulationData, setCirculationData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCirculationData = async () => {
      if (!titleID) {
        console.log("No titleID provided to Analytics component")
        setLoading(false)
        return
      }

      console.log("Analytics fetching data for titleID:", titleID)
      setLoading(true)

      try {
        // Step 1: Fetch books associated with the current titleID from book_indiv
        const { data: bookIndiv, error: bookIndivError } = await supabase
          .from("book_indiv")
          .select("*")
          .eq("titleID", titleID)

        if (bookIndivError) {
          console.error("Error fetching book_indiv: ", bookIndivError.message)
          setLoading(false)
          return
        }

        // Get a list of bookBarcodes for the current titleID
        const bookBarcodes = bookIndiv.map((book) => book.bookBarcode)

        if (bookBarcodes.length === 0) {
          console.log("No book copies found for this title")
          setLoading(false)
          return
        }

        // Step 2: Fetch all transactions for these books
        const { data: transactions, error: transactionError } = await supabase
          .from("book_transactions")
          .select(`
            transactionType, 
            checkinDate, 
            checkinTime,
            checkoutDate,
            checkoutTime,
            bookBarcode
          `)
          .in("bookBarcode", bookBarcodes)

        if (transactionError) {
          console.error("Error fetching transactions: ", transactionError.message)
          setLoading(false)
          return
        }

        // Process data for the chart
        const formattedData = transactions.map((item) => ({
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
          bookBarcode: item.bookBarcode,
        }))

        const { chartData } = processData(formattedData, timeFrame)
        setCirculationData(chartData)
      } catch (error) {
        console.error("Error in fetchCirculationData: ", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCirculationData()
  }, [titleID, timeFrame])

  // Process data functions similar to LibBkCircBackend.jsx
  const processData = (data, selectedTimeFrame) => {
    const chartData = generateChartData(data, selectedTimeFrame)
    return { chartData }
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

  return (
    <div className="bg-white p-4 rounded-lg border-grey border">
      <h3 className="text-2xl font-semibold mb-2">Analytics</h3>

      {/* Time Frame Selector */}
      <div className="mb-4">
        <label htmlFor="time-frame" className="mr-2 font-medium">
          Select Time Frame:
        </label>
        <select
          id="time-frame"
          onChange={(e) => setTimeFrame(e.target.value)}
          value={timeFrame}
          className="border border-gray-300 rounded-md py-1 px-2"
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
      </div>

      {/* Circulation Bar Chart */}
      <div className="w-full mb-6">
        <h4 className="text-lg font-medium mb-2">Book Circulation History</h4>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading circulation data...</p>
          </div>
        ) : circulationData.length > 0 ? (
          <ResponsiveContainer width="100%" aspect={3}>
            <BarChart data={circulationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} domain={[0, "auto"]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="borrowed" fill="#FFB200" name="Borrowed" />
              <Bar dataKey="returned" fill="#118B50" name="Returned" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex justify-center items-center h-64 border border-gray-200 rounded-lg">
            <p className="text-gray-500">No circulation data available for this book.</p>
          </div>
        )}
      </div>

      {/* Detailed Circulation History Table */}
      <SnglBkCrcltn titleID={titleID} />
    </div>
  )
}

export default Analytics

