import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../supabaseClient.js"

const ListOfUserAcc = () => {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("Ascending")
  const [typeFilter, setTypeFilter] = useState("All")
  const [userData, setUserData] = useState([])
  const [loading, setLoading] = useState(true)
  const userAccountsRef = useRef(null)

  useEffect(() => {
    const scrollToUserAccounts = () => {
      if (location.hash === "#user-accounts-list" && userAccountsRef.current) {
        userAccountsRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }

    // Scroll after a short delay to ensure the component has rendered
    const timeoutId = setTimeout(scrollToUserAccounts, 100)

    return () => clearTimeout(timeoutId)
  }, [location])

  useEffect(() => {
    const fetchUserAccounts = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("user_accounts")
        .select("userAccountType, userEmail, userFName, userLName, userID, userLPUID, userCollege, userDepartment")
        .in("userAccountType", ["User", "Faculty", "Student", ]) // Use .in() to filter multiple types

      if (error) {
        console.error("Error fetching data from Supabase:", error)
      } else {
        const formattedData = data.map((user) => ({
          type: user.userAccountType,
          email: user.userEmail,
          name: `${user.userFName} ${user.userLName}`,
          userId: user.userID,
          schoolId: user.userLPUID,
          college: user.userCollege,
          department: user.userDepartment,
        }))
        setUserData(formattedData)
      }
      setLoading(false)
    }

    fetchUserAccounts()
  }, [])

  // Handle sorting
  const sortedData = [...userData].sort((a, b) => {
    if (sortOrder === "Ascending") {
      return a.name.localeCompare(b.name)
    } else {
      return b.name.localeCompare(a.name)
    }
  })

  // Handle filtering and searching
  const filteredData = sortedData.filter((user) => {
    const matchesType = typeFilter === "All" || user.type === typeFilter

    const matchesSearch =
      !searchTerm ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.schoolId && user.schoolId.includes(searchTerm))

    return matchesType && matchesSearch
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / entriesPerPage)
  const startIndex = (currentPage - 1) * entriesPerPage
  const displayedUsers = filteredData.slice(startIndex, startIndex + entriesPerPage)

  const handleUserClick = (user) => {
    navigate("/admin/useraccounts/viewusers", {
      state: { userId: user.userId, user: user },
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const formatSchoolNo = (value) => {
    if (!value) return "N/A"
    // Remove non-numeric characters
    let numericValue = value.replace(/\D/g, "")

    // Apply the XXXX-X-XXXXX format
    if (numericValue.length > 4) {
      numericValue = `${numericValue.slice(0, 4)}-${numericValue.slice(4)}`
    }
    if (numericValue.length > 6) {
      numericValue = `${numericValue.slice(0, 6)}-${numericValue.slice(6, 11)}`
    }
    return numericValue
  }

  return (
    <div ref={userAccountsRef} id="user-accounts-list" className="scroll-mt-16">
      <div className="bg-white border border-grey p-4 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">List of User Accounts</h2>

        {/* Controls for sort, filter, and search */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Sort By */}
            <div className="flex items-center space-x-2">
              <span className="font-medium text-sm">Sort:</span>
              <button
                onClick={() => setSortOrder(sortOrder === "Ascending" ? "Descending" : "Ascending")}
                className="sort-by bg-gray-200 py-1 px-3 border-grey rounded-lg text-sm w-28"
              >
                {sortOrder}
              </button>
            </div>

            {/* Filter By */}
            <div className="flex items-center space-x-2">
              <span className="font-medium text-sm">Type:</span>
              <select
                className="py-1 px-3 border border-grey rounded-lg text-sm w-32"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Student">Student</option>
                <option value="Faculty">Faculty</option>
              </select>
            </div>

            {/* Entries Per Page */}
            <div className="flex items-center space-x-2">
              <span className="font-medium text-sm">Entries:</span>
              <select
                className="bg-gray-200 py-1 px-3 border border-grey rounded-lg text-sm w-20"
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center space-x-2 min-w-[0]">
            <label htmlFor="search" className="font-medium text-sm">
              Search:
            </label>
            <input
              type="text"
              id="search"
              className="border border-grey rounded-md py-1 px-2 text-sm w-auto sm:w-[420px]"
              placeholder="Name, email, or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y  ">
            <thead>
              <tr>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                </th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Number
                </th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  College
                </th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y  ">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-2 text-center">
                    Loading data...
                  </td>
                </tr>
              ) : displayedUsers.length > 0 ? (
                displayedUsers.map((user, index) => (
                  <tr key={index} className="hover:bg-light-gray cursor-pointer">
                    <td className="px-4 py-2 text-sm text-gray-900 flex justify-center">
                      <span className="bookinv-category inline-flex items-center justify-center text-sm font-medium rounded-full px-2 py-1">
                        {user.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm truncate text-left">{user.email}</td>
                    <td className="px-4 py-3 text-sm text-arcadia-red font-semibold truncate text-left">
                      <button onClick={() => handleUserClick(user)} className="text-blue-500 hover:underline">
                        {user.name}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm truncate text-center">{user.schoolId || "N/A"}</td>
                    <td className="px-4 py-3 text-sm truncate text-center">{user.college || "N/A"}</td>
                    <td className="px-4 py-3 text-sm truncate text-center">{user.department || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-2 text-center text-zinc-600">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-4 space-x-4">
          <button
            className={`uPage-btn ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-grey"}`}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous Page
          </button>
          <span className="text-xs text-arcadia-red">Page {currentPage}</span>
          <button
            className={`uPage-btn ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-grey"}`}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next Page
          </button>
        </div>
      </div>
    </div>
  )
}

export default ListOfUserAcc

