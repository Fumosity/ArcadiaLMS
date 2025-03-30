import React, { useRef, useEffect, useState } from "react";
import { supabase } from "../../supabaseClient.js";
import { v4 as uuidv4 } from "uuid";
import { addResearch, newThesisIDGenerator } from "../../backend/ARAddBackend.jsx";
import ResearchUploadModal from '../../z_modals/ResearchUploadModal';
import ARAddPreview from "../admin-research-add-comp/ARAddPreview";
import { getDocument } from 'pdfjs-dist';
import * as pdfjsLib from 'pdfjs-dist';
import { GlobalWorkerOptions } from 'pdfjs-dist';

// Set the worker source explicitly
GlobalWorkerOptions.workerSrc = '/pdfjs-dist/pdf.worker.min.mjs';

//Main Function
const ARAdding = ({ formData, setFormData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pageCount, setPageCount] = useState(0);

  const collegeDepartmentMap = {
    "COECSA": ["DOA", "DCS", "DOE"],
    "CLAE": [""],
    "CITHM": [""],
    "CAMS": [""],
    "CON": [""],
    "CBA": [""],
    "LAW": [""],
    "CFAD": [""],
    "IS": ["JHS", "SHS"],
    "Graduate School": [""],
  };

  //Aggregates form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const updateDepartmentOptions = (college) => {
    // Assuming `collegeDepartmentMap` contains the mapping from college to an array of departments
    const options = collegeDepartmentMap[college] || [];

    setDepartmentOptions(options);

    // If the currently selected department is no longer valid for the new college, reset it
    setFormData((prevData) => ({
      ...prevData,
      department: options.includes(prevData.department) ? prevData.department : "", // reset department if invalid
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


  // Function to handle extracted data and update formData
  const handleExtractedData = (data) => {
    setFormData((prevData) => ({
      ...prevData,
      ...data,
      college: data.college,
      department: data.department,  // Ensure department is set from extracted data if available
    }));
    updateDepartmentOptions(data.college);  // Ensure department options are updated when data is autofilled
  };

  //Handles the submission to the database
  const handleSubmit = async () => {

    const requiredFields = ["title", "author", "college", "department", "abstract", "keyword", "pubDate", "location", "researchID", "researchCallNum",];

    // Ensure formData is fully updated
    const updatedFormData = { ...formData }; // Capture current formData

    // Check for missing fields
    const missingFields = requiredFields.filter(
      (field) => !updatedFormData[field] ||
        (typeof updatedFormData[field] === "string" && !updatedFormData[field].trim())
    );
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(", ")}`);
      return;
    }

    const arcIdRegex = /^LPUCAV\d{6}$/;
    if (!arcIdRegex.test(formData.researchCallNum)) {
      alert("ARC ID must follow the format (e.g., LPUCAV012345).");
      return;
    }

    setIsSubmitting(true);
    const pdfUrls = [];
    const imageUrls = [];

    console.log(uploadedFiles)

    if (!Array.isArray(uploadedFiles)) {
      console.error("uploadedFiles is not an array:", uploadedFiles);
      return;
    }

    for (const file of uploadedFiles) { //error here
      const filePath = `${uuidv4()}_${file.name}`;
      const { error } = await supabase.storage.from("research-files").upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

      if (error) {
        console.error("Error uploading file: ", error);
      } else {
        const { data: publicData, error: urlError } = supabase.storage.from("research-files").getPublicUrl(filePath);
        if (urlError) {
          console.error("Error getting public URL: ", urlError.message);
        } else {
          if (file.type === "application/pdf") {
            pdfUrls.push(publicData.publicUrl);
          } else if (file.type.startsWith("image/")) {
            imageUrls.push(publicData.publicUrl);
          }
        }
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      pdf: pdfUrls.join(', '),
      images: imageUrls.join(', '),
    }));

    await addResearch({ ...formData, pdf: pdfUrls.join(', '), images: imageUrls.join(', '), pages: formData.pages });

    setFormData({
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
      pdf: '',
      images: '',
      pages: ''
    });

    setUploadedFiles([]);
    await newThesisIDGenerator({}, setFormData);
    setIsSubmitting(false);
  };

  //Generate a new researchID
  useEffect(() => { newThesisIDGenerator(formData, setFormData) }, []);

  //Form
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border border-grey rounded-lg p-4 w-full h-fit">
        <h2 className="text-2xl font-semibold mb-4">Research Adding</h2>
        <div className='flex'>
          {/* Left Side: Form Section */}
          <div className="w-2/3">
            <p className="text-gray-600 mb-8">
              Data points marked with an asterisk (*) are autofilled. Use a semicolon (;) or comma (,) to add multiple authors and keywords.
            </p>

            <h3 className="text-xl font-semibold my-2">Research Paper Upload</h3>

            <div className="flex-col justify-between items-center mb-6 space-y-2">
              <div className="">
                <p>Upload research pages to autofill. Include the Title Page, Abstract, and Keywords for best results.</p>
                <p className="text-gray-500">Accepted formats: (*.pdf, *.png, *.jpeg)</p>
              </div>
              <div className="flex justify-end w-full">
                <button
                  className="add-book w-1/3 mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
                  onClick={() => setIsModalOpen(true)}
                >
                  Upload Pages
                </button>
              </div>
            </div>

            {uploadedFiles.length > 0 && (
              <p className="text-grey mb-4">
                Uploaded Files: {uploadedFiles.map(file => file.name).join(', ')}
              </p>
            )}

            <h3 className="text-xl font-semibold my-2">Research Paper Information</h3>

            <form className="space-y-2">
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
                      className="w-full px-3 py-1 rounded-full border border-grey appearance-none"
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
                      className="w-full px-3 py-1 rounded-full border border-grey appearance-none"
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
                <label className="w-1/4">Abstract:</label>
                <input type="text" name="abstract" className="w-2/3 px-3 py-1 rounded-full border border-grey" value={formData.abstract} onChange={handleChange} placeholder="Full Abstract Text" required />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Pages:</label>
                <input type="number" name="pages" className="w-2/3 px-3 py-1 rounded-full border border-grey" value={pageCount} placeholder="No. of pages" required />
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
              <div className="justify-between items-center hidden">
                <label className="w-1/4">Database ID*:</label>
                <input type="number" name="researchID" className="w-2/3 px-3 py-1 rounded-full border border-grey" value={formData.researchID} onChange={handleChange} required />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Call Number:</label>
                <input type="text" name="researchCallNum" className="w-2/3 px-3 py-1 rounded-full border border-grey" value={formData.researchCallNum} onChange={handleChange} placeholder="ARC Issued ID, eg. LPUCAV012345" required />
              </div>
            </form>
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <button type="button" onClick={handleSubmit} className="add-book w-1/4 mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition">
            {isSubmitting ? "Submitting..." : "Add Research"}
          </button>
        </div>
      </div>

      <ResearchUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFileSelect={handleFileSelect}
        onExtractedData={handleExtractedData}    // For autofill data
        onPageCountChange={setPageCount}
      />
    </div>
  );
};

export default ARAdding;