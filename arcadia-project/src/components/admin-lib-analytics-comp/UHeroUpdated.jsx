import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { supabase } from "../../supabaseClient"

const UHeroUpdated = () => {
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("hero_carousel")
          .select("*")
          .order("displayorder", { ascending: true }) // Changed to lowercase

        if (error) throw error
        setSlides(data || [])
      } catch (err) {
        console.error("Error fetching carousel slides:", err)
        setError("Failed to load carousel slides")
      } finally {
        setLoading(false)
      }
    }

    fetchSlides()
  }, [])

  useEffect(() => {
    if (slides.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [slides.length])

  // Fallback to default slides if none are found in the database
  const defaultSlides = [
    {
      image: "/image/arc1.JPG",
      title: (
        <>
          Explore ARC's
          <br />
          Services Now!
        </>
      ),
      description: <>View Different Services ARC has to offer</>,
      buttontext: "View Services", // Changed to lowercase
      link: "/user/services",
    },
    {
      image: "/image/arc3.JPG",
      title: (
        <>
          Browse the LPU-C <br /> Academic Resource Center
        </>
      ),
      description: <>Discover knowledge, explore resources, and reserve your favorite books today.</>,
      buttontext: "See the Book Catalog", // Changed to lowercase
      link: "/user/bookmanagement",
    },
    {
      image: "/image/arc2.JPG",
      title: <>Explore our Research Collection</>,
      description: <>Find the resources you need for your academic success.</>,
      buttontext: "View Research Catalog", // Changed to lowercase
      link: "/user/researchmanagement",
    },
    {
      image: "/image/arc6.JPG",
      title: (
        <>
          Reservation of Rooms <br />
          Now Available!
        </>
      ),
      description: "Reserve rooms for academic purposes.",
      buttontext: "View Available Rooms", // Changed to lowercase
      link: "/user/reservations",
    },
  ]

  const displaySlides = slides.length > 0 ? slides : defaultSlides
  const currentSlide = displaySlides[currentIndex]

  // Optional guard (useful if slides could ever be empty)
  if (!currentSlide) {
    return null // Or some fallback UI
  }

  return (
    <div className="uHero-cont">
      <section className="userHero relative overflow-hidden rounded-lg w-full h-[500px]">
        {displaySlides.map((slide, index) => (
          <img
            key={index}
            src={slide.image || "/placeholder.svg"}
            alt={`Hero Background ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100 z-0" : "opacity-0 z-0"
            }`}
          />
        ))}

        {/* Overlay content */}
        <div className="absolute inset-0 flex flex-col items-start justify-center text-center w-full h-full px-4 py-16 bg-black/50">
          <h1 className="justify-start text-left userHero-title pl-4 text-white text-4xl md:text-5xl font-bold mb-4">
            {typeof currentSlide.title === "string" ? (
              <span dangerouslySetInnerHTML={{ __html: currentSlide.title.replace(/\n/g, "<br />") }} />
            ) : (
              currentSlide.title
            )}
          </h1>
          <p className="userHero-text text-white pl-4 text-lg md:text-xl mb-6">
            {typeof currentSlide.description === "string" ? (
              <span dangerouslySetInnerHTML={{ __html: currentSlide.description.replace(/\n/g, "<br />") }} />
            ) : (
              currentSlide.description
            )}
          </p>
          <Link
            to={currentSlide.link}
            className="px-6 py-2 border border-white ml-4 rounded-full text-white hover:bg-arcadia-red hover:border-arcadia-red transition duration-300"
          >
            {currentSlide.buttontext}
          </Link>
        </div>
      </section>
    </div>
  )
}

export default UHeroUpdated
