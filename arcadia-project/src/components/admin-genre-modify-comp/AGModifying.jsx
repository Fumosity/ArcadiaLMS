import { useEffect, useRef, useState } from "react"
import { supabase } from "../../supabaseClient.js"
import { v4 as uuidv4 } from "uuid"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

//Main Function
const AGModifying = ({ formData, setFormData }) => {
  const fileInputRef = useRef(null)
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [img, setImg] = useState("")
  const [validationErrors, setValidationErrors] = useState({})
  const [genres, setGenres] = useState([])
  const [selectedGenres, setSelectedGenres] = useState([])
  const [categoryFilter, setCategoryFilter] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const initialFormData = {
      genre: params.get("genre") || "",
      category: params.get("category") || "",
      description: params.get("description") || "",
      img: params.get("img") || "",
      genreID: params.get("genreID") || "",
    }

    setFormData(initialFormData)
    setCategoryFilter(initialFormData.category || null)
  }, [location.search, setFormData])

  //Aggregates form inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })

    if (e.target.value) {
      setValidationErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: false }))
    }
  }

  //Holds and sends the uploaded cover image when submitted
  const uploadCover = async (e) => {
    const coverFile = e.target.files[0]
    const filePath = `${uuidv4()}_${coverFile.name}`

    const { data, error } = await supabase.storage.from("genre-img").upload(filePath, coverFile, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Error uploading image: ", error)
    } else {
      const { data: publicData, error: urlError } = supabase.storage.from("genre-img").getPublicUrl(filePath)

      if (urlError) {
        console.error("Error getting public URL: ", urlError.message)
      } else {
        setFormData({ ...formData, img: publicData.publicUrl })
        setValidationErrors((prevErrors) => ({ ...prevErrors, img: false }))
      }
    }
  }

  //Opens file upload window on click
  const handleDivClick = () => {
    fileInputRef.current.click()
  }

  const handleCategoryChange = (category) => {
    setCategoryFilter(category)
    setFormData((prev) => ({ ...prev, category }))
  }

  const errorStyle = {
    border: "1px solid red",
  }

  const handleReset = async () => {
    const params = new URLSearchParams(location.search)
    const initialFormData = {
      genre: params.get("genre") || "",
      category: params.get("category") || "",
      description: params.get("description") || "",
      img: params.get("img") || "",
      genreID: params.get("genreID") || "",
    }

    console.log(initialFormData)

    setFormData(initialFormData)
    setCategoryFilter(initialFormData.category || null)
  }

  //Handles the submission to the database
  const handleModify = async () => {
    console.log("formData before validation:", formData)

    if (!formData || typeof formData !== "object" || !formData.genreID) {
      console.error("Invalid form data or missing genreID.")
      return
    }

    const newValidationErrors = {}

    Object.keys(formData).forEach((field) => {
      const value = formData[field]
      if (!value || (Array.isArray(value) && value.length === 0)) {
        newValidationErrors[field] = true
      }
    })

    if (!formData.img) {
      newValidationErrors.img = true
    }

    if (Object.keys(newValidationErrors).length > 0) {
      setValidationErrors(newValidationErrors)
      console.log("Validation errors:", newValidationErrors)
      return
    }

    setValidationErrors({})
    setIsSubmitting(true)

    const { genreID, genre, ...otherData } = formData

    // Map 'genre' to 'genreName' for database compatibility
    const updateData = {
      ...otherData,
      genreName: genre,
    }

    try {
      console.log("Updating genre with data:", updateData)

      // 🔹 Step 1: Update the genre in the database
      const { error: updateError } = await supabase.from("genres").update(updateData).eq("genreID", genreID)

      if (updateError) {
        console.error("Error updating genre:", updateError)
        return
      }

      toast.success("Genre updated successfully!", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: "colored",
      })

      console.log("Genre updated successfully!")
      setTimeout(() => {
        navigate("/admin/genremanagement")
      }, 0)

      setImg("")
      setFormData((prevData) => ({ ...prevData, img: "" }))

      if (fileInputRef.current) {
        fileInputRef.current.value = null
      }
    } catch (error) {
      console.error("Unexpected error during modification:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  //Form
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border border-grey rounded-lg p-4 w-full h-fit">
        <h2 className="text-2xl font-semibold mb-4">Genre Modifying</h2>
        <div className="flex">
          {/* Left Side: Form Section */}
          <div className="w-full">
            <div className="flex flex-col items-center px-2 w-full">
              <div className="w-full h-fit flex justify-center">
                <div
                  className="border border-grey p-4 w-full rounded-lg  hover:bg-light-gray transition"
                  onClick={handleDivClick}
                >
                  <img
                    src={formData.img || "/image/book_research_placeholder.png"}
                    alt="Genre img placeholder"
                    className="h-[250px] w-full object-cover rounded-lg border border-grey"
                  />
                </div>
              </div>
              <p className="text-sm text-gray-500 text-center m-2">Click to change genre image</p>

              <input
                type="file"
                ref={fileInputRef}
                required
                className="hidden"
                onChange={uploadCover}
                accept="image/png, image/jpeg, image/jpg"
              />
            </div>
            {/* Form Section */}
            <form className="space-y-2">
              <div className="flex justify-between items-center" key="genre">
                <label className="w-1/3">Genre:</label>
                <input
                  type="text"
                  name="genre"
                  required
                  className="w-2/3 px-3 py-1 rounded-full border border-grey"
                  value={formData.genre}
                  onChange={handleChange}
                  style={validationErrors.genre ? errorStyle : {}}
                />
              </div>

              <div className="flex justify-between items-center">
                <label className="w-1/4">Category:</label>
                {/* Category selection buttons */}
                <div className="flex gap-4 w-2/3">
                  {["Fiction", "Non-fiction"].map((category) => (
                    <button
                      key={category}
                      onClick={(e) => {
                        e.preventDefault()
                        handleCategoryChange(category)
                      }}
                      className={`px-4 py-1 rounded-full w-full text-sm transition-colors ${
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

              <div className="flex justify-between items-center" key="description">
                <label className="w-1/3">Description:</label>
                <input
                  type="text"
                  name="description"
                  required
                  className="w-2/3 px-3 py-1 rounded-full border border-grey"
                  value={formData.description}
                  onChange={handleChange}
                  style={validationErrors.description ? errorStyle : {}}
                />
              </div>
            </form>
          </div>
        </div>
        {/* Add Book Button */}
        <div className="flex justify-center mt-8 gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="add-book w-1/4 mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
          >
            Reset Changes
          </button>
          <button
            type="button"
            onClick={handleModify}
            className="add-book w-1/4 mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default AGModifying
