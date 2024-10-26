import React from "react";

const ResearchPreviewInv = ({ research }) => { // Accept the research prop
  if (!research) return <div className="bg-white p-4 rounded-lg shadow-md">Select a research to see details.</div>; // Return a message if no research is selected

  const researchDetails = {
    title: research.title,
    author: research.author,
    college: research.college,
    department: research.department,
    abstract: research.abstract,
    pages: research.pages,
    keywords: research.keywords,
    datePublished: research.datePublished,
    location: research.location,
    databaseID: research.databaseID,
    arcID: research.arcID,
    isbn: research.isbn,
    quantity: research.quantity,
  };

  // Custom mapping for display purposes
  const displayKeyMapping = {
    databaseID: "Database ID",
    arcID: "ARC ID",
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md" style={{ maxWidth: "350px", margin: "0 auto" }}>
      <h3 className="text-xl font-semibold mb-3">About</h3>
      <div className="relative bg-white p-2 mb-4 rounded-lg hover:bg-grey transition-all duration-300 ease-in-out hover:shadow-md">
        <img src={research.cover || "image/researchcover.png"} alt="Research cover" className="h-200 w-150 mx-auto mb-2 rounded" />
        <p className="text-xs text-gray-500 mb-2 text-center">Click to update research cover</p>
      </div>  

      <table className="min-w-full border-collapse">
        <tbody>
          {Object.entries(researchDetails).map(([key, value], index) => (
            <tr key={index} className="border-b border-grey">
              <td className="px-1 py-1 font-semibold capitalize" style={{ width: "40%" }}>
                {displayKeyMapping[key] || key.replace(/([A-Z])/g, ' $1')}: {/* Use mapping or default format */}
              </td>
              <td className="px-1 py-1 text-sm">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-3 flex justify-center space-x-2">
        <button className="px-2 py-1 bg-gray-200 text-gray-800 rounded text-xs">Discard Changes</button>
        <button className="px-2 py-1 bg-blue-600 text-gray-800 rounded text-xs">Save Changes</button>
      </div>
    </div>
  );
};

export default ResearchPreviewInv;
