import React, { useState, useEffect, useRef } from "react";
import { addBook, newIDAndProcDateGenerator } from "../../backend/ABAddBackend.jsx";
import { supabase } from "../../supabaseClient.js";
import { v4 as uuidv4 } from "uuid";

const ABAdding = ({ formData, setFormData }) => {
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
      }
    }
  };

  const handleDivClick = () => {
    fileInputRef.current.click();
  }

  useEffect(() => {
    const generateNewIDAndProcDate = async () => {
      await newIDAndProcDateGenerator(formData, setFormData);
    };
    generateNewIDAndProcDate();
  }, []);

  const handleSubmit = async () => {
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
      quantity: '',
      cover: ''
    });
  };

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
                <input type="text" name="title" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" value={formData.title} onChange={handleChange} />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Authors:</label>
                <input type="text" name="author" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" value={formData.author} onChange={handleChange} />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Genre:</label>
                <input type="text" name="genre" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" value={formData.genre} onChange={handleChange} />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Category:</label>
                <input type="text" name="category" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" value={formData.category} onChange={handleChange} />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Publisher:</label>
                <input type="text" name="publisher" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" value={formData.publisher} onChange={handleChange} />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Synopsis:</label>
                <textarea name="synopsis" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" rows="3" value={formData.synopsis} onChange={handleChange} />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Keywords:</label>
                <input type="text" name="keyword" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" value={formData.keyword} onChange={handleChange} />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Date Published (Current):</label>
                <input type="date" name="currentPubDate" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" value={formData.currentPubDate} onChange={handleChange} />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Date Published (Original):</label>
                <input type="date" name="originalPubDate" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" value={formData.originalPubDate} onChange={handleChange} />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Date Procured:</label>
                <input type="date" name="procDate" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" value={formData.procDate} onChange={handleChange} />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Location:</label>
                <input type="text" name="location" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" value={formData.location} onChange={handleChange} />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Database ID*:</label>
                <input type="text" name="bookID" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" value={formData.bookID} onChange={handleChange} />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">ARC ID:</label>
                <input type="text" name="arcID" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" value={formData.arcID} onChange={handleChange} />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">ISBN:</label>
                <input type="text" name="isbn" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" value={formData.isbn} onChange={handleChange} />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Quantity:</label>
                <input type="number" name="quantity" className="input-field w-2/3 p-2 border border-gray-400 rounded-xl" value={formData.quantity} onChange={handleChange} />
              </div>
            </form>

            {/* Add Book Button */}
            <div className="flex justify-center mt-8">
              <button type="button" onClick={handleSubmit} className="add-research-btn py-2 px-8 border-gray-400 rounded-2xl">
                Add Book
              </button>
            </div>
          </div>

          {/* Right Side: Book Cover Placeholder */}
          <div className="w-60 ml-8 mt-72">
            <p className="font-bold text-lg mb-2">Book Cover*</p>
            <div className="relative bg-gray-100 p-4 h-50 border border-gray-400 rounded-lg" onClick={ handleDivClick }> 
              <img
                src= { formData.cover || 'N/A'} // Replace with dynamic path or placeholder image
                alt="Book cover placeholder"
                className="h-full w-full object-contain mb-2"
              />
              <p className="text-xs text-gray-500 text-center">Click to update book cover</p>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={uploadCover} 
              accept="image/png, image/jpeg, image/jpg" // Specify accepted formats
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ABAdding;
