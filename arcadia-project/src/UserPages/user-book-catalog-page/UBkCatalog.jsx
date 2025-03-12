import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import UNavbar from "../../components/UserComponents/user-main-comp/UNavbar"
import USearchBar from "../../components/UserComponents/user-main-comp/USearchBar"
import Title from "../../components/main-comp/Title"
import FilterSidebar from "../../components/UserComponents/user-book-search-comp/FilterSidebar"
import Recommended from "../../components/UserComponents/user-home-comp/Recommended"
import MostPopular, { fetchMostPopularBooks } from "../../components/UserComponents/user-home-comp/MostPopular"
import HighlyRated, { fetchHighlyRatedBooks } from "../../components/UserComponents/user-home-comp/HighlyRated"
import NewlyAdded from "../../components/UserComponents/user-book-catalog-comp/NewlyAdded"
import ReleasedThisYear from "../../components/UserComponents/user-book-catalog-comp/ReleasedThisYear"
import Fiction, { fetchFictionBooks } from "../../components/UserComponents/user-book-catalog-comp/Fiction"
import Nonfiction, { fetchNonfictionBooks } from "../../components/UserComponents/user-book-catalog-comp/Nonfiction"
import UBkResults from "./UBkResults"
import { useUser } from "../../backend/UserContext"
import SeeMore from "../../components/UserComponents/user-home-comp/SeeMore"
import { supabase } from "/src/supabaseClient.js"
import ArcOpHr from "../../components/UserComponents/user-home-comp/ArcOpHr"
import UpEvents from "../../components/UserComponents/user-home-comp/UpEvents"
import Services from "../../components/UserComponents/user-main-comp/Services"
import MostPopBk from "../../components/UserComponents/user-main-comp/MostPopBk"
import HighestRatedBk from "../../components/UserComponents/user-main-comp/HIghestRatedBk"

const UBkCatalog = () => {
    const [query, setQuery] = useState("")
    const { user, updateUser } = useUser()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const titleId = queryParams.get("titleID")
    const viewParam = queryParams.get("view")
    const [bookDetails, setBookDetails] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [seeMoreComponent, setSeeMoreComponent] = useState(null)

    // Check URL query parameters on component mount
    useEffect(() => {
        // If the view parameter is 'highlyRated', show the expanded HighlyRated component
        if (viewParam === "highlyRated") {
            setSeeMoreComponent({
                title: "Highly Rated",
                fetchBooks: fetchHighlyRatedBooks,
            })
        }
        if (viewParam === "mostPopular") {
            setSeeMoreComponent({
                title: "Most Popular",
                fetchBooks: fetchMostPopularBooks,
            })
        }
        if (viewParam === "fictionBooks") {
            setSeeMoreComponent({
                title: "Fiction Books",
                fetchBooks: fetchFictionBooks,
            })
        }
        if (viewParam === "nonFictionBooks") {
            setSeeMoreComponent({
                title: "Non-fiction Books",
                fetchBooks: fetchNonfictionBooks,
            })
        }
    }, [viewParam])

    useEffect(() => {
        const fetchBookDetails = async () => {
            if (!titleId) {
                setError("Title ID not provided")
                setLoading(false)
                return
            }

            const { data, error } = await supabase.from("book_titles").select("*").eq("titleID", titleId).single()

            if (error || !data) {
                console.error("Error fetching or no data:", error)
                setError("Failed to fetch book details or book not found")
                setLoading(false)
                return
            }

            const publishedYear = data.originalPubDate ? new Date(data.originalPubDate).getFullYear() : "Unknown Year"

            setBookDetails({
                ...data,
                image_url: data.cover || "https://via.placeholder.com/150x300",
                publishedYear,
            })
            setLoading(false)
        }

        if (titleId) {
            fetchBookDetails()
        } else {
            setLoading(false)
        }
    }, [titleId])

    if (!user) {
        return <div>Loading...</div> // Or show a user-friendly message
    }

    const handleBackClick = () => {
        setSeeMoreComponent(null)
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    const handleSeeMoreClick = (component, fetchFunction) => {
        if (typeof fetchFunction !== "function") {
            console.error("fetchFunction is not a function", fetchFunction);
            return;
        }
        setSeeMoreComponent({
            title: component,
            fetchBooks: fetchFunction,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="min-h-screen bg-light-white">
            <UNavbar />
            <USearchBar placeholder="Search books..." onSearch={setQuery} />
            <Title>Book Catalog</Title>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="userContent-container flex flex-col lg:flex-row gap-8 justify-center items-start">
                    <div className="lg:w-1/4 md:w-1/3 w-full space-y-4">
                        {query.trim() && <FilterSidebar />}
                        {!query.trim() && <ArcOpHr />}
                        {!query.trim() && <UpEvents />}
                        {!query.trim() && <Services />}
                        {!query.trim() && <MostPopBk onSeeMoreClick={(title, fetchFunc) => handleSeeMoreClick(title, fetchFunc)} />}
                        {!query.trim() && <HighestRatedBk onSeeMoreClick={(title, fetchFunc) => handleSeeMoreClick(title, fetchFunc)} />}
                    </div>
                    <div className="userMain-content lg:w-3/4 w-full ml-5">
                        {query.trim() && <UBkResults query={query} />}
                        {!query.trim() && <Recommended titleID={titleId} userID={user.userID} category={bookDetails?.category || "General"} />}
                        {!query.trim() && <MostPopular onSeeMoreClick={(title, fetchFunc) => handleSeeMoreClick(title, fetchFunc)} />}
                        {!query.trim() && <HighlyRated onSeeMoreClick={(title, fetchFunc) => handleSeeMoreClick(title, fetchFunc)} />}
                        {!query.trim() && <NewlyAdded onSeeMoreClick={(title, fetchFunc) => handleSeeMoreClick(title, fetchFunc)} />}
                        {!query.trim() && <ReleasedThisYear onSeeMoreClick={(title, fetchFunc) => handleSeeMoreClick(title, fetchFunc)} />}
                        {!query.trim() && <Fiction onSeeMoreClick={(title, fetchFunc) => handleSeeMoreClick(title, fetchFunc)} />}
                        {!query.trim() && <Nonfiction onSeeMoreClick={(title, fetchFunc) => handleSeeMoreClick(title, fetchFunc)} />}

                    </div>
                </div>
            </main>
        </div>
    );
};

export default UBkCatalog

