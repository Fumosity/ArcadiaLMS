import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MainHeader from "../components/main-comp/MainHeader";
import Title from "../components/main-comp/Title";
import BookModify from "../components/admin-book-modify/BookModify";

const ABModify = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  
  // Retrieve book details from query params
  const formData = {
    title: queryParams.get("title") || '',
    author: queryParams.get("author") || '',
    genre: queryParams.get("genre") || '',
    category: queryParams.get("category") || '',
    publisher: queryParams.get("publisher") || '',
    synopsis: queryParams.get("synopsis") || '',
    keyword: queryParams.get("keywords") || '',
    currentPubDate: queryParams.get("datePublished") || '',
    originalPubDate: queryParams.get("republished") || '',
    location: queryParams.get("location") || '',
    bookID: queryParams.get("databaseID") || '',
    arcID: queryParams.get("arcID") || '',
    isbn: queryParams.get("isbn") || '',
    cover: '', // Adjust if cover needs to be passed
  };

  const [formDataState, setFormData] = useState(formData);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main header */}
      <MainHeader />
      <Title>Modify Book</Title>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-8">
            {/* Pass formDataState and setFormData to BookModify */}
            <BookModify formData={formDataState} setFormData={setFormData} />
          </div>
          {/* Preview section */}
          <div className="lg:col-span-1 space-y-8">
          </div>
        </div>
      </main>
    </div>
  );
};

export default ABModify;
