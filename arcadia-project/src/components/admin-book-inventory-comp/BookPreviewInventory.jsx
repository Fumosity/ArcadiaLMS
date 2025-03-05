import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import PopularAmong from "../admin-book-viewer-comp/PopularAmong";
import SimilarTo from "../admin-book-viewer-comp/SimilarTo";
import { supabase } from "../../supabaseClient";
import WrngDeleteTitle from "../../z_modals/warning-modals/WrmgDeleteTitle";
import { toast } from "react-toastify";
import "react-toastify/ReactToastify.css"

const BookPreviewInventory = ({ book }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (book) {
      const timer = setTimeout(() => setLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [book]);

  if (!book) {
    return <div className="bg-white p-4 rounded-lg border-grey border text-center mt-12">Select a book title to view its details.</div>;
  }

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg border-grey border mt-12">
        <h3 className="text-xl font-semibold mb-3">
          <Skeleton width={150} />
        </h3>
        <div className="relative bg-white p-2 mb-4 rounded-lg">
          <Skeleton height={200} width={150} className="mx-auto mb-2 rounded" />
          <p className="text-xs text-gray-500 mb-2 text-center">
            <Skeleton width={120} />
          </p>
        </div>
        <table className="min-w-full border-collapse">
          <tbody>
            {[...Array(10)].map((_, index) => (
              <tr key={index} className="border-b border-grey">
                <td className="px-1 py-1 font-semibold capitalize" style={{ width: "40%" }}>
                  <Skeleton width={80} />
                </td>
                <td className="px-1 py-1 text-sm">
                  <Skeleton width={150} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3 flex justify-center">
          <Skeleton width={100} height={35} borderRadius={20} />
        </div>
      </div>
    );
  }

  const bookDetails = {
    title: book.title,
    author: Array.isArray(book.author) ? book.author.join(', ') : (book.author ?? '').split(';').join(',') || '',
    genres: Array.isArray(book.genres) ? book.genres.join(', ') : (book.genres ?? '').split(';').join(',') || '',
    category: book.category,
    publisher: book.publisher,
    synopsis: book.synopsis,
    keywords: Array.isArray(book.keywords) ? book.keywords.join(', ') : (book.keywords ?? '').split(';').join(',') || '',
    datePublished: book.originalPubDate,
    republished: book.currentPubDate,
    quantity: book.quantity,
    cover: book.cover,
    location: book.location,
    isbn: book.isbn,
    price: book.price,
    titleID: book.titleID
  };

  const handleModifyBook = () => {
    console.log("Title in BookPreviewInventory:", bookDetails.title);
    const queryParams = new URLSearchParams(bookDetails).toString();
    navigate(`/admin/bookmodify?${queryParams}`);
  };

  const handleDeleteBook = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteBook = async () => {
    try {
      const { error } = await supabase
        .from("book_titles")
        .delete()
        .eq("titleID", bookDetails.titleID);
  
      if (error) {
        console.error("Error deleting book:", error.message);
        toast.error("Failed to delete book.");
        return;
      }
  
      toast.success("Book deleted successfully!");
      setIsDeleteModalOpen(false);
  
      // Reload the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1500); 
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("An error occurred while deleting the book.");
    }
  };
  

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
          onClick={handleModifyBook}
        >
          Modify Book Copies
        </button>
        <button
          className="add-book text-sm w-full mb-2 px-2 py-2 rounded-lg border-grey hover:bg-arcadia-red hover:text-white"
          onClick={handleDeleteBook}
        >
          Delete Book
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg border-grey border w-full">
        <h3 className="text-2xl font-semibold mb-2">Book Preview</h3>
        <div className="w-full h-fit flex justify-center">
          <div className="relative bg-white p-4 w-fit rounded-lg hover:bg-grey transition-all duration-300 ease-in-out hover:shadow-md border border-grey">
            <img
              src={book.cover || "image/bkfrontpg.png"}
              alt="Book cover"
              className="h-[475px] w-[300px] rounded-lg border border-grey object-cover"
            />
          </div>
        </div>
        <table className="w-full border-collapse">
          <tbody>
            {Object.entries(bookDetails)
              .filter(([key]) => !["cover", "quantity", "titleID"].includes(key)) // Exclude multiple keys
              .map(([key, value], index) => (
                <tr key={index} className="border-b border-grey">
                  <td className="px-1 py-1 font-semibold capitalize w-1/3">
                    {key === "datePublished"
                      ? "Current Pub. Date:"
                      : key === "republished"
                      ? "Original Pub. Date:"
                      : key === "isbn"
                      ? "ISBN:"
                      : key === "arcID"
                      ? "ARC ID:"
                      : key.replace(/([A-Z])/g, " $1") + ":"}
                  </td>
                  <td className="px-1 py-1 text-sm break-words w-2/3">{value}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <PopularAmong />
      <SimilarTo />

      <WrngDeleteTitle
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteBook}
        itemName={bookDetails.title}
      />
    </div>
  );
};

export default BookPreviewInventory;
