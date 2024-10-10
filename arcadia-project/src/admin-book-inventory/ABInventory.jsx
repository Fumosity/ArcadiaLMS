import React from "react";
import MainHeader from "../components/main-comp/MainHeader";
import InventoryTitle from "../components/admin-book-inventory-comp/InventoryTitle";
import CurrentBookInventory from "../components/admin-book-inventory-comp/CurrentBookInventory";

const ABInventory = () => (
  <div className="min-h-screen bg-gray-100">
    {/* Main header */}
    <MainHeader />
    
    {/* Inventory title */}
    <InventoryTitle />

    {/* Main content with room for a side pane */}
    <div className="flex justify-center">
      {/* Content area (CurrentBookInventory will be a card-like element) */}
      <div className="w-full max-w-5xl p-4">
        <CurrentBookInventory />
      </div>

      {/* Placeholder for future side pane */}
      <div className="w-1/4 p-4">
        {/* Side pane content (for later) */}
      </div>
    </div>
  </div>
);

export default ABInventory;
