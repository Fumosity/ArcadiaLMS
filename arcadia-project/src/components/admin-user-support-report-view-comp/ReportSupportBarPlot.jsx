"use client"

import { useState, useEffect, useCallback } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { supabase } from "/src/supabaseClient.js"

const ReportSupportBarPlot = () => {
  const [data, setData] = useState([])
  const [timeFrame, setTimeFrame] = useState("week")
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
  }, [timeFrame])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const getDateRange = (frame) => {
    const currentDate = new Date()
    let startDate, endDate

    if (frame === "week") {
      // Get Monday of current week
      startDate = new Date(currentDate)
      startDate.setDate(currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -5 : 2))
      startDate.setHours(0, 0, 0, 0)

      // Get Friday of current week
      endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 4)
      endDate.setHours(23, 59, 59, 999)
    } else if (frame === "month") {
      // Start of current month
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 2)
      // End of current month
      endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
      endDate.setHours(23, 59, 59, 999)
    }

    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    }
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
    return Object.keys(chartData)
      .sort((a, b) => new Date(a) - new Date(b))
      .map((key) => ({
        name: formatDisplayLabel(key, selectedTimeFrame),
        reports: chartData[key].reports,
        supports: chartData[key].supports,
        date: key, // Keep original date for sorting
      }))
  }

  const getTimeLabels = (selectedTimeFrame) => {
    const { startDate, endDate } = getDateRange(selectedTimeFrame)
    const start = new Date(startDate)
    const end = new Date(endDate)
    const labels = []

    while (start <= end) {
      labels.push(start.toISOString().split("T")[0])
      start.setDate(start.getDate() + 1)
    }

    return labels
  }

  const initializeChartData = (labels) => {
    const data = {}
    labels.forEach((label) => {
      data[label] = { reports: 0, supports: 0 }
    })
    return data
  }

  const formatTimeLabel = (date, selectedTimeFrame) => {
    return date.toISOString().split("T")[0] // YYYY-MM-DD format
  }

  const formatDisplayLabel = (dateStr, selectedTimeFrame) => {
    const date = new Date(dateStr)

    if (selectedTimeFrame === "week") {
      const weekday = date.toLocaleDateString("en-US", { weekday: "long" })
      const formattedDate = date.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" })
      return `${weekday} (${formattedDate})`
    } else if (selectedTimeFrame === "month") {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }

    return dateStr
  }

  const handleTimeFrameChange = (newTimeFrame) => {
    setTimeFrame(newTimeFrame)
  }

  // if (isLoading) {
  //   return <div>Loading...</div>
  // }

  return (
    <div className="bg-white p-4 rounded-lg border-grey border h-fit">
      <h3 className="text-2xl font-semibold mb-4">Reports and Supports Over Time</h3>
      <div className="mb-4">
        <select
          value={timeFrame}
          onChange={(e) => handleTimeFrameChange(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="reports" fill="#A31D1D" />
          <Bar dataKey="supports" fill="#FFB200" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ReportSupportBarPlot

