import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "react-loading-skeleton/dist/skeleton.css"
import { supabase } from "../../supabaseClient"
import WrngDeleteTitle from "../../z_modals/warning-modals/WrmgDeleteTitle"
import ViewSynopsis from "../../z_modals/ViewSynopsis"

import "react-toastify/ReactToastify.css"

const BookPreviewInventory = ({ book, onBookUpdate }) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isViewOpen, setViewOpen] = useState(false)
  const [synopsisContent, setSynopsisContent] = useState("")


  useEffect(() => {
    if (book) {
      const timer = setTimeout(() => {
        setLoading(false)
        setSynopsisContent(book.synopsis || "")
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [book])

  if (!book) {
    return (
      <div className="bg-white p-4 rounded-lg border-grey border text-center mt-12">
        Select a book title to view its details.
      </div>
    )
  }

  const bookDetails = {
    title: book.title,
    author: Array.isArray(book.author) ? book.author.join(', ') : (book.author ?? '').split(';').join(',') || '',
    genres: Array.isArray(book.genres) ? book.genres.join(', ') : (book.genres ?? '').split(';').join(',') || '',
    category: book.category,
    publisher: book.publisher,
    synopsis: book.synopsis,
    keywords: Array.isArray(book.keywords) ? book.keywords.join(', ') : (book.keywords ?? '').split(';').join(',') || '',
    pubDate: book.pubDate,
    location: book.location,
    isbn: book.isbn,
    cover: book.cover,
    price: book.price,
    titleCallNum: book.titleCallNum,
    titleID: book.titleID,
  };

  const handleModifyBook = () => {
    console.log("Title in BookPreviewInventory:", bookDetails.title);
    const queryParams = new URLSearchParams(bookDetails).toString();
    navigate(`/admin/bookmodify?${queryParams}`);
  };

  const handleManageCopies = () => {
    console.log("Title in BookPreviewInventory:", bookDetails.title)
    
    navigate(`/admin/copymanagement?titleID=${bookDetails.titleID}`)
  }
  
  return (
    <div className="">
      <div className="flex justify-center gap-2">
        <button
          className="add-book text-sm w-full mb-2 px-2 py-2 rounded-lg border-grey hover:bg-arcadia-red hover:text-white"
          onClick={handleModifyBook}
        >
          Modify Book Title
        </button>
        <button
          className="add-book text-sm w-full mb-2 px-2 py-2 rounded-lg border-grey hover:bg-arcadia-red hover:text-white"
          onClick={handleManageCopies}
        >
          Manage Copies
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg border-grey border w-full">
        <h3 className="text-2xl font-semibold mb-2">Book Preview</h3>
        <div className="w-full h-fit flex justify-center">
          <div className="relative bg-white p-4 w-fit rounded-lg hover:bg-grey transition-all duration-300 ease-in-out hover:shadow-md border border-grey">
            <img
              src={book.cover && book.cover !== "" ? book.cover : "../image/book_research_placeholder.png"}
              alt="Book cover"
              className="h-[475px] w-[300px] rounded-lg border border-grey object-cover"
            />
          </div>
        </div>
        <table className="w-full border-collapse">
          <tbody>
            {Object.entries(bookDetails)
              .filter(([key]) => !["cover", "quantity", "titleID"].includes(key))
              .map(([key, value], index) => (
                <tr key={index} className="border-b border-grey">
                  <td className="px-1 py-1 font-semibold capitalize w-1/3">
                    {key === "pubdate"
                      ? "Pub. Year:"
                      : key === "isbn"
                          ? "ISBN:"
                          : key === "titleCallNum"
                            ? "Call No.:"
                            : key.replace(/([A-Z])/g, " $1") + ":"}
                  </td>
                  <td className="px-1 py-1 text-sm break-words w-2/3">
                    {key === "synopsis" ? (
                      <div className="flex gap-2 items-center">
                        <span>{value ? value.substring(0, 100) + (value.length > 100 ? "..." : "") : "N/A"}</span>
                        <button
                          className="border border-grey px-2 py-0.5 rounded-xl hover:bg-grey transition-all duration-300 ease-in-out hover:shadow-md"
                          onClick={() => setViewOpen(true)}
                        >
                          View
                        </button>
                      </div>
                    ) : (
                      value
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <ViewSynopsis isOpen={isViewOpen} onClose={() => setViewOpen(false)} synopsisContent={synopsisContent} />
    </div>
  )
}

export default BookPreviewInventory

