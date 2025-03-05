import { useEffect, useState } from "react"
import { supabase } from "/src/supabaseClient.js"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

export default function ABCopiesList({ titleID }) {
    const [copyData, setCopyData] = useState([])
    const [sortOrder, setSortOrder] = useState("Descending")
    const [acqDateFilter, setAcqDateFilter] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedBook, setSelectedBook] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [entriesPerPage, setEntriesPerPage] = useState(5)
    const [statusType, setStatusType] = useState("All")


    useEffect(() => {
        if (!titleID) {
            console.log("ABCopiesList: titleID is not yet available.");
            return; // Exit the useEffect if titleID is not present
        }

        const fetchCopies = async () => {
            setIsLoading(true)

            try {

                const { data: bookIndiv, error: bookError } = await supabase
                    .from("book_indiv")
                    .select("*")
                    .in("titleID", [titleID])

                if (bookError) {
                    console.error("Error fetching book_indiv:", bookError.message)
                    return
                }

                console.log("Copies of selected book:", bookIndiv)
                setCopyData(bookIndiv)
            } catch (error) {
                console.error("An unexpected error occurred:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchCopies()
    }, [titleID])

    // Handle sorting
    const sortedData = [...copyData].sort((a, b) => {
        if (sortOrder === "Ascending") {
            return a.title.localeCompare(b.title)
        } else {
            return b.title.localeCompare(a.title)
        }
    })

    // Handle filtering and searching
    const filteredData = sortedData.filter((book) => {
        // Filter by publication date if specified
        const matchesAcqDate =
            !acqDateFilter ||
            (book.bookAcqDate && book.bookAcqDate.toLowerCase().includes(acqDateFilter.toLowerCase()))

        // Helper function to check if a value matches the search term
        const matchesSearchTerm = (value) => {
            if (typeof value === "string") {
                return value.toLowerCase().includes(searchTerm.toLowerCase())
            } else if (Array.isArray(value)) {
                return value.some((item) => typeof item === "string" && item.toLowerCase().includes(searchTerm.toLowerCase()))
            }
            return false
        }

        // Filter by search term
        const matchesSearch =
            !searchTerm ||
            matchesSearchTerm(book.bookBarcode)
        // Filter by status type
        const matchesStatus = statusType === "All" || book.bookStatus === statusType

        return matchesAcqDate && matchesSearch && matchesStatus
    })

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / entriesPerPage)
    const startIndex = (currentPage - 1) * entriesPerPage
    const displayedBooks = filteredData.slice(startIndex, startIndex + entriesPerPage)

    return (
        <div className="bg-white p-4 rounded-lg border-grey border h-fit w-1/2">
            <h3 className="text-2xl font-semibold mb-4">List of Copies</h3>

            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4">
                    {/* Sort By */}
                    <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">Sort:</span>
                        <button
                            onClick={() => setSortOrder(sortOrder === "Ascending" ? "Descending" : "Ascending")}
                            className="sort-by bg-gray-200 py-1 px-3 rounded-lg text-sm w-28"
                        >
                            {sortOrder}
                        </button>
                    </div>

                    {/* Status Type Filter */}
                    <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">Status:</span>
                        <select
                            className="bg-gray-200 py-1 px-1 border rounded-lg text-sm w-auto"
                            value={statusType}
                            onChange={(e) => setStatusType(e.target.value)}
                        >
                            <option value="All">All Status</option>
                            <option value="Available">Available</option>
                            <option value="Unavailable">Unavailable</option>
                            <option value="Damaged">Damaged</option>

                        </select>
                    </div>

                    {/* Acq Date Filter */}
                    <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">Acq. Date:</span>
                        <input
                            type="text"
                            className="bg-gray-200 py-1 px-2 border rounded-lg text-sm w-[90px]"
                            placeholder="YYYY-MM"
                            value={acqDateFilter}
                            onChange={(e) => setAcqDateFilter(e.target.value)}
                        />
                    </div>

                    {/* Entries Per Page */}
                    <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">Entries:</span>
                        <select
                            className="bg-gray-200 py-1 px-1 border rounded-lg text-sm w-13"
                            value={entriesPerPage}
                            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                    </div>
                </div>
                {/* Search */}
                <div className="flex items-center space-x-2 min-w-[0]">
                    <label htmlFor="search" className="font-medium text-sm">
                        Search:
                    </label>
                    <input
                        type="text"
                        id="search"
                        className="border border-gray-300 rounded-md py-1 px-2 text-sm w-auto sm:w-[420px]"
                        placeholder="Barcode or Status..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {["Status", "Barcode", "Date Acquired"].map((header) => (
                                <th
                                    key={header}
                                    className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                            Array.from({ length: entriesPerPage }).map((_, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-2 text-sm text-gray-500 truncate max-w-xs">
                                        <Skeleton className="w-1/3" />
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-500 truncate max-w-xs">
                                        <Skeleton className="w-1/3" />
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-500 truncate max-w-xs">
                                        <Skeleton className="w-1/3" />
                                    </td>
                                </tr>
                            ))
                        ) : displayedBooks.length > 0 ? (
                            displayedBooks.map((item, index) => {
                                return (
                                    <tr
                                        key={index}
                                        className={`hover:bg-light-gray cursor-pointer `}
                                        onClick={() => handleRowClick(item)}
                                    >
                                        <td className="px-4 py-2 text-sm text-gray-900 text-center w-1/3">
                                            <span className="bookinv-category inline-flex items-center justify-center text-sm font-medium rounded-full px-2 py-1">
                                                {item.bookStatus}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-900 text-center w-1/3">
                                            {item.bookBarcode}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-900 text-center w-1/3">
                                            {item.bookAcqDate}
                                        </td>
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td colSpan="3" className="px-4 py-2 text-center text-zinc-600">
                                    No books found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-2 space-x-4">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className="uPage-btn"
                    disabled={currentPage === 1}
                >
                    Previous Page
                </button>
                <span className="text-xs text-arcadia-red">Page {currentPage}</span>
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className="uPage-btn"
                    disabled={currentPage === totalPages}
                >
                    Next Page
                </button>
            </div>
        </div>
    )
}