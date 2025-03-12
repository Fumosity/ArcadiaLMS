
import { Link, useNavigate } from "react-router-dom"

const UFooter = () => {
  const navigate = useNavigate()

  
  const handleHighlyRatedClick = () => {
    // Navigate to home page with a query parameter to indicate showing the expanded HighlyRated component
    navigate("/user/bookmanagement/?view=highlyRated")

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleMostPopularClick = () => {
    // Navigate to home page with a query parameter to indicate showing the expanded HighlyRated component
    navigate("/user/bookmanagement/?view=mostPopular")

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleFictionBooks = () => {
    // Navigate to home page with a query parameter to indicate showing the expanded HighlyRated component
    navigate("/user/bookmanagement/?view=fictionBooks")

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleNonfictionBooks = () => {
    // Navigate to home page with a query parameter to indicate showing the expanded HighlyRated component
    navigate("/user/bookmanagement/?view=nonFictionBooks")

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" })
  }


  return (
    <footer className="bg-arcadia-black w-full px-4 py-10">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 justify-items-center text-center">
          <div>
            <h4 className="text-sm font-semibold text-left mb-4 text-white">
              Book Catalog
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
              <li>
                <button
                  onClick={handleFictionBooks}
                  className="text-grey hover:text-white hover:underline cursor-pointer text-left"
                >
                  Fiction
                </button>
              </li>
              <li>
                <button
                  onClick={handleNonfictionBooks}
                  className="text-grey hover:text-white hover:underline cursor-pointer text-left"
                >
                  Non-fiction
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-left mb-4 text-white">
              <Link to="/user/researchmanagement" className="hover:underline">
                Research Catalog (WIP)
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
              <li>
              <Link
                                to="/user/reservations#reserv-a-room"
                                className="hover:underline"
                                onClick={() => {
                                    // Navigate to the page first
                                    setTimeout(() => {
                                        // After navigation, find and scroll to the element
                                        const element = document.getElementById("reserv-a-room")
                                        if (element) {
                                            element.scrollIntoView({ behavior: "smooth" })
                                        }
                                    }, 100)
                                }}
                            >
                Reserve A Room
                </Link>
                </li>
              <li>
              <Link
                                to="/user/reservations#room-reservs"
                                className="hover:underline"
                                onClick={() => {
                                    // Navigate to the page first
                                    setTimeout(() => {
                                        // After navigation, find and scroll to the element
                                        const element = document.getElementById("room-reservs")
                                        if (element) {
                                            element.scrollIntoView({ behavior: "smooth" })
                                        }
                                    }, 100)
                                }}
                            >
                Reservation Schedule
                </Link>
                </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-left mb-4 text-white">
              Services
            </h4>
            <ul className="text-sm text-grey text-left space-y-2">
              <li>
                <Link
                  to="/user/faqs"
                  className="hover:underline"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                  FAQs
                </Link>
              </li>

            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-left mb-4 text-white">
              Support
            </h4>
            <ul className="text-sm text-grey text-left space-y-2">
              <li>
                <Link
                  to="/user/support/reportticket"
                  className="hover:underline"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                  User Reports
                </Link>
              </li>
              <li>
                <Link
                  to="/user/support/supportticket"
                  className="hover:underline"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                  Support Tickets
                </Link>
              </li>
              <li>
                <Link
                  to="/user/support"
                  className="hover:underline"
                  onClick={() => window.scrollTo({ bottom: 0, behavior: "smooth" })}
                >
                  Contacts
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-left mb-4 text-white">
              User Account
            </h4>
            <ul className="text-sm text-grey text-left space-y-2">
              <li>
                <Link
                  to="/user/accountview"
                  className="hover:underline"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                  View Account
                </Link>
              </li>
              <li>
                <Link
                  to="/user/accountview"
                  className="hover:underline"
                  onClick={() => {
                    const middleOfPage = Math.floor(document.documentElement.scrollHeight / 2);
                    window.scrollTo({ top: middleOfPage, behavior: "smooth" });
                  }}
                >
                  Circulation History
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default UFooter

