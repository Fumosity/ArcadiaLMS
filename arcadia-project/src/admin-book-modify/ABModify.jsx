import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Title from "../components/main-comp/Title";
import BookModify from "../components/admin-book-modify/BookModify";
import ABAddPreview from "../components/admin-book-add-comp/ABAddPreview";
import { supabase } from "../supabaseClient";
import WrngDeleteTitle from "../z_modals/warning-modals/WrmgDeleteTitle";

const ABModify = () => {
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
    currentPubDate: queryParams.get("currdatePublished") || '',
    originalPubDate: queryParams.get("orgdatePublished") || '',
    location: queryParams.get("location") || '',
    bookID: queryParams.get("databaseID") || '',
    arcID: queryParams.get("arcID") || '',
    isbn: queryParams.get("isbn") || '',
    price: queryParams.get("price") || '',
    cover: queryParams.get("cover") || '',
    titleID: queryParams.get("titleID") || '',
  };

  const [formDataState, setFormData] = useState(formData);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleDeleteBook = async () => {
    const titleID = formDataState.titleID;
    if (!titleID) {
      alert("No book title selected for deletion.");
      return;
    }

    const { error } = await supabase.from("book_titles").delete().eq("titleID", titleID);
    if (error) {
      alert("Failed to delete book: " + error.message);
    } else {
      alert("Book deleted successfully.");
      navigate("/admin/bookmanagement");
    }
  };

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
              className="add-book w-1/2 mb-2 px-4 py-2 rounded-lg bg-arcadia-red text-white hover:bg-red transition"
              onClick={() => setDeleteModalOpen(true)}
            >
              Delete Book
            </button>
          </div>
          <BookModify formData={formDataState} setFormData={setFormData} />
        </div>
        <div className="flex flex-col items-start flex-shrink-0 w-1/4">
          <ABAddPreview formData={formDataState} />
        </div>
      </div>
      <WrngDeleteTitle
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteBook}
        itemName={formDataState.title}
      />
    </div>
  );
};

export default ABModify;
