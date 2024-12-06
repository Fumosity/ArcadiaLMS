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
  const coverInputRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pageCount, setPageCount] = useState(0); 

  const collegeDepartmentMap = {
    "CAMS": [""],
    "CLAE": [""],
    "CBA": [""],
    "COECSA": ["DOA", "DCS", "DOE"],
    "CFAD": [""],
    "CITHM": [""],
    "CON": [""]
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
  
  //Holds and sends the uploaded cover image when submitted
  const uploadCover = async (e) => {
    let coverFile = e.target.files[0];
    const filePath = `${uuidv4()}_${coverFile.name}`;

    const { data, error } = await supabase.storage.from("research-covers").upload(filePath, coverFile, {
      cacheControl: '3600',
      upsert: false,
    });

    if (error) {
      console.error("Error uploading image: ", error);
    } else {
      const { data: publicData, error: urlError } = supabase.storage.from("research-covers").getPublicUrl(filePath);

      if (urlError) {
        console.error("Error getting public URL: ", urlError.message);
      } else {
        setFormData((prevData) => ({
          ...prevData,
          cover: publicData.publicUrl,
        }));
      }
    }
  };

  //Checks if the cover image input field was clicked
  const handleCoverClick = () => {
    coverInputRef.current.click();
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
  
    // Check for the first file and set it as the cover
    const firstFile = files[0];
    if (!firstFile) return;
  
    try {
      // If the first file is an image
      if (firstFile.type.startsWith("image/")) {
        const filePath = `${uuidv4()}_${firstFile.name}`;
        const { error } = await supabase.storage.from("research-covers").upload(filePath, firstFile, {
          cacheControl: "3600",
          upsert: false,
        });
  
        if (error) {
          console.error("Error uploading image cover: ", error);
        } else {
          const { data: publicData, error: urlError } = supabase.storage.from("research-covers").getPublicUrl(filePath);
          if (urlError) {
            console.error("Error getting public URL for cover image: ", urlError.message);
          } else {
            setFormData((prevData) => ({
              ...prevData,
              cover: publicData.publicUrl, // Set the public URL as the cover
              pages: files.length, 
            }));
          }
        }
      }
      // If the first file is a PDF
      else if (firstFile.type === "application/pdf") {
        // Extract the first page of the PDF as an image (requires a library like `pdfjs-dist`)
        const fileReader = new FileReader();
        fileReader.onload = async () => {
          const pdfData = new Uint8Array(fileReader.result);
  
          // Use pdfjs-dist to load the PDF and render the first page as an image
          const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

          const totalPages = pdf.numPages;
          
          const page = await pdf.getPage(1);
          const viewport = page.getViewport({ scale: 1.5 });
  
          // Render the page to a canvas
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
  
          const context = canvas.getContext("2d");
          await page.render({ canvasContext: context, viewport }).promise;
  
          // Convert canvas to a Blob (image)
          canvas.toBlob(async (blob) => {
            const filePath = `${uuidv4()}_cover.jpg`;
            const { error } = await supabase.storage.from("research-covers").upload(filePath, blob, {
              cacheControl: "3600",
              upsert: false,
            });
  
            if (error) {
              console.error("Error uploading cover from PDF: ", error);
            } else {
              const { data: publicData, error: urlError } = supabase.storage.from("research-covers").getPublicUrl(filePath);
              if (urlError) {
                console.error("Error getting public URL for cover image: ", urlError.message);
              } else {
                setFormData((prevData) => ({
                  ...prevData,
                  cover: publicData.publicUrl, // Set the public URL as the cover
                  pages: totalPages,
                }));
              }
            }
          }, "image/jpeg");
        };
  
        fileReader.readAsArrayBuffer(firstFile);
      }
    } catch (error) {
      console.error("Error processing cover file:", error);
    }
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
    
    const requiredFields = ["title", "author", "college", "department", "abstract", "keyword", "pubDate", "location", "researchID", "researchARCID", "pages",];

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
    if (!arcIdRegex.test(formData.researchARCID)) {
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
      researchARCID: '',
      pubDate: '',
      cover: '',
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
      <div className="flex justify-center items-start p-8">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl flex">
          <div className="w-3/4">
            <h2 className="text-3xl font-bold mb-4">Research Adding</h2>
            <p className="text-gray-600 mb-8">
              Data points marked with an asterisk (*) are autofilled. Use a semicolon to add multiple authors.
            </p>

            <div className="flex justify-between items-center mb-6">
              <div>
                <p>Upload research pages to autofill.</p>
                <p className="text-gray-500">Accepted formats: (*.pdf, *.png, *.jpeg)</p>
              </div>
              <button
                className="upload-page-btn py-2 px-4 border-gray-400 rounded-2xl"
                onClick={() => setIsModalOpen(true)}
              >
                Upload Pages
              </button>
            </div>

            {uploadedFiles.length > 0 && (
              <p className="text-grey mb-4">
                Uploaded Files: {uploadedFiles.map(file => file.name).join(', ')}
              </p>
            )}

            <form className="space-y-6">
              <div className="flex justify-between items-center">
                <label className="w-1/4">Title:</label>
                <input type="text" name="title" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" value={formData.title} onChange={handleChange} placeholder="Full Research Title" required />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Authors:</label>
                <input type="text" name="author" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" value={formData.author} onChange={handleChange} placeholder="Author 1; Author 2; Author 3;..." required />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">College:</label>
                <div className="select-dropdown-wrapper w-2/3">
                  <select
                    name="college"
                    className="select-dropdown"
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
                      className="select-dropdown"
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

              <div className="flex justify-between items-center">
                <label className="w-1/4">Abstract:</label>
                <input type="text" name="abstract" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" value={ formData.abstract } onChange={ handleChange }  placeholder="Full Abstract Text" required />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Pages:</label>
                <input type="number" name="pages" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" value={pageCount} placeholder="No. of pages" required/>
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Keywords:</label>
                <input type="text" name="keyword" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" value={ formData.keyword } onChange={ handleChange } placeholder="Keyword 1; Keyword 2; Keyword 3;..." required />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Date Published:</label>
                <input type="date" name="pubDate" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" value={ formData.pubDate } onChange={ handleChange } required />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Location:</label>
                <input type="text" name="location" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" value={ formData.location } onChange={ handleChange } placeholder="Shelf Location" required />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Database ID*:</label>
                <input type="number" name="researchID" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" value={ formData.researchID } onChange={ handleChange } required />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">ARC ID:</label>
                <input type="text" name="researchARCID" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" value={ formData.researchARCID } onChange={ handleChange } placeholder="ARC Issued ID, eg. LPUCAV012345" required />
              </div>
            </form>

            <div className="flex justify-center mt-8">
              <button type="button" onClick={ handleSubmit } className="add-research-btn py-2 px-8 border-gray-400 rounded-2xl">
                {isSubmitting ? "Submitting..." : "Add Research"}
              </button>
            </div>
          </div>

          <div className="w-60 ml-8 mt-72">
            <p className="font-bold text-lg mb-2">Research Cover*</p>
            <div className="relative bg-gray-100 p-4 h-50 border border-gray-400 rounded-lg hover:bg-grey
            " onClick={ handleCoverClick }>
              <img
                src={formData.cover || "/image/book_research_placeholder.png"}
                alt="Research cover placeholder"
                className="h-full w-full object-contain mb-2"
              />
              <p className="text-xs text-gray-500 text-center">Click to update thesis cover</p>
            </div>
            <input type="file" ref={ coverInputRef } className="hidden" onChange={ uploadCover } accept="image/png, image/jpeg, image/jpg" required />
          </div>
        </div>
      </div>

      <ResearchUploadModal
        isOpen={isModalOpen}
        onClose={ () => setIsModalOpen(false) }
        onFileSelect={ handleFileSelect }
        onExtractedData={handleExtractedData}    // For autofill data
        onPageCountChange={setPageCount}
      />
    </div>
  );
};

export default ARAdding;