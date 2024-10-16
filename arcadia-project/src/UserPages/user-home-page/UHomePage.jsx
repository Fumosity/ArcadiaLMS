import React from "react";
import Header from "../../components/UserComponents/user-main-comp/header";

const UHomePage = () => {
  return (
    <div>
      <Header />
      {/* Navigation */}
      <div className="bg-white py-2 shadow-md">
        <nav className="flex justify-between items-center px-4">
          <div className="flex">
            <a href="#" className="userNav-link">Home</a>
            <a href="#" className="userNav-link">Books</a>
            <a href="#" className="userNav-link">Theses</a>
            <a href="#" className="userNav-link">Reservations</a>
            <a href="#" className="userNav-link">Cafe</a>
          </div>
          <div className="userAccount">
            <a href="#">Account</a>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="userHero bg-hero-image">
        <div className="userHero-overlay"></div>
        <div className="relative z-10">
          <h1 className="userHero-title">Welcome to Arcadia Library</h1>
          <p className="userHero-text">Discover knowledge, explore resources, and reserve your favorite books today.</p>
          <button className="userHero-button">Explore Now</button>
        </div>
      </section>

      {/* Search Section */}
      <section className="userSearch-section">
        <h2 className="userSearch-title">What are you looking for?</h2>
        <input type="text" className="userSearch-input" placeholder="Search for books, authors, or topics..." />

        <div className="userSearch-suggestions">
          <p>Try:</p>
          <div className="userSuggestion-buttons">
            <button className="userSuggestion-button">Option 1</button>
            <button className="userSuggestion-button">Option 2</button>
            <button className="userSuggestion-button">Option 3</button>
            <button className="userSuggestion-button">Option 4</button>
          </div>
        </div>
      </section>

      {/* Content Container */}
      <div className="userContent-container flex py-8 px-4 gap-8">
        {/* Sidebar */}
        <aside className="userSidebar w-1/4 bg-white p-4 rounded-lg">
          <h2 className="userSidebar-title">Latest News and Updates</h2>
          {/* 7 Vertical Cards */}
          {[...Array(7)].map((_, index) => (
            <div key={index} className="news-card bg-white p-4 mb-4 shadow-md rounded-md">
              <p>News update {index + 1}</p>
            </div>
          ))}
        </aside>

        {/* Main Content */}
        <div className="userMain-content w-3/4">
          {/* Recommended for You */}
          <section>
            <h2 className="userSection-title">Recommended for You</h2>
            <div className="flex gap-4 flex-wrap">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="userBook-card bg-white shadow-md rounded-md p-4 flex gap-4 mb-4 items-center">
                  <img
                    src="https://via.placeholder.com/80x120"
                    alt="Book Cover"
                    className="w-20 h-30 rounded-md" // Adjust size as needed
                  />
                  <div className="userBook-info">
                    <p className="userGenre hidden sm:block">Fiction</p>
                    <p className="userBook-title hidden sm:block">The Great Story</p>
                    <p className="userAuthor hidden sm:block">J. Doe</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Most Popular */}
          <section className="mt-8">
            <h2 className="userSection-title">Most Popular</h2>
            <div className="flex gap-4 flex-wrap">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="userBook-card bg-white shadow-md rounded-md p-4 flex gap-4 mb-4 items-center">
                  <img
                    src="https://via.placeholder.com/80x120"
                    alt="Book Cover"
                    className="w-20 h-30 rounded-md" // Adjust size as needed
                  />
                  <div className="userBook-info">
                    <p className="userGenre hidden sm:block">Thriller</p>
                    <p className="userBook-title hidden sm:block">Edge of Fear</p>
                    <p className="userAuthor hidden sm:block">J. Doe</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Highly Rated */}
          <section className="mt-8">
            <h2 className="userSection-title">Highly Rated</h2>
            <div className="flex gap-4 flex-wrap">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="userBook-card bg-white shadow-md rounded-md p-4 flex gap-4 mb-4 items-center">
                  <img
                    src="https://via.placeholder.com/80x120"
                    alt="Book Cover"
                    className="w-20 h-30 rounded-md"
                  />
                  <div className="userBook-info">
                    <p className="userGenre hidden sm:block">Romance</p>
                    <p className="userBook-title hidden sm:block">Love in the Air</p>
                    <p className="userAuthor hidden sm:block">J. Doe</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-arcadia-red text-white py-12 mt-16">
        <div className="container mx-auto text-center">
          <p>© 2024 Arcadia Library. All rights reserved.</p>
        </div>
      </footer>
      <div className="h-8"></div>
    </div>
  );
}

export default UHomePage;
