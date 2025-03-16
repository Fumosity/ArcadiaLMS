import { createContext, useContext, useState } from "react"

// Create a context for research filters
const ResearchFilterContext = createContext()

export function useResearchFilters() {
  return useContext(ResearchFilterContext)
}

export function ResearchFilterProvider({ children }) {
  // Publication year filters
  const [selectedYear, setSelectedYear] = useState("")
  const [yearRange, setYearRange] = useState({ from: "", to: "" })

  // College and department filters
  const [selectedCollege, setSelectedCollege] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("")

  // Sorting
  const [sortOption, setSortOption] = useState("best-match")

  // Function to clear all filters
  const clearFilters = () => {
    setSelectedYear("")
    setYearRange({ from: "", to: "" })
    setSelectedCollege("")
    setSelectedDepartment("")
    setSortOption("best-match")
  }

  // Apply year range
  const applyYearRange = (from, to) => {
    setYearRange({ from, to })
    // Clear the predefined year selection when custom range is applied
    setSelectedYear("")
  }

  const value = {
    // Publication year
    selectedYear,
    setSelectedYear,
    yearRange,
    setYearRange,
    applyYearRange,

    // College and department
    selectedCollege,
    setSelectedCollege,
    selectedDepartment,
    setSelectedDepartment,

    // Sorting
    sortOption,
    setSortOption,

    // Actions
    clearFilters,
  }

  return <ResearchFilterContext.Provider value={value}>{children}</ResearchFilterContext.Provider>
}

