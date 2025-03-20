import React, { useState } from "react";
import ABAdding from "../components/admin-book-add-comp/ABAdding";
import ABAddPreview from "../components/admin-book-add-comp/ABAddPreview";
import Title from "../components/main-comp/Title";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ABAdd = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const [formData, setFormData] = useState({
    title: '',
    author: [],
    genres: [],
    category: [],
    publisher: '',
    synopsis: '',
    keywords: [],
    currentPubDate: '',
    originalPubDate: '',
    procurementDate: '',
    location: '',
    bookID: '',
    bookBarcode: '',
    isbn: '',
    cover: '',
    price: '',
    titleCallNum: '',
  })

  return (
    <div className="min-h-screen bg-white">
      <Title>Book Adding</Title>
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
          <ABAdding formData={formData} setFormData={setFormData} />
        </div>
        {/* Preview section */}
        <div className="flex flex-col items-start flex-shrink-0 w-1/4">
          <ABAddPreview formData={formData} />
        </div>
      </div>
    </div>
  );
};

export default ABAdd;
