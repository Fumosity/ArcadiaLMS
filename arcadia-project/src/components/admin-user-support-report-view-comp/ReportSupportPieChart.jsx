import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { supabase } from "/src/supabaseClient.js"

const REPORT_STATUS_COLORS = {
  Resolved: "#118B50",
  Ongoing: "#FFB200",
  Intended: "#A31D1D",
}

const SUPPORT_STATUS_COLORS = {
  Approved: "#118B50",
  Pending: "#FFB200",
  Rejected: "#A31D1D",
}

const ReportSupportPieChart = () => {
  const [reportData, setReportData] = useState([])
  const [supportData, setSupportData] = useState([])
  const [timeFrame, setTimeFrame] = useState("month")
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    fetchData()
  }, [timeFrame, currentDate])

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
      startDate = new Date(date.getFullYear(), 0, 1)
      // End of current year
      endDate = new Date(date.getFullYear(), 11, 31)
      endDate.setHours(23, 59, 59, 999)
    }

    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    }
  }

  const fetchData = async () => {
    const { startDate, endDate } = getDateRange(timeFrame)

    const { data: reports, error: reportError } = await supabase
      .from("report_ticket")
      .select("status, date")
      .gte("date", startDate)
      .lte("date", endDate)

    const { data: supports, error: supportError } = await supabase
      .from("support_ticket")
      .select("status, date")
      .gte("date", startDate)
      .lte("date", endDate)

    if (reportError || supportError) {
      console.error("Error fetching data:", reportError || supportError)
      return
    }

    setReportData(groupDataByStatus(reports, REPORT_STATUS_COLORS))
    setSupportData(groupDataByStatus(supports, SUPPORT_STATUS_COLORS))
  }

  const groupDataByStatus = (data, colorMap) => {
    const grouped = data.reduce((acc, item) => {
      if (!acc[item.status]) acc[item.status] = 0
      acc[item.status]++
      return acc
    }, {})

    return Object.entries(grouped).map(([status, value]) => ({
      name: status,
      value,
      color: colorMap[status] || "#8884d8",
    }))
  }

  const ReportLegend = () => (
    <div className="flex justify-center items-center gap-4 mt-2">
      {Object.entries(REPORT_STATUS_COLORS).map(([status, color]) => (
        <div key={status} className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: color }}></div>
          <span className="text-sm font-medium">{status}</span>
        </div>
      ))}
    </div>
  )

  const SupportLegend = () => (
    <div className="flex justify-center items-center gap-4 mt-2">
      {Object.entries(SUPPORT_STATUS_COLORS).map(([status, color]) => (
        <div key={status} className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: color }}></div>
          <span className="text-sm font-medium">{status}</span>
        </div>
      ))}
    </div>
  )

  const renderPieChart = (data, title, LegendComponent) => (
    <div className="flex flex-col w-1/2 items-center">
      <h3 className="text-lg font-semibold text-center mb-4">{title}</h3>
      <ResponsiveContainer width={450} height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={90}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <LegendComponent />
    </div>
  )

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

  return (
    <div className="bg-white p-4 rounded-lg border-grey border h-fit">
      <h3 className="text-2xl font-semibold mb-2">Status Overview</h3>

      <div className="flex items-center justify-between mb-6">
        
        <select
          value={timeFrame}
          onChange={(e) => handleTimeFrameChange(e.target.value)}
          className="bg-white p-2 border border-grey rounded-md"
        >
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>

        <div className="flex justify-center  items-center gap-2 border border-grey rounded">
          <button onClick={navigatePrevious} className="p-2 hover:bg-grey">
            &lt;
          </button>
          <span className="font-medium">{formatDateRange()}</span>
          <button onClick={navigateNext} className="p-2 hover:bg-grey">
            &gt;
          </button>
        </div>
      </div>

      <div className="flex justify-center items-start overflow-auto">
        {renderPieChart(reportData, "User Report Status", ReportLegend)}
        {renderPieChart(supportData, "User Support Status", SupportLegend)}
      </div>
    </div>
  )
}

export default ReportSupportPieChart

