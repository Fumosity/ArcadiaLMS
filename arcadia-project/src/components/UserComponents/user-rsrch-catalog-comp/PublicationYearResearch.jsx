import { useState, useEffect } from "react"
import { useResearchFilters } from "../../../backend/ResearchFilterContext"
import { supabase } from "../../../supabaseClient"

export default function PublicationYearResearch() {
  const { selectedYear, setSelectedYear, yearRange, applyYearRange } = useResearchFilters()
  const [fromYear, setFromYear] = useState(yearRange.from)
  const [toYear, setToYear] = useState(yearRange.to)
  const [availableYears, setAvailableYears] = useState([])
  const [loading, setLoading] = useState(true)

  const yearOptions = ["All", "Last 5 Years", "Last 10 Years", "Last 25 Years"]

  useEffect(() => {
    async function fetchPublicationYears() {
      try {
        setLoading(true)
        const { data, error } = await supabase.from("research").select("pubDate").not("pubDate", "is", null)

        if (error) {
          console.error("Error fetching publication years:", error)
          return
        }

        // Extract years from dates and remove duplicates
        const years = data
          .map((research) => new Date(research.pubDate).getFullYear())
          .filter((year) => !isNaN(year))
          .sort((a, b) => b - a) // Sort descending (newest first)

        // Remove duplicates
        const uniqueYears = [...new Set(years)]
        setAvailableYears(uniqueYears)
      } catch (error) {
        console.error("Error processing publication years:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPublicationYears()
  }, [])

  const handleYearSelect = (year) => {
    // If clicking the already selected option, deselect it
    if (selectedYear === year) {
      setSelectedYear("")
    } else {
      setSelectedYear(year)
      // Clear the custom range inputs when a predefined option is selected
      setFromYear("")
      setToYear("")
    }
  }

  const handleApplyYearRange = () => {
    applyYearRange(fromYear, toYear)
  }

  // Set min and max years for the range inputs based on available data
  const minYear = availableYears.length > 0 ? Math.min(...availableYears) : 1900
  const maxYear = availableYears.length > 0 ? Math.max(...availableYears) : new Date().getFullYear()

  return (
    <div className="uSidebar-filter">
      <h2 className="text-xl font-semibold mb-2.5">Publication Year</h2>
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {yearOptions.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={option.toLowerCase().replace(/\s/g, "-")}
                checked={selectedYear === option}
                onChange={() => handleYearSelect(option)}
                className="custom-checkbox"
              />
              <label htmlFor={option.toLowerCase().replace(/\s/g, "-")} className="text-sm">
                {option}
              </label>
            </div>
          ))}
        </div>
        <div className="mt-4 w-full">
          <div className="flex items-center w-full space-x-2">
            <div>
              <b>
                <label htmlFor="from" className="text-xs block mb-1">
                  From
                </label>
              </b>
              <input
                type="number"
                id="from"
                value={fromYear}
                onChange={(e) => setFromYear(e.target.value)}
                className="w-full py-0.5 text-dark-grey border border-grey rounded-2xl text-sm text-right"
                placeholder={minYear.toString()}
                min={minYear}
                max={maxYear}
              />
            </div>
            <div>
              <b>
                <label htmlFor="to" className="text-xs block mb-1">
                  Through
                </label>
              </b>
              <input
                type="number"
                id="to"
                value={toYear}
                onChange={(e) => setToYear(e.target.value)}
                className="w-full py-0.5 text-dark-grey border border-grey rounded-2xl text-sm text-right"
                placeholder={maxYear.toString()}
                min={minYear}
                max={maxYear}
              />
            </div>
          </div>
          <button
            onClick={handleApplyYearRange}
            className="mt-2 w-full bg-arcadia-red hover:bg-red hover:text-white text-white py-1 px-4 rounded-xl text-sm"
          >
            Apply Year Range
          </button>

          {loading && <p className="text-xs text-gray-500 mt-2">Loading publication years...</p>}

          {!loading && availableYears.length > 0 && (
            <div className="mt-2 text-xs text-gray-500">
              <p>
                Available years: {minYear} - {maxYear}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

