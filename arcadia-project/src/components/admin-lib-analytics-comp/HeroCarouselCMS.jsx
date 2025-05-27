import { useState, useEffect } from "react"
import { supabase } from "../../supabaseClient"
import { toast } from "react-toastify"

const STORAGE_BUCKET = "hero-images" // upload to this bucket

const HeroCarouselCMS = () => {
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [slideToDelete, setSlideToDelete] = useState(null)
  const [sortField, setSortField] = useState("displayorder")
  const [sortDirection, setSortDirection] = useState("asc")

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    buttontext: "", // Lowercase
    link: "",
    displayorder: 0, // Lowercase
  })

  // Fetch slides from Supabase
  const fetchSlides = async () => {
    try {
      setLoading(true)
      const query = supabase
        .from("hero_carousel")
        .select("*")
        .order(sortField, { ascending: sortDirection === "asc" }) // sortField is already lowercase

      const { data, error } = await query

      if (error) throw error
      setSlides(data || [])
    } catch (err) {
      console.error("Error fetching slides:", err)
      setError("Failed to load hero carousel slides")
      toast.error("Failed to load hero carousel slides", {
        position: "bottom-right",
        autoClose: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSlides()
  }, [sortField, sortDirection])

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  // Open modal for creating a new slide
  const handleAddNew = () => {
    setCurrentSlide(null)
    setFormData({
      title: "",
      description: "",
      image: "",
      buttontext: "", // Lowercase
      link: "",
      displayorder: slides.length + 1, // Lowercase
    })
    setIsModalOpen(true)
  }

  // Open modal for editing an existing slide
  const handleEdit = (slide) => {
    setCurrentSlide(slide)
    setFormData({
      title: slide.title,
      description: slide.description,
      image: slide.image,
      buttontext: slide.buttontext, // Lowercase
      link: slide.link,
      displayorder: slide.displayorder || 0, // Lowercase
    })
    setIsModalOpen(true)
  }

  // Open delete confirmation modal
  const handleDeleteClick = (slide) => {
    setSlideToDelete(slide)
    setIsDeleteModalOpen(true)
  }

  // Submit form to create or update a slide
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)

      // Create a clean copy of the form data
      const cleanedFormData = {
        title: formData.title,
        description: formData.description,
        image: formData.image,
        buttontext: formData.buttontext, // Lowercase
        link: formData.link,
        displayorder: formData.displayorder, // Lowercase
      }

      if (currentSlide) {
        // Update existing slide
        const { error } = await supabase.from("hero_carousel").update(cleanedFormData).eq("id", currentSlide.id)

        if (error) throw error

        toast.success("Slide updated successfully!", {
          position: "bottom-right",
          autoClose: 2000,
          onClose: () => fetchSlides(),
        })
      } else {
        // Create new slide
        const { error } = await supabase.from("hero_carousel").insert([cleanedFormData])

        if (error) throw error

        toast.success("Slide created successfully!", {
          position: "bottom-right",
          autoClose: 2000,
          onClose: () => fetchSlides(),
        })
      }

      setIsModalOpen(false)
    } catch (err) {
      console.error("Error saving slide:", err)
      setError(`Failed to save hero carousel slide: ${err.message}`)
      toast.error(`Failed to save hero carousel slide: ${err.message}`, {
        position: "bottom-right",
        autoClose: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  // Delete a slide
  const handleDelete = async () => {
    if (!slideToDelete) return

    try {
      setLoading(true)
      const { error } = await supabase.from("hero_carousel").delete().eq("id", slideToDelete.id)

      if (error) throw error

      setIsDeleteModalOpen(false)
      setSlideToDelete(null)

      toast.success("Slide deleted successfully!", {
        position: "bottom-right",
        autoClose: 2000,
        onClose: () => fetchSlides(),
      })
    } catch (err) {
      console.error("Error deleting slide:", err)
      setError("Failed to delete hero carousel slide")
      toast.error("Failed to delete hero carousel slide", {
        position: "bottom-right",
        autoClose: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Upload image to Supabase storage
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      setLoading(true)

      // Create a unique file name
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `hero-carousel/${fileName}`

      // Upload file to Supabase Storage using the specified bucket
      const { error: uploadError, data } = await supabase.storage.from(STORAGE_BUCKET).upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath)

      // Update form with the image URL
      setFormData({
        ...formData,
        image: urlData.publicUrl,
      })

      toast.success("Image uploaded successfully!", {
        position: "bottom-right",
        autoClose: 2000,
      })
    } catch (err) {
      console.error("Error uploading image:", err)
      setError(`Failed to upload image: ${err.message || "Unknown error"}`)
      toast.error(`Failed to upload image: ${err.message || "Unknown error"}`, {
        position: "bottom-right",
        autoClose: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="uMain-cont">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Hero Carousel Management</h1>
        <button
          onClick={handleAddNew}
          className="bg-arcadia-red hover:bg-grey hover:text-black text-white px-4 py-2 rounded-md transition-colors"
        >
          Add New Slide
        </button>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {/* Preview of current carousel */}
      {slides.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Current Carousel Preview</h2>
          <div className="relative overflow-hidden rounded-lg w-full h-[300px] bg-gray-200">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === 0 ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={slide.image || "/placeholder.svg?height=300&width=800"}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-start justify-center p-8">
                  <h3 className="text-white text-2xl font-bold mb-2">{slide.title}</h3>
                  <p className="text-white mb-4">{slide.description}</p>
                  <button className="px-4 py-2 border border-white rounded-full text-white hover:bg-arcadia-red hover:border-arcadia-red transition duration-300">
                    {slide.buttontext}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Slides table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-grey rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("displayorder")}
              >
                <div className="flex items-center">
                  Order
                  {sortField === "displayorder" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("title")}
              >
                <div className="flex items-center">
                  Title
                  {sortField === "title" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Button Text
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-grey">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : slides.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  No carousel slides found
                </td>
              </tr>
            ) : (
              slides.map((slide) => (
                <tr key={slide.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{slide.displayorder || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {slide.image ? (
                      <img
                        src={slide.image || "/placeholder.svg"}
                        alt={slide.title}
                        className="h-16 w-24 object-cover rounded"
                      />
                    ) : (
                      <div className="h-16 w-24 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{slide.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{slide.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{slide.buttontext}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">{slide.link}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button onClick={() => handleEdit(slide)} className="text-arcadia-red hover:underline">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteClick(slide)} className="text-arcadia-red hover:underline">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {currentSlide ? "Edit Carousel Slide" : "Add New Carousel Slide"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-grey rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="Enter slide title"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    You can use HTML tags like {"<br />"} for line breaks in the title
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-grey rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="Enter slide description"
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1">
                    You can use HTML tags like {"<br />"} for line breaks in the description
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                  <input
                    type="text"
                    name="buttontext"
                    value={formData.buttontext}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-grey rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="Enter button text (e.g., 'Learn More')"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                  <input
                    type="text"
                    name="link"
                    value={formData.link}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-grey rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="Enter link URL (e.g., '/user/services')"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                  <div className="flex items-center space-x-4">
                    {formData.image && (
                      <img
                        src={formData.image || "/placeholder.svg"}
                        alt="Preview"
                        className="h-24 w-36 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full px-3 py-2 border border-grey rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Or enter image URL directly:</p>
                      <input
                        type="text"
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-3 py-2 border border-grey rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    name="displayorder"
                    value={formData.displayorder}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-grey rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-grey rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-arcadia-red hover:bg-grey hover:text-black text-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Slide"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && slideToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete the slide "{slideToDelete.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-grey rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-arcadia-red hover:bg-grey hover:text-black text-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HeroCarouselCMS
