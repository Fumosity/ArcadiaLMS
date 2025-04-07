import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import WrngDeleteGenre from "../../z_modals/warning-modals/WrngDeleteGenre"
import { supabase } from "../../supabaseClient"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"

const GenrePreview = ({ genre, onGenreDeleted }) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  // Simulate loading effect when a genre is selected
  useEffect(() => {
    if (genre) {
      // Simulate a delay to show the skeleton effect
      const timer = setTimeout(() => setLoading(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [genre])

  // Show a message if no genre is selected
  if (!genre) {
    return (
      <div className="bg-white p-4 rounded-lg border-grey border text-center mt-12">
        Select a genre to view its details.
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
        <div className="relative bg-white p-2 mb-4 rounded-lg">
          <Skeleton height={200} width={150} className="mx-auto mb-2 rounded" />
        </div>
        <table className="min-w-full border-collapse">
          <tbody>
            {[...Array(3)].map((_, index) => (
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
      </div>
    )
  }

  const genreDetails = {
    genreID: genre.genreID,
    genre: genre.genreName,
    category: genre.category,
    description: genre.description,
    img: genre.img,
  }

  // Create a function to handle navigation
  const handleModifyGenre = () => {
    console.log("Genre ID in GenrePreview:", genreDetails.genreID)
    const queryParams = new URLSearchParams(genreDetails).toString()
    navigate(`/admin/genremodify?${queryParams}`)
  }

  // Function to open the delete confirmation modal
  const handleDeleteGenre = () => {
    setIsDeleteModalOpen(true)
  }

  // Function to handle the actual deletion
  const confirmDeleteGenre = async () => {
    try {
      // Delete the genre from Supabase
      const { error } = await supabase
        .from("genres") // Assuming your table is called "genres"
        .delete()
        .eq("genreID", genreDetails.genreID)

      if (error) throw error

      // Close the modal
      setIsDeleteModalOpen(false)

      toast.success("Genre successfully deleted.", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: "colored",

      })
      // alert("Genre successfully deleted.")
      setTimeout(() => {
        window.location.reload()
      }, 0)

      // Notify parent component that genre was deleted
      if (onGenreDeleted) {
        onGenreDeleted(genreDetails.genreID)
      }

      // Navigate back to the genres list
      navigate("/admin/genremanagement")
    } catch (error) {
      console.error("Error deleting genre:", error)
      alert("An unexpected error occurred while deleting the genre.")
      setIsDeleteModalOpen(false)
    }
  }

  return (
    <div className="">
      <div className="flex justify-center gap-2">
        <button
          className="add-book w-full mb-2 px-2 py-2 rounded-lg border-grey hover:bg-arcadia-red hover:text-white"
          onClick={handleModifyGenre}
        >
          Modify Selected Genre
        </button>
        <button
          className="add-book w-full mb-2 px-2 py-2 rounded-lg border-grey hover:bg-arcadia-red hover:text-white"
          onClick={handleDeleteGenre}
        >
          Delete Selected Genre
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg border-grey border w-full">
        <h3 className="text-2xl font-semibold mb-4">Genre Preview</h3>
        <div className="w-full h-fit flex justify-center">
          <div className="border border-grey p-4 w-full rounded-lg hover:bg-light-gray transition">
            <img
              src={genre.img || "image/book_research_placeholder.png"}
              alt="genre img"
              className="h-[250px] w-full object-cover rounded-lg border border-grey"
            />
          </div>
        </div>
        <table className="w-full border-collapse">
          <tbody>
            {Object.entries(genreDetails)
              .filter(([key]) => !["genreID", "img"].includes(key)) // Exclude multiple keys
              .map(([key, value], index) => (
                <tr key={index} className="border-b border-grey">
                  <td className="px-1 py-1 font-semibold capitalize align-top" style={{ width: '30%' }}>
                    {key.replace(/([A-Z])/g, " $1")}:
                  </td>
                  <td className="px-1 py-1 text-sm w-full text-right">
                    {key === 'description' ? (
                      <div className="text-justify">{value}</div>
                    ) : (
                      value
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <WrngDeleteGenre
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteGenre}
        itemName={genreDetails.genre}
      />
    </div>
  )
}

export default GenrePreview