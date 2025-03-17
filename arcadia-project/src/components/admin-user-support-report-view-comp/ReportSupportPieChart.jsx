import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { supabase } from "/src/supabaseClient.js"

const STATUS_COLORS = {
  Ongoing: "#FFB200",
  Intended: "#A31D1D",
  Resolved: "#118B50",
}

const ReportSupportPieChart = () => {
  const [reportData, setReportData] = useState([])
  const [supportData, setSupportData] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data: reports, error: reportError } = await supabase.from("report_ticket").select("status")
    const { data: supports, error: supportError } = await supabase.from("support_ticket").select("status")

    if (reportError || supportError) {
      console.error("Error fetching data:", reportError || supportError)
      return
    }

    setReportData(groupDataByStatus(reports))
    setSupportData(groupDataByStatus(supports))
  }

  const groupDataByStatus = (data) => {
    const grouped = data.reduce((acc, item) => {
      if (!acc[item.status]) acc[item.status] = 0
      acc[item.status]++
      return acc
    }, {})

    return Object.entries(grouped).map(([status, value]) => ({
      name: status,
      value,
      color: STATUS_COLORS[status] || "#8884d8",
    }))
  }

  const renderPieChart = (data, title) => (
    <div className="flex flex-col w-1/2 items-center">
      <h3 className="text-lg font-semibold text-center mb-4">{title}</h3>
      <ResponsiveContainer width={400} height={300}>
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
    </div>
  )

  // Custom legend component
  const CustomLegend = () => (
    <div className="flex justify-center items-center gap-8 mt-4">
      {Object.entries(STATUS_COLORS).map(([status, color]) => (
        <div key={status} className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: color }}></div>
          <span className="text-sm font-medium">{status}</span>
        </div>
      ))}
    </div>
  )

  return (
    <div className="bg-white p-4 rounded-lg border-grey border h-fit">
      <h3 className="text-2xl font-semibold mb-6">Reports and Supports Status</h3>
      <div className="flex justify-center items-start overflow-auto">
        {renderPieChart(reportData, "Reports")}
        {renderPieChart(supportData, "Supports")}
      </div>
      <CustomLegend />
    </div>
  )
}

export default ReportSupportPieChart

