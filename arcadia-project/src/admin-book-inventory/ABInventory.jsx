import React from "react";
import MainHeader from "../components/main-comp/MainHeader";
import CurrentBookInventory from "../components/admin-book-inventory-comp/CurrentBookInventory";
import Navbar from "../components/main-comp/Navbar";
import BookPreviewInv from "../components/admin-book-inventory-comp/BookPreviewInventory";
import Footer from "../components/main-comp/Footer";
import PopularAmong from "../components/admin-book-viewer-comp/PopularAmong";
import SimilarTo from "../components/admin-book-viewer-comp/SimilarTo";
import Copyright from "../components/main-comp/Copyright";
import Title from "../components/main-comp/Title";

const ABInventory = () => (
  <div className="min-h-screen bg-gray-100">
    {/* Main header */}
    <MainHeader />
    <Navbar />
    <Title>Book Inventory</Title>
    {/* Main content with flex layout */}
    <div className="flex justify-center items-start space-x-2 pb-12 py-8">
      <div className="flex-shrink-0">
        <CurrentBookInventory />
      </div>
      <div className="hidden lg:flex flex-col items-start flex-shrink-0"> {/* Stack vertically */}
        {/* Circular Add Book Button */}
        <button className="add-book">
          Add Book
        </button>
        <div className="w-full mt-5">
        <BookPreviewInv />
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

export default ABInventory;
