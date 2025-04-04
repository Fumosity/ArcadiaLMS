import React, { useRef, useEffect, useState } from "react";
import { supabase } from "../../supabaseClient.js";
import { v4 as uuidv4 } from "uuid";
import WrngRmvRsrchInv from "../../z_modals/warning-modals/WrngRmvRsrchInv";
import {useNavigate } from "react-router-dom";

const ResearchModify = ({ formData, setFormData, onSave }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [formDataState] = useState(formData);
  const navigate = useNavigate();

  const handleResearchDelete = async () => {
    const researchID = formDataState.researchID;
    if (!researchID) {
      alert("No research title selected for deletion.");
      return;
    }

    const { error } = await supabase
      .from("research")
      .delete()
      .eq("researchID", researchID);

    if (error) {
      alert("Failed to delete research: " + error.message);
    } else {
      alert("Research deleted successfully.");
      navigate("/admin/researchmanagement");
    }
  };

  const collegeDepartmentMap = {
    "CAMS": [],
    "CLAE": [],
    "CBA": [],
    "COECSA": ["DOA", "DCS", "DOE"],
    "CFAD": [],
    "CITHM": [],
    "CON": []
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const initialFormData = {
      title: queryParams.get("title") || '',
      author: queryParams.get("author") || [],
      college: queryParams.get("college") || '',
      department: queryParams.get("department") || '',
      abstract: queryParams.get("abstract") || '',
      keywords: queryParams.get("keywords") || '',
      pubDate: queryParams.get("pubDate") || '',
      location: queryParams.get("location") || '',
      researchID: queryParams.get("researchID") || '',
      researchCallNum: queryParams.get("researchCallNum") || '',
    };

    setFormData(initialFormData);
  }, [location.search, setFormData]);

  useEffect(() => {
    if (formData.college) {
      updateDepartmentOptions(formData.college);
    }
  }, [formData.college]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReset = async () => {
    const queryParams = new URLSearchParams(location.search);
    const initialFormData = {
      title: queryParams.get("title") || '',
      author: queryParams.get("author") || [],
      college: queryParams.get("college") || '',
      department: queryParams.get("department") || '',
      abstract: queryParams.get("abstract") || '',
      keywords: queryParams.get("keywords") || '',
      pubDate: queryParams.get("pubDate") || '',
      location: queryParams.get("location") || '',
      researchID: queryParams.get("researchID") || '',
      researchCallNum: queryParams.get("researchCallNum") || '',
    };

    console.log(initialFormData)

    setFormData(initialFormData);
  }

  const handleSave = async () => {
    if (!formData || !formData.researchID) {
      console.error("Invalid form data or missing researchID");
      return;
    }

    const { researchID, ...rest } = formData;

    // Convert `keywords` into an array for JSONB storage
    const processKeywords = (keywords) => {
      if (!keywords) return [];
      return Array.isArray(keywords)
        ? keywords.map((k) => k.trim()).filter((k) => k !== "")
        : keywords.split(/[,;]+/).map((k) => k.trim()).filter((k) => k !== "");
    };

    // Convert array/string values properly (excluding category since it's derived from genres)
    const updateData = Object.fromEntries(
      Object.entries(rest)
        .filter(([key]) => key !== 'category')
        .map(([key, value]) => {
          if (key === "keywords") {
            return [key, processKeywords(value)]; // Store as JSONB array
          }
          if (key === "author") {
            return [key, processKeywords(value)]; // Store as JSONB array
          }
          return [key, value];
        })
    );


    try {
      const { data, error } = await supabase
        .from("research")
        .update(updateData)
        .match({ researchID });

      if (error) throw error;

      console.log("Research updated successfully:", data);
      if (onSave) await onSave(formData);
    } catch (err) {
      console.error("Error updating research:", err);
    }
    alert("Changes saved successfully!");
  };

  const updateDepartmentOptions = (college) => {
    const options = collegeDepartmentMap[college] || [];
    setDepartmentOptions(options);

    setFormData((prevData) => ({
      ...prevData,
      department: options.length > 0 && options.includes(prevData.department) ? prevData.department : "",
    }));
  };

  // Separate function to handle file uploads
  const handleFileSelect = async (files) => {
    console.log("Files received in handleFileSelect:", files);

    if (!Array.isArray(files)) {
      setUploadedFiles([]);
      setPageCount(0);
      return;
    }

    setUploadedFiles(files);
    setPageCount(files.length);
  };


  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border border-grey rounded-lg p-4 w-full h-fit">
        <h2 className="text-2xl font-semibold mb-4">Research Modify</h2>
        <div className='flex'>
          {/* Left Side: Form Section */}
          <div className="w-full">
            <p className="text-gray-600 mb-8">
              Use a semicolon (;) or comma (,) to add multiple authors and keywords.
            </p>

            <div className="flex-col justify-between items-center mb-6 space-y-2">
              <div className="flex justify-start w-full">
                <button
                  className="add-book w-1/2 mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
                  onClick={() => setIsModalOpen(true)}
                >
                  Upload Pages to Autofill
                </button>
              </div>
            </div>

            <h3 className="text-xl font-semibold my-2">Research Paper Information</h3>

            <form className="space-y-2">
              <div className="flex justify-between items-start space-x-2">
                <div className="flex-col justify-between items-center w-1/2 space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="w-1/4">Title:</label>
                    <input type="text" name="title" className="w-2/3 px-3 py-1 rounded-full border border-grey" value={formData.title} onChange={handleChange} placeholder="Full Research Title" required />
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="w-1/4">Authors:</label>
                    <input type="text" name="author" className="w-2/3 px-3 py-1 rounded-full border border-grey" value={formData.author} onChange={handleChange} placeholder="Author 1; Author 2; Author 3;..." required />
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="w-1/4">College:</label>
                    <div className="select-dropdown-wrapper w-2/3">
                      <select
                        name="college"
                        className="w-full px-3 py-1 rounded-full border border-grey appearance-none"
                        value={formData.college}
                        onChange={(e) => {
                          handleChange(e);
                          updateDepartmentOptions(e.target.value);
                        }}
                      >
                        <option value="">Select a college</option>
                        {Object.keys(collegeDepartmentMap).map((college) => (
                          <option key={college} value={college}>
                            {college}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {formData.college === "COECSA" && (
                    <div className="flex justify-between items-center">
                      <label className="w-1/4">Department:</label>
                      <div className="select-dropdown-wrapper w-2/3">
                        <select
                          name="department"
                          className="w-full px-3 py-1 rounded-full border border-grey"
                          value={formData.department}
                          onChange={handleChange}
                        >
                          <option value="">Select a department</option>
                          {departmentOptions.map((department) => (
                            <option key={department} value={department}>
                              {department}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                  {formData.college === "IS" && (
                    <div className="flex justify-between items-center">
                      <label className="w-1/4">High School Level:</label>
                      <div className="select-dropdown-wrapper w-2/3">
                        <select
                          name="department"
                          className="w-full px-3 py-1 rounded-full border border-grey"
                          value={formData.department}
                          onChange={handleChange}
                        >
                          <option value="">Select level</option>
                          {departmentOptions.map((department) => (
                            <option key={department} value={department}>
                              {department}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                  <label className="w-1/4">Pages:</label>
                    <input type="number" name="pages" className="w-2/3 px-3 py-1 rounded-full border border-grey" value={formData.pages} onChange={handleChange} min="0" placeholder="No. of pages" required />
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="w-1/4">Keywords:</label>
                    <input type="text" name="keyword" className="w-2/3 px-3 py-1 rounded-full border border-grey" value={formData.keyword} onChange={handleChange} placeholder="Keyword 1; Keyword 2; Keyword 3;..." required />
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="w-1/4">Date Published:</label>
                    <input type="date" name="pubDate" className="w-2/3 px-3 py-1 rounded-full border border-grey" value={formData.pubDate} onChange={handleChange} required />
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="w-1/4">Location:</label>
                    <input type="text" name="location" className="w-2/3 px-3 py-1 rounded-full border border-grey" value={formData.location} onChange={handleChange} placeholder="Shelf Location" required />
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="w-1/4">Call Number:</label>
                    <input type="text" name="researchCallNum" className="w-2/3 px-3 py-1 rounded-full border border-grey" value={formData.researchCallNum} onChange={handleChange} placeholder="ARC Issued ID, eg. CITHM-123" required />
                  </div>
                  <div className="justify-between items-center hidden">
                    <label className="w-1/4">Database ID*:</label>
                    <input type="number" name="researchID" className="w-2/3 px-3 py-1 rounded-full border border-grey" value={formData.researchID} onChange={handleChange} required />
                  </div>
                </div>
                <div className="flex flex-col justify-between items-start w-1/2 space-y-2">
                  <label className="w-1/4 h-8">Abstract:</label>
                  <textarea type="text" name="abstract" className="w-full px-3 py-1 rounded-2xl border border-grey min-h-72" value={formData.abstract} onChange={handleChange} placeholder="Full Abstract Text" required />
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="flex justify-center mt-8 gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="add-book w-1/4 mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
          >
            Reset Changes
          </button>
          <button
              className="add-book w-1/4 mb-2 px-4 py-2 rounded-lg bg-arcadia-red hover:red text-white"
              onClick={() => setIsModalOpen(true)}
            >
              Delete Research
            </button>
          <button
            type="button"
            onClick={handleSave}
            className="add-book w-1/4 mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
          >
            Save Changes
          </button>
        </div>
      </div>
      <WrngRmvRsrchInv
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRemove={handleResearchDelete}
      />
    </div>
  );
};

export default ResearchModify;
