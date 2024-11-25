import React, { useEffect, useRef, useState } from "react";
import { addBook, generateNewBookID, generateProcDate } from "../../backend/ABAddBackend.jsx";
import { supabase } from "../../supabaseClient.js";
import { v4 as uuidv4 } from "uuid";

//Main Function
const ABAdding = ({ formData, setFormData }) => {
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cover, setCover] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  //Aggregates form inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.value) {
      setValidationErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: false }));
    }
  };

  //Holds and sends the uploaded cover image when submitted
  const uploadCover = async (e) => {
    let coverFile = e.target.files[0];
    const filePath = `${uuidv4()}_${coverFile.name}`;

    const { data, error } = await supabase.storage.from("book-covers").upload(filePath, coverFile, {
      cacheControl: '3600',
      upsert: false,
    });

    if (error) {
      console.error("Error uploading image: ", error);
    } else {
      const { data: publicData, error: urlError } = supabase.storage.from("book-covers").getPublicUrl(filePath);

      if (urlError) {
        console.error("Error getting public URL: ", urlError.message);
      } else {
        setFormData({ ...formData, cover: publicData.publicUrl });
        setValidationErrors((prevErrors) => ({ ...prevErrors, cover: false }));
      }
    }
  };

  //Opens file upload window on click
  const handleDivClick = () => {
    fileInputRef.current.click();
  }

  //Generate a new bookID and procDate
  useEffect(() => {
    generateNewBookID(setFormData);
    generateProcDate(setFormData);
  }, [setFormData]);

  const errorStyle = {
    border: '1px solid red'
  };

  //Handles the submission to the database
  const handleSubmit = async () => {
    console.log("formData before validation:", formData);

    if (!formData || typeof formData !== 'object') {
      console.error("formData is not defined or not an object.");
      return;
    }

    const newValidationErrors = {};

    Object.keys(formData).forEach((field) => {
      const value = formData[field];

      if (!value || (Array.isArray(value) && value.length === 0)) {
        newValidationErrors[field] = true;
      }
    });

    if (!formData.cover) {
      newValidationErrors.cover = true;
    }

    if (Object.keys(newValidationErrors).length > 0) {
      setValidationErrors(newValidationErrors);  // This ensures re-render with red borders
      return;
    }
    
    setValidationErrors({});
    setIsSubmitting(true);

    await addBook(formData)
    setFormData({
      title: '',
      author: [],
      genre: [],
      category: [],
      publisher: '',
      synopsis: '',
      keyword: [],
      currentPubDate: '',
      originalPubDate: '',
      procDate: '',
      location: '',
      bookID: '',
      arcID: '',
      isbn: '',
      cover: ''
    });

    setCover('');
    setFormData((prevData) => ({ ...prevData, cover: '' }));

    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }

    console.log(formData);
    generateNewBookID(setFormData);
    generateProcDate(setFormData);

    setIsSubmitting(false);
  };

  //Form
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex justify-center items-start p-8">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl flex">
          {/* Left Side: Form Section */}
          <div className="w-3/4">
            {/* Title */}
            <h2 className="text-3xl font-bold mb-4">Book Adding</h2>
            <p className="text-gray-600 mb-8">
              Data points marked with an asterisk (*) are autofilled. Use a semicolon to add multiple authors.
            </p>

            {/* Upload Section */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <p>Upload book pages to autofill.</p>
                <p className="text-gray-500">Accepted formats: (*.pdf, *.png, *.jpeg)</p>
              </div>
            </div>

            {/* Form Section */}
            <form className="space-y-6">
              <div className="flex justify-between items-center" key="title">
                <label className="w-1/4">Title:</label>
                <input type="text" name="title" required 
                  className="input-field w-2/3 p-2 border"
                  value={ formData.title } 
                  onChange={ handleChange } 
                  style={ validationErrors.title ? errorStyle : {} }
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Authors:</label>
                <input type="text" name="author" required 
                  className="input-field w-2/3 p-2 border"
                  value={ formData.author } 
                  onChange={ handleChange }
                  style={ validationErrors.author ? errorStyle : {} }
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Genre:</label>
                <input type="text" name="genre" required 
                  className="input-field w-2/3 p-2 border" 
                  value={ formData.genre } 
                  onChange={ handleChange }
                  style={ validationErrors.genre ? errorStyle : {} }
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Category:</label>
                <input type="text" name="category" required
                  className="input-field w-2/3 p-2 border"
                  value={formData.category} 
                  onChange={handleChange} 
                  style={ validationErrors.category ? errorStyle : {} }
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Publisher:</label>
                <input type="text" name="publisher" required 
                  className="input-field w-2/3 p-2 border"
                  value={formData.publisher} 
                  onChange={handleChange} 
                  style={ validationErrors.publisher ? errorStyle : {} }
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Synopsis:</label>
                <textarea name="synopsis" required 
                  className="input-field w-2/3 p-2 border"
                  rows="3" 
                  value={formData.synopsis} 
                  onChange={handleChange} 
                  style={ validationErrors.synopsis ? errorStyle : {} }
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Keywords:</label>
                <input type="text" name="keyword" required 
                  className="input-field w-2/3 p-2 border"
                  value={formData.keyword} 
                  onChange={handleChange} 
                  style={ validationErrors.keyword ? errorStyle : {} }
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Date Published (Current):</label>
                <input type="date" name="currentPubDate" required 
                  className="input-field w-2/3 p-2 border"
                  value={formData.currentPubDate} 
                  onChange={handleChange} 
                  style={ validationErrors.currentPubDate ? errorStyle : {} }
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Date Published (Original):</label>
                <input type="date" name="originalPubDate" required 
                  className="input-field w-2/3 p-2 border"
                  value={formData.originalPubDate} 
                  onChange={handleChange} 
                  style={ validationErrors.originalPubDate ? errorStyle : {} }
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Date Procured:</label>
                <input type="date" name="procDate" required 
                  className="input-field w-2/3 p-2 border"
                  value={formData.procDate} 
                  onChange={handleChange} 
                  style={ validationErrors.procDate ? errorStyle : {} }
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Location:</label>
                <input type="text" name="location" required 
                  className="input-field w-2/3 p-2 border"
                  value={formData.location} 
                  onChange={handleChange}
                  style={ validationErrors.location ? errorStyle : {} } 
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Database ID*:</label>
                <input type="text" name="bookID" required 
                  className="input-field w-2/3 p-2 border" 
                  value={formData.bookID} 
                  onChange={handleChange} 
                  style={ validationErrors.bookID ? errorStyle : {} }
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">ARC ID:</label>
                <input type="text" name="arcID" required 
                  className="input-field w-2/3 p-2 border"
                  value={formData.arcID} 
                  onChange={handleChange} 
                  style={ validationErrors.arcID ? errorStyle : {} }
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">ISBN:</label>
                <input type="text" name="isbn" required 
                  className="input-field w-2/3 p-2 border"
                  value={formData.isbn} 
                  onChange={handleChange} 
                  style={ validationErrors.isbn ? errorStyle : {} }
                />
              </div>
            </form>

            {/* Add Book Button */}
            <div className="flex justify-center mt-8">
              <button type="button" onClick={handleSubmit} className="add-research-btn py-2 px-8 border-gray-400 rounded-2xl">
              {isSubmitting ? "Submitting..." : "Add Book"}
              </button>
            </div>
          </div>

          {/* Right Side: Book Cover Placeholder */}
          <div className="w-60 ml-8 mt-72">
            <p className="font-bold text-lg mb-2">Book Cover*</p>
            <div className="relative bg-gray-100 p-4 h-50 border rounded-lg" onClick={ handleDivClick }>   
              <img
                src= { formData.cover || 'N/A'}
                alt="Book cover placeholder"
                className="h-full w-full object-contain mb-2"
              />
              <p className="text-xs text-gray-500 text-center">Click to update book cover</p>
            </div>
            <input type="file" ref={fileInputRef} required className="hidden" onChange={uploadCover} accept="image/png, image/jpeg, image/jpg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ABAdding;