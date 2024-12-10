import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import MainHeader from "../components/main-comp/MainHeader";
import CurrentBookInventory from "../components/admin-book-inventory-comp/CurrentBookInventory";
import BookPreviewInv from "../components/admin-book-inventory-comp/BookPreviewInventory";
import PopularAmong from "../components/admin-book-viewer-comp/PopularAmong";
import SimilarTo from "../components/admin-book-viewer-comp/SimilarTo";
import Title from "../components/main-comp/Title";

const ABInventory = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [selectedBook, setSelectedBook] = useState(null); // State to hold the selected book details

  const handleBookSelect = (book) => {
    setSelectedBook(book); // Update selected book
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <MainHeader />
      <Title>Book Inventory</Title>

      <div className="flex justify-center items-start space-x-2 pb-12 py-8">
        <div className="flex-shrink-0">
          <CurrentBookInventory onBookSelect={handleBookSelect} />
        </div>
        <div className="hidden lg:flex flex-col items-start flex-shrink-0">
          {/* Circular Add Book Button */}
          <button 
            className="add-book mb-4 px-4 py-2 rounded-full border-grey hover:bg-blue-600 transition"
            onClick={() => navigate('/admin/bookadding')} // Navigate to ABAdd on click
          >
            Add Book
          </button>   
          <div className="w-full mt-5">
            <BookPreviewInv book={selectedBook} /> {/* Pass the selected book to BookPreviewInv */}
          </div>

          <div className="w-full mt-5">
            <PopularAmong />
          </div>

          <div className="w-full mt-5">
            {/* Similar To Table */}
            <SimilarTo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ABInventory;
