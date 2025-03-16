import { createContext, useContext, useState } from "react"

// Create a context for filters
const FilterContext = createContext()

export function useFilters() {
  return useContext(FilterContext)
}

export function FilterProvider({ children }) {
  // Publication year filters
  const [selectedYear, setSelectedYear] = useState("")
  const [yearRange, setYearRange] = useState({ from: "", to: "" })

  // Category and genre filters
  const [selectedCategory, setSelectedCategory] = useState("")
  const [searchGenre, setSearchGenre] = useState([])
  const [excludeGenre, setExcludeGenre] = useState([])
  const [isAndSearch, setIsAndSearch] = useState(true)

  // Sorting
  const [sortOption, setSortOption] = useState("best-match")

  // Function to clear all filters
  const clearFilters = () => {
    setSelectedYear("")
    setYearRange({ from: "", to: "" })
    setSelectedCategory("")
    setSearchGenre([])
    setExcludeGenre([])
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

    // Category and genre
    selectedCategory,
    setSelectedCategory,
    searchGenre,
    setSearchGenre,
    excludeGenre,
    setExcludeGenre,
    isAndSearch,
    setIsAndSearch,

    // Sorting
    sortOption,
    setSortOption,

    // Actions
    clearFilters,
  }

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
}

