import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import SimilarTo from "../admin-book-viewer-comp/SimilarTo"
import ViewAbstract from "../../z_modals/ViewAbstract"
import ModifyAbstract from "../../z_modals/ModifyAbstract"
import { supabase } from "../../supabaseClient"

const ResearchPreviewInv = ({ research, onResearchUpdate }) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [isViewOpen, setViewOpen] = useState(false)
  const [isModifyOpen, setModifyOpen] = useState(false)
  const [abstractContent, setAbstractContent] = useState("")
  const [updateStatus, setUpdateStatus] = useState({ loading: false, error: null })

  // Simulate loading effect when a research is selected
  useEffect(() => {
    if (research) {
      const timer = setTimeout(() => {
        setLoading(false)
        // Initialize abstract content when research is loaded
        setAbstractContent(research.abstract || "")
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [research])

  // Show a message if no research is selected
  if (!research) {
    return (
      <div className="bg-white p-4 rounded-lg border-grey border text-center mt-12">
        Select a research paper to view its details.
      </div>
    )
  }

  // Show skeletons while loading
  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg border-grey border mt-12">
        <h3 className="text-xl font-semibold mb-3">
          <Skeleton width={150} />
        </h3>
        <table className="min-w-full border-collapse">
          <tbody>
            {[...Array(10)].map((_, index) => (
              <tr key={index} className="border-b border-grey">
                <td className="px-1 py-1 font-semibold capitalize" style={{ width: "40%" }}>
                  <Skeleton width={80} />
                </td>
                <td className="px-1 py-1 text-sm">
                  <Skeleton width={150} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3 flex justify-center">
          <Skeleton width={100} height={35} borderRadius={20} />
        </div>
      </div>
    )
  }

  // Handle abstract modification with Supabase update
  const handleModifyAbstract = async (newAbstract) => {
    setUpdateStatus({ loading: true, error: null })

    try {
      // Update the abstract in Supabase
      const { data, error } = await supabase
        .from("research")
        .update({ abstract: newAbstract })
        .eq("researchID", research.researchID)

      if (error) throw error

      // Update local state
      setAbstractContent(newAbstract)

      // Notify parent component about the update if needed
      if (onResearchUpdate) {
        onResearchUpdate({
          ...research,
          abstract: newAbstract,
        })
      }

      setUpdateStatus({ loading: false, error: null })
      setModifyOpen(false)
    } catch (error) {
      console.error("Error updating abstract:", error)
      setUpdateStatus({ loading: false, error: error.message })
      // You might want to show an error message to the user here
    }
  }

  const researchDetails = {
    title: research.title || "N/A",
    author: Array.isArray(research.author) ? research.author.join(', ') : (research.author ?? '').split(';').join(', ') || 'N/A',
    college: research.college || "N/A",
    department: research.department || "N/A",
    abstract: abstractContent || "N/A", // Use the state variable instead of research.abstract
    researchCallNum: research.researchCallNum || "N/A",
    keywords: Array.isArray(research.keywords) ? research.keywords.join(', ') : (research.keywords ?? '').split(';').join(', ') || 'N/A',
    pubDate: research.pubDate || "N/A",
    location: research.location || "N/A",
    researchID: research.researchID || "N/A"
  };

  // Navigate to modify research page with query parameters
  const handleModifyResearch = () => {
    const queryParams = new URLSearchParams(researchDetails).toString()
    navigate(`/admin/researchmodify?${queryParams}`)
  }

  return (
    <div className="">
      <div className="flex justify-center gap-2">
        <button
          className="add-book w-full mb-2 px-2 py-2 rounded-lg border-grey hover:bg-arcadia-red hover:text-white"
          onClick={handleModifyResearch}
        >
          Modify Research
        </button>
      </div>
      
      <div className="bg-white p-4 rounded-lg border-grey border w-full">
        <h3 className="text-2xl font-semibold mb-2">Research Preview</h3>
        <table className="min-w-full border-collapse">
          <tbody>
            {Object.entries(researchDetails)
            .filter(([key]) => !["researchID"].includes(key))
            .map(([key, value], index) => (
              <tr key={index} className="border-b border-grey">
                <td className="px-1 py-1 font-semibold capitalize w-1/3">
                  {key === "pubdate"
                      ? "Pub. Year:"
                    : key === "researchCallNum"
                      ? "Call No."
                      : key.replace(/([A-Z])/g, " $1") + ":"}
                </td>
                <td className="px-1 py-1 text-sm break-words w-2/3">
                  {key === "abstract" ? (
                    <div className="flex gap-2 items-center">
                      <span>{value ? value.substring(0, 100) + (value.length > 100 ? "..." : "") : "N/A"}</span> {/* Display a preview */}
                      <button
                        className="border border-grey px-2 py-0.5 rounded-xl hover:bg-grey transition-all duration-300 ease-in-out hover:shadow-md"
                        onClick={() => setViewOpen(true)}
                      >
                        View
                      </button>
                    </div>
                  ) : (
                    <span>{value || "N/A"}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Status message for database updates */}
        {updateStatus.error && (
          <div className="mt-2 p-2 bg-red-100 text-red-700 rounded-md">
            Error updating abstract: {updateStatus.error}
          </div>
        )}
      </div>

      {/* Abstract Modals */}
      <ViewAbstract isOpen={isViewOpen} onClose={() => setViewOpen(false)} abstractContent={abstractContent} />

      <ModifyAbstract
        isOpen={isModifyOpen}
        onClose={() => setModifyOpen(false)}
        onModify={handleModifyAbstract}
        initialAbstract={abstractContent}
        isUpdating={updateStatus.loading}
      />
    </div >
  )
}

export default ResearchPreviewInv

