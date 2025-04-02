import { useEffect, useState } from "react"
import Title from "../components/main-comp/Title"
import { useNavigate, useLocation } from "react-router-dom"
import ABCopiesPreview from "../components/admin-book-copies-comp/ABCopiesPreview"
import { supabase } from "/src/supabaseClient.js"
import ABCopiesList from "../components/admin-book-copies-comp/ABCopiesList"
import ABCopiesMgmt from "../components/admin-book-copies-comp/ABCopiesMgmt"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import ABCopiesHistory from "../components/admin-book-copies-comp/ABCopiesHistory"

const ABCopies = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [book, setBook] = useState(null) // State to hold the fetched book details
  const [titleID, setTitleID] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isLoadingTitleID, setIsLoadingTitleID] = useState(true)
  const [refreshList, setRefreshList] = useState(false)

  const [formData, setFormData] = useState({
    bookStatus: "",
    bookBarcode: "",
    titleCallNum: "",
    bookLocation: "",
    bookAcqDate: "",
    bookID: "",
    titleID: null,
  })

  const [originalFormData, setOriginalFormData] = useState(null)
  const [isAddMode, setIsAddMode] = useState(false) // Add isAddMode state

  const handleCopySelect = (selectedCopy) => {
    const newFormData = {
      bookStatus: selectedCopy.bookStatus || "",
      bookBarcode: selectedCopy.bookBarcode || "",
      titleCallNum: selectedCopy.book_titles.titleCallNum || "",
      bookLocation: selectedCopy.book_titles.location || "",
      bookAcqDate: selectedCopy.bookAcqDate || "",
      bookID: selectedCopy.bookID,
      titleID: selectedCopy.titleID,
    }

    setFormData(newFormData)
    setOriginalFormData(newFormData)
    setIsAddMode(false)
  }

  const handleAddCopy = async () => {
    setIsAddMode(true)
    setOriginalFormData(null)

    if (titleID) {
      const { data, error } = await supabase
        .from("book_titles")
        .select("titleCallNum, location")
        .eq("titleID", titleID)
        .single()

      if (error) {
        console.error("Error fetching book details:", error)
        return
      }

      if (data) {
        setFormData({
          bookStatus: "",
          bookBarcode: "",
          titleCallNum: data.titleCallNum || "",
          bookLocation: data.location || "",
          bookAcqDate: "",
          bookID: "",
          titleID: null,
        })
      } else {
        //Handle case where book title is not found.
        setFormData({
          bookStatus: "",
          bookBarcode: "",
          titleCallNum: "",
          bookLocation: "",
          bookAcqDate: "",
          bookID: "",
          titleID: null,
        })
        console.error("Book title not found")
      }
    } else {
      setFormData({
        bookStatus: "",
        bookBarcode: "",
        titleCallNum: "",
        bookLocation: "",
        bookAcqDate: "",
        bookID: "",
        titleID: null,
      })
      console.error("titleID is not set")
    }
  }

  const handleRefresh = () => {
    setRefreshList(!refreshList) // Toggle refresh state
  }

  useEffect(() => {
    const fetchBookDetails = async () => {
      setIsLoadingTitleID(true)

      const query = new URLSearchParams(location.search)
      const fetchedTitleID = query.get("titleID") // Get titleID from query params

      if (fetchedTitleID) {
        console.log("fetchedTitleID", fetchedTitleID)

        // Fetch book details with genres
        const { data, error } = await supabase
          .from("book_titles")
          .select("*, book_genre_link(genres(genreID, genreName, category))")
          .eq("titleID", fetchedTitleID) // Fetch the book with the matching titleID
          .single() // Ensure we get a single result

        if (error) {
          console.error("Error fetching book:", error)
          setLoading(false)
          return
        }

        // Process the data to extract genres and category
        if (data) {
          // Extract genres from the book_genre_link
          const genres = data.book_genre_link.map((link) => link.genres.genreName)
          // Get the category from the first genre (assuming all genres have the same category)
          const category = data.book_genre_link.length > 0 ? data.book_genre_link[0].genres.category : "Uncategorized"

          // Add genres and category to the book data
          const processedData = {
            ...data,
            genres,
            category,
          }

          console.log("Processed book data:", processedData)

          setTimeout(() => {
            setBook(processedData) // Set the processed book details in state
            setLoading(false)
            setTitleID(fetchedTitleID)
          }, 1000)
        } else {
          setLoading(false)
          console.error("No book data found for the given titleID")
        }
      } else {
        console.error("No titleID found in URL parameters")
      }
      setIsLoadingTitleID(false)
    }

    fetchBookDetails()
  }, [location.search]) // Fetch book details when the component mounts

  return (
    <div className="min-h-screen bg-white">
      <Title>Copy Management</Title>
      <div className="flex justify-center items-start space-x-2 pb-12 pt-8 px-12">
        <div className="flex-shrink-0 w-3/4 space-y-2">
          {/* Main content for adding research */}
          <div className="flex justify-between w-full gap-2 -mb-2">
            <button
              className="add-book w-1/2 mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
              onClick={() => navigate("/admin/bookmanagement")}
            >
              Return to Book Inventory
            </button>
            <button
              className="add-book w-1/2 mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
              onClick={() => navigate(`/admin/abviewer?titleID=${encodeURIComponent(titleID)}`)}
            >
              Return to Book Viewer
            </button>
            <button
              className="add-book w-1/2 mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
              onClick={handleAddCopy}
            >
              Add a Copy
            </button>
          </div>
          <div className="flex justify-between w-full gap-2">
            {isLoadingTitleID ? (
              <div className="bg-white p-4 rounded-lg border-grey border h-fit w-1/2">
                <h3 className="text-2xl font-semibold mb-4">
                  <Skeleton width={150} />
                </h3>

                <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Sort By */}
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">
                        <Skeleton width={40} />
                      </span>
                      <Skeleton width={80} height={30} />
                    </div>

                    {/* Status Type Filter */}
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">
                        <Skeleton width={40} />
                      </span>
                      <Skeleton width={80} height={30} />
                    </div>

                    {/* Acq Date Filter */}
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">
                        <Skeleton width={70} />
                      </span>
                      <Skeleton width={80} height={30} />
                    </div>

                    {/* Entries Per Page */}
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">
                        <Skeleton width={50} />
                      </span>
                      <Skeleton width={40} height={30} />
                    </div>
                  </div>
                  {/* Search */}
                  <div className="flex items-center space-x-2 min-w-[0]">
                    <label htmlFor="search" className="font-medium text-sm">
                      <Skeleton width={50} />
                    </label>
                    <Skeleton width={200} height={30} />
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
                            <Skeleton width={60} />
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm text-gray-500 truncate max-w-xs">
                            <Skeleton width="80%" />
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500 truncate max-w-xs">
                            <Skeleton width="80%" />
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500 truncate max-w-xs">
                            <Skeleton width="80%" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <ABCopiesList titleID={titleID} onRowSelect={handleCopySelect} refreshList={refreshList} />
            )}
            <ABCopiesMgmt
              formData={formData}
              setFormData={setFormData}
              originalFormData={originalFormData}
              setOriginalFormData={setOriginalFormData}
              onRefresh={handleRefresh}
              titleID={titleID}
              isAddMode={isAddMode}
            />
          </div>
          <ABCopiesHistory titleID={titleID} />
        </div>
        {/* Preview section */}
        <div className="flex flex-col items-start flex-shrink-0 w-1/4">
          <ABCopiesPreview book={book} loading={loading} /> {/* Pass loading prop */}
        </div>
      </div>
    </div>
  )
}

export default ABCopies

