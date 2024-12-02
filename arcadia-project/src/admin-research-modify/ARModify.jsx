import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MainHeader from "../components/main-comp/MainHeader";
import Title from "../components/main-comp/Title";
import ResearchModify from "../components/admin-research-modify/ResearchModify";

const ARModify = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  
  // Retrieve research details from query params
  const formData = {
    title: queryParams.get("title") || '',
    author: queryParams.get("author") || '',
    college: queryParams.get("college") || '',
    department: queryParams.get("department") || '',
    abstract: queryParams.get("abstract") || '',
    keyword: queryParams.get("keyword") || '',
    pubDate: queryParams.get("pubDate") || '',
    location: queryParams.get("location") || '',
    thesisID: queryParams.get("thesisID") || '',
    arcID: queryParams.get("arcID") || '',
    cover: queryParams.get("cover") || '',
  };

  const [formDataState, setFormData] = useState(formData);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main header */}
      <MainHeader />
      <Title>Modify Research</Title>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-8">
            {/* Pass formDataState and setFormData to ResearchModify */}
            <ResearchModify formData={formDataState} setFormData={setFormData} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ARModify;