import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Title from "../components/main-comp/Title";
import BookModify from "../components/admin-book-modify/BookModify";
import ABAddPreview from "../components/admin-book-add-comp/ABAddPreview";
import { supabase } from "../supabaseClient";

const ABModify = () => {
  useEffect(() => {
    document.title = "Arcadia | Book Modify";
}, []);
  const navigate = useNavigate();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const formData = {
    title: queryParams.get("title") || '',
    author: queryParams.get("author") || '',
    genres: queryParams.get("genres") || '',
    category: queryParams.get("category") || '',
    publisher: queryParams.get("publisher") || '',
    synopsis: queryParams.get("synopsis") || '',
    keywords: queryParams.get("keywords") || '',
    pubDate: queryParams.get("pubDate") || '',
    location: queryParams.get("location") || '',
    titleCallNum: queryParams.get("titleCallNum") || '',
    isbn: queryParams.get("isbn") || '',
    price: queryParams.get("price") || '',
    cover: queryParams.get("cover") || '',
    titleID: queryParams.get("titleID") || '',
  };

  const titleID = queryParams.get("titleID")
  console.log(titleID)

  const [formDataState, setFormData] = useState(formData);

  return (
    <div className="min-h-screen bg-white">
      <Title>Book Modify</Title>
      <div className="flex justify-center items-start space-x-2 pb-12 pt-8 px-12">
        <div className="flex-shrink-0 w-3/4">
          <div className="flex justify-between w-full gap-2">
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
          </div>
          <BookModify formData={formDataState} setFormData={setFormData} />
        </div>
        <div className="flex flex-col items-start flex-shrink-0 w-1/4">
          <ABAddPreview formData={formDataState} />
        </div>
      </div>

    </div>
  );
};

export default ABModify;
