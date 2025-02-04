import { useState } from "react"
import { Link } from "react-router-dom"

const genres = [
  { id: 1, name: "Fiction", category: "main" },
  { id: 2, name: "Non-fiction", category: "main" },
  { id: 3, name: "Action", category: "fiction" },
  { id: 4, name: "Adventure", category: "fiction" },
  { id: 5, name: "Mystery", category: "fiction" },
  { id: 6, name: "Fantasy", category: "fiction" },
  { id: 7, name: "Science Fiction", category: "fiction" },
  { id: 8, name: "Speculative Fiction", category: "fiction" },
  { id: 9, name: "Autobiographies", category: "nonfiction" },
  { id: 10, name: "Biographies", category: "nonfiction" },
  { id: 11, name: "History", category: "nonfiction" },
  { id: 12, name: "Philosophy", category: "nonfiction" },
  { id: 13, name: "Medical Science", category: "academic" },
  { id: 14, name: "Tourism and Hospitality", category: "academic" },
  { id: 15, name: "Encyclopedia", category: "reference" },
  { id: 16, name: "Romance", category: "fiction" },
  { id: 17, name: "War", category: "nonfiction" },
  { id: 18, name: "Tragedy", category: "fiction" },
  { id: 19, name: "Comedy", category: "fiction" },
  { id: 20, name: "Engineering", category: "academic" },
  { id: 21, name: "Mathematics", category: "academic" },
  { id: 22, name: "Academic", category: "main" },
  { id: 23, name: "Language", category: "academic" },
]

export default function UserInterests() {
  const [selectedGenres, setSelectedGenres] = useState([])

  const toggleGenre = (genreId) => {
    setSelectedGenres((prev) => (prev.includes(genreId) ? prev.filter((id) => id !== genreId) : [...prev, genreId]))
  }

  const handleContinue = () => {
    if (selectedGenres.length < 5) {
      alert("Please select at least 5 genres")
      return
    }
    // Handle continuation logic here
    console.log("Selected genres:", selectedGenres)
  }

  return (
    <div className="uMain-cont flex">
      <div className="w-1/2 p-12 flex flex-col">
      <div className="flex justify-center mb-6">
          <div className="flex items-center gap-1">
            <h1 className="text-3xl font-semibold">Hello Shiori!</h1>
          </div>
        </div>

        <p className="text-gray-600 mb-4">Select a number of interests or genres that you want to see!</p>

        <div className="flex-1">
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => toggleGenre(genre.id)}
                className={`px-4 py-2 rounded-full text-sm transition-colors
                  ${
                    selectedGenres.includes(genre.id)
                      ? "bg-arcadia-red text-white"
                      : "border border-arcadia-red text-arcadia-red hover:bg-arcadia-red/5"
                  }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center items-center gap-4 mt-8">
          <Link
            to="/previous-step"
            className="registerBtn"
          >
            Return
          </Link>
          <button
            onClick={handleContinue}
            disabled={selectedGenres.length < 5}
            className={`genRedBtns ${
              selectedGenres.length < 5 ? "bg-gray-400 cursor-not-allowed" : "bg-arcadia-red hover:bg-arcadia-red/90"
            }`}
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
  )
}

