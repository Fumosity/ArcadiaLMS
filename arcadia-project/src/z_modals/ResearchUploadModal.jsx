import React, { useState } from 'react';

function ResearchUploadModal({ isOpen, onClose, onFileSelect }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles(files);
    setNumberOfPages(files.length);
  };

  const handleUpload = () => {
    onFileSelect(uploadedFiles); // Pass uploaded files back to ARAdding when upload is confirmed
    onClose();
  };

  const handleCancel = () => {
    setUploadedFiles([]);
    setNumberOfPages(0);
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
          <p className="text-sm font-medium text-gray-700">
            Data points marked with an asterisk (*) are autofilled.
          </p>
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

            <div>
              <label className="text-gray-800">Number of pages*:</label>
              <input
                type="text"
                value={numberOfPages}
                readOnly
                className="w-full mt-1 p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="text-gray-800">Page order:</label>
              <input
                type="text"
                value="According to filename"
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
                className="px-6 py-2 bg-grey rounded-full hover:bg-arcadia-red hover:text-white"
                aria-label="Upload files"
              >
                Upload
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-grey rounded-full hover:bg-arcadia-red hover:text-white ml-2"
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
