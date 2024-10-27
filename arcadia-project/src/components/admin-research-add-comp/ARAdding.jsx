import React, { useRef, useEffect, useState } from "react";
import { supabase } from "../../supabaseClient.js";
import { v4 as uuidv4 } from "uuid";
import { addResearch, newThesisIDGenerator } from "../../backend/ARAddBackend.jsx";
import ResearchUploadModal from '../../z_modals/ResearchUploadModal';

const ARAdding = ({ formData, setFormData }) => {
  const coverInputRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

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

  const handleCoverClick = () => {
    coverInputRef.current.click();
  };

  const handleFileSelect = (files) => {
    setUploadedFiles(files);
  };

  const handleSubmit = async () => {
    const pdfUrls = []; // Array to hold the URLs of uploaded PDFs
    const imageUrls = []; // Array to hold the URLs of uploaded images

    // Upload all selected files to Supabase
    for (const file of uploadedFiles) {
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
          // Check if the file is a PDF or an image and store URLs accordingly
          if (file.type === "application/pdf") {
            pdfUrls.push(publicData.publicUrl); // Add to PDF URLs
          } else if (file.type.startsWith("image/")) {
            imageUrls.push(publicData.publicUrl); // Add to image URLs
          }
        }
      }
    }

    // Join URLs into a single string separated by commas
    setFormData((prevData) => ({
      ...prevData,
      pdf: pdfUrls.join(', '), // Set PDF URLs
      images: imageUrls.join(', '), // Set image URLs
    }));

    await addResearch({ ...formData, pdf: pdfUrls.join(', '), images: imageUrls.join(', ') }); // Ensure both fields contain URLs

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
      pdf: '',
      images: '' 
    });
    setUploadedFiles([]);
  };

  useEffect(() => { newThesisIDGenerator(formData, setFormData) }, []);

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

            {uploadedFiles.length > 0 && ( // Display the uploaded file names if they exist
              <p className="text-grey mb-4">
                Uploaded Files: {uploadedFiles.map(file => file.name).join(', ')}
              </p>
            )}
            
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

            <div className="flex justify-center mt-8">
              <button type="button" onClick={handleSubmit} className="add-research-btn py-2 px-8 border-gray-400 rounded-2xl">
                Add Research
              </button>
            </div>
          </div>

          <div className="w-60 ml-8 mt-72">
            <p className="font-bold text-lg mb-2">Research Cover*</p>
            <div className="relative bg-gray-100 p-4 h-50 border border-gray-400 rounded-lg hover:bg-grey" onClick={handleCoverClick}>
              <img
                src={formData.cover || "image/researchcover.png"}
                alt="Research cover placeholder"
                className="h-full w-full object-contain mb-2"
              />
              <p className="text-xs text-gray-500 text-center">Click to update thesis cover</p>
            </div>
            <input
              type="file"
              ref={coverInputRef}
              className="hidden"
              onChange={uploadCover}
              accept="image/png, image/jpeg, image/jpg"
            />
          </div>
        </div>
      </div>

      <ResearchUploadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onFileSelect={handleFileSelect} 
      />
    </div>
  );
};

export default ARAdding;
