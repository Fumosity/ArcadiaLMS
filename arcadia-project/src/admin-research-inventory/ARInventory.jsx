import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    <div className="min-h-screen bg-white">
      <Title>Research Inventory</Title>
      {/* <MainHeader /> */}

      <div className="flex justify-center items-start space-x-2 pb-12 py-8 px-12">
        <div className="flex-shrink-0 w-3/4">
          <div className="flex justify-between w-full gap-2">
            <button
              className="add-book w-full mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
              onClick={() => navigate('/admin/researchadding')}
            >
              Add Research
            </button>
            <button
              className="add-book w-full mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
              onClick={() => navigate('/admin/researchexport')}
            >
              Export Research Inventory
            </button>
          </div>
          <CurrentResearchInventory onResearchSelect={handleResearchSelect} />
        </div>
        <div className="hidden lg:flex flex-col items-start flex-shrink-0 w-1/4">
          <div className="w-full">
            <ResearchPreviewInv research={selectedResearch} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARInventory;
