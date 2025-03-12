"use client"
import { Link, useNavigate } from "react-router-dom"

const UFooter = () => {
  const navigate = useNavigate()

  const handleHighlyRatedClick = () => {
    // Navigate to home page with a query parameter to indicate showing the expanded HighlyRated component
    navigate("/?view=highlyRated")

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleMostPopularClick = () => {
    // Navigate to home page with a query parameter to indicate showing the expanded HighlyRated component
    navigate("/?view=mostPopular")

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" })
  }


  return (
    <footer className="bg-arcadia-black w-full px-4 py-10">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 justify-items-center text-center">
          <div>
            <h4 className="text-sm font-semibold text-left mb-4 text-white">
              <Link to="/user/bookmanagement" className="hover:underline">
                Book Catalog
              </Link>
            </h4>
            <ul className="text-sm text-grey text-left space-y-2">
              <li><button
                onClick={handleMostPopularClick}
                className="text-grey hover:text-white hover:underline cursor-pointer text-left"
              >
                Most Popular Books
              </button></li>
              <li>
                <button
                  onClick={handleHighlyRatedClick}
                  className="text-grey hover:text-white hover:underline cursor-pointer text-left"
                >
                  Highest Rated Books
                </button>
              </li>
              <li>Most Popular Theses</li>
              <li>Highest Rated Theses</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-left mb-4 text-white">
              <Link to="/user/researchmanagement" className="hover:underline">
                Research Catalog
              </Link>
            </h4>
            <ul className="text-sm text-grey text-left space-y-2">
              <li>Book Checking</li>
              <li>History</li>
              <li>Borrowed Books</li>
              <li>Returned Books</li>
              <li>Overdue Books</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-left mb-4 text-white">
              <Link to="/user/reservations" className="hover:underline">
                Reservations
              </Link>
            </h4>
            <ul className="text-sm text-grey text-left space-y-2">
              <li>Reservation History</li>
              <li>Room Status</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-left mb-4 text-white">
              <Link to="/user/services" className="hover:underline">
                Services
              </Link>
            </h4>
            <ul className="text-sm text-grey text-left space-y-2">
              <li>Printing</li>
              <li>Arcadia Chatbot</li>
              <li>ARC Cafe</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-left mb-4 text-white">
              <Link to="/user/support" className="hover:underline">
                Support
              </Link>
            </h4>
            <ul className="text-sm text-grey text-left space-y-2">
              <li>User Reports</li>
              <li>Support Tickets</li>
              <li>Contacts</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-left mb-4 text-white">
              <Link to="/user/accountview" className="hover:underline">
                User Account
              </Link>
            </h4>
            <ul className="text-sm text-grey text-left space-y-2">
              <li>View Account</li>
              <li>Circulation History</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default UFooter

