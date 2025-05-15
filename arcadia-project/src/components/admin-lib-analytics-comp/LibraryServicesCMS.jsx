import { useState, useEffect } from "react"
import { supabase } from "../../supabaseClient"
import { toast } from "react-toastify"

// Change this to match your existing bucket name
const STORAGE_BUCKET = "images" // Common default bucket name in Supabase

const LibraryServicesCMS = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentService, setCurrentService] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState("displayOrder")
  const [sortDirection, setSortDirection] = useState("asc")

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    displayOrder: 0,
  })

  // Fetch services from Supabase
  const fetchServices = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from("library_services")
        .select("*")
        .order(sortField, { ascending: sortDirection === "asc" })

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      }

      const { data, error } = await query

      if (error) throw error
      setServices(data || [])
    } catch (err) {
      console.error("Error fetching services:", err)
      setError("Failed to load library services")
      toast.error("Failed to load library services", {
        position: "bottom-right",
        autoClose: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [searchTerm, sortField, sortDirection])

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  // Open modal for creating a new service
  const handleAddNew = () => {
    setCurrentService(null)
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      displayOrder: services.length + 1,
    })
    setIsModalOpen(true)
  }

  // Open modal for editing an existing service
  const handleEdit = (service) => {
    setCurrentService(service)
    setFormData({
      title: service.title,
      description: service.description,
      imageUrl: service.imageUrl,
      displayOrder: service.displayOrder || 0,
    })
    setIsModalOpen(true)
  }

  // Open delete confirmation modal
  const handleDeleteClick = (service) => {
    setServiceToDelete(service)
    setIsDeleteModalOpen(true)
  }

  // Submit form to create or update a service
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)

      // Create a clean copy of the form data without any fields that might cause issues
      const cleanedFormData = {
        title: formData.title,
        description: formData.description,
        imageUrl: formData.imageUrl,
        displayOrder: formData.displayOrder,
      }

      if (currentService) {
        // Update existing service
        const { error } = await supabase.from("library_services").update(cleanedFormData).eq("id", currentService.id)

        if (error) throw error

        toast.success("Service updated successfully!", {
          position: "bottom-right",
          autoClose: 2000,
          onClose: () => window.location.reload(),
        })
      } else {
        // Create new service
        const { error } = await supabase.from("library_services").insert([cleanedFormData])

        if (error) throw error

        toast.success("Service created successfully!", {
          position: "bottom-right",
          autoClose: 2000,
          onClose: () => window.location.reload(),
        })
      }

      setIsModalOpen(false)
    } catch (err) {
      console.error("Error saving service:", err)
      setError(`Failed to save library service: ${err.message}`)
      toast.error(`Failed to save library service: ${err.message}`, {
        position: "bottom-right",
        autoClose: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  // Delete a service
  const handleDelete = async () => {
    if (!serviceToDelete) return

    try {
      setLoading(true)
      const { error } = await supabase.from("library_services").delete().eq("id", serviceToDelete.id)

      if (error) throw error

      setIsDeleteModalOpen(false)
      setServiceToDelete(null)

      toast.success("Service deleted successfully!", {
        position: "bottom-right",
        autoClose: 2000,
        onClose: () => window.location.reload(),
      })
    } catch (err) {
      console.error("Error deleting service:", err)
      setError("Failed to delete library service")
      toast.error("Failed to delete library service", {
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
      const filePath = `library-services/${fileName}`

      // Upload file to Supabase Storage using the specified bucket
      const { error: uploadError, data } = await supabase.storage.from(STORAGE_BUCKET).upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath)

      // Update form with the image URL
      setFormData({
        ...formData,
        imageUrl: urlData.publicUrl,
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
        <h1 className="text-2xl font-semibold">Library Services Management</h1>
        <button
          onClick={handleAddNew}
          className="bg-arcadia-red hover:bg-grey hover:text-black text-white px-4 py-2 rounded-md transition-colors"
        >
          Add New Service
        </button>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {/* Search and filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search services..."
            className="w-full px-4 py-2 border border-grey rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            onClick={() => setSearchTerm("")}
          >
            {searchTerm && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Services table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-grey rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("displayOrder")}
              >
                <div className="flex items-center">
                  Order
                  {sortField === "displayOrder" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
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
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-grey">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : services.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No library services found
                </td>
              </tr>
            ) : (
              services.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.displayOrder || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {service.imageUrl ? (
                      <img
                        src={service.imageUrl || "/placeholder.svg"}
                        alt={service.title}
                        className="h-16 w-24 object-cover rounded"
                      />
                    ) : (
                      <div className="h-16 w-24 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{service.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button onClick={() => handleEdit(service)} className="text-arcadia-red hover:underline">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteClick(service)} className="text-arcadia-red hover:underline">
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
              {currentService ? "Edit Library Service" : "Add New Library Service"}
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
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-greyrounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                  <div className="flex items-center space-x-4">
                    {formData.imageUrl && (
                      <img
                        src={formData.imageUrl || "/placeholder.svg"}
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
                        name="imageUrl"
                        value={formData.imageUrl}
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
                    name="displayOrder"
                    value={formData.displayOrder}
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
                  {loading ? "Saving..." : "Save Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && serviceToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete the service "{serviceToDelete.title}"? This action cannot be undone.
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

export default LibraryServicesCMS
