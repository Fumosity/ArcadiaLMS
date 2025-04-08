import { useEffect, useState } from "react"
import { supabase } from "../../../supabaseClient.js"
import { useUser } from "../../../backend/UserContext" // Adjust path as needed
import { toast } from "react-toastify"

export function UserInterests() {
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [genres, setGenres] = useState([])
  const [selectedGenres, setSelectedGenres] = useState([])
  const [originalGenres, setOriginalGenres] = useState([]) // Stores original selection for reset
  const [loading, setLoading] = useState(true)

  const { user } = useUser() // Global user state from context
  const userId = user?.userID

  useEffect(() => {
    async function fetchData() {
      await fetchGenres()
      await fetchUserGenres()
    }
    fetchData()
  }, [])

  async function fetchGenres() {
    setLoading(true)
    const { data, error } = await supabase.from("genres").select("*")
    if (error) {
      console.error("Error fetching genres:", error)
    } else {
      console.log(data)
      setGenres(data)
    }
    setLoading(false)
  }

  async function fetchUserGenres() {
    const { data, error } = await supabase.from("user_genre_link").select("genreID").eq("userID", userId)

    if (error) {
      console.error("Error fetching user genres:", error)
    } else {
      const userGenres = data.map((item) => item.genreID)
      setSelectedGenres(userGenres)
      setOriginalGenres(userGenres) // Store for reset
    }
  }

  async function toggleGenre(genreID) {
    const updatedGenres = new Set(selectedGenres)

    if (updatedGenres.has(genreID)) {
      updatedGenres.delete(genreID)
      await supabase.from("user_genre_link").delete().match({ userID: userId, genreID })
    } else {
      updatedGenres.add(genreID)
      await supabase.from("user_genre_link").insert([{ userID: userId, genreID }])
    }

    setSelectedGenres([...updatedGenres]) // Convert Set to array
  }

  function handleCategoryChange(category) {
    setCategoryFilter(category)
  }

  function resetChanges() {
    setSelectedGenres(originalGenres)
  }

  async function updateChanges() {
    try {
      const toAdd = selectedGenres.filter((id) => !originalGenres.includes(id))
      const toRemove = originalGenres.filter((id) => !selectedGenres.includes(id))

      // Add new selections
      if (toAdd.length > 0) {
        const insertData = toAdd.map((genreID) => ({ userID: userId, genreID }))
        await supabase.from("user_genre_link").insert(insertData)
      }

      // Remove unselected genres
      if (toRemove.length > 0) {
        await supabase.from("user_genre_link").delete().in("genreID", toRemove).eq("userID", userId)
      }

      // Update original selection state
      setOriginalGenres(selectedGenres)

      // Show success toast notification
      toast.success("Your interests have been updated successfully!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      })
    } catch (error) {
      console.error("Error updating interests:", error)
      toast.error("Failed to update your interests. Please try again.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
      })
    }
  }

  return (
    <div className="uMain-cont">
      <h2 className="text-2xl font-medium text-arcadia-black mb-6">User Interests</h2>
      <div className="mb-4">
        Below are your current interests, which will be used to recommend books. Click on a genre to select or deselect,
        then press update to save changes.
      </div>

      {/* Category Selection */}
      <div className="flex-col justify-between items-center mb-4">
        <label className="w-1/4">Categories of interest:</label>
        <div className="flex gap-4 w-full p-4">
          {["All", "Fiction", "Non-fiction"].map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-6 py-2 rounded-full w-full text-sm transition-colors ${
                categoryFilter === category
                  ? "bg-arcadia-red border-arcadia-red border text-white"
                  : "border border-arcadia-red text-arcadia-red hover:bg-arcadia-red/5"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Genre Selection */}
      <div className="flex-col justify-between items-center mb-4">
        <label className="w-1/4">Genres of interest:</label>

        {loading ? (
          <p>Loading genres...</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-2 w-full pl-12 pr-12 pt-4">
            {genres
              .filter((genre) => categoryFilter === "All" || genre.category === categoryFilter)
              .map((genre) => (
                <button
                  key={genre.genreID}
                  onClick={() => toggleGenre(genre.genreID)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    selectedGenres.includes(genre.genreID)
                      ? "bg-arcadia-red border-arcadia-red border text-white"
                      : "border border-arcadia-red text-arcadia-red hover:bg-arcadia-red/5"
                  }`}
                >
                  {genre.genreName}
                </button>
              ))}
          </div>
        )}
      </div>

      {/* Reset & Update Buttons */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={resetChanges}
          className="w-1/6 px-4 py-2 rounded-full text-sm transition-colors border border-arcadia-red text-arcadia-red hover:bg-arcadia-red/5"
        >
          Reset Changes
        </button>
        <button
          onClick={updateChanges}
          className="w-1/6 px-4 py-2 rounded-full text-sm transition-colors bg-arcadia-red border-arcadia-red border text-white"
        >
          Update Changes
        </button>
      </div>
    </div>
  )
}
