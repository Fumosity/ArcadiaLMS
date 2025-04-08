import { useNavigate } from "react-router-dom"
import "react-loading-skeleton/dist/skeleton.css"

const AGAddPreview = ({ formData }) => {
  const navigate = useNavigate()

  const genreDetails = {
    genreName: formData.genre, // pinalitan ko formData.genreName to formData.genre
    category: formData.category,
    description: formData.description,
    img: formData.img,
  }

  // Create a function to handle navigation
  const handleModifyGenre = () => {
    console.log("Genre ID in GenrePreview:", genreDetails.genreName)
    const queryParams = new URLSearchParams(genreDetails).toString()
    navigate(`/admin/genremodify?${queryParams}`)
  }

  return (
    <div className="w-full">
      <div className="bg-white p-4 rounded-lg border-grey border w-full mt-12">
        <h3 className="text-2xl font-semibold mb-4">Genre Preview</h3>
        <div className="w-full h-fit flex justify-center">
          <div className="border border-grey p-4 w-full rounded-lg  hover:bg-light-gray transition">
            <img
              src={genreDetails.img || "/image/book_research_placeholder.png"}
              alt="genre img"
              className="h-[250px] w-full object-cover rounded-lg border border-grey"
            />
          </div>
        </div>
        <table className="w-full border-collapse">
          <tbody>
            {Object.entries(genreDetails)
              .filter(([key]) => key !== "img")
              .map(([key, value], index) => (
                <tr key={index} className="border-b border-grey">
                  <td className="px-1 py-1 font-semibold capitalize">
                    {key === "genreName" ? ["Genre"] : key.replace(/([A-Z])/g, " $1")}:
                  </td>
                  <td className={`px-1 py-1 text-sm w-full text-right ${key === "description" ? "text-justify" : ""}`}>
                    {value}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AGAddPreview
