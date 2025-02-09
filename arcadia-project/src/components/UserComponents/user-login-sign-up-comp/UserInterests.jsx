import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { supabase } from "./../../../supabaseClient"; 

export default function UserInterests({ userData, onBack, onContinue }) {
  const [genres, setGenres] = useState([])
  const [selectedGenres, setSelectedGenres] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState(null);

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
    setSelectedGenres((prev) =>
      prev.includes(genreID)
        ? prev.filter((id) => id !== genreID)
        : [...prev, genreID]
    );
  };

  const handleContinue = () => {
    if (selectedGenres.length < 5) {
      alert("Please select at least 5 genres");
      return;
    }
    console.log("Selected genres:", selectedGenres);

    const selectedGenreNames = genres
      .filter((genre) => selectedGenres.includes(genre.genreID))
      .map((genre) => genre.genreName);

    console.log("Selected genre names:", selectedGenreNames);
    onContinue(selectedGenres);
  };

  // Filter genres based on the selected category
  const filteredGenres = categoryFilter
    ? genres.filter((genre) => genre.category === categoryFilter)
    : genres;

  return (
    <div className="uMain-cont flex">
      <div className="w-1/2 p-12 flex flex-col">
        <h1 className="text-3xl font-semibold text-center mb-6">Hello {userData.firstName}!</h1>
        <p className="text-gray-600 mb-4">Select a number of interests or genres that you want to see!</p>

        {/* Category selection buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setCategoryFilter("Fiction")}
            className={`px-6 py-2 rounded-full text-sm transition-colors ${categoryFilter === "Fiction"
                ? "bg-arcadia-red text-white"
                : "border border-arcadia-red text-arcadia-red hover:bg-arcadia-red/5"
              }`}
          >
            Fiction
          </button>
          <button
            onClick={() => setCategoryFilter("Non-fiction")}
            className={`px-6 py-2 rounded-full text-sm transition-colors ${categoryFilter === "Non-fiction"
                ? "bg-arcadia-red text-white"
                : "border border-arcadia-red text-arcadia-red hover:bg-arcadia-red/5"
              }`}
          >
            Non-fiction
          </button>
          <button
            onClick={() => setCategoryFilter(null)} // Reset the filter
            className={`px-6 py-2 rounded-full text-sm transition-colors ${categoryFilter === null
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
          <div className="flex flex-wrap gap-2">
            {filteredGenres.map((genre) => (
              <button
                key={genre.genreID}
                onClick={() => toggleGenre(genre.genreID)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${selectedGenres.includes(genre.genreID)
                    ? "bg-arcadia-red text-white"
                    : "border border-arcadia-red text-arcadia-red hover:bg-arcadia-red/5"
                  }`}
              >
                {genre.genreName}
              </button>
            ))}
          </div>
        )}

        <div className="flex justify-center items-center gap-4 mt-8">
          <button onClick={onBack} className="registerBtn">Return</button>
          <button
            onClick={handleContinue}
            disabled={selectedGenres.length < 5}
            className={`genRedBtns ${selectedGenres.length < 5 ? "bg-gray-400 cursor-not-allowed" : "bg-arcadia-red hover:bg-arcadia-red/90"}`}
          >
            Continue
          </button>
        </div>

        {selectedGenres.length < 5 && (
          <p className="text-sm text-arcadia-red mt-2">
            Please select {5 - selectedGenres.length} more genre(s) to continue.
          </p>
        )}
      </div>

      <div className="w-1/2 relative bg-grey rounded-2xl">
        <div className="absolute inset-0 flex items-end p-12">
          <h2 className="text-white text-4xl font-semibold">Knowledge that empowers.</h2>
        </div>
      </div>
    </div>
  );
}