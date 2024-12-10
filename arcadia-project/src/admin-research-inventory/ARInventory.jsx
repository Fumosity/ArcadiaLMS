import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import MainHeader from "../components/main-comp/MainHeader";
import PopularAmong from "../components/admin-book-viewer-comp/PopularAmong";
import SimilarTo from "../components/admin-book-viewer-comp/SimilarTo";
import Title from "../components/main-comp/Title";
import CurrentResearchInventory from "../components/admin-research-inventory/CurrentResearchInventory";
import ResearchPreviewInv from "../components/admin-research-inventory/ResearchPreviewInv";

const ARInventory = () => {
  const [selectedResearch, setSelectedResearch] = useState(null);
  const navigate = useNavigate();
  const handleResearchSelect = (researchItem) => { 
    setSelectedResearch(researchItem);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <MainHeader />
      <Title>Research Inventory</Title>
      <div className="flex justify-center items-start space-x-2 pb-12 py-8">
        <div className="flex-shrink-0">
          <CurrentResearchInventory onResearchSelect={handleResearchSelect} />
        </div>
        <div className="hidden lg:flex flex-col items-start flex-shrink-0">
          <button 
            className="add-book mb-4 px-4 py-2 rounded-full border-grey hover:bg-blue-600 transition"
            onClick={() => navigate('/admin/researchadding')} 
          >
            Add Research
          </button>
          <div className="w-full mt-5">
            <ResearchPreviewInv research={selectedResearch} /> 
          </div>
          
          <div className="w-full mt-5">
            <PopularAmong />
          </div>

          <div className="w-full mt-5">
            <SimilarTo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARInventory;
