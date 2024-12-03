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
      <div className="bg-white border border-grey p-6 rounded-lg mb-6">
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

      <div className="">
        <div className="bg-white border border-grey p-6 rounded-lg mb-6">
          <h2 className="text-xl text-left font-semibold mb-4">By College</h2>
          <div className="border border-grey rounded-lg px-5 py-5 flex gap-10 items-center justify-center">
            <div>
              <h2 className="text-xl mb-4 text-center">Records</h2>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-center">Group</th>
                  </tr>
                </thead>
                <tbody>
                  {collegeData.map((college) => (
                    <tr key={college.name}>
                      <td className="text-center">{college.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <h2 className="text-xl mb-4 text-center">This Week</h2>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-right px-6">Borrows</th>
                    <th className="text-right px-6">Returns</th>
                  </tr>
                </thead>
                <tbody>
                  {collegeData.map((college) => (
                    <tr key={college.name}>
                      <td className="text-center px-6">323</td>
                      <td className="text-center px-6">12,532</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="items-center justify-center">
              <h2 className="text-xl mb-4 text-center">Last Week</h2>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-right px-6">Borrows</th>
                    <th className="text-right px-6">Returns</th>
                  </tr>
                </thead>
                <tbody>
                  {collegeData.map((college) => (
                    <tr key={college.name}>
                      <td className="text-center px-6">323</td>
                      <td className="text-center px-6">12,532</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>


        <div className="bg-white border border-grey p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4 text-left">By Department</h2>
          <div className="border border-grey rounded-lg px-5 py-5 flex gap-10 items-center justify-center">
            <div>
              <h2 className="text-xl mb-4 text-center">Records</h2>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-center">Group</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentData.map((dept) => (
                    <tr key={dept.name}>
                      <td className="text-center">{dept.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <h2 className="text-xl mb-4 text-center">This Week</h2>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-right px-6">Borrows</th>
                    <th className="text-right px-6">Returns</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentData.map((dept) => (
                    <tr key={dept.name}>
                      <td className="text-center px-6">323</td>
                      <td className="text-center px-6">12,532</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <h2 className="text-xl mb-4 text-center">Last Week</h2>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-right px-6">Borrows</th>
                    <th className="text-right px-6">Returns</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentData.map((dept) => (
                    <tr key={dept.name}>
                      <td className="text-center px-6">323</td>
                      <td className="text-center px-6">12,532</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        
      </div>


    </div>
  )
}