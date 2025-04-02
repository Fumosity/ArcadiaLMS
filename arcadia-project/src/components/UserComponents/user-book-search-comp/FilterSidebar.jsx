import CatGenre from "./CatGenre"
import PublicationYear from "./PublicationYear"
import { useFilters } from "../../../backend/FilterContext"
import { X } from "lucide-react"

export default function FilterSidebar({ onClose }) {
  const { clearFilters, sortOption, setSortOption } = useFilters()

  return (
    <div className="space-y-4 w-full">
      {/* Mobile close button - only shown in mobile view */}
      {onClose && (
        <div className="flex justify-end lg:hidden">
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100" aria-label="Close filters">
            <X size={20} />
          </button>
        </div>
      )}

      <button
        onClick={clearFilters}
        className="uSidebar-filter text-arcadia-red px-3 py-0.5 text-sm font-semibold text-left border border-grey rounded-xl hover:underline w-full"
      >
        Clear Filters
      </button>

      <div className="uSidebar-filter flex flex-col sm:flex-row items-start sm:items-center sm:space-x-2 px-3 py-0.5 border border-grey rounded-full">
        <label htmlFor="sort" className="text-sm font-semibold w-32 mb-1 sm:mb-0">
          Sort:
        </label>
        {/* Select Dropdown with Custom Arrow */}
        <div className="relative w-full sm:w-64">
          <select
            id="sort"
            className="text-sm rounded-xl border border-grey bg-white focus:outline-none focus:ring-0 appearance-none px-4 py-2 w-full"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="best-match">Best Match</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="date-desc">Newest to Oldest</option>
            <option value="date-asc">Oldest to Newest</option>
            <option value="rating-desc">Highest Rated</option>
          </select>

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

      <PublicationYear />
      <CatGenre />

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="uSidebar-filter text-arcadia-red px-3 py-0.5 text-sm font-semibold text-left border border-grey rounded-xl hover:bg-arcadia-red hover:text-white w-full"
      >
        Return to Top
      </button>
    </div>
  )
}

