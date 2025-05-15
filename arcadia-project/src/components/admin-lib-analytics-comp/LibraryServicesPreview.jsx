import React from "react"
import { useState, useEffect, useRef } from "react"
import { supabase } from "../../supabaseClient"

const LibraryServicesPreview = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedCards, setExpandedCards] = useState({})
  const [truncatedTexts, setTruncatedTexts] = useState({})

  // Refs for all service descriptions
  const descriptionRefs = useRef({})

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("library_services")
          .select("*")
          .order("displayOrder", { ascending: true })

        if (error) throw error
        setServices(data || [])
      } catch (err) {
        console.error("Error fetching services:", err)
        setError("Failed to load library services")
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  // Check if text is truncated by line-clamp
  const checkTruncation = () => {
    const newTruncatedState = {}

    Object.keys(descriptionRefs.current).forEach((id) => {
      const element = descriptionRefs.current[id].current
      if (!element) return

      // Store original state
      const originalLineClamp = element.style.webkitLineClamp
      const originalHeight = element.style.height
      const originalOverflow = element.style.overflow

      // Temporarily remove line clamp to get full height
      element.style.webkitLineClamp = "unset"
      element.style.height = "auto"
      element.style.overflow = "visible"
      const fullHeight = element.scrollHeight

      // Restore line clamp
      element.style.webkitLineClamp = originalLineClamp
      element.style.height = originalHeight
      element.style.overflow = originalOverflow

      // Get clamped height
      const clampedHeight = element.clientHeight

      // If full height is greater than clamped height, text is truncated
      newTruncatedState[id] = fullHeight > clampedHeight + 5 // Adding small buffer for precision
    })

    setTruncatedTexts(newTruncatedState)
  }

  // Toggle expanded card
  const toggleCardExpansion = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Assign refs on service load
  useEffect(() => {
    const newRefs = {}
    services.forEach((service) => {
      newRefs[service.id] = descriptionRefs.current[service.id] || React.createRef()
    })
    descriptionRefs.current = newRefs
  }, [services])

  // Check for truncation after render and window resize
  useEffect(() => {
    if (!loading && services.length > 0) {
      // Wait for render to complete
      const timer = setTimeout(() => {
        checkTruncation()
      }, 100)

      // Also check on window resize
      window.addEventListener("resize", checkTruncation)

      return () => {
        clearTimeout(timer)
        window.removeEventListener("resize", checkTruncation)
      }
    }
  }, [loading, services, descriptionRefs.current])

  if (loading) {
    return (
      <div className="uMain-cont">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Library Services</h2>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-grey"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="uMain-cont">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Library Services Preview</h2>
        </div>
        <div className="bg-red-100 border border-grey text-red-700 px-4 py-3 rounded mb-4">{error}</div>
      </div>
    )
  }

  return (
    <div className="uMain-cont">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Library Services Preview</h2>
      </div>

      <div className="space-y-6">
        {/* All services in a grid layout */}
        {services.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center">
            {services.map((service) => (
              <div
                key={service.id}
                className={`genCard-cont flex flex-col justify-between bg-white border border-grey rounded-lg p-4 w-full ${
                  expandedCards[service.id] ? "h-auto" : "h-[450px]"
                } transition-all duration-300`}
              >
                <div>
                  <img
                    src={service.imageUrl || "/placeholder.svg"}
                    alt={service.title}
                    className="w-full h-[300px] object-cover rounded-lg mb-2"
                  />
                  <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                  <p
                    ref={descriptionRefs.current[service.id]}
                    className={`text-sm text-gray-500 mb-1.5 text-justify ${expandedCards[service.id] ? "" : "line-clamp-3"}`}
                  >
                    {service.description}
                  </p>
                </div>
                {(truncatedTexts[service.id] || expandedCards[service.id]) && (
                  <button
                    onClick={() => toggleCardExpansion(service.id)}
                    className="text-sm text-arcadia-red text-left font-medium hover:underline mt-auto"
                  >
                    {expandedCards[service.id] ? "Hide" : "Read more"}
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">No library services available at the moment.</div>
        )}
      </div>
    </div>
  )
}

export default LibraryServicesPreview
