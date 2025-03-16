import React, { useState } from "react";
import MainHeader from "../components/main-comp/MainHeader";
import Navbar from "../components/main-comp/Navbar";
import Footer from "../components/main-comp/Footer";
import ARAdding from "../components/admin-research-add-comp/ARAdding";
import ARAddPreview from "../components/admin-research-add-comp/ARAddPreview";
import Copyright from "../components/main-comp/Copyright";
import Title from "../components/main-comp/Title";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ARAdd = () => {
    const navigate = useNavigate(); // Initialize useNavigate
  
  const [formData, setFormData] = useState({
    researchID: '',
    title: '',
    author: [],
    college: '',
    department: '',
    abstract: '',
    keywords: [],
    location: '',
    researchCallNum: '',
    pubDate: '',
    cover: '',
    pdf: ''
  })

  return(
    <div className="min-h-screen bg-white">
    <Title>Research Adding</Title>
    <div className="flex justify-center items-start space-x-2 pb-12 pt-8 px-12">
        <div className="flex-shrink-0 w-3/4">
          {/* Main content for adding research */}
          <div className="flex justify-between w-full gap-2">
            <button
              className="add-book w-1/2 mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
              onClick={() => navigate('/admin/researchmanagement')}
            >
              Return to Research Inventory
            </button>
          </div>
          <ARAdding formData={formData} setFormData={setFormData} />
        </div>

        {/* Preview section */}
        <div className="flex flex-col items-start flex-shrink-0 w-1/4">
          <ARAddPreview formData={formData} />
        </div>
      </div>
  </div>
  );
};


export default ARAdd;