import { useState, useEffect } from "react"
import { useResearchFilters } from "../../../backend/ResearchFilterContext"
import { supabase } from "../../../supabaseClient"

export default function CollegeAndDept() {
  const { selectedCollege, setSelectedCollege, selectedDepartment, setSelectedDepartment } = useResearchFilters()

  const [colleges, setColleges] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch colleges and departments from the database
  useEffect(() => {
    async function fetchCollegesAndDepartments() {
      try {
        setLoading(true)

        // No need to fetch colleges anymore as they are hardcoded
        setColleges(["COECSA", "CLAE", "CITHM", "CAMS", "CBA", "LAW", "CFAD", "CON", "IS", "Graduate School"])

        // Fetch departments for the selected college
        await fetchDepartments(selectedCollege)
      } catch (error) {
        console.error("Error processing colleges:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCollegesAndDepartments()
  }, [])

  // Fetch departments based on selected college
  const fetchDepartments = async (college) => {
    try {
      let query = supabase.from("research").select("department").not("department", "is", null)

      // If a college is selected (and not "All"), filter by that college
      if (college && college !== "All") {
        query = query.eq("college", college)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error fetching departments:", error)
        return
      }

      // Extract unique department names
      const uniqueDepartments = [...new Set(data.map((item) => item.department))]
        .filter((department) => department) // Remove empty values
        .sort()

      setDepartments(uniqueDepartments)
    } catch (error) {
      console.error("Error processing departments:", error)
    }
  }

  // Update departments when college changes
  useEffect(() => {
    fetchDepartments(selectedCollege)
    // Reset department selection when college changes
    if (selectedCollege !== "All") {
      setSelectedDepartment("")
    }
  }, [selectedCollege])

  return (
    <div className="uSidebar-filter">
      <h2 className="text-xl font-semibold mb-2.5">College and Department</h2>

      {/* College Dropdown */}
      <div className="mb-2">
        <label className="text-sm font-semibold block mb-1">Programs:</label>
        <div className="relative w-full">
          <select
            className="text-sm rounded-xl border border-grey bg-white focus:outline-none focus:ring-0 appearance-none px-4 py-2 w-full"
            value={selectedCollege}
            onChange={(e) => setSelectedCollege(e.target.value)}
          >
            <option value="">All</option>
            <option value="COECSA">COECSA</option>
            <option value="CLAE">CLAE</option>
            <option value="CITHM">CITHM</option>
            <option value="CAMS">CAMS</option>
            <option value="CBA">CBA</option>
            <option value="LAW">LAW</option>
            <option value="CFAD">CFAD</option>
            <option value="CON">CON</option>
            <option value="IS">IS</option>
            <option value="Graduate School">Graduate School</option>
          </select>

          {/* Custom dropdown arrow */}
          <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            <svg
              className="w-4 h-4 text-black"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* Department Dropdown (Only Visible if the selected college is COECSA or IS) */}
      {selectedCollege === "COECSA" && (
        <div className="mb-2">
          <label className="text-sm font-semibold block mb-1">Department:</label>
          <div className="relative w-full">
            <select
              className="text-sm rounded-xl border border-grey bg-white focus:outline-none focus:ring-0 appearance-none px-4 py-2 w-full"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="">All</option>
              {loading ? (
                <option value="" disabled>
                  Loading departments...
                </option>
              ) : (
                departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))
              )}
            </select>

            {/* Custom dropdown arrow */}
            <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <svg
                className="w-4 h-4 text-black"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </div>
        </div>
      )}
      {selectedCollege === "IS" && (
        <div className="mb-2">
          <label className="text-sm font-semibold block mb-1">High School Level:</label>
          <div className="relative w-full">
            <select
              className="text-sm rounded-xl border border-grey bg-white focus:outline-none focus:ring-0 appearance-none px-4 py-2 w-full"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="">All</option>
              {loading ? (
                <option value="" disabled>
                  Loading high school levels...
                </option>
              ) : (
                departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))
              )}
            </select>

            {/* Custom dropdown arrow */}
            <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <svg
                className="w-4 h-4 text-black"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
