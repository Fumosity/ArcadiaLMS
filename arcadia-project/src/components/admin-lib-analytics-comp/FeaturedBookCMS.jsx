import { useState, useEffect, useCallback } from "react"
import { toast } from "react-toastify"
import FeaturedBook from "./FeaturedBook"
import FeaturedResearch from "./FeaturedResearch"
import { supabase } from "../../supabaseClient"

const FeaturedBookCMS = () => {
    const [error, setError] = useState(null);
    const [emptyFields, setEmptyFields] = useState({});
    const [formDataBook, setFormDataBook] = useState({ bookTitle: "", notes: "" });
    const [formDataResearch, setFormDataResearch] = useState({ researchTitle: "", notes: ""})
    const [loading, setLoading] = useState(false);
    const [bookSuggestionsBk, setBookSuggestionsBk] = useState([]) // Store search results
    const [showSuggestionsBk, setShowSuggestionsBk] = useState(false)
    const [isSearchingBk, setIsSearchingBk] = useState(false) // Loading state for search
    const [researchSuggestionsRs, setResearchSuggestionsRs] = useState([]) // Store search results
    const [showSuggestionsRs, setShowSuggestionsRs] = useState(false)
    const [isSearchingRs, setIsSearchingRs] = useState(false) // Loading state for search
    const [refreshKeyBook, setRefreshKeyBook] = useState(0);
    const [refreshKeyResearch, setRefreshKeyResearch] = useState(0);

    const fetchBookTitles = useCallback(async () => {
        if (formDataBook.bookTitle.length < 2) {
            // Prevent excessive API calls
            setBookSuggestionsBk([])
            return
        }

        setIsSearchingBk(true)
        try {
            // Different query based on check mode

            const { data, error } = await supabase
                .from("book_titles")
                .select("title")
                .ilike("title", `%${formDataBook.bookTitle}%`)
                .limit(5)

            if (error) {
                console.error("Error fetching book titles:", error)
                setBookSuggestionsBk([])
            } else {
                console.log("Fetched available books:", data)
                setBookSuggestionsBk(data || [])
            }

        } catch (error) {
            console.error("Error fetching books:", error)
            setBookSuggestionsBk([])
        }
        setIsSearchingBk(false)
    }, [formDataBook.bookTitle])

    const fetchResearchTitles = useCallback(async () => {
        if (formDataResearch.researchTitle.length < 2) {
            // Prevent excessive API calls
            setResearchSuggestionsRs([])
            return
        }

        setIsSearchingBk(true)
        try {
            // Different query based on check mode

            const { data, error } = await supabase
                .from("research")
                .select("title")
                .ilike("title", `%${formDataResearch.researchTitle}%`)
                .limit(5)

            if (error) {
                console.error("Error fetching research titles:", error)
                setResearchSuggestionsRs([])
            } else {
                console.log("Fetched available research:", data)
                setResearchSuggestionsRs(data || [])
            }

        } catch (error) {
            console.error("Error fetching research:", error)
            setResearchSuggestionsRs([])
        }
        setIsSearchingRs(false)
    }, [formDataResearch.researchTitle])

    useEffect(() => {
        fetchBookTitles()
    }, [fetchBookTitles])

    useEffect(() => {
        fetchResearchTitles()
    }, [fetchResearchTitles])

    const handleBookSelection = (book) => {
        setFormDataBook((prev) => ({
            ...prev,
            bookTitle: book.title || "",
        }))
        setShowSuggestionsBk(false) // Hide suggestions after selection
    }

    const handleResearchSelection = (research) => {
        setFormDataResearch((prev) => ({
            ...prev,
            researchTitle: research.title || "",
        }))
        setShowSuggestionsRs(false) // Hide suggestions after selection
    }

    const handleInputChangeBook = (e) => {
        const { name, value } = e.target;
        setFormDataBook((prev) => ({ ...prev, [name]: value }));
        setEmptyFields((prev) => ({ ...prev, [name]: false }));

        // Show suggestions if input length >= 2 and we have suggestions
        if (name === "bookTitle" && value.length >= 2) {
            setShowSuggestionsBk(true);
        } else {
            setShowSuggestionsBk(false);
        }
    };

    const handleInputChangeResearch = (e) => {
        const { name, value } = e.target;
        setFormDataResearch((prev) => ({ ...prev, [name]: value }));
        setEmptyFields((prev) => ({ ...prev, [name]: false }));

        // Show suggestions if input length >= 2 and we have suggestions
        if (name === "researchTitle" && value.length >= 2) {
            setShowSuggestionsRs(true);
        } else {
            setShowSuggestionsRs(false);
        }
    };

    const handleSubmitBook = async (e) => {
        e.preventDefault();

        if (!formDataBook.bookTitle.trim()) {
            setEmptyFields({ bookTitle: true });
            setError("Title is required.");
            toast.error("Please enter a Title.");
            return;
        }

        setLoading(true);
        try {
            // Search for book title first
            const { data: matchingBooks, error: searchError } = await supabase
                .from("book_titles")
                .select("titleID")
                .ilike("title", formDataBook.bookTitle.trim())
                .limit(1);

            if (searchError) throw searchError;

            if (!matchingBooks || matchingBooks.length === 0) {
                setError("Book title not found.");
                toast.error("Book title not found. Please select a valid title.");
                setLoading(false);
                return;
            }

            const matchedTitleID = matchingBooks[0].titleID; // your FK

            // Insert with generated featuredTitleID
            const { error: insertError } = await supabase
                .from("featured_book")
                .insert([{
                    titleID: matchedTitleID,
                    notes: formDataBook.notes
                }]);

            if (insertError) throw insertError;

            toast.success("Featured book added successfully!");
            setFormDataBook({ bookTitle: "", notes: "" });
            setEmptyFields({});
            setError(null);

            setRefreshKeyBook((prev) => prev + 1);


        } catch (err) {
            setError(err.message || "Failed to add featured book.");
            toast.error("Error adding featured book.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitResearch = async (e) => {
        e.preventDefault();

        if (!formDataResearch.researchTitle.trim()) {
            setEmptyFields({ researchTitle: true });
            setError("Title is required.");
            toast.error("Please enter a Title.");
            return;
        }

        setLoading(true);
        try {
            // Search for book title first
            const { data: matchingResearch, error: searchError } = await supabase
                .from("research")
                .select("researchID")
                .ilike("title", formDataResearch.researchTitle.trim())
                .limit(1);

            if (searchError) throw searchError;

            if (!matchingResearch || matchingResearch.length === 0) {
                setError("Research title not found.");
                toast.error("Research title not found. Please select a valid title.");
                setLoading(false);
                return;
            }

            const matchedResearchID = matchingResearch[0].researchID; // your FK

            // Insert with generated featuredTitleID
            const { error: insertError } = await supabase
                .from("featured_research")
                .insert([{
                    researchID: matchedResearchID,
                    notes: formDataResearch.notes
                }]);

            if (insertError) throw insertError;

            toast.success("Featured research added successfully!");
            setFormDataResearch({ researchTitle: "", notes: "" });
            setEmptyFields({});
            setError(null);

            setRefreshKeyResearch((prev) => prev + 1);


        } catch (err) {
            setError(err.message || "Failed to add featured research.");
            toast.error("Error adding featured research.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="uMain-cont">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Featured Work Management</h1>
            </div>

            <div className="flex gap-8">

            
            <div className="w-1/2">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    <div className="w-full">
                        <FeaturedBook refreshKey={refreshKeyBook} />
                    </div>

                    <div className="w-full">
                        <h2 className="text-xl font-semibold mb-4">Change Featured Book</h2>
                        <form onSubmit={handleSubmitBook} className="space-y-4 h-fit">
                            <div className="relative w-full">
                                <div className="flex flex-row gap-2">
                                    <label className="w-1/3 content-center">Title:</label>
                                    <input
                                        type="text"
                                        name="bookTitle"
                                        value={formDataBook.bookTitle}
                                        onChange={handleInputChangeBook}
                                        placeholder={
                                            "Search book title"
                                        }
                                        className="px-3 py-1 w-2/3 rounded-full border border-grey"
                                        onFocus={() => {
                                            if (bookSuggestionsBk.length > 0) setShowSuggestionsBk(true)
                                        }}
                                        onBlur={() => {
                                            setTimeout(() => setShowSuggestionsBk(false), 200)
                                        }}
                                    />

                                    {showSuggestionsBk && bookSuggestionsBk.length > 0 && (
                                        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-grey rounded-md shadow-md z-5">
                                            {bookSuggestionsBk.map((book, index) => (
                                                <div
                                                    key={`fallback-key-${index}`}
                                                    className="px-4 py-2 hover:bg-grey cursor-pointer"
                                                    onMouseDown={() => handleBookSelection(book)}
                                                >
                                                    {book.title || "Unknown Title"}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 h-1/2">
                                <label className="w-full">Librarian's Notes:</label>
                                <textarea
                                    name="notes"
                                    placeholder="Notes"
                                    value={formDataBook.notes}
                                    onChange={handleInputChangeBook}
                                    className="px-3 py-1 w-full h-full rounded-xl border border-grey"
                                    rows="6"
                                    disabled={loading}
                                />
                            </div>
                            <button
                                type="submit"
                                className="add-book w-full px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
                                disabled={loading}
                            >
                                {loading ? "Adding..." : "Add Featured Book"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="w-1/2">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    <div className="w-full">
                        <FeaturedResearch refreshKey={refreshKeyResearch} />
                    </div>

                    <div className="w-full">
                        <h2 className="text-xl font-semibold mb-4">Change Featured Research</h2>
                        <form onSubmit={handleSubmitResearch} className="space-y-4 h-fit">
                            <div className="relative w-full">
                                <div className="flex flex-row gap-2">
                                    <label className="w-1/3 content-center">Title:</label>
                                    <input
                                        type="text"
                                        name="researchTitle"
                                        value={formDataResearch.researchTitle}
                                        onChange={handleInputChangeResearch}
                                        placeholder={
                                            "Search research title"
                                        }
                                        className="px-3 py-1 w-2/3 rounded-full border border-grey"
                                        onFocus={() => {
                                            if (researchSuggestionsRs.length > 0) setShowSuggestionsRs(true)
                                        }}
                                        onBlur={() => {
                                            setTimeout(() => setShowSuggestionsRs(false), 200)
                                        }}
                                    />

                                    {showSuggestionsRs && researchSuggestionsRs.length > 0 && (
                                        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-grey rounded-md shadow-md z-5">
                                            {researchSuggestionsRs.map((research, index) => (
                                                <div
                                                    key={`fallback-key-${index}-rs`}
                                                    className="px-4 py-2 hover:bg-grey cursor-pointer"
                                                    onMouseDown={() => handleResearchSelection(research)}
                                                >
                                                    {research.title || "Unknown Title"}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 h-1/2">
                                <label className="w-full">Librarian's Notes:</label>
                                <textarea
                                    name="notes"
                                    placeholder="Notes"
                                    value={formDataResearch.notes}
                                    onChange={handleInputChangeResearch}
                                    className="px-3 py-1 w-full h-full rounded-xl border border-grey"
                                    rows="6"
                                    disabled={loading}
                                />
                            </div>
                            <button
                                type="submit"
                                className="add-book w-full px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
                                disabled={loading}
                            >
                                {loading ? "Adding..." : "Add Featured Research"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            </div>
        </div>
    );
};

export default FeaturedBookCMS
