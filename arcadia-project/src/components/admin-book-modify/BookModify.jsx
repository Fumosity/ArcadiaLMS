import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../../supabaseClient.js";
import { v4 as uuidv4 } from "uuid";
import BookCopiesIndiv from "./BookCopiesIndiv";

const BookModify = ({ formData, setFormData, onSave }) => {
  const fileInputRef = useRef(null);
  const location = useLocation();

  console.log("Title ID in BookModify:", formData.titleID);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const initialFormData = {
      title: params.get("title") || "",
      author: params.get("author") || [],
      genre: params.get("genre") || [],
      category: params.get("category") || [],
      publisher: params.get("publisher") || "",
      synopsis: params.get("synopsis") || "",
      keyword: params.get("keywords") || [],
      currentPubDate: params.get("republished") || "",
      originalPubDate: params.get("datePublished") || "",
      quantity: params.get("quantity") || 0,
      procDate: params.get("procurementDate") || "",
      cover: params.get("cover") || "",
      titleID: params.get("titleID") || null,
      bookARCID: params.get("bookARCID") || null, // New parameter
    };

    setFormData(initialFormData);
  }, [location.search, setFormData]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const uploadCover = async (e) => {
    let coverFile = e.target.files[0];
    const filePath = `${uuidv4()}_${coverFile.name}`;

    const { data, error } = await supabase.storage.from("book-covers").upload(filePath, coverFile, {
      cacheControl: "3600",
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
  };

  const handleSave = async () => {
    if (!formData || !formData.titleID) {
      console.error("Invalid form data or missing titleID");
      return;
    }

    const { titleID, ...rest } = formData;

    const updateData = Object.fromEntries(
      Object.entries(rest).map(([key, value]) => {
        if (["author", "genre", "category", "keyword"].includes(key)) {
          return [key, Array.isArray(value) ? value : value.split(";").map((v) => v.trim())];
        }
        return [key, value];
      })
    );

    const { data, error } = await supabase
      .from("book_titles")
      .update(updateData)
      .match({ titleID });

    if (error) {
      console.error("Error updating book: ", error);
    } else {
      console.log("Book updated successfully:", data);
      if (onSave) {
        await onSave(formData);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex justify-center items-start p-8">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl flex">
          {/* Left Side: Form Section */}
          <div className="w-3/4">
            <h2 className="text-3xl font-bold mb-4">Modify Book</h2>
            <p className="text-gray-600 mb-8">
              Data points marked with an asterisk (*) are autofilled. Use a semicolon to add multiple authors.
            </p>

            <form className="space-y-6">
              <div className="flex justify-between items-center">
                <label className="w-1/4">Title:</label>
                <input
                  type="text"
                  name="title"
                  className="input-field w-2/3 p-2 border border-gray-400 rounded-xl"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Authors:</label>
                <input
                  type="text"
                  name="author"
                  className="input-field w-2/3 p-2 border border-gray-400 rounded-xl"
                  value={formData.author}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Genre:</label>
                <input
                  type="text"
                  name="genre"
                  className="input-field w-2/3 p-2 border border-gray-400 rounded-xl"
                  value={formData.genre}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Category:</label>
                <input
                  type="text"
                  name="category"
                  className="input-field w-2/3 p-2 border border-gray-400 rounded-xl"
                  value={formData.category}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Publisher:</label>
                <input
                  type="text"
                  name="publisher"
                  className="input-field w-2/3 p-2 border border-gray-400 rounded-xl"
                  value={formData.publisher}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Synopsis:</label>
                <textarea
                  name="synopsis"
                  className="input-field w-2/3 p-2 border border-gray-400 rounded-xl"
                  rows="3"
                  value={formData.synopsis}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Keywords:</label>
                <input
                  type="text"
                  name="keyword"
                  className="input-field w-2/3 p-2 border border-gray-400 rounded-xl"
                  value={formData.keyword}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Date Published (Current):</label>
                <input
                  type="date"
                  name="currentPubDate"
                  className="input-field w-2/3 p-2 border border-gray-400 rounded-xl"
                  value={formData.currentPubDate}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Date Published (Original):</label>
                <input
                  type="date"
                  name="originalPubDate"
                  className="input-field w-2/3 p-2 border border-gray-400 rounded-xl"
                  value={formData.originalPubDate}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Date Procured:</label>
                <input
                  type="date"
                  name="procDate"
                  className="input-field w-2/3 p-2 border border-gray-400 rounded-xl"
                  value={formData.procDate}
                  onChange={handleChange}
                />
              </div>
            </form>

            <div className="flex justify-center mt-8">
              <button
                type="button"
                onClick={handleSave}
                className="add-research-btn py-2 px-8 border-gray-400 rounded-2xl"
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* Right Side: Book Cover Placeholder */}
          <div className="w-60 ml-8 mt-72">
            <p className="font-bold text-lg mb-2">Book Cover*</p>
            <div
              className="relative bg-gray-100 p-4 h-50 border border-gray-400 rounded-lg"
              onClick={handleDivClick}
            >
              <img
                src={formData.cover || "image-placeholder.jpg"}
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
              accept="image/png, image/jpeg, image/jpg"
            />
          </div>
        </div>
      </div>
      {formData.titleID && <BookCopiesIndiv titleID={formData.titleID} />}
    </div>
  );
};

export default BookModify;
