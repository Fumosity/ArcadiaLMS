import { ArrowLeft } from "lucide-react"
import GenreGrid from "./GenreGrid"

const SeeMoreGenres = ({ onGenreClick, selectedComponent, onBackClick, fetchGenres }) => {
  return (
    <div className="min-h-screen bg-light-white">
      <button
        onClick={onBackClick}
        className="w-[200px] h-[44px] mb-8 border border-grey rounded-full px-5 inline-flex items-center gap-2 text-sm text-black hover:bg-light-gray transition-colors"
      >
        <span className="w-5 h-5 border border-black rounded-full bg-gray-100 flex items-center justify-center">
          <ArrowLeft className="w-3 h-3" />
        </span>
        Back to Home
      </button>

      <GenreGrid title={selectedComponent} fetchGenres={fetchGenres} onGenreClick={onGenreClick}/>
      </div>
  )
}

export default SeeMoreGenres

