import React, { useState, useEffect } from "react";
import Title from "../components/main-comp/Title";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import AGAdding from "../components/admin-genre-add-comp/AGAdding";
import AGAddPreview from "../components/admin-genre-add-comp/AGAddPreview";

const AGAdd = () => {
  useEffect(() => {
    document.title = "Arcadia | Genre Adding";
}, []);
  const navigate = useNavigate(); // Initialize useNavigate

  const [formData, setFormData] = useState({
    genre: '',
    category: '',
    img: '',
    description: '',
  })

  return (
    <div className="min-h-screen bg-white">
      <Title>Genre Adding</Title>
      <div className="flex justify-center items-start space-x-2 pb-12 pt-8 px-12">
        <div className="flex-shrink-0 w-1/2">
          {/* Main content for adding research */}
          <div className="flex justify-between w-full gap-2">
            <button
              className="add-book w-1/2 mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
              onClick={() => navigate('/admin/genremanagement')}
            >
              Return to Genre Management
            </button>
          </div>
          <AGAdding formData={formData} setFormData={setFormData} />
        </div>
        {/* Preview section */}
        <div className="flex flex-col items-start flex-shrink-0 w-1/2">
          <AGAddPreview formData={formData} />
        </div>
      </div>
    </div>
  );
};

export default AGAdd;
