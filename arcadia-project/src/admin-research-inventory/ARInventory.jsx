import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import MainHeader from "../components/main-comp/MainHeader";
import PopularAmong from "../components/admin-book-viewer-comp/PopularAmong";
import SimilarTo from "../components/admin-book-viewer-comp/SimilarTo";
import Title from "../components/main-comp/Title";
import CurrentResearchInventory from "../components/admin-research-inventory/CurrentResearchInventory";
import ResearchPreviewInv from "../components/admin-research-inventory/ResearchPreviewInv";

const ARInventory = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main header */}
      <MainHeader />
      <Title>Research Inventory</Title>
      {/* Main content with flex layout */}
      <div className="flex justify-center items-start space-x-2 pb-12 py-8">
        <div className="flex-shrink-0">
          <CurrentResearchInventory />
        </div>
        <div className="hidden lg:flex flex-col items-start flex-shrink-0"> {/* Stack vertically */}
          {/* Circular Add Research Button */}
          <button 
            className="add-book mb-4 px-4 py-2 rounded-full border-grey hover:bg-blue-600 transition"
            onClick={() => navigate('/researchadding')} // Navigate to /researchadding on click
          >
            Add Research
          </button>
          <div className="w-full mt-5">
            <ResearchPreviewInv />
          </div>
          
          <div className="w-full mt-5">
            <PopularAmong />
          </div>

          <div className="w-full mt-5">
            {/* Similar To Table */}
            <SimilarTo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARInventory;
