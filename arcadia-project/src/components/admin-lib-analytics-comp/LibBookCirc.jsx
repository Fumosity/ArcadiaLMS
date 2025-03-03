"use client"

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
    <div className="bg-white p-4 rounded-lg border-grey border">
      <h3 className="text-2xl font-semibold mb-2">Book Circulation</h3>

      {/* Time Frame Selector */}
      <div className="mb-4">
        <label htmlFor="time-frame" className="mr-2">
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

      {/* Bar Chart for Book Circulation */}
      <div className="w-full mb-6">
        <ResponsiveContainer width="100%" aspect={2}>
          <BarChart data={circulationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} domain={[0, "auto"]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="borrowed" fill="#e8d08d" name="Borrowed" />
            <Bar dataKey="returned" fill="#82ca9d" name="Returned" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Book Circulation History Table */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Book Circulation History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-center">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Start Date & Time</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">End Date & Time</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Borrower</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Book Title</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Book ID</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-center">
              {tableData.map((book, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td
                    className={`py-1 px-3 my-2 text-sm text-gray-900 rounded-full inline-flex justify-center self-center
                            ${book.type === "Returned" ? "bg-[#8fd28f]" : book.type === "Borrowed" ? "bg-[#e8d08d]" : ""}`}
                  >
                    {book.type}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {book.checkoutDate} {book.checkoutTime}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {book.type === "Returned" ? `${book.checkinDate} ${book.checkinTime}` : "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-blue-600">{book.borrower}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{book.bookTitle}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{book.bookBarcode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default LibBookCirc

