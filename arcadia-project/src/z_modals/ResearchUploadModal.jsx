import React, { useState } from 'react';
import axios from 'axios';

function ResearchUploadModal({ isOpen, onClose, onFileSelect, onExtractedData }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [extractedData, setExtractedData] = useState({
    title: '',
    abstract: '',
    authors: '',
    keywords: '',
    publication_date: '',
    department: '',
    college: ''
  });

  const [isUploading, setIsUploading] = useState(false); // Track if uploading is in progress
  const [uploadComplete, setUploadComplete] = useState(false); // Track upload completion

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file =>
      ['application/pdf', 'image/png', 'image/jpeg'].includes(file.type)
    );

    if (validFiles.length !== files.length) {
      alert("Some files were rejected due to invalid formats.");
    }
    setUploadedFiles(validFiles);
  };


  const handleUpload = async () => {
    setIsUploading(true); // Set uploading to true
    setUploadComplete(false); // Reset the completion status

    try {
      const formData = new FormData();

      // Append each selected file to the form data
      for (const file of uploadedFiles) {
        formData.append('files', file);
      }

      const response = await axios.post('http://127.0.0.1:8000/extract-text/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log("Backend response:", response.data);

      console.log("Extracted text from backend:", response.data.text);

      let reformatPubDate

      if (response.data.pubDate){
        reformatPubDate = response.data.pubDate + "-01"
      } else {
        reformatPubDate = ""
      }

      const extractedData = {
        title: response.data.title || "",
        abstract: response.data.abstract || "",
        author: response.data.author || "",
        keyword: response.data.keywords || "",
        pubDate: reformatPubDate || "",
        department: response.data.department || "",
        college: response.data.college || "",
      };      

      setExtractedData(extractedData);
      onFileSelect(uploadedFiles);
      onExtractedData(extractedData);

      setUploadComplete(true);

    } catch (error) {
      console.error("Error extracting text:", error);
      alert("Failed to extract text. Please try again or check your file format.");
    } finally {
      setIsUploading(false); // Set uploading to false when done
    }
  };

  const handleCancel = () => {
    setUploadedFiles([]);
    setShowPreview(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-xl max-w-lg w-full shadow-lg relative">


        <header className="mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">Upload Research</h1>
        </header>

        <section>
          <div className="space-y-3">

            <div className="flex-col justify-center mt-4">
              {isUploading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="loader"></div>
                  <span>Uploading...</span>
                </div>
              ) : uploadComplete ? (
                <div className="flex-col justify-center">
                  <div className="text-green-500 text-center">Upload Complete! You can now close the modal.</div>
                  <div className="flex justify-center mt-2">
                    <button
                      onClick={handleCancel}
                      className="penBtn"
                      aria-label="Cancel upload"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <p className="text-gray-800">
                      Upload research pages for autofill. The uploaded pages should
                      include the following: Title Page, Abstract, Keywords.
                      <br />
                      <br />
                      Accepted formats: (A PDF, or an image format: PNG, JPEG)
                    </p>
                    <label
                      htmlFor="file-upload"
                      className="inline-block mt-2 px-4 py-0.5 border border-arcadia-red rounded-full text-arcadia-red cursor-pointer"
                      aria-label="Upload research pages in PDF or image formats"
                    >
                      Upload Pages
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        accept=".pdf,.png,.jpeg,.jpg"
                        onChange={handleFileUpload}
                        className="hidden"
                        aria-label="Upload research pages"
                      />
                    </label>
                  </div>
                  <div>
                    <label className="text-gray-800">Files uploaded:</label>
                    <input
                      type="text"
                      value={uploadedFiles.length > 0 ? uploadedFiles.map((file) => file.name).join(', ') : 'No files uploaded'}
                      readOnly
                      className="w-full mt-1 p-2 border rounded-md"
                    />
                    <div className='flex items-center justify-center space-x-4 mt-2'>
                      <button
                        onClick={handleUpload}
                        className="penBtn"
                        aria-label="Upload files"
                      >
                        Upload
                      </button>
                      <button
                        onClick={handleCancel}
                        className="cancelModify"
                        aria-label="Cancel upload"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>


                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ResearchUploadModal;
