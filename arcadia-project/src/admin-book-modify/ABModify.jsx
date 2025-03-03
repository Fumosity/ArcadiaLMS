import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MainHeader from "../components/main-comp/MainHeader";
import Title from "../components/main-comp/Title";
import BookModify from "../components/admin-book-modify/BookModify";
import BookCopiesIndiv from "../components/admin-book-modify/BookCopiesIndiv";
import ABAddPreview from "../components/admin-book-add-comp/ABAddPreview";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ABModify = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  // Retrieve book details from query params
  const formData = {
    title: queryParams.get("title") || '',
    author: queryParams.get("author") || '',
    genres: queryParams.get("genres") || '',
    category: queryParams.get("category") || '',
    publisher: queryParams.get("publisher") || '',
    synopsis: queryParams.get("synopsis") || '',
    keywords: queryParams.get("keywords") || '',
    currentPubDate: queryParams.get("datePublished") || '',
    originalPubDate: queryParams.get("republished") || '',
    location: queryParams.get("location") || '',
    bookID: queryParams.get("databaseID") || '',
    arcID: queryParams.get("arcID") || '',
    isbn: queryParams.get("isbn") || '',
    price: queryParams.get("price") || '',
    cover: queryParams.get("cover") || '',
    titleID: queryParams.get("titleID") || '',
  };

  console.log("ABModify", formData)

  const [formDataState, setFormData] = useState(formData);

  return (
    <div className="min-h-screen bg-white">
      {/* Main header */}
      <Title>Book Modify</Title>
      <div className="flex justify-center items-start space-x-2 pb-12 pt-8 px-12">
        <div className="flex-shrink-0 w-3/4">
          {/* Main content for adding research */}
          <div className="flex justify-between w-full gap-2">
            <button
              className="add-book w-1/2 mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
              onClick={() => navigate('/admin/bookmanagement')}
            >
              Return to Book Inventory
            </button>
          </div>
          {/* Pass formDataState and setFormData to BookModify */}
          <BookModify formData={formDataState} setFormData={setFormData} />

        </div>
        <div className="col-span-2 space-y-8">

          <ABAddPreview formData={formDataState} />
        </div>
      </div>
    </div>
  );
};

export default ABModify;
