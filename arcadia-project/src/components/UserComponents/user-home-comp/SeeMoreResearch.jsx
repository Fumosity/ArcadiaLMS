import { ArrowLeft } from "lucide-react"
import ResearchGrid from "./ResearchGrid"

const SeeMoreResearch = ({ selectedComponent, onBackClick, fetchResearch }) => {
  return (
    <div className="min-h-screen bg-light-white">
      <button
        onClick={onBackClick}
        className="w-[200px] h-[44px] mb-4 border border-grey rounded-full px-5 inline-flex items-center gap-2 text-sm text-black hover:bg-light-gray transition-colors"
      >
        <span className="w-5 h-5 border border-black rounded-full bg-gray-100 flex items-center justify-center">
          <ArrowLeft className="w-3 h-3" />
        </span>
        Back to Catalog
      </button>

      <div className="mb-4">
        <h1 className="text-3xl font-bold">{selectedComponent}</h1>
      </div>

      <ResearchGrid title={selectedComponent} fetchResearch={fetchResearch} />
    </div>
  )
}

export default SeeMoreResearch

