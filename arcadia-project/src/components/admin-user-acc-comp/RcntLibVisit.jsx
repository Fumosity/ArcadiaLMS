"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { supabase } from "../../supabaseClient";

const COLORS = [
  "hsl(215, 90%, 50%)",
  "hsl(150, 60%, 50%)",
  "hsl(0, 70%, 60%)",
  "hsl(40, 80%, 50%)",
  "hsl(280, 60%, 60%)",
  "hsl(190, 70%, 50%)",
]

export default function RcntLibVisit() {
  const [collegeData, setCollegeData] = useState([])
  const [departmentData, setDepartmentData] = useState([])

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('book_transactions')
        .select('*')
        .order('checkout_date', { ascending: false })
        .limit(1000)

      if (error) {
        console.error('Error fetching data:', error)
        return
      }

      const transactions = data
      const processedData = processTransactions(transactions)
      setCollegeData(processedData.collegeData)
      setDepartmentData(processedData.departmentData)
    }

    fetchData()
  }, [])

  function processTransactions(transactions) {
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

    const collegeMap = new Map()
    const departmentMap = new Map()

    transactions.forEach(transaction => {
      const college = transaction.userID.substring(0, 4) // Assuming college code is first 4 characters of userID
      const department = transaction.userID.substring(0, 3) // Assuming department code is first 3 characters of userID
      const transactionDate = new Date(transaction.checkout_date)

      // Process college data
      if (!collegeMap.has(college)) {
        collegeMap.set(college, { name: college, value: 0, thisWeekBorrows: 0, thisWeekReturns: 0, lastWeekBorrows: 0, lastWeekReturns: 0 })
      }
      const collegeData = collegeMap.get(college)
      collegeData.value++

      // Process department data
      if (!departmentMap.has(department)) {
        departmentMap.set(department, { name: department, value: 0, thisWeekBorrows: 0, thisWeekReturns: 0, lastWeekBorrows: 0, lastWeekReturns: 0 })
      }
      const departmentData = departmentMap.get(department)
      departmentData.value++

      // Process weekly data
      if (transactionDate >= oneWeekAgo) {
        if (transaction.transaction_type === 'borrow') {
          collegeData.thisWeekBorrows++
          departmentData.thisWeekBorrows++
        } else if (transaction.transaction_type === 'return') {
          collegeData.thisWeekReturns++
          departmentData.thisWeekReturns++
        }
      } else if (transactionDate >= twoWeeksAgo) {
        if (transaction.transaction_type === 'borrow') {
          collegeData.lastWeekBorrows++
          departmentData.lastWeekBorrows++
        } else if (transaction.transaction_type === 'return') {
          collegeData.lastWeekReturns++
          departmentData.lastWeekReturns++
        }
      }
    })

    return {
      collegeData: Array.from(collegeMap.values()),
      departmentData: Array.from(departmentMap.values())
    }
  }

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
                      <td className="text-center px-6">{college.thisWeekBorrows}</td>
                      <td className="text-center px-6">{college.thisWeekReturns}</td>
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
                      <td className="text-center px-6">{college.lastWeekBorrows}</td>
                      <td className="text-center px-6">{college.lastWeekReturns}</td>
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
                      <td className="text-center px-6">{dept.thisWeekBorrows}</td>
                      <td className="text-center px-6">{dept.thisWeekReturns}</td>
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
                      <td className="text-center px-6">{dept.lastWeekBorrows}</td>
                      <td className="text-center px-6">{dept.lastWeekReturns}</td>
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

