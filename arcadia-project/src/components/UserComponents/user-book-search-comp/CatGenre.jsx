import { useState, useEffect } from "react"
import { useFilters } from "../../../backend/filterContext"
import { supabase } from "../../../supabaseClient"

export default function CatGenre() {
  const {
    selectedCategory,
    setSelectedCategory,
    searchGenre,
    setSearchGenre,
    excludeGenre,
    setExcludeGenre,
    isAndSearch,
    setIsAndSearch,
  } = useFilters()

  const [categories, setCategories] = useState([])
  const [availableGenres, setAvailableGenres] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch categories and genres from the database
  useEffect(() => {
    async function fetchCategoriesAndGenres() {
      try {
        setLoading(true)

        // Fetch unique categories
        const { data: categoryData, error: categoryError } = await supabase
          .from("genres")
          .select("category")
          .not("category", "is", null)

        if (categoryError) {
          console.error("Error fetching categories:", categoryError)
          return
        }

        // Extract unique categories
        const uniqueCategories = [...new Set(categoryData.map((item) => item.category))]
          .filter((category) => category) // Remove empty values
          .sort()

        setCategories(uniqueCategories)

        // Fetch all genres initially
        await fetchGenres(selectedCategory)
      } catch (error) {
        console.error("Error processing categories:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategoriesAndGenres()
  }, [])

  // Fetch genres based on selected category
  const fetchGenres = async (category) => {
    try {
      let query = supabase.from("genres").select("genreName").not("genreName", "is", null)

      // If a category is selected (and not "All"), filter by that category
      if (category && category !== "All") {
        query = query.eq("category", category)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error fetching genres:", error)
        return
      }

      // Extract unique genre names
      const uniqueGenres = [...new Set(data.map((item) => item.genreName))]
        .filter((genre) => genre) // Remove empty values
        .sort()

      setAvailableGenres(uniqueGenres)
    } catch (error) {
      console.error("Error processing genres:", error)
    }
  }

  // Update genres when category changes
  useEffect(() => {
    fetchGenres(selectedCategory)
  }, [selectedCategory])

  const handleCategorySelect = (category) => {
    // If clicking the already selected category, deselect it
    if (selectedCategory === category) {
      setSelectedCategory("")
    } else {
      setSelectedCategory(category)
    }
  }

  const handleGenreSelect = (genre, setGenreFunction, genreList) => {
    if (!genreList.includes(genre)) {
      setGenreFunction([...genreList, genre])
    }
  }

  const handleRemoveGenre = (genre, setGenreFunction, genreList) => {
    setGenreFunction(genreList.filter((g) => g !== genre))
  }

  return (
    <div className="uSidebar-filter">
      <h2 className="text-xl font-semibold mb-2.5">Category and Genre</h2>

      {/* Category checkboxes with single-select behavior and custom styles */}
      <div className="grid grid-cols-3 gap-2 pb-2">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="category-all"
            checked={selectedCategory === "All"}
            onChange={() => handleCategorySelect("All")}
            className="custom-checkbox"
          />
          <label htmlFor="category-all" className="text-sm">
            All
          </label>
        </div>

        {categories.map((category) => (
          <div key={category} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`category-${category.toLowerCase()}`}
              checked={selectedCategory === category}
              onChange={() => handleCategorySelect(category)}
              className="custom-checkbox"
            />
            <label htmlFor={`category-${category.toLowerCase()}`} className="text-sm">
              {category}
            </label>
          </div>
        ))}

        {loading && categories.length === 0 && (
          <div className="col-span-3 text-sm text-gray-500">Loading categories...</div>
        )}
      </div>

      {/* Search Genre dropdown */}
      <div className="space-y-2 border-t border-grey">
        <div className="flex items-center mt-1 justify-between">
          <p className="text-sm font-medium">Search for Genre:</p>
          <div className="flex items-center space-x-1 text-sm">
            <button
              onClick={() => setIsAndSearch(true)}
              className={`font-medium ${isAndSearch ? "text-arcadia-red font-bold" : "text-black"}`}
            >
              AND
            </button>
            <span className="text-gray-400">┃</span>
            <button
              onClick={() => setIsAndSearch(false)}
              className={`font-medium ${!isAndSearch ? "text-arcadia-red font-bold" : "text-black"}`}
            >
              OR
            </button>
          </div>
        </div>

        {/* Select Dropdown with Custom Arrow */}
        <div className="relative w-full">
          <select
            onChange={(e) => {
              if (e.target.value) {
                handleGenreSelect(e.target.value, setSearchGenre, searchGenre)
                e.target.value = "" // Reset select after selection
              }
            }}
            className="w-full px-2 py-0.5 text-sm text-dark-grey border border-grey rounded-2xl bg-white appearance-none pr-8"
            defaultValue=""
          >
            <option value="" disabled>
              {loading ? "Loading genres..." : "Select a genre..."}
            </option>
            {availableGenres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
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

        {/* Display selected genres for Search Genre */}
        <div className="flex flex-wrap gap-2 mt-1">
          {searchGenre.map((genre) => (
            <div
              key={genre}
              className="flex items-center border-arcadia-red rounded-2xl bg-arcadia-red text-white px-2 py-0.5"
            >
              <button
                className="mr-2 text-white text-left"
                onClick={() => handleRemoveGenre(genre, setSearchGenre, searchGenre)}
              >
                ×
              </button>
              <span>{genre}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Exclude Genre dropdown */}
      <div className="space-y-2">
        <p className="text-sm font-medium mt-1">Exclude Genre:</p>
        <div className="relative w-full">
          <select
            onChange={(e) => {
              if (e.target.value) {
                handleGenreSelect(e.target.value, setExcludeGenre, excludeGenre)
                e.target.value = "" // Reset select after selection
              }
            }}
            className="w-full px-2 py-0.5 text-sm text-dark-grey border border-grey rounded-2xl bg-white appearance-none pr-8"
            defaultValue=""
          >
            <option value="" disabled>
              {loading ? "Loading genres..." : "Select a genre to exclude..."}
            </option>
            {availableGenres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
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
        {/* Display selected genres for Exclude Genre */}
        <div className="flex flex-wrap gap-2 mt-1">
          {excludeGenre.map((genre) => (
            <div
              key={genre}
              className="flex items-center border-arcadia-red rounded-2xl bg-arcadia-red text-white px-2 py-0.5"
            >
              <button
                className="mr-2 text-white text-left"
                onClick={() => handleRemoveGenre(genre, setExcludeGenre, excludeGenre)}
              >
                ×
              </button>
              <span>{genre}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

