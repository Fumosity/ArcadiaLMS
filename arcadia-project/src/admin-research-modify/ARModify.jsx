import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Title from "../components/main-comp/Title";
import ResearchModify from "../components/admin-research-modify/ResearchModify";
import ARAddPreview from "../components/admin-research-add-comp/ARAddPreview";
import { supabase } from "../supabaseClient";


const ARModify = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

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
    researchCallNum: queryParams.get("researchCallNum") || '',
    cover: queryParams.get("cover") || '',
  };

  const [formDataState, setFormData] = useState(formData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Title>Modify Research</Title>
      <div className="flex justify-center items-start space-x-2 pb-12 pt-8 px-12">
        <div className="flex-shrink-0 w-3/4">
          <div className="flex justify-between w-full gap-2">
            <button
              className="add-book w-1/2 mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
              onClick={() => navigate('/admin/researchmanagement')}
            >
              Return to Research Inventory
            </button>
          </div>
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