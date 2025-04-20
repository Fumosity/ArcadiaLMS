import { useEffect, useRef, useState } from "react"
import { addBook, generateNewBookID, generateProcDate } from "../../backend/ABAddBackend.jsx"
import { supabase } from "../../supabaseClient.js"
import { v4 as uuidv4 } from "uuid"
import { toast } from "react-toastify"

//Main Function
const ABAdding = ({ formData, setFormData }) => {
  const fileInputRef = useRef(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cover, setCover] = useState("")
  const [validationErrors, setValidationErrors] = useState({})
  const [genres, setGenres] = useState([])
  const [selectedGenres, setSelectedGenres] = useState([])
  const [categoryFilter, setCategoryFilter] = useState(null)
  const [loading, setLoading] = useState(true)

  // Define the error style for validation
  const errorStyle = { border: "2px solid red" }

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

    const { data, error } = await supabase.storage.from("book-covers").upload(filePath, coverFile, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Error uploading image: ", error)
    } else {
      const { data: publicData, error: urlError } = supabase.storage.from("book-covers").getPublicUrl(filePath)

      if (urlError) {
        console.error("Error getting public URL: ", urlError.message)
      } else {
        setFormData({ ...formData, cover: publicData.publicUrl })
        setValidationErrors((prevErrors) => ({ ...prevErrors, cover: false }))
      }
    }
  }

  //Opens file upload window on click
  const handleDivClick = () => {
    fileInputRef.current.click()
  }

  //Generate a new bookID and procDate
  useEffect(() => {
    const fetchGenres = async () => {
      const { data, error } = await supabase.from("genres").select("genreID, genreName, category")
      if (error) {
        console.error("Error fetching genres:", error)
      } else {
        const sortedData = data.sort((a, b) => {
          return a.genreName.localeCompare(b.genreName); 
        });
        console.log(data)
        setGenres(sortedData)
      }
      setLoading(false)
    }
    fetchGenres()

    generateNewBookID(setFormData)
    generateProcDate(setFormData)
  }, [setFormData])

  const handleCategoryChange = (category) => {
    setCategoryFilter(category)
    setSelectedGenres([]) // Reset genres when category changes
    setFormData((prev) => ({ ...prev, category, genres: [] }))
  }

  const toggleGenre = (genreID) => {
    setSelectedGenres((prev) => {
      const newSelection = prev.includes(genreID) ? prev.filter((id) => id !== genreID) : [...prev, genreID]

      // Update formData with selected genre names
      const selectedGenreNames = genres
        .filter((genres) => newSelection.includes(genres.genreID))
        .map((genres) => genres.genreName)

      setFormData((prev) => ({ ...prev, genres: selectedGenreNames }))
      return newSelection
    })
  }

  //Handles the submission to the database
  const handleSubmit = async () => {
    console.log("formData before validation:", formData)

    if (!formData || typeof formData !== "object") {
      console.error("formData is not defined or not an object.")
      toast.error("Error: Invalid form data", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      })
      return
    }

    const newValidationErrors = {}

    Object.keys(formData).forEach((field) => {
      const value = formData[field]

      if (!value || (Array.isArray(value) && value.length === 0)) {
        newValidationErrors[field] = true
      }
    })

    if (!formData.cover) {
      newValidationErrors.cover = true
    }

    if (Object.keys(newValidationErrors).length > 0) {
      setValidationErrors(newValidationErrors) // This ensures re-render with red borders
      console.log("something is wrong here at", newValidationErrors)
      toast.error("Please fill in all required fields", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      })
      return
    }

    setValidationErrors({})
    setIsSubmitting(true)

    console.log("pre addBook")
    const success = await addBook(formData)

    if (success) {
      toast.success("Book added successfully!", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      })
      setFormData({
        title: "",
        author: [],
        genres: [],
        category: [],
        publisher: "",
        synopsis: "",
        keywords: [],
        currentPubDate: "",
        originalPubDate: "",
        procurementDate: "",
        location: "",
        bookID: "",
        bookBarcode: "",
        isbn: "",
        cover: "",
        price: "",
        titleCallNum: "",
      })

      setCover("")
      setFormData((prevData) => ({ ...prevData, cover: "" }))

      if (fileInputRef.current) {
        fileInputRef.current.value = null
      }

      generateNewBookID(setFormData)
      generateProcDate(setFormData)
    } else {
      toast.error("Failed to add book. Please try again.", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      })
    }

    console.log("post addBook")
    console.log(formData)

    setIsSubmitting(false)
  }

  //Form
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border border-grey rounded-lg p-4 w-full h-fit">
        <h2 className="text-2xl font-semibold mb-4">Book Adding</h2>
        <div className="flex">
          {/* Left Side: Form Section */}
          <div className="w-2/3">
            <p className="text-gray-600 mb-8">
              Data points marked with an asterisk (*) are autofilled. Use a semicolon (;) or comma (,) to add multiple
              authors and keywords.
            </p>

            <h3 className="text-xl font-semibold my-2">Book Title Information</h3>

            {/* Form Section */}
            <form className="space-y-2">
              <div className="flex justify-between items-center" key="title">
                <label className="w-1/4">Title:</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-2/3 px-3 py-1 rounded-full border border-grey"
                  value={formData.title}
                  onChange={handleChange}
                  style={validationErrors.title ? errorStyle : {}}
                  placeholder="Full Book Title"
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Authors:</label>
                <input
                  type="text"
                  name="author"
                  required
                  className="w-2/3 px-3 py-1 rounded-full border border-grey"
                  value={formData.author}
                  onChange={handleChange}
                  style={validationErrors.author ? errorStyle : {}}
                  placeholder="Author 1; Author 2; Author 3; ..."
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

              <div className="flex justify-between items-center">
                <label className="w-1/4">Genres:</label>

                {loading ? (
                  <p>Loading genres...</p>
                ) : (
                  <div className="flex flex-wrap gap-2 w-2/3">
                    {genres
                      .filter((genres) => genres.category === categoryFilter)
                      .map((genres) => (
                        <button
                          key={genres.genreID}
                          onClick={(e) => {
                            e.preventDefault()
                            toggleGenre(genres.genreID)
                          }}
                          className={`px-4 py-1 rounded-full text-sm transition-colors ${
                            selectedGenres.includes(genres.genreID)
                              ? "bg-arcadia-red border-arcadia-red border text-white"
                              : "border border-arcadia-red text-arcadia-red hover:bg-arcadia-red/5"
                          }`}
                        >
                          {genres.genreName}
                        </button>
                      ))}
                  </div>
                )}
                <input
                  type="text"
                  name="genres"
                  required
                  className="input-field w-2/3 p-2 border hidden"
                  value={formData.genres}
                  onChange={handleChange}
                  style={validationErrors.genres ? errorStyle : {}}
                />
              </div>

              <div className="flex justify-between items-center">
                <label className="w-1/4">Publisher:</label>
                <input
                  type="text"
                  name="publisher"
                  required
                  className="w-2/3 px-3 py-1 rounded-full border border-grey"
                  value={formData.publisher}
                  onChange={handleChange}
                  style={validationErrors.publisher ? errorStyle : {}}
                  placeholder="Publishing Company Name"
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Synopsis:</label>
                <textarea
                  name="synopsis"
                  required
                  className="w-2/3 px-3 py-1 rounded-2xl border border-grey min-h-24"
                  rows="3"
                  value={formData.synopsis}
                  onChange={handleChange}
                  style={validationErrors.synopsis ? errorStyle : {}}
                  placeholder="Book Synopsis"
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Keywords:</label>
                <input
                  type="text"
                  name="keywords"
                  required
                  className="w-2/3 px-3 py-1 rounded-full border border-grey"
                  value={formData.keywords}
                  onChange={handleChange}
                  style={validationErrors.keywords ? errorStyle : {}}
                  placeholder="Keyword 1; Keyword 2; Keyword 3; ..."
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Current Pub. Date:</label>
                <input
                  type="date"
                  name="currentPubDate"
                  required
                  className="w-2/3 px-3 py-1 rounded-full border border-grey"
                  value={formData.currentPubDate}
                  onChange={handleChange}
                  style={validationErrors.currentPubDate ? errorStyle : {}}
                  placeholder="Publishing Date of Current Edition"
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Original Pub. Date:</label>
                <input
                  type="date"
                  name="originalPubDate"
                  required
                  className="w-2/3 px-3 py-1 rounded-full border border-grey"
                  value={formData.originalPubDate}
                  onChange={handleChange}
                  style={validationErrors.originalPubDate ? errorStyle : {}}
                  placeholder="Publishing Date of Original Edition"
                />
              </div>

              <div className="flex justify-between items-center">
                <label className="w-1/4">Location:</label>
                <input
                  type="text"
                  name="location"
                  required
                  className="w-2/3 px-3 py-1 rounded-full border border-grey"
                  value={formData.location}
                  onChange={handleChange}
                  style={validationErrors.location ? errorStyle : {}}
                  placeholder="Book Location"
                />
              </div>

              <div className="justify-between items-center hidden">
                <label className="w-1/4">Database ID*:</label>
                <input
                  type="text"
                  name="bookID"
                  required
                  className="w-2/3 px-3 py-1 rounded-full border border-grey"
                  value={formData.bookID}
                  onChange={handleChange}
                  style={validationErrors.bookID ? errorStyle : {}}
                  placeholder="Database ID"
                />
              </div>

              <div className="flex justify-between items-center">
                <label className="w-1/4">Call No.:</label>
                <input
                  type="text"
                  name="titleCallNum"
                  required
                  className="w-2/3 px-3 py-1 rounded-full border border-grey"
                  value={formData.titleCallNum}
                  onChange={handleChange}
                  style={validationErrors.titleCallNum ? errorStyle : {}}
                  placeholder="Book Title Call Number"
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">ISBN:</label>
                <input
                  type="text"
                  name="isbn"
                  required
                  className="w-2/3 px-3 py-1 rounded-full border border-grey"
                  value={formData.isbn}
                  onChange={handleChange}
                  style={validationErrors.isbn ? errorStyle : {}}
                  placeholder="ISBN Number"
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Price:</label>
                <input
                  type="number"
                  name="price"
                  required
                  className="w-2/3 px-3 py-1 rounded-full border border-grey"
                  value={formData.price}
                  onChange={handleChange}
                  style={validationErrors.price ? errorStyle : {}}
                  placeholder="Market Price"
                />
              </div>

              <h3 className="text-xl font-semibold py-2">Book Information of First Copy</h3>

              <div className="flex justify-between items-center">
                <label className="w-1/4">Barcode:</label>
                <input
                  type="text"
                  name="bookBarcode"
                  required
                  className="w-2/3 px-3 py-1 rounded-full border border-grey"
                  value={formData.bookBarcode}
                  onChange={handleChange}
                  style={validationErrors.bookBarcode ? errorStyle : {}}
                  placeholder="Unique Barcode"
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Date Procured:</label>
                <input
                  type="date"
                  name="procurementDate"
                  required
                  className="w-2/3 px-3 py-1 rounded-full border border-grey"
                  value={formData.procurementDate}
                  onChange={handleChange}
                  style={validationErrors.procurementDate ? errorStyle : {}}
                  placeholder="Procurement Date of First Copy"
                />
              </div>
            </form>
          </div>

          {/* Right Side: Book Cover Placeholder */}
          <div className="flex flex-col items-center px-2 w-1/3">
            <label className="text-md mb-2">Book Cover:</label>
            <div className="w-full h-fit flex justify-center">
              <div
                className={`border p-4 w-fit rounded-lg hover:bg-light-gray transition ${
                  validationErrors.cover ? "border-red border-2" : "border-grey"
                }`}
                onClick={handleDivClick}
              >
                <img
                  src={formData.cover || "/image/book_research_placeholder.png"}
                  alt="Book cover placeholder"
                  className={`h-[375px] w-[225px] object-cover rounded-lg ${
                    validationErrors.cover ? "border-red border-2" : "border border-grey"
                  }`}
                />
              </div>
            </div>
            <p className="text-sm text-gray-500 text-center m-2">Click to change book cover</p>

            <input
              type="file"
              ref={fileInputRef}
              required
              className="hidden"
              onChange={uploadCover}
              accept="image/png, image/jpeg, image/jpg"
            />
          </div>
        </div>
        {/* Add Book Button */}
        <div className="flex justify-center mt-8">
          <button
            type="button"
            onClick={handleSubmit}
            className="add-book w-1/4 mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
          >
            {isSubmitting ? "Submitting..." : "Add Book"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ABAdding
