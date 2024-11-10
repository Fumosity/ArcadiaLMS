import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

export default function ReturnToSearch() {
  return (
    <Link
      to="/search"
      className="w-[200px] h-[44px] border border-grey rounded-full px-5 inline-flex items-center gap-2 text-sm text-black hover:bg-light-gray transition-colors"
    >
      <span className="w-5 h-5 border border-black rounded-full bg-gray-100 flex items-center justify-center">
        <ArrowLeft className="w-3 h-3" />
      </span>
      Return to Search
    </Link>
  )
}