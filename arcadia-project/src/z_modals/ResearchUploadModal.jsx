import React, { useState } from 'react';
import axios from 'axios';
import api from '../api';

function ResearchUploadModal({ isOpen, onClose, onFileSelect, onExtractedData }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [extractedChunks, setExtractedChunks] = useState([]);

  function properCase(name) {
    const lowerCaseWords = new Set([
      "a", "an", "and", "but", "or", "for", "nor", "so", "the", "to", "up", "in", "on",
      "at", "by", "with", "as", "of", "from", "about", "between", "during", "into",
      "through", "over", "under", "within", "is", "are", "was", "were", "be", "been", "being"
    ]);

    // Split the string into two parts: before the colon and after the colon
    const [beforeColon, afterColon] = name.split(":");

    // Function to apply proper case to a string
    function applyProperCase(str) {
      const words = str.split(" ");

      for (let i = 0; i < words.length; i++) {
        let word = words[i];

        // Handle names like McDonald, O'Neil
        if (/^(Mc|Mac)[A-Za-z]+$/.test(word)) {
          words[i] = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
          continue;
        }

        if (/^O'[A-Za-z]+$/.test(word)) {
          words[i] = "O'" + word.slice(2, 3).toUpperCase() + word.slice(3).toLowerCase();
          continue;
        }

        // Capitalize the first word and all other words that aren't in lowercase words
        if (i === 0 || !lowerCaseWords.has(word.toLowerCase())) {
          words[i] = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        } else {
          words[i] = word.toLowerCase();
        }
      }

      // Special handling for hyphenated words like "Eco-Innovation"
      return words.join(" ").replace(/\b([A-Za-z]+-[A-Za-z]+)\b/g, (match) => {
        return match.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join("-");
      });
    }

    // Apply formatting to the part after the colon, if any
    const formattedBeforeColon = beforeColon.trim();  // Keep before colon as is
    const formattedAfterColon = afterColon ? applyProperCase(afterColon.trim()) : "";

    // Return the properly formatted string
    return formattedBeforeColon + (formattedAfterColon ? ": " + formattedAfterColon : "");
  }

  function formatAuthors(authorsText) {
    // Remove unwanted symbols but keep letters, spaces, periods, and hyphens
    authorsText = authorsText.replace(/[^\w\s\.\-]/g, " "); // Convert unwanted chars to spaces
    authorsText = authorsText.replace(/\s+/g, " ").trim(); // Normalize spaces

    // Split potential author names
    const words = authorsText.split(" ");
    const formattedAuthors = [];
    let currentAuthor = [];

    // Process names properly
    for (let i = 0; i < words.length; i++) {
      currentAuthor.push(words[i]);

      // Detect name endings (e.g., "V.", "Jr.", "III")
      if (i > 0 && (/^[A-Z]\.$/.test(words[i - 1]) || /^(Jr|Sr|II|III|IV|V)\.?$/i.test(words[i]))) {
        formattedAuthors.push(currentAuthor.join(" ").trim());
        currentAuthor = [];
      }
    }

    if (currentAuthor.length > 0) {
      formattedAuthors.push(currentAuthor.join(" ").trim());
    }

    // Proper case formatting (capitalize first letter of each word, except suffixes)
    function properCase(name) {
      const nameParts = name.split(" ");
      return nameParts
        .map(part => /^(Jr|Sr|II|III|IV|V)\.?$/i.test(part) ? part : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(" ");
    }

    return formattedAuthors.map(author => properCase(author)).join("; ");
  }

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
    setIsUploading(true);
    setUploadComplete(false);

    try {
      const formData = new FormData();
      uploadedFiles.forEach(file => formData.append('files', file));

      const response = await api.post('api/extract-text', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log("Backend response:", response.data);

      const extractedChunks = response.data.chunks.map(chunk => {
        // Apply proper case for title and author fields
        if (chunk.Classification === "title") {
          chunk.Preprocessed_Text = properCase(chunk.Preprocessed_Text);
        } else if (chunk.Classification === "authors") {
          chunk.Preprocessed_Text = formatAuthors(chunk.Preprocessed_Text);
        } else if (chunk.Classification === "keywords") {
          chunk.Preprocessed_Text = chunk.Preprocessed_Text.replace(/\b(keywords?|key words?)\b.*?(?:—|:)?\s*/i, '').trim();
          chunk.Preprocessed_Text = properCase(chunk.Preprocessed_Text);
        }

        return {
          ...chunk,
          Classification: chunk.Classification || "skip", // Default to "skip" if empty
        };
      });

      console.log(extractedChunks)

      setExtractedChunks(extractedChunks);

      onFileSelect(uploadedFiles);
      setUploadComplete(true);
    } catch (error) {
      console.error("Error extracting text:", error);
      alert("Failed to extract text. Please try again or check your file format.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClassificationChange = (index, newClassification) => {
    const updatedChunks = [...extractedChunks];
    updatedChunks[index].Classification = newClassification; // Fix: Use "Classification"
    setExtractedChunks(updatedChunks);
  };

  const handleChunkEdit = (index, newText) => {
    const updatedChunks = [...extractedChunks];
    updatedChunks[index].Preprocessed_Text = newText;
    setExtractedChunks(updatedChunks);
  };


  const handleCancel = () => {
    setUploadedFiles([]);
    setExtractedChunks([]);
    onClose();
  };

  const handleConfirm = () => {
    // Group all classified chunks together
    const groupedData = extractedChunks.reduce((acc, chunk) => {
      if (!acc[chunk.Classification]) {
        acc[chunk.Classification] = [];
      }
      acc[chunk.Classification].push(chunk.Preprocessed_Text);
      return acc;
    }, {});

    console.log("Grouped Data Before Formatting:", groupedData);

    // Extract publication year only
    let formattedPubDate = "";
    if (groupedData["pubDate"] && groupedData["pubDate"].length > 0) {
      const rawDate = groupedData["pubDate"].join("").trim();
      console.log("Raw pubDate:", rawDate);

      const dateParts = rawDate.split(" ");

      if (dateParts.length === 2) {
        // Handles cases like "April 2019", "april 2019", "APRIL 2019"
        const yearPart = dateParts[1];
        if (/^\d{4}$/.test(yearPart)) {
          formattedPubDate = yearPart;
        }
      } else if (/^\d{4}$/.test(rawDate)) {
        // Already just a year
        formattedPubDate = rawDate;
      } else if (/^\d{4}-\d{2}(-\d{2})?$/.test(rawDate)) {
        // Extract the year from "YYYY-MM" or "YYYY-MM-DD"
        formattedPubDate = rawDate.slice(0, 4);
      } else {
        console.warn("Unrecognized date format:", rawDate);
      }

      console.log("Formatted pubDate (year only):", formattedPubDate);
    } else {
      console.warn("No pubDate found in grouped data.");
    }

    // Construct confirmed data
    const confirmedData = {
      title: groupedData["title"] ? groupedData["title"].join(" ") : "",
      abstract: groupedData["abstract"] ? groupedData["abstract"].join(" ") : "",
      author: groupedData["author"] ? groupedData["author"].join(", ") : "",
      keywords: groupedData["keywords"] ? groupedData["keywords"].join(", ") : "",
      pubDate: formattedPubDate, // Now correctly formatted
      department: groupedData["department"] ? groupedData["department"].join(", ") : "",
      college: groupedData["college"] ? groupedData["college"].join(", ") : "",
    };

    console.log("Confirmed Data:", confirmedData);
    onExtractedData(confirmedData);
    onClose();
  };


  const handleReupload = () => {
    setUploadComplete(false)
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-xl w-5/6 h-3/4 shadow-lg relative">
        <header className="mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">Metadata Autofill Tool</h1>
        </header>

        <div className="flex space-x-2 h-full">
          {/* Upload Section */}
          <div className="space-y-2 w-1/3">
            <h1 className="text-xl font-semibold text-gray-900">Upload Research</h1>
            <div className="flex flex-col mt-4">
              {isUploading ? (
                <div className="flex items-center justify-center space-x-2 pt-32">
                  <div className="loader"></div>
                  <span>Uploading...</span>
                </div>
              ) : uploadComplete ? (
                <div className="flex flex-col justify-evenly space-y-2 h-80">
                  <div className="text-green-500 text-center">Upload Complete!<br /> You can now close the modal, or verify the autofill results. Click on the chunk data to modify its contents.</div>
                  <div className='flex flex-col space-y-2'>
                    <div className="flex justify-center">
                      <button onClick={handleReupload} className="penBtn">Reupload files</button>
                    </div>
                    <div className="flex justify-center">
                      <button onClick={handleConfirm} className="penBtn">Confim Autofill</button>
                    </div>
                    <div className="flex justify-center">
                      <button onClick={handleCancel} className="penBtn">Cancel Autofill</button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <p className="text-gray-800">
                      Upload research pages for autofill. The uploaded pages should
                      include the following: Title Page, Abstract, keywords.
                      <br /><br />
                      Accepted formats: PDF, PNG, JPEG
                    </p>
                    <label htmlFor="file-upload" className="inline-block mt-2 px-4 py-1 border border-arcadia-red rounded-full text-arcadia-red cursor-pointer">
                      Upload Pages
                      <input id="file-upload" type="file" multiple accept=".pdf,.png,.jpeg,.jpg" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                  <div className='flex flex-col space-y-2'>
                    <label className="text-gray-800">Files uploaded:</label>
                    <input type="text" value={uploadedFiles.length > 0 ? uploadedFiles.map(file => file.name).join(', ') : 'No files uploaded'} readOnly className="w-full p-2 border border-grey rounded-full" />
                    <div className='flex flex-col items-center justify-center space-y-2 mt-2'>
                      <button
                        onClick={handleUpload}
                        disabled={uploadedFiles.length === 0}
                        className={`penBtn px-2.5 py-1 rounded-full ${uploadedFiles.length === 0 ? 'bg-grey cursor-not-allowed text-dark-gray border border-dark-gray' : 'bg-arcadia-red text-white hover:bg-red focus:outline-none focus:ring-2 focus:ring-arcadia-red focus:ring-offset-2'}`}
                      >
                        Upload
                      </button>
                      <button onClick={handleCancel} className="cancelModify">Close Window</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Verify Results Section */}
          <div className='w-2/3'>
            <h1 className="text-xl font-semibold text-gray-900">Verify Results</h1>
            <div className='p-2 flex flex-col justify-between h-5/6'>
              <div className="overflow-y-auto">
                <table className="min-w-full divide-y divide-dark-gray">
                  <thead className="bg-white sticky top-0 ">
                    <tr>
                      <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase">Chunk Data</th>
                      <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase">Classification</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-dark-gray">
                    {extractedChunks.length > 0 ? (
                      extractedChunks.map((chunk, index) => (
                        <tr key={index} className='hover:bg-light-gray p-2'>
                          <td>
                            <div className='flex items-center p-2'>
                              <textarea
                                className="w-full px-3 py-1 rounded-md border border-grey resize-none"
                                value={chunk.Preprocessed_Text}
                                onChange={(e) => handleChunkEdit(index, e.target.value)}
                                rows={1}
                                ref={(el) => {
                                  if (el) {
                                    el.style.height = "auto"; // Reset height
                                    el.style.height = `${el.scrollHeight / 16}rem`; // Convert px to rem dynamically
                                  }
                                }}
                                style={{
                                  minHeight: "1.5rem",  // 1 line
                                  maxHeight: "4.5rem",  // 3 lines
                                  overflowY: "hidden", // No scrollbar unless necessary
                                }}
                                onInput={(e) => {
                                  e.target.style.height = "auto"; // Reset height
                                  const newHeight = Math.min(e.target.scrollHeight / 16, 4.5); // Convert to rem
                                  e.target.style.height = `${newHeight}rem`; // Expand up to 3 lines
                                  e.target.style.overflowY = newHeight >= 4.5 ? "auto" : "hidden"; // Show scrollbar only after 3 lines
                                }}
                              />
                            </div>
                          </td>
                          <td className="p-2">
                            <select className="w-full px-3 py-1 rounded-lg border border-grey" value={chunk.Classification} onChange={(e) => handleClassificationChange(index, e.target.value)}>
                              <option value="title">Title</option>
                              <option value="author">Author</option>
                              <option value="college">College</option>
                              <option value="department">Department</option>
                              <option value="abstract">Abstract</option>
                              <option value="keywords">Keyword/s</option>
                              <option value="pubDate">Pub. Year</option>
                              <option value="skip">Skip</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="2" className="text-center py-4 text-gray-500">No extracted data available.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResearchUploadModal;
