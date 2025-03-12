import { Link } from "react-router-dom"

const Footer = () => (
    <footer className="bg-arcadia-black w-full px-4 py-10">
        <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4 justify-items-center text-center">
                <div>
                    <h4 className="text-sm text-left font-semibold mb-4 text-white">
                            Library Analytics
                    </h4>
                    <ul className="text-sm text-grey text-left space-y-2">
                        <li>
                        <Link
                                to="/admin/analytics#book-circulation-demographics"
                                className="hover:underline"
                                onClick={() => {
                                    // Navigate to the page first
                                    setTimeout(() => {
                                        // After navigation, find and scroll to the element
                                        const element = document.getElementById("book-circulation-demographics")
                                        if (element) {
                                            element.scrollIntoView({ behavior: "smooth" })
                                        }
                                    }, 100)
                                }}
                            >
                            Book Circulation
                                </Link>
                        </li>
                        <li>
                        <Link
                                to="/admin/useraccounts#history"
                                className="hover:underline"
                                onClick={() => {
                                    // Navigate to the page first
                                    setTimeout(() => {
                                        // After navigation, find and scroll to the element
                                        const element = document.getElementById("history")
                                        if (element) {
                                            element.scrollIntoView({ behavior: "smooth" })
                                        }
                                    }, 100)
                                }}
                            >
                            History Demographics
                                </Link>
                            </li>
                        <li>
                        <Link
                                to="/admin/useraccounts#room-reserv-demographics"
                                className="hover:underline"
                                onClick={() => {
                                    // Navigate to the page first
                                    setTimeout(() => {
                                        // After navigation, find and scroll to the element
                                        const element = document.getElementById("room-reserv-demographics")
                                        if (element) {
                                            element.scrollIntoView({ behavior: "smooth" })
                                        }
                                    }, 100)
                                }}
                            >
                            Room Reservation Demographics
                            </Link>
                            </li>
                        <li>Highest Rated Theses</li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-sm text-left font-semibold mb-4 text-white">Circulation</h4>
                    <ul className="text-sm text-grey text-left space-y-2">
                        <li>
                            <Link
                                to="/admin/bookcheckinout"
                                className="hover:underline"
                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            >
                                Book Checking
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/circulatoryhistory"
                                className="hover:underline"
                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            >
                                Book Circulation
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/circulatoryhistory#history"
                                className="hover:underline"
                                onClick={() => {
                                    // Navigate to the page first
                                    setTimeout(() => {
                                        // After navigation, find and scroll to the element
                                        const element = document.getElementById("history")
                                        if (element) {
                                            element.scrollIntoView({ behavior: "smooth" })
                                        }
                                    }, 100)
                                }}
                            >
                                History
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/circulatoryhistory#borrowed-books"
                                className="hover:underline"
                                onClick={() => {
                                    // Navigate to the page first
                                    setTimeout(() => {
                                        // After navigation, find and scroll to the element
                                        const element = document.getElementById("borrowed-books")
                                        if (element) {
                                            element.scrollIntoView({ behavior: "smooth" })
                                        }
                                    }, 100)
                                }}
                            >
                                Borrowed Books
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/circulatoryhistory#returned-books"
                                className="hover:underline"
                                onClick={() => {
                                    // Navigate to the page first
                                    setTimeout(() => {
                                        // After navigation, find and scroll to the element
                                        const element = document.getElementById("returned-books")
                                        if (element) {
                                            element.scrollIntoView({ behavior: "smooth" })
                                        }
                                    }, 100)
                                }}
                            >
                                Returned Books
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/circulatoryhistory#overdue-books"
                                className="hover:underline"
                                onClick={() => {
                                    // Navigate to the page first
                                    setTimeout(() => {
                                        // After navigation, find and scroll to the element
                                        const element = document.getElementById("overdue-books")
                                        if (element) {
                                            element.scrollIntoView({ behavior: "smooth" })
                                        }
                                    }, 100)
                                }}
                            >
                                Overdue Books
                            </Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-sm text-left font-semibold mb-4 text-white">
                        Book Management
                    </h4>
                    <ul className="text-sm text-grey text-left space-y-2">
                        <li>
                            <Link
                                to="/admin/bookmanagement#book-inventory"
                                className="hover:underline"
                                onClick={() => {
                                    // Navigate to the page first
                                    setTimeout(() => {
                                        // After navigation, find and scroll to the element
                                        const element = document.getElementById("book-inventory")
                                        if (element) {
                                            element.scrollIntoView({ behavior: "smooth" })
                                        }
                                    }, 100)
                                }}
                            >
                                Inventory
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/bookadding"
                                className="hover:underline"
                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            >
                                Add Books
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/bookexport"
                                className="hover:underline"
                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            >
                                Export Book Inventory
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/genremanagement"
                                className="hover:underline"
                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            >
                                Genre Management
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/genreadding"
                                className="hover:underline"
                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            >
                                Add Genre
                            </Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-sm text-left font-semibold mb-4 text-white">
                        Research Management
                    </h4>
                    <ul className="text-sm text-grey text-left space-y-2">
                        <li>
                            <Link
                                to="/admin/researchmanagement"
                                className="hover:underline"
                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            >
                                Inventory
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/researchadding"
                                className="hover:underline"
                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            >
                                Add Theses
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/researchexport"
                                className="hover:underline"
                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            >
                                Export Research Inventory
                            </Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-sm text-left font-semibold mb-4 text-white">
                        User Accounts
                    </h4>
                    <ul className="text-sm text-grey text-left space-y-2">
                        <li>
                            <Link
                                to="/admin/useraccounts#book-circulation-demographics"
                                className="hover:underline"
                                onClick={() => {
                                    // Navigate to the page first
                                    setTimeout(() => {
                                        // After navigation, find and scroll to the element
                                        const element = document.getElementById("book-circulation-demographics")
                                        if (element) {
                                            element.scrollIntoView({ behavior: "smooth" })
                                        }
                                    }, 100)
                                }}
                            >
                                Circulation Demographics
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/useraccounts#users-list"
                                className="hover:underline"
                                onClick={() => {
                                    // Navigate to the page first
                                    setTimeout(() => {
                                        // After navigation, find and scroll to the element
                                        const element = document.getElementById("users-list")
                                        if (element) {
                                            element.scrollIntoView({ behavior: "smooth" })
                                        }
                                    }, 100)
                                }}
                            >
                                List of User Accounts
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/useraccounts#admin-list"
                                className="hover:underline"
                                onClick={() => {
                                    // Navigate to the page first
                                    setTimeout(() => {
                                        // After navigation, find and scroll to the element
                                        const element = document.getElementById("admin-list")
                                        if (element) {
                                            element.scrollIntoView({ behavior: "smooth" })
                                        }
                                    }, 100)
                                }}
                            >
                                List of Admin Accounts
                            </Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-sm text-left font-semibold mb-4 text-white">
                        Support
                    </h4>
                    <ul className="text-sm text-grey text-left space-y-2">
                        <li>
                            <Link
                                to="/admin/support#reports-and-supports-over-time"
                                className="hover:underline"
                                onClick={() => {
                                    // Navigate to the page first
                                    setTimeout(() => {
                                        // After navigation, find and scroll to the element
                                        const element = document.getElementById("reports-and-supports-over-time")
                                        if (element) {
                                            element.scrollIntoView({ behavior: "smooth" })
                                        }
                                    }, 100)
                                }}
                            >
                                Reports and Supports Over Time
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/support#reports-and-supports-status"
                                className="hover:underline"
                                onClick={() => {
                                    // Navigate to the page first
                                    setTimeout(() => {
                                        // After navigation, find and scroll to the element
                                        const element = document.getElementById("reports-and-supports-status")
                                        if (element) {
                                            element.scrollIntoView({ behavior: "smooth" })
                                        }
                                    }, 100)
                                }}
                            >
                                Reports and Supports Status
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/support#user-reports"
                                className="hover:underline"
                                onClick={() => {
                                    // Navigate to the page first
                                    setTimeout(() => {
                                        // After navigation, find and scroll to the element
                                        const element = document.getElementById("user-reports")
                                        if (element) {
                                            element.scrollIntoView({ behavior: "smooth" })
                                        }
                                    }, 100)
                                }}
                            >
                                User Reports
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/support#support-tickets"
                                className="hover:underline"
                                onClick={() => {
                                    // Navigate to the page first
                                    setTimeout(() => {
                                        // After navigation, find and scroll to the element
                                        const element = document.getElementById("support-tickets")
                                        if (element) {
                                            element.scrollIntoView({ behavior: "smooth" })
                                        }
                                    }, 100)
                                }}
                            >
                                Support Tickets
                            </Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-sm text-left font-semibold mb-4 text-white">
                            Reservations
                    </h4>
                    <ul className="text-sm text-grey text-left space-y-2">
                        <li>
                            <Link
                                to="/admin/reservations#room-reserv"
                                className="hover:underline"
                                onClick={() => {
                                    // Navigate to the page first
                                    setTimeout(() => {
                                        // After navigation, find and scroll to the element
                                        const element = document.getElementById("room-reserv")
                                        if (element) {
                                            element.scrollIntoView({ behavior: "smooth" })
                                        }
                                    }, 100)
                                }}
                            >
                                Reservation History
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/reservations#room-booking"
                                className="hover:underline"
                                onClick={() => {
                                    // Navigate to the page first
                                    setTimeout(() => {
                                        // After navigation, find and scroll to the element
                                        const element = document.getElementById("room-booking")
                                        if (element) {
                                            element.scrollIntoView({ behavior: "smooth" })
                                        }
                                    }, 100)
                                }}
                            >
                                Reserve a Room
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/reservations#reserved-rooms"
                                className="hover:underline"
                                onClick={() => {
                                    // Navigate to the page first
                                    setTimeout(() => {
                                        // After navigation, find and scroll to the element
                                        const element = document.getElementById("reserved-rooms")
                                        if (element) {
                                            element.scrollIntoView({ behavior: "smooth" })
                                        }
                                    }, 100)
                                }}
                            >
                                Reserved Rooms
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </footer>
)

export default Footer

