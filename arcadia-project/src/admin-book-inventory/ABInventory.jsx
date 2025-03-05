import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import MainHeader from "../components/main-comp/MainHeader";
import CurrentBookInventory from "../components/admin-book-inventory-comp/CurrentBookInventory";
import BookPreviewInv from "../components/admin-book-inventory-comp/BookPreviewInventory";
import Title from "../components/main-comp/Title";

const ABInventory = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [selectedBook, setSelectedBook] = useState(null); // State to hold the selected book details

  const handleBookSelect = (book) => {
    setSelectedBook(book); // Update selected book
  };

  return (
    <div className="min-h-screen bg-white">
      <Title>Book Inventory</Title>
      {/* <MainHeader /> */}

      <div className="flex justify-center items-start space-x-2 pb-12 pt-8 px-12">
        <div className="flex-shrink-0 w-3/4">
          <div className="flex justify-between w-full gap-2">
            <button
              className="add-book w-full mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
              onClick={() => navigate('/admin/bookadding')} // Navigate to ABAdd on click
            >
              Add a Book Title
            </button>
            <button
              className="add-book w-full mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
              onClick={() => navigate('/admin/genremanagement')} // Navigate to ABAdd on click
            >
              Genre Management
            </button>
            <button
              className="add-book w-full mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
              onClick={() => navigate('/admin/bookexport')} // Navigate to ABAdd on click
            >
              Export Book Inventory
            </button>
          </div>
          <CurrentBookInventory onBookSelect={handleBookSelect} />
        </div>
        <div className="flex flex-col items-start flex-shrink-0 w-1/4">
          <div className="w-full">
            <BookPreviewInv book={selectedBook} /> {/* Pass the selected book to BookPreviewInv */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ABInventory;
