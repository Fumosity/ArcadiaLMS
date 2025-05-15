import { useState, useEffect } from "react"
import { supabase } from "../../supabaseClient"
import { toast } from "react-toastify"

// Use the same bucket name as in LibraryServicesCMS.jsx
const STORAGE_BUCKET = "images" // Change this to match your existing bucket name

const DragDropReorder = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [draggedItem, setDraggedItem] = useState(null)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("library_services")
        .select("id, title, imageUrl, displayOrder")
        .order("displayOrder", { ascending: true })

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

  const handleDragStart = (e, index) => {
    setDraggedItem(index)
    // Make the drag image transparent
    e.dataTransfer.setDragImage(new Image(), 0, 0)
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    if (draggedItem === null) return

    // Don't do anything if hovering over the same item
    if (draggedItem === index) return

    const newServices = [...services]
    const draggedService = newServices[draggedItem]

    // Remove the dragged item
    newServices.splice(draggedItem, 1)
    // Insert it at the new position
    newServices.splice(index, 0, draggedService)

    // Update the display order for each item
    newServices.forEach((service, i) => {
      service.displayOrder = i + 1
    })

    setServices(newServices)
    setDraggedItem(index)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
  }

  const saveOrder = async () => {
    try {
      setSaving(true)

      // Prepare updates for each service
      const updates = services.map((service) => ({
        id: service.id,
        displayOrder: service.displayOrder,
      }))

      // Update each service in the database
      for (const update of updates) {
        const { error } = await supabase
          .from("library_services")
          .update({ displayOrder: update.displayOrder })
          .eq("id", update.id)

        if (error) throw error
      }

      // Show success message with toast
      toast.success("Service order updated successfully!", {
        position: "bottom-right",
        autoClose: 2000,
        onClose: () => window.location.reload(),
      })
    } catch (err) {
      console.error("Error saving order:", err)
      setError("Failed to save the new order")
      toast.error("Failed to save the new order", {
        position: "bottom-right",
        autoClose: 3000,
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Reorder Library Services</h2>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-grey"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="uMain-cont">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Reorder Library Services</h2>
        <button
          onClick={saveOrder}
          disabled={saving}
          className="bg-arcadia-red hover:bg-grey hover:text-black text-white px-4 py-2 rounded-md transition-colors disabled:bg-blue-300"
        >
          {saving ? "Saving..." : "Save Order"}
        </button>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <p className="text-sm text-gray-600 mb-4">
        Drag and drop items to reorder them. Click "Save Order" when you're done.
      </p>

      <div className="space-y-2">
        {services.map((service, index) => (
          <div
            key={service.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`flex items-center p-3 bg-white border rounded-lg cursor-move ${
              draggedItem === index ? "border-ongoing shadow-lg" : "border-grey"
            }`}
          >
            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full mr-3">
              {service.displayOrder}
            </div>
            {service.imageUrl && (
              <img
                src={service.imageUrl || "/placeholder.svg"}
                alt={service.title}
                className="h-12 w-16 object-cover rounded mr-4"
              />
            )}
            <div className="font-medium">{service.title}</div>
            <div className="ml-auto text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DragDropReorder
