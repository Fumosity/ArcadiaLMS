import React from "react";
import MainHeader from "../components/main-comp/MainHeader";
import Footer from "../components/main-comp/Footer";
import PopularAmong from "../components/admin-book-viewer-comp/PopularAmong";
import SimilarTo from "../components/admin-book-viewer-comp/SimilarTo";
import Copyright from "../components/main-comp/Copyright";
import Title from "../components/main-comp/Title";
import CurrentResearchInventory from "../components/admin-research-inventory/CurrentResearchInventory";
import ResearchPreviewInv from "../components/admin-research-inventory/ResearchPreviewInv";

const ARInventory = () => (
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
        {/* Circular Add Book Button */}
        <button className="add-book">
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

    {/* Placeholder for future side pane */}
    <footer className="bg-light-gray mt-12 py-8">
      {/* Side pane content (for later) */}
    
    <Footer/>
    </footer>
    <Copyright />
  </div>
);

export default ARInventory;
