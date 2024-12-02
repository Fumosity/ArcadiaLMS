import React, { useRef } from "react";
import { supabase } from "../../supabaseClient.js";
import { v4 as uuidv4 } from "uuid";

const ResearchModify = ({ formData, setFormData, onSave }) => {
    const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!formData || !formData.thesisID) {
      console.error("Invalid form data or missing thesisID");
      return;
    }

    const { thesisID, ...updateData } = formData;

    try {
      const { data, error } = await supabase
        .from("research")
        .update(updateData)
        .match({ thesisID });

      if (error) throw error;

      console.log("Research updated successfully:", data);
      if (onSave) await onSave(formData);
    } catch (err) {
      console.error("Error updating research:", err);
    }
  };

  const uploadCover = async (e) => {
    let coverFile = e.target.files[0];
    const filePath = `${uuidv4()}_${coverFile.name}`;

    const { data, error } = await supabase.storage.from("research-covers").upload(filePath, coverFile, {
      cacheControl: "3600",
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

  const handleDivClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex justify-center items-start p-8">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl flex">
          {/* Left Side: Form Section */}
          <div className="w-3/4">
            <h2 className="text-3xl font-bold mb-4">Modify Research</h2>
            <p className="text-gray-600 mb-8">
              Data points marked with an asterisk (*) are autofilled. Use a semicolon to add multiple authors or keywords.
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
                <label className="w-1/4">College:</label>
                <input
                  type="text"
                  name="college"
                  className="input-field w-2/3 p-2 border border-gray-400 rounded-xl"
                  value={formData.college}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Department:</label>
                <input
                  type="text"
                  name="department"
                  className="input-field w-2/3 p-2 border border-gray-400 rounded-xl"
                  value={formData.department}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Abstract:</label>
                <textarea
                  name="abstract"
                  className="input-field w-2/3 p-2 border border-gray-400 rounded-xl"
                  rows="3"
                  value={formData.abstract}
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
                <label className="w-1/4">Publication Date:</label>
                <input
                  type="date"
                  name="pubDate"
                  className="input-field w-2/3 p-2 border border-gray-400 rounded-xl"
                  value={formData.pubDate}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Location:</label>
                <input
                  type="text"
                  name="location"
                  className="input-field w-2/3 p-2 border border-gray-400 rounded-xl"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">ARC ID:</label>
                <input
                  type="text"
                  name="arcID"
                  className="input-field w-2/3 p-2 border border-gray-400 rounded-xl"
                  value={formData.arcID}
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

          {/* Right Side: Research Cover Placeholder */}
          <div className="w-60 ml-8 mt-72">
            <p className="font-bold text-lg mb-2">Research Cover*</p>
            <div
              className="relative bg-gray-100 p-4 h-50 border border-gray-400 rounded-lg"
              onClick={handleDivClick}
            >
              <img
                src={formData.cover || "image-placeholder.jpg"}
                alt="Research cover placeholder"
                className="h-full w-full object-contain mb-2"
              />
              <p className="text-xs text-gray-500 text-center">Click to update research cover</p>
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
    </div>
  );
};

export default ResearchModify;
