import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MainHeader from "../components/main-comp/MainHeader";
import Title from "../components/main-comp/Title";
import ResearchModify from "../components/admin-research-modify/ResearchModify";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import ARAddPreview from "../components/admin-research-add-comp/ARAddPreview";

const ARModify = () => {
      const navigate = useNavigate(); // Initialize useNavigate
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  
  // Retrieve research details from query params
  const formData = {
    title: queryParams.get("title") || '',
    author: queryParams.get("author") || '',
    college: queryParams.get("college") || '',
    department: queryParams.get("department") || '',
    abstract: queryParams.get("abstract") || '',
    keywords: queryParams.get("keywords") || '',
    pubDate: queryParams.get("pubDate") || '',
    location: queryParams.get("location") || '',
    thesisID: queryParams.get("thesisID") || '',
    arcID: queryParams.get("arcID") || '',
    cover: queryParams.get("cover") || '',
  };

  const [formDataState, setFormData] = useState(formData);

  return (
    <div className="min-h-screen bg-white">
      {/* Main header */}
      <Title>Modify Research</Title>
      <div className="flex justify-center items-start space-x-2 pb-12 pt-8 px-12">
        <div className="flex-shrink-0 w-3/4">
          {/* Main content for adding research */}
          <div className="flex justify-between w-full gap-2">
            <button
              className="add-book w-1/2 mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
              onClick={() => navigate('/admin/researchmanagement')}
            >
              Return to Book Inventory
            </button>
          </div>
            {/* Pass formDataState and setFormData to ResearchModify */}
            <ResearchModify formData={formDataState} setFormData={setFormData} />
          </div>
          <div className="flex flex-col items-start flex-shrink-0 w-1/4">
          <ARAddPreview formData={formDataState} />
          </div>
        </div>
    </div>
  );
};

export default ARModify;