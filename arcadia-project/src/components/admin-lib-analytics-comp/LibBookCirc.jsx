import { useState, useEffect, useCallback } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { fetchBookCirculationData, processData } from "../../backend/LibBkCircBackend"

const LibBookCirc = () => {
  const [timeFrame, setTimeFrame] = useState("month")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [circulationData, setCirculationData] = useState([])
  const [tableData, setTableData] = useState([])

  const loadData = useCallback(async () => {
    const rawData = await fetchBookCirculationData()
    const { filteredTableData, chartData } = processData(rawData, timeFrame, currentDate)
    setTableData(filteredTableData)
    setCirculationData(chartData)
  }, [timeFrame, currentDate])

  useEffect(() => {
    loadData()
  }, [loadData])

  const navigatePrevious = () => {
    const newDate = new Date(currentDate)
    if (timeFrame === "week") {
      newDate.setDate(newDate.getDate() - 7)
    } else if (timeFrame === "month") {
      newDate.setMonth(newDate.getMonth() - 1)
    }
    setCurrentDate(newDate)
  }

  const navigateNext = () => {
    const newDate = new Date(currentDate)
    if (timeFrame === "week") {
      newDate.setDate(newDate.getDate() + 7)
    } else if (timeFrame === "month") {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const formatDateRange = () => {
    if (timeFrame === "week") {
      const startOfWeek = new Date(currentDate)
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())

      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)

      return `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`
    } else if (timeFrame === "month") {
      return currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    }
    return ""
  }

  return (
    <div className="bg-white p-4 rounded-lg h-fit">

      <div className="flex items-center justify-start gap-2 mb-6">
        <select
          id="time-frame"
          onChange={(e) => setTimeFrame(e.target.value)}
          value={timeFrame}
          className="bg-white p-2 border border-grey rounded-md"
        >
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>

        <div className="flex justify-center items-center gap-2 border border-grey rounded">
          <button onClick={navigatePrevious} className="p-2 hover:bg-grey">
            &lt;
          </button>
          <span className="font-medium">{formatDateRange()}</span>
          <button onClick={navigateNext} className="p-2 hover:bg-grey">
            &gt;
          </button>
        </div>
      </div>

      {/* Bar Chart for Book Circulation */}
      <div className="w-full mb-6">
        <ResponsiveContainer width="100%" height={400}>
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
      </div>
    </div>
  )
}

export default LibBookCirc
