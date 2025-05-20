import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { useUser } from "../../backend/UserContext"
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
import HighestRatedBk from "../../components/UserComponents/user-main-comp/HighestRatedBk"
import SearchByGenre from "../../components/UserComponents/user-genre-cat/SearchByGenre"
import GenrePage from "../../components/UserComponents/user-genre-cat/GenrePage"
import SeeMore from "../../components/UserComponents/user-home-comp/SeeMore"
import SeeMoreGenres from "../../components/UserComponents/user-home-comp/SeeMoreGenres"
import FeaturedBook from "../../components/admin-lib-analytics-comp/FeaturedBook"
import FeaturedResearch from "../../components/admin-lib-analytics-comp/FeaturedResearch"

const UHomePage = () => {
  useEffect(() => {
    document.title = "Arcadia | Home";
  }, []);
  const [selectedGenre, setSelectedGenre] = useState(null)
  const [seeMoreComponent, setSeeMoreComponent] = useState(null)
  const [seeMoreGenresComponent, setSeeMoreGenresComponent] = useState(null)
  const { user } = useUser()

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

  // Check if user is a guest
  const isGuest = user?.userAccountType === "Guest"

  return (
    <div className="min-h-screen bg-light-white">
      
      

      <div className="w-10/12 mx-auto py-8 userContent-container flex flex-col lg:flex-row justify-center justify-items-start">
        <div className="lg:w-1/4 lg:block md:hidden space-y-4 min-h-full">
          <ArcOpHr />
          <UpEvents />
          {/* Hide Services component for guest users */}
          {!isGuest && <Services />}
          <div className="space-y-4 sticky top-4">
            <MostPopBk onSeeMoreClick={(title, fetchFunc) => handleSeeMoreClick(title, fetchFunc)} />
            <HighestRatedBk onSeeMoreClick={(title, fetchFunc) => handleSeeMoreClick(title, fetchFunc)} />
          </div>
        </div>

        <div className="userMain-content lg:w-3/4 md:w-full">
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
              <div className="flex flex-row gap-4">
                <div className="w-1/2">
                  <FeaturedBook />
                </div>
                <div className="w-1/2">
                  <FeaturedResearch />
                </div>
              </div>
              {!isGuest && <Recommended onSeeMoreClick={(title, fetchFunc) => handleSeeMoreClick(title, fetchFunc)} />}
              {!isGuest && <InterestedGenre onSeeMoreClick={(title, fetchFunc) => handleSeeMoreClick(title, fetchFunc)} />}
              <MostPopular onSeeMoreClick={(title, fetchFunc) => handleSeeMoreClick(title, fetchFunc)} />
              <HighlyRated onSeeMoreClick={(title, fetchFunc) => handleSeeMoreClick(title, fetchFunc)} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default UHomePage