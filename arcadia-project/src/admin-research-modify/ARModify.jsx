import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Title from "../components/main-comp/Title";
import ResearchModify from "../components/admin-research-modify/ResearchModify";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import ARAddPreview from "../components/admin-research-add-comp/ARAddPreview";
import {supabase} from "../supabaseClient"

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
    researchID: queryParams.get("researchID") || '',
    arcID: queryParams.get("arcID") || '',
    cover: queryParams.get("cover") || '',
  };

  const [formDataState, setFormData] = useState(formData);

  const handleResearchDelete = async () => {
    const researchID = formDataState.researchID;

    if (!researchID) {
      alert("No research title selected for deletion.");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this research?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("research")
      .delete()
      .eq("researchID", researchID);

    if (error) {
      alert("Failed to delete research: " + error.message);
    } else {
      alert("Research deleted successfully.");
      navigate("/admin/researchmanagement");
    }
  };
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
            <button
              className="add-book w-1/2 mb-2 px-4 py-2 rounded-lg bg-arcadia-red hover:red text-white"
              onClick={handleResearchDelete}
            >
              Delete Research
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