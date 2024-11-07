import React, { useState } from 'react';
import axios from 'axios';

function ResearchUploadModal({ isOpen, onClose, onPageCountChange, onFileSelect, onExtractedData }) {
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

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles(files);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      let totalPages = 0;  // Initialize total pages count

      // Append each selected file to the form data
      for (const file of uploadedFiles) {
        formData.append('files', file);
      }

      const response = await axios.post('http://127.0.0.1:8000/extract-text/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log("Extracted text from backend:", response.data.text);

      const extractedData = {
        title: response.data.title,
        abstract: response.data.abstract,
        authors: response.data.authors,
        keywords: response.data.keywords,
        publication_date: response.data.publication_date,
        department: response.data.department,
        college: response.data.college
      };
  
      setExtractedData(extractedData);
      onFileSelect(extractedData); // Add extractedData here
      onExtractedData(extractedData); // <-- Add this line

      // Count the number of pages from the response
      uploadedFiles.forEach((file) => {
        if (file.type === "application/pdf") {
          // Add logic to determine page count based on file
          totalPages = response.data.total_pages; // assuming the backend gives pageCount for PDFs
        } else {
          totalPages += 1; // Each image counts as 1 page
        }
      });
      console.log(response.data)
      // Set the total page count
      onPageCountChange(totalPages);

    } catch (error) {
      console.error("Error extracting text:", error);
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
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          aria-label="Close"
        >
          &times;
        </button>

        <header className="mb-4">
          <h1 className="text-2xl font-medium text-gray-900">Upload Research</h1>
        </header>

        <section>
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
              className="inline-block mt-2 px-4 py-2 border border-gray-700 rounded-full text-gray-900 cursor-pointer"
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

          <div className="space-y-3">
            <div>
              <label className="text-gray-800">Files uploaded:</label>
              <input
                type="text"
                value={uploadedFiles.length > 0 ? uploadedFiles.map((file) => file.name).join(', ') : 'No files uploaded'}
                readOnly
                className="w-full mt-1 p-2 border rounded-md"
              />
            </div>

            <div className="flex items-center">
              <label htmlFor="preview-checkbox" className="text-gray-800 mr-2">
                Show Research Preview? (PDF only)
              </label>
              <input
                type="checkbox"
                id="preview-checkbox"
                checked={showPreview}
                onChange={(e) => setShowPreview(e.target.checked)}
                className="h-4 w-4 rounded border-gray-700"
              />
            </div>

            <p className="text-sm text-gray-600">
              A Research Preview adds a PDF Viewer into the Research View of this paper. Requires a PDF file to be uploaded.
            </p>

            <div className="flex justify-center mt-4">
              <button
                onClick={handleUpload}
                className="px-6 py-2 bg-gray-300 rounded-full hover:bg-arcadia-red hover:text-white"
                aria-label="Upload files"
              >
                Upload
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-300 rounded-full hover:bg-arcadia-red hover:text-white ml-2"
                aria-label="Cancel upload"
              >
                Cancel
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ResearchUploadModal;
