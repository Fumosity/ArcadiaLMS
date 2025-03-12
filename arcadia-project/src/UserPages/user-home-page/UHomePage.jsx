import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import UNavbar from "../../components/UserComponents/user-main-comp/UNavbar"
import Recommended from "../../components/UserComponents/user-home-comp/Recommended"
import InterestedGenre from "../../components/UserComponents/user-home-comp/InterestedGenre"
import UHero from "../../components/UserComponents/user-home-comp/UHero"
import MostPopular, { fetchMostPopularBooks } from "../../components/UserComponents/user-home-comp/MostPopular"
import HighlyRated, { fetchHighlyRatedBooks } from "../../components/UserComponents/user-home-comp/HighlyRated"
import ArcOpHr from "../../components/UserComponents/user-home-comp/ArcOpHr"
import UpEvents from "../../components/UserComponents/user-home-comp/UpEvents"
import Services from "../../components/UserComponents/user-main-comp/Services"
import MostPopBk from "../../components/UserComponents/user-main-comp/MostPopBk"
import HighestRatedBk from "../../components/UserComponents/user-main-comp/HIghestRatedBk"
import SearchByGenre from "../../components/UserComponents/user-genre-cat/SearchByGenre"
import GenrePage from "../../components/UserComponents/user-genre-cat/GenrePage"
import SeeMore from "../../components/UserComponents/user-home-comp/SeeMore"
import SeeMoreGenres from "../../components/UserComponents/user-home-comp/SeeMoreGenres"

const UHomePage = () => {
  const [selectedGenre, setSelectedGenre] = useState(null)
  const [seeMoreComponent, setSeeMoreComponent] = useState(null)
  const [seeMoreGenresComponent, setSeeMoreGenresComponent] = useState(null)

  // Get location to check for query parameters
  const location = useLocation()

  // Check URL query parameters on component mount
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const view = queryParams.get("view")

    // If the view parameter is 'highlyRated', show the expanded HighlyRated component
    if (view === "highlyRated") {
      setSeeMoreComponent({
        title: "Highly Rated",
        fetchBooks: fetchHighlyRatedBooks,
        onGenreClick: handleGenreClick,
      })
    }
    if (view === "mostPopular") {
      setSeeMoreComponent({
        title: "Most Popular",
        fetchBooks: fetchMostPopularBooks,
        onGenreClick: handleGenreClick,
      })
    }
  }, [location])

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre)
    console.log("selected genre", genre)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleBackClick = () => {
    setSelectedGenre(null)
    setSeeMoreComponent(null)
    setSeeMoreGenresComponent(null)
    window.scrollTo({ top: 0, behavior: "smooth" })

    // Clear the URL query parameter when going back
    const url = new URL(window.location)
    url.searchParams.delete("view")
    window.history.pushState({}, "", url)
  }

  const handleSeeMoreClick = (component, fetchFunction) => {
    if (typeof fetchFunction !== "function") {
      console.error("fetchFunction is not a function", fetchFunction)
      return
    }
    setSeeMoreComponent({
      title: component,
      fetchBooks: fetchFunction,
      onGenreClick: handleGenreClick,
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSeeMoreGenresClick = (component, fetchData) => {
    setSeeMoreGenresComponent({
      title: component,
      fetchAllGenres: fetchData,
      onGenreClick: handleGenreClick, // Pass onGenreClick
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-light-white">
      <UNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Content Container */}
        <div className="userContent-container flex flex-col lg:flex-row gap-8 justify-center items-start">
          {/* Sidebar */}
          <div className="lg:w-1/4 md:w-1/3 w-full space-y-4">
            <ArcOpHr />
            <UpEvents />
            <Services />
            <MostPopBk onSeeMoreClick={(title, fetchFunc) => handleSeeMoreClick(title, fetchFunc)} />
            <HighestRatedBk onSeeMoreClick={(title, fetchFunc) => handleSeeMoreClick(title, fetchFunc)} />
          </div>

          {/* Main Content */}
          <div className="userMain-content lg:w-3/4 w-full ml-5">
            {selectedGenre ? (
              <GenrePage selectedGenre={selectedGenre} onBackClick={handleBackClick} />
            ) : seeMoreComponent ? (
              <SeeMore
                selectedComponent={seeMoreComponent.title}
                onBackClick={handleBackClick}
                fetchBooks={seeMoreComponent.fetchBooks}
              />
            ) : seeMoreGenresComponent ? (
              <SeeMoreGenres
                onGenreClick={handleGenreClick}
                selectedComponent={seeMoreGenresComponent.title}
                onBackClick={handleBackClick}
                fetchAllGenres={seeMoreGenresComponent.fetchAllGenres}
              />
            ) : (
              <>
                <UHero />
                <SearchByGenre
                  onGenreClick={handleGenreClick}
                  onSeeMoreGenresClick={(title, fetchData) => handleSeeMoreGenresClick(title, fetchData)}
                />
                <Recommended onSeeMoreClick={(title, fetchFunc) => handleSeeMoreClick(title, fetchFunc)} />
                <InterestedGenre onSeeMoreClick={(title, fetchFunc) => handleSeeMoreClick(title, fetchFunc)} />
                <MostPopular onSeeMoreClick={(title, fetchFunc) => handleSeeMoreClick(title, fetchFunc)} />
                <HighlyRated onSeeMoreClick={(title, fetchFunc) => handleSeeMoreClick(title, fetchFunc)} />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default UHomePage

