import { useState, useEffect, useCallback } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { supabase } from "/src/supabaseClient.js"

const ReportSupportBarPlot = () => {
  const [data, setData] = useState([])
  const [timeFrame, setTimeFrame] = useState("week")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    const { startDate, endDate } = getDateRange(timeFrame)

    const { data: reports, error: reportError } = await supabase
      .from("report_ticket")
      .select("date, time")
      .gte("date", startDate)
      .lte("date", endDate)

    const { data: supports, error: supportError } = await supabase
      .from("support_ticket")
      .select("date, time")
      .gte("date", startDate)
      .lte("date", endDate)

    if (reportError || supportError) {
      console.error("Error fetching data:", reportError || supportError)
      setIsLoading(false)
      return
    }

    const groupedData = processData(reports, supports, timeFrame)
    setData(groupedData)
    setIsLoading(false)
  }, [timeFrame, currentDate])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const getDateRange = (frame) => {
    const date = new Date(currentDate)
    let startDate, endDate

    if (frame === "week") {
      // Get Monday of current week
      startDate = new Date(date)
      startDate.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -5 : 2))
      startDate.setHours(0, 0, 0, 0)

      // Get Friday of current week
      endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 4)
      endDate.setHours(23, 59, 59, 999)
    } else if (frame === "month") {
      // Start of current month
      startDate = new Date(date.getFullYear(), date.getMonth(), 1)
      // End of current month
      endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      endDate.setHours(23, 59, 59, 999)
    } else if (frame === "year") {
      // Start of current year
      startDate = new Date(date.getFullYear(), 1)
      // End of current year
      endDate = new Date(date.getFullYear(), 11, 31)
      endDate.setHours(23, 59, 59, 999)
    }

    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    }
  }

  const getTimeLabels = (selectedTimeFrame) => {
    const { startDate, endDate } = getDateRange(selectedTimeFrame)
    const start = new Date(startDate)
    const end = new Date(endDate)
    const labels = []

    if (selectedTimeFrame === "year") {
      for (let month = 0; month < 12; month++) {
        const monthDate = new Date(currentDate.getFullYear(), month, 1)
        labels.push(monthDate.toLocaleDateString("en-CA"))
      }
      
    } else {
      // For week and month, use days
      while (start <= end) {
        labels.push(start.toISOString().split("T")[0])
        start.setDate(start.getDate() + 1)
      }
    }

    return labels
  }

  const processData = (reports, supports, selectedTimeFrame) => {
    const timeLabels = getTimeLabels(selectedTimeFrame)
    const chartData = initializeChartData(timeLabels)

    // Process reports
    reports.forEach((report) => {
      const reportDate = new Date(report.date)
      const timeLabel = formatTimeLabel(reportDate, selectedTimeFrame)

      if (chartData[timeLabel]) {
        chartData[timeLabel].reports += 1
      }
    })

    // Process supports
    supports.forEach((support) => {
      const supportDate = new Date(support.date)
      const timeLabel = formatTimeLabel(supportDate, selectedTimeFrame)

      if (chartData[timeLabel]) {
        chartData[timeLabel].supports += 1
      }
    })

    // Convert to array format for chart
    if (selectedTimeFrame === "year") {
      // For year view, sort by month number (0-11)
      return Object.keys(chartData)
        .sort((a, b) => {
          const monthA = new Date(a).getMonth()
          const monthB = new Date(b).getMonth()
          return monthA - monthB
        })
        .map((key) => ({
          name: formatDisplayLabel(key, selectedTimeFrame),
          reports: chartData[key].reports,
          supports: chartData[key].supports,
          date: key,
          monthIndex: new Date(key).getMonth(), // Add month index for sorting
        }))
    } else {
      // For week and month views, sort by date
      return Object.keys(chartData)
        .sort((a, b) => new Date(a) - new Date(b))
        .map((key) => ({
          name: formatDisplayLabel(key, selectedTimeFrame),
          reports: chartData[key].reports,
          supports: chartData[key].supports,
          date: key,
        }))
    }
  }

  const initializeChartData = (labels) => {
    const data = {}
    labels.forEach((label) => {
      data[label] = { reports: 0, supports: 0 }
    })
    return data
  }

  const formatTimeLabel = (date, selectedTimeFrame) => {
    if (selectedTimeFrame === "year") {
      // For year view, group by month (first day of each month)
      return new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString("en-CA")
    }
    return new Date(date).toLocaleDateString("en-CA")
  }
  

  const formatDisplayLabel = (dateStr, selectedTimeFrame) => {
    const date = new Date(dateStr)

    if (selectedTimeFrame === "week") {
      const weekday = date.toLocaleDateString("en-US", { weekday: "long" })
      const formattedDate = date.toLocaleDateString("en-US", { month: "numeric", day: "numeric" })
      return `${weekday} (${formattedDate})`
    } else if (selectedTimeFrame === "month") {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    } else if (selectedTimeFrame === "year") {
      return date.toLocaleDateString("en-US", { month: "long" })
    }

    return dateStr
  }

  const navigatePrevious = () => {
    const newDate = new Date(currentDate)
    if (timeFrame === "week") {
      newDate.setDate(newDate.getDate() - 7)
    } else if (timeFrame === "month") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else if (timeFrame === "year") {
      newDate.setFullYear(newDate.getFullYear() - 1)
    }
    setCurrentDate(newDate)
  }

  const navigateNext = () => {
    const newDate = new Date(currentDate)
    if (timeFrame === "week") {
      newDate.setDate(newDate.getDate() + 7)
    } else if (timeFrame === "month") {
      newDate.setMonth(newDate.getMonth() + 1)
    } else if (timeFrame === "year") {
      newDate.setFullYear(newDate.getFullYear() + 1)
    }
    setCurrentDate(newDate)
  }

  const formatDateRange = () => {
    if (timeFrame === "week") {
      const { startDate, endDate } = getDateRange(timeFrame)
      return `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`
    } else if (timeFrame === "month") {
      return currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    } else if (timeFrame === "year") {
      return currentDate.getFullYear().toString()
    }
    return ""
  }

  const handleTimeFrameChange = (newTimeFrame) => {
    setTimeFrame(newTimeFrame)
  }

  // Format Y-axis ticks as integers
  const formatYAxisTick = (value) => {
    return Math.round(value)
  }

  const customTooltipFormatter = (value, name) => {
    // Capitalize the first letter of the data key
    const formattedName = name === "reports" ? "Reports" : name === "supports" ? "Supports" : name // fallback to the original name if it doesn't match
    return [Math.round(value), formattedName]
  }

  return (
    <div className="bg-white p-4 rounded-lg border-grey border h-fit">
      <h3 className="text-2xl font-semibold mb-2">Reports and Supports Over Time</h3>

      <div className="flex items-center justify-between mb-6">
        
        <select
          value={timeFrame}
          onChange={(e) => handleTimeFrameChange(e.target.value)}
          className="bg-white p-2 border border-gray rounded-md"
        >
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
        
        <div className="flex justify-center  items-center gap-2 border border-gray rounded">
          <button onClick={navigatePrevious} className="p-2 hover:bg-grey">
            &lt;
          </button>
          <span className="font-medium">{formatDateRange()}</span>
          <button onClick={navigateNext} className="p-2 hover:bg-grey">
            &gt;
          </button>
        </div>

      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={formatYAxisTick} allowDecimals={false} />
          <Tooltip formatter={customTooltipFormatter} />
          <Legend
            formatter={
              (value) => (value === "reports" ? "Reports" : value === "supports" ? "Supports" : value) // fallback if it's neither
            }
          />
          <Bar dataKey="reports" name="Reports" fill="#A31D1D" />
          <Bar dataKey="supports" name="Supports" fill="#FFB200" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ReportSupportBarPlot

