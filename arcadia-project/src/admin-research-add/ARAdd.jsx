import React from "react";
import MainHeader from "../components/main-comp/MainHeader";
import Navbar from "../components/main-comp/Navbar";
import Footer from "../components/main-comp/Footer";
import ARAdding from "../components/admin-research-add-comp/ARAdding";
import ARAddPreview from "../components/admin-research-add-comp/ARAddPreview";
import Copyright from "../components/main-comp/Copyright";
import Title from "../components/main-comp/Title";

const ARAdd = () => (
  <div className="min-h-screen bg-gray-100">
    {/* Main header */}
    <MainHeader />
    <Title>Research Adding</Title>
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          {/* Main content for adding research */}
          <ARAdding />
        </div>

        {/* Preview section */}
        <div className="lg:col-span-1 space-y-8">
          <ARAddPreview />
        </div>
      </div>
    </main>
  </div>
);

export default ARAdd;
