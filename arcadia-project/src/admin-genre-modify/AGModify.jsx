import React, { useState, useEffect } from "react";
import Title from "../components/main-comp/Title";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import AGModifying from "../components/admin-genre-modify-comp/AGModifying";
import AGAddPreview from "../components/admin-genre-add-comp/AGAddPreview";
import { useLocation } from "react-router-dom";

const AGModify = () => {
  useEffect(() => {
    document.title = "Arcadia | Genre Modify";
}, []);
    const navigate = useNavigate(); // Initialize useNavigate
  
  const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
  
    // Retrieve book details from query params
    const formData = {
      genre: queryParams.get("genre") || '',
      category: queryParams.get("category") || '',
      description: queryParams.get("description") || '',
      img: queryParams.get("img") || '',
    };
  
    console.log("ABModify", formData)
  
    const [formDataState, setFormData] = useState(formData);
  

  return (
    <div className="min-h-screen bg-white">
      <Title>Genre Modifying</Title>
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
          <AGModifying formData={formDataState} setFormData={setFormData} />
        </div>
        {/* Preview section */}
        <div className="flex flex-col items-start flex-shrink-0 w-1/2">
          <AGAddPreview formData={formDataState} />
        </div>
      </div>
    </div>
  );
};

export default AGModify;
