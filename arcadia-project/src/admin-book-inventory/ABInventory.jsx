import React from "react";
import MainHeader from "../components/main-comp/MainHeader";
import InventoryTitle from "../components/admin-book-inventory-comp/InventoryTitle";
import CurrentBookInventory from "../components/admin-book-inventory-comp/CurrentBookInventory";
import Navbar from "../components/main-comp/Navbar";
import BookPreviewInv from "../components/admin-book-inventory-comp/BookPreviewInventory";
import Footer from "../components/main-comp/Footer";

const ABInventory = () => (
  <div className="min-h-screen bg-gray-100">
    {/* Main header */}
    <MainHeader />
    <Navbar />
    {/* Inventory title */}
    <InventoryTitle />

    {/* Main content with flex layout */}
    <div className="flex justify-center items-start space-x-2 pb-12">
      <div className="flex-shrink-0">
        <CurrentBookInventory />
      </div>
      <div className="hidden lg:flex flex-col items-start flex-shrink-0"> {/* Stack vertically */}
        {/* Circular Add Book Button */}
        <button className="add-book">
          Add Book
        </button>
        <BookPreviewInv />
      </div>
    </div>

    {/* Placeholder for future side pane */}
    <div className="hidden lg:block">
      {/* Side pane content (for later) */}
    </div>
    <Footer/>
  </div>
);

export default ABInventory;
