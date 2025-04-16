import { useState, useEffect } from "react"
import { supabase } from "./../../../supabaseClient"

export default function UserInterests({ userData, onBack, onContinue }) {
  const [genres, setGenres] = useState([])
  const [selectedGenres, setSelectedGenres] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState(null)

  console.log(userData)

  useEffect(() => {
    const fetchGenres = async () => {
      const { data, error } = await supabase.from("genres").select("genreID, genreName, category")
      if (error) {
        console.error("Error fetching genres:", error)
      } else {
        setGenres(data)
      }
      setLoading(false)
    }
    fetchGenres()
  }, [])

  const toggleGenre = (genreID) => {
    setSelectedGenres((prev) => (prev.includes(genreID) ? prev.filter((id) => id !== genreID) : [...prev, genreID]))
  }

  const handleContinue = () => {
    console.log("Selected genres:", selectedGenres)

    const selectedGenreNames = genres
      .filter((genre) => selectedGenres.includes(genre.genreID))
      .map((genre) => genre.genreName)

    console.log("Selected genre names:", selectedGenreNames)
    onContinue(selectedGenres)
  }

  // Filter genres based on the selected category
  const filteredGenres = categoryFilter ? genres.filter((genre) => genre.category === categoryFilter) : genres

  return (
    <div className="uMain-cont flex max-h-[600px] max-w-[950px] h-full w-full bg-white">
      <div className="w-1/2 p-12 pb-24 flex flex-col relative">
        <h3 className="text-5xl font-semibold text-center mb-6">Hello {userData.firstName}!</h3>
        <p className="text-gray-600 mb-4">Select a number of interests or genres that you want to see!</p>

        {/* Category selection buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setCategoryFilter("Fiction")}
            className={`px-3 py-0.5 rounded-full text-sm font-semibold transition-colors ${
              categoryFilter === "Fiction"
                ? "bg-arcadia-red text-white"
                : "border border-arcadia-red text-arcadia-red hover:bg-arcadia-red/5"
            }`}
          >
            Fiction
          </button>
          <button
            onClick={() => setCategoryFilter("Non-fiction")}
            className={`px-3 py-0.5 rounded-full text-sm font-semibold transition-colors ${
              categoryFilter === "Non-fiction"
                ? "bg-arcadia-red text-white"
                : "border border-arcadia-red text-arcadia-red hover:bg-arcadia-red/5"
            }`}
          >
            Non-fiction
          </button>
          <button
            onClick={() => setCategoryFilter(null)} // Reset the filter
            className={`px-3 py-0.5 rounded-full text-sm font-semibold transition-colors ${
              categoryFilter === null
                ? "bg-arcadia-red text-white"
                : "border border-arcadia-red text-arcadia-red hover:bg-arcadia-red/5"
            }`}
          >
            All
          </button>
        </div>

        {loading ? (
          <p>Loading genres...</p>
        ) : (
          <div className="flex flex-wrap gap-2 overflow-y-auto pr-2 custom-scrollbar max-h-[250px]">
            {filteredGenres.map((genre) => (
              <button
                key={genre.genreID}
                onClick={() => toggleGenre(genre.genreID)}
                className={`px-3 py-0.5 rounded-full text-sm transition-colors ${
                  selectedGenres.includes(genre.genreID)
                    ? "bg-arcadia-red text-white"
                    : "border border-arcadia-red text-arcadia-red hover:bg-arcadia-red/5"
                }`}
              >
                {genre.genreName}
              </button>
            ))}
          </div>
        )}

        <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-4">
          <button onClick={onBack} className="registerBtn">
            Return
          </button>
          <button onClick={handleContinue} className={`genRedBtns`}>
            Continue
          </button>
        </div>
      </div>

      <div className="w-1/2 relative rounded-2xl bg-cover bg-center">
        <img src="/image/hero2.jpeg" alt="Hero Background" className="w-[560px] h-full object-cover rounded-lg" />

        <div className="absolute inset-0 bg-black opacity-70 rounded-lg" />

        <div className="absolute inset-0 flex items-end p-12 z-10">
          <h2 className="text-white text-4xl text-right font-semibold">Knowledge that empowers.</h2>
        </div>
      </div>
    </div>
  )
}

