import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

const collegeData = [
  { name: "CTHM", value: 25 },
  { name: "COECSA", value: 20 },
  { name: "CBA", value: 15 },
  { name: "CEAS", value: 20 },
  { name: "CLAE", value: 20 },
]

const departmentData = [
  { name: "DOE", value: 23.59 },
  { name: "DOM", value: 16.53 },
  { name: "DOL", value: 13.18 },
  { name: "DCS", value: 25.52 },
  { name: "DOA", value: 12.47 },
  { name: "Others", value: 8.71 },
]

const COLORS = [
  "hsl(215, 90%, 50%)",
  "hsl(150, 60%, 50%)",
  "hsl(0, 70%, 60%)",
  "hsl(40, 80%, 50%)",
  "hsl(280, 60%, 60%)",
  "hsl(190, 70%, 50%)",
]

export default function RcntLibVisit() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Library Visits</h2>
        <div className="flex justify-around">
          <div className="h-[300px] w-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={collegeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {collegeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="h-[300px] w-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">By College</h2>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Group</th>
                <th className="text-right">Visits Today</th>
                <th className="text-right">Visits This Month</th>
                <th className="text-right">Day Change</th>
                <th className="text-right">Month Change</th>
              </tr>
            </thead>
            <tbody>
              {collegeData.map((college) => (
                <tr key={college.name}>
                  <td>{college.name}</td>
                  <td className="text-right">323</td>
                  <td className="text-right">12,532</td>
                  <td className="text-right text-green-600">1.5%</td>
                  <td className="text-right text-green-600">0.5%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">By Department</h2>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Group</th>
                <th className="text-right">Visits Today</th>
                <th className="text-right">Visits This Month</th>
                <th className="text-right">Day Change</th>
                <th className="text-right">Month Change</th>
              </tr>
            </thead>
            <tbody>
              {departmentData.map((dept) => (
                <tr key={dept.name}>
                  <td>{dept.name}</td>
                  <td className="text-right">323</td>
                  <td className="text-right">12,532</td>
                  <td className="text-right text-green-600">1.5%</td>
                  <td className="text-right text-green-600">0.5%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">By Year Level</h2>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Group</th>
                <th className="text-right">Visits Today</th>
                <th className="text-right">Visits This Month</th>
                <th className="text-right">Day Change</th>
                <th className="text-right">Month Change</th>
              </tr>
            </thead>
            <tbody>
              {['4th Year', '5th Year', '3rd Year', 'Grade 12', '2nd Year'].map((year) => (
                <tr key={year}>
                  <td>{year}</td>
                  <td className="text-right">323</td>
                  <td className="text-right">12,532</td>
                  <td className="text-right text-green-600">1.5%</td>
                  <td className="text-right text-green-600">0.5%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">By Time</h2>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Period</th>
                <th className="text-right">Visits Today</th>
                <th className="text-right">Visits This Month</th>
                <th className="text-right">Day Change</th>
                <th className="text-right">Month Change</th>
              </tr>
            </thead>
            <tbody>
              {['12PM-1PM', '1PM-2PM', '11PM-12PM', '2PM-3PM', '10PM-11PM'].map((time) => (
                <tr key={time}>
                  <td>{time}</td>
                  <td className="text-right">323</td>
                  <td className="text-right">12,532</td>
                  <td className="text-right text-green-600">1.5%</td>
                  <td className="text-right text-green-600">0.5%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      
    </div>
  )
}