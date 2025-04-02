import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { fetchBookCirculationData, processData } from "../../backend/LibBkCircBackend"

const LibBookCirc = () => {
  const [timeFrame, setTimeFrame] = useState("month")
  const [circulationData, setCirculationData] = useState([])
  const [tableData, setTableData] = useState([])

  useEffect(() => {
    const loadData = async () => {
      const rawData = await fetchBookCirculationData()
      const { filteredTableData, chartData } = processData(rawData, timeFrame)
      setTableData(filteredTableData)
      setCirculationData(chartData)
    }

    loadData()
  }, [timeFrame])

  return (
    <div className="bg-white p-4">

      {/* Time Frame Selector */}
      <div className="mb-4">
        <label htmlFor="time-frame" className="mr-2">
          Select Time Frame:
        </label>
        <select
          id="time-frame"
          onChange={(e) => setTimeFrame(e.target.value)}
          value={timeFrame}
          className="border border-grey rounded-md py-1 px-2"
        >
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
      </div>

      {/* Bar Chart for Book Circulation */}
      <div className="w-full mb-6">
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
      </div>
    </div>
  )
}

export default LibBookCirc

