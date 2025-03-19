import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { supabase } from "../../supabaseClient";

const collegeColors = [
  "#c27ba0",
  "#8e7cc3",
  "#6fa8dc",
  "#6d9eeb",
  "#76a5af",
  "#93c47d",
  "#ffd966",
  "#f6b26b",
  "#e06666",
  "#cc4125"
];

const deptColors= [
  "#C96868",
  "#FADFA1",
  "#7EACB5",
  "#bf4d4d",
  "#4B4376",
  "#D17D98",
  "#47663B",
  "#898121",
  "#DA8359",
  "#705C53"
]


export default function RcntLibVisit() {
  const [collegeData, setCollegeData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase
          .from("book_transactions")
          .select(`
            transactionType,
            checkoutDate,
            checkinDate,
            user_accounts!inner (
              userCollege,
              userDepartment
            )
          `)
          .order("checkoutDate", { ascending: false });

        if (error) {
          console.error("Error fetching data:", error);
          return;
        }

        const processedData = processTransactions(data);
        setCollegeData(processedData.collegeData);
        setDepartmentData(processedData.departmentData);
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    }

    fetchData();
  }, []);

  function processTransactions(transactions) {
    const now = new Date();
    const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
    const twoWeeksAgo = new Date(now.setDate(now.getDate() - 14));

    const collegeMap = new Map();
    const departmentMap = new Map();

    transactions.forEach((transaction) => {
      const { userCollege, userDepartment } = transaction.user_accounts || {};
      if (!userCollege) return;

      const transactionDate = new Date(transaction.checkoutDate);
      const isReturned = transaction.checkinDate != null;

      // College Aggregation
      if (!collegeMap.has(userCollege)) {
        collegeMap.set(userCollege, {
          name: userCollege,
          borrows: 0,
          returns: 0,
          thisWeekBorrows: 0,
          thisWeekReturns: 0,
          lastWeekBorrows: 0,
          lastWeekReturns: 0,
        });
      }
      const collegeData = collegeMap.get(userCollege);
      collegeData.borrows += 1;
      if (isReturned) collegeData.returns += 1;

      // Time-based Aggregation
      if (transactionDate >= oneWeekAgo) {
        collegeData.thisWeekBorrows += 1;
        if (isReturned) collegeData.thisWeekReturns += 1;
      } else if (transactionDate >= twoWeeksAgo) {
        collegeData.lastWeekBorrows += 1;
        if (isReturned) collegeData.lastWeekReturns += 1;
      }

      // Department Aggregation
      if (userDepartment) {
        if (!departmentMap.has(userDepartment)) {
          departmentMap.set(userDepartment, {
            name: userDepartment,
            borrows: 0,
            returns: 0,
            thisWeekBorrows: 0,
            thisWeekReturns: 0,
            lastWeekBorrows: 0,
            lastWeekReturns: 0,
            college: userCollege,
          });
        }
        const departmentData = departmentMap.get(userDepartment);
        departmentData.borrows += 1;
        if (isReturned) departmentData.returns += 1;

        if (transactionDate >= oneWeekAgo) {
          departmentData.thisWeekBorrows += 1;
          if (isReturned) departmentData.thisWeekReturns += 1;
        } else if (transactionDate >= twoWeeksAgo) {
          departmentData.lastWeekBorrows += 1;
          if (isReturned) departmentData.lastWeekReturns += 1;
        }
      }
    });

    return {
      collegeData: Array.from(collegeMap.values()),
      departmentData: Array.from(departmentMap.values()),
    };
  }

  return (
    <div className="flex-col space-y-2">

      {/* Pie Charts */}
      <div className="bg-white border border-grey p-4 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-left">Book Circulation Demographics</h2>
        <div className="flex justify-around">
          {/* College Data Chart */}
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
                  dataKey="borrows"
                >
                  {collegeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={collegeColors[index % collegeColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Department Data Chart */}
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
                  dataKey="borrows"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={deptColors[index % deptColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="flex space-x-2 w-full">
        {/* By College Section */}
        <div className="bg-white border border-grey p-4 rounded-lg min-w-36 w-full">
          <h2 className="text-2xl font-semibold mb-4 text-left">Circulation By Program</h2>
          <div className="pb-4 overflow-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-2 py-2 text-center text-sm font-medium text-gray-500 uppercase tracking-wider border-t border-x-0 border" rowSpan="2">Group</th>
                  <th className="px-2 py-2 text-center text-sm font-medium text-gray-500 uppercase tracking-wider border-y border-gray-200" colSpan="2">This Week</th>
                  <th className="px-2 py-2 text-center text-sm font-medium text-gray-500 uppercase tracking-wider border-y border-gray-200" colSpan="2">Last Week</th>
                </tr>
                <tr className="bg-gray-100">
                  <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Borrows</th>
                  <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Returns</th>
                  <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Borrows</th>
                  <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Returns</th>
                </tr>
              </thead>
              <tbody>
                {collegeData.map((college) => (
                  <tr key={college.name} className="hover:bg-light-gray cursor-pointer border border-b border-x-0">
                    <td className="px-4 py-2 text-center text-sm text-gray-500 truncate min-w-4">{college.name}</td>
                    <td className="px-4 py-2 text-center text-sm text-gray-500 truncate min-w-4">{college.thisWeekBorrows}</td>
                    <td className="px-4 py-2 text-center text-sm text-gray-500 truncate min-w-4">{college.thisWeekReturns}</td>
                    <td className="px-4 py-2 text-center text-sm text-gray-500 truncate min-w-4">{college.lastWeekBorrows}</td>
                    <td className="px-4 py-2 text-center text-sm text-gray-500 truncate min-w-4">{college.lastWeekReturns}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* By Department Section */}
        <div className="bg-white border border-grey p-4 rounded-lg min-w-36 w-full">
          <h2 className="text-2xl font-semibold mb-4 text-left">Circulation By Department</h2>
          <div className="pb-4 overflow-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-2 py-2 text-center text-sm font-medium text-gray-500 uppercase tracking-wider border-t border-x-0 border" rowSpan="2">Group</th>
                  <th className="px-2 py-2 text-center text-sm font-medium text-gray-500 uppercase tracking-wider border-y border-gray-200" colSpan="2">This Week</th>
                  <th className="px-2 py-2 text-center text-sm font-medium text-gray-500 uppercase tracking-wider border-y border-gray-200" colSpan="2">Last Week</th>
                </tr>
                <tr className="bg-gray-100">
                  <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Borrows</th>
                  <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Returns</th>
                  <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Borrows</th>
                  <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Returns</th>
                </tr>
              </thead>
              <tbody>
                {departmentData.map((dept) => (
                  <tr key={dept.name} className="hover:bg-light-gray cursor-pointer border border-b border-x-0">
                    <td className="px-4 py-2 text-center text-sm text-gray-500 truncate min-w-4">{dept.name}</td>
                    <td className="px-4 py-2 text-center text-sm text-gray-500 truncate min-w-4">{dept.thisWeekBorrows}</td>
                    <td className="px-4 py-2 text-center text-sm text-gray-500 truncate min-w-4">{dept.thisWeekReturns}</td>
                    <td className="px-4 py-2 text-center text-sm text-gray-500 truncate min-w-4">{dept.lastWeekBorrows}</td>
                    <td className="px-4 py-2 text-center text-sm text-gray-500 truncate min-w-4">{dept.lastWeekReturns}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
