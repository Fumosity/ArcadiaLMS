"use client"

import { useState } from "react"
import UNavbar from "../../components/UserComponents/user-main-comp/UNavbar"
import Recommended from "../../components/UserComponents/user-home-comp/Recommended"
import InterestedGenre from "../../components/UserComponents/user-home-comp/InterestedGenre"
import UHero from "../../components/UserComponents/user-home-comp/UHero"
import MostPopular from "../../components/UserComponents/user-home-comp/MostPopular"
import HighlyRated from "../../components/UserComponents/user-home-comp/HighlyRated"
import ArcOpHr from "../../components/UserComponents/user-home-comp/ArcOpHr"
import UpEvents from "../../components/UserComponents/user-home-comp/UpEvents"
import Services from "../../components/UserComponents/user-main-comp/Services"
import MostPopBk from "../../components/UserComponents/user-main-comp/MostPopBk"
import HighestRatedBk from "../../components/UserComponents/user-main-comp/HIghestRatedBk"
import SearchByGenre from "../../components/UserComponents/user-genre-cat/SearchByGenre"
import GenrePage from "../../components/UserComponents/user-genre-cat/GenrePage"
import SeeMore from "../../components/UserComponents/user-home-comp/SeeMore"

const UHomePage = () => {
  const [selectedGenre, setSelectedGenre] = useState(null)
  const [seeMoreComponent, setSeeMoreComponent] = useState(null)

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre)
  }

  const handleBackClick = () => {
    setSelectedGenre(null)
    setSeeMoreComponent(null)
  }

  const handleSeeMoreClick = (component, fetchFunction) => {
    setSeeMoreComponent({ title: component, fetchBooks: fetchFunction })
  }

  return (
    <div className="min-h-screen bg-light-white">
      <UNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Content Container */}
        <div className="userContent-container flex flex-col lg:flex-row gap-8 justify-center items-start">
          {/* Sidebar */}
          <div className="lg:w-1/4 md:w-1/3 w-full space-y-8 mr-5">
            <ArcOpHr />
            <UpEvents />
            <Services />
            <MostPopBk />
            <HighestRatedBk />
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
            ) : (
              <>
                <UHero />
                <SearchByGenre onGenreClick={handleGenreClick} />
                <Recommended
                  onSeeMoreClick={(fetchFunction) => handleSeeMoreClick("Recommended for You", fetchFunction)}
                />
                <InterestedGenre
                  onSeeMoreClick={(fetchFunction) => handleSeeMoreClick("Because You Like", fetchFunction)}
                />
                <MostPopular onSeeMoreClick={(fetchFunction) => handleSeeMoreClick("Most Popular", fetchFunction)} />
                <HighlyRated onSeeMoreClick={(fetchFunction) => handleSeeMoreClick("Highly Rated", fetchFunction)} />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default UHomePage

