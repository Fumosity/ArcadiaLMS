import React from "react";
import MainHeader from "../components/main-comp/MainHeader";
import Navbar from "../components/main-comp/Navbar";
import Footer from "../components/main-comp/Footer";
import ARAdding from "../components/admin-research-add-comp/ARAdding";
import ARAddPreview from "../components/admin-research-add-comp/ARAddPreview";

const ARAdd = () => (
  <div className="min-h-screen bg-gray-100">
    {/* Main header */}
    <MainHeader />
    <Navbar />
    {/* Inventory title */}
    <div className="title">
      <div className="title-logo">
        <img src="image/arcadia.png" alt="Book icon" className="h-15 w-15 mr-2" />
        <h2 className="text-2xl font-semibold">Add a Research</h2>
      </div>
    </div>
    {/* Main content with flex layout */}
    <div className="flex justify-center items-start space-x-2 pb-12">
      <ARAdding />
      <ARAddPreview /> {/* Now positioned next to ARAdding */}
    </div>
    <Footer />
  </div>
);
export default ARAdd;
