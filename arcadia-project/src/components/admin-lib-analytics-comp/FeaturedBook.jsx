import { useState, useEffect } from "react"
import { supabase } from "../../supabaseClient"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

const FeaturedBook = ({ refreshKey }) => {
    const [book, setBook] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchLatestFeaturedBook = async () => {
            setIsLoading(true)
            setError(null)

            try {
                const { data: featuredBookData, error: featuredBookError } = await supabase
                    .from("featured_book")
                    .select("*, book_titles(*, book_indiv(bookStatus))")
                    .order("created_at", { ascending: false })
                    .limit(1)

                if (featuredBookError) throw featuredBookError

                if (featuredBookData && featuredBookData.length > 0) {
                    const bookDetails = featuredBookData[0].book_titles

                    const { data: ratingsData, error: ratingsError } = await supabase
                        .from("ratings")
                        .select("titleID, ratingValue")
                        .eq("titleID", bookDetails.titleID)
                    if (ratingsError) throw ratingsError

                    const averageRating = ratingsData.reduce((acc, curr) => acc + (curr.ratingValue || 0), 0) / (ratingsData.length || 1)

                    const { data: bookGenres, error: genreError } = await supabase
                        .from("book_genre_link")
                        .select("genres(genreName, category)")
                        .eq("titleID", bookDetails.titleID)
                    if (genreError) throw genreError

                    const genres = bookGenres.map((item) => item.genres?.genreName).filter(Boolean)
                    const category = bookGenres[0]?.genres?.category || "Uncategorized"

                    const mergedData = {
                        ...featuredBookData[0],
                        ...bookDetails,
                        averageRating,
                        category,
                        genres,
                    }

                    setBook(mergedData)
                } else {
                    setBook(null)
                }
            } catch (err) {
                setError("Failed to fetch the featured book.")
            } finally {
                setIsLoading(false)
            }
        }

        fetchLatestFeaturedBook()
    }, [refreshKey])

    if (isLoading) return <div>Loading featured book...</div>
    if (error) return <div>{error}</div>
    if (!book) return <div>No featured book found.</div>

    return (

        <div className="uMain-cont">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Featured Book</h2>
            </div>
            <div className="genCard-cont flex w-full h-[35vh] gap-2 p-4 border border-grey bg-silver rounded-lg mt-4">
                <div className="flex-shrink-0 w-1/3">
                    <img src={book.cover || "/placeholder.svg"} alt={book.title} className="w-full h-full bg-grey object-cover border border-grey rounded-md" />
                </div>
                <div className="flex-1 justify-between h-full w-full">
                    <div>
                        <h3 className="text-xl font-ZenSerif leading-tight whitespace-pre-wrap truncate break-words line-clamp-2">{book.title || "none"}</h3>
                        <div className="text-md text-gray-700 mt-1 mb-1 space-y-1">
                            <p className="font-semibold">{Array.isArray(book.author) ? book.author.join(", ") : book.author || "none"}</p>
                            <p className="w-full leading-tight line-clamp-4 overflow-hidden text-ellipsis break-words">
                                <span className="font-semibold">Librarian's Notes:</span><br />
                                "<span className="italic">{book.notes || "No notes available."}"</span>
                            </p>
                        </div>
                    </div>
                    <div className="justify-start space-x-2 w-1/3 absolute bottom-4">
                        <button
                            className="w-full hover:bg-arcadia-red rounded-lg hover:text-white text-center text-sm px-2 py-1 bg-white text-arcadia-red border border-arcadia-red"
                            onClick={() => {
                                window.scrollTo({ top: 0, behavior: "smooth" })
                                navigate(`/user/bookview?titleID=${book.titleID}`)
                            }}
                        >
                            View Book
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FeaturedBook
