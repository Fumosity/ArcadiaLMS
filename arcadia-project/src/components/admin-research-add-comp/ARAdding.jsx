import React, { useRef, useEffect } from "react";
import { supabase } from "../../supabaseClient.js";
import { v4 as uuidv4 } from "uuid";
import { addResearch, newThesisIDGenerator } from "../../backend/ARAddBackend.jsx";

const ARAdding = ({ formData, setFormData }) => {
  const pagesInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
        setFormData({ ...formData, cover: publicData.publicUrl });
      }
    }
  };

  const uploadFile = async (e) => {
    let thesisFile = e.target.files[0];
    const allowedExtensions = ['pdf'];
    const fileExtension = thesisFile.name.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      console.error("Unsupported file type. Please upload a PDF file.");
      return;
    }

    const filePath = `${uuidv4()}_${thesisFile.name}`;

    const { data, error } = await supabase.storage.from("research-files").upload(filePath, thesisFile, {
      cacheControl: '3600',
      upsert: false,
    });

    if (error) {
      console.error("Error uploading image: ", error);
    } else {
      const { data: publicData, error: urlError } = supabase.storage.from("research-files").getPublicUrl(filePath);

      if (urlError) {
        console.error("Error getting public URL: ", urlError.message);
      } else {
        setFormData({ ...formData, pdf: publicData.publicUrl });
      }
    }
  };

  const handleCoverClick = () => {
    coverInputRef.current.click();
  }

  const handlePagesClick = () => {
    pagesInputRef.current.click();
  }

  const handleSubmit = async () => {
    await addResearch(formData)
    setFormData({
      thesisID: '',
      title: '',
      author: [],
      college: '',
      department: '',
      abstract: '',
      keyword: [],
      location: '',
      arcID: '',
      pubDate: '',
      cover: '',
      pdf: ''
    });
  };

  useEffect(() => { newThesisIDGenerator(formData, setFormData) }, []);

  return (
    <div className="min-h-screen bg-gray-100">
    <div className="flex justify-center items-start p-8">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl flex">
        {/* Left Side: Form Section */}
        <div className="w-3/4">
          {/* Title */}
          <h2 className="text-3xl font-bold mb-4">Research Adding</h2>
          <p className="text-gray-600 mb-8">
            Data points marked with an asterisk (*) are autofilled. Use a semicolon to add multiple authors.
          </p>

          {/* Upload Section */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <p>Upload research pages to autofill.</p>
              <p className="text-gray-500">Accepted formats: (*.pdf, *.png, *.jpeg)</p>
            </div>
            <button className="upload-page-btn py-2 px-4 border-gray-400 rounded-2xl" onClick={ handlePagesClick }>
              Upload Pages
            </button>
            <input
              type="file"
              ref={ pagesInputRef }
              className="hidden"
              onChange={ uploadFile }
              accept="application/pdf"
            />
          </div>

          {/* Form Section */}
          <form className="space-y-6">
            <div className="flex justify-between items-center">
              <label className="w-1/4">Title:</label>
              <input type="text" name="title" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" value={formData.title} onChange={handleChange} />
            </div>
            <div className="flex justify-between items-center">
              <label className="w-1/4">Authors:</label>
              <input type="text" name="author" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" value={formData.author} onChange={handleChange} />
            </div>
            <div className="flex justify-between items-center">
              <label className="w-1/4">College:</label>
              <input type="text" name="college" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" value={formData.college} onChange={handleChange} />
            </div>
            <div className="flex justify-between items-center">
              <label className="w-1/4">Department:</label>
              <input type="text" name="department" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" value={formData.department} onChange={handleChange} />
            </div>
            <div className="flex justify-between items-center">
              <label className="w-1/4">Abstract:</label>
              <input type="text" name="abstract" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" value={formData.abstract} onChange={handleChange} />
            </div>
            <div className="flex justify-between items-center">
              <label className="w-1/4">Pages:</label>
              <input type="number" name="page" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" />
            </div>
            <div className="flex justify-between items-center">
              <label className="w-1/4">Keywords:</label>
              <input type="text" name="keyword" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" value={formData.keyword} onChange={handleChange} />
            </div>
            <div className="flex justify-between items-center">
              <label className="w-1/4">Date Published:</label>
              <input type="date" name="pubDate" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" value={formData.pubDate} onChange={handleChange} />
            </div>
            <div className="flex justify-between items-center">
              <label className="w-1/4">Location:</label>
              <input type="text" name="location" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" value={formData.location} onChange={handleChange} />
            </div>
            <div className="flex justify-between items-center">
              <label className="w-1/4">Database ID*:</label>
              <input type="text" name="thesisID" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" value={formData.thesisID} onChange={handleChange} />
            </div>
            <div className="flex justify-between items-center">
              <label className="w-1/4">ARC ID:</label>
              <input type="text" name="arcID" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" value={formData.arcID} onChange={handleChange} />
            </div>
          </form>

          {/* Add Research Button */}
          <div className="flex justify-center mt-8">
            <button type="button" onClick={ handleSubmit } className="add-research-btn py-2 px-8 border-gray-400 rounded-2xl">
              Add Research
            </button>
          </div>
        </div>

        {/* Right Side: Research Cover Placeholder */}
        <div className="w-60 ml-8 mt-72">
          <p className="font-bold text-lg mb-2">Research Cover*</p>
          <div className="relative bg-gray-100 p-4 h-50 border border-gray-400 rounded-lg" onClick={ handleCoverClick }> 
            <img
              src= {formData.cover || "image/researchcover.png" } // Replace with dynamic path or placeholder image
              alt="Research cover placeholder"
              className="h-full w-full object-contain mb-2"
            />
            <p className="text-xs text-gray-500 text-center">Click to update thesis cover</p>
          </div>
          <input
            type="file"
            ref={ coverInputRef }
            className="hidden"
            onChange={ uploadCover }
            accept="image/png, image/jpeg, image/jpg"
          />
        </div>
      </div>
    </div>
  </div>
  );
};

export default ARAdding;
