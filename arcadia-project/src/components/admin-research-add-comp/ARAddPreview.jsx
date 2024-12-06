import React from "react";

const ARAddPreview = ({ formData }) => {
  const {
    title = "N/A",
    author = "N/A",
    college = "N/A",
    department = "N/A",
    abstract = "N/A",
    pages = "N/A",
    keyword = "N/A",
    pubDate = "N/A",
    location = "N/A",
    researchID = "N/A",
    researchARCID = "N/A",
    cover
  } = formData;

  const thesisDetails = {
    title,
    author,
    college,
    department,
    abstract,
    pages,
    keywords: keyword,
    datePublished: pubDate,
    location,
    databaseID: researchID,
    researchARCID,
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md" style={{ maxWidth: "350px", margin: "0 auto" }}>
      {/* Book Front Page */}
      <h3 className="text-xl font-semibold mb-3">About</h3>
      <div className="relative bg-white p-2 mb-4 rounded-lg hover:bg-grey transition-all duration-300 ease-in-out hover:shadow-md">
        <img src={cover || "/image/book_research_placeholder.png"} alt="Thesis cover" className="h-200 w-150 mx-auto mb-2 rounded border border-grey" />
        <p className="text-xs text-gray-500 mb-2 text-center">Research Cover Preview</p>
      </div>

      <table className="min-w-full border-collapse">
        <tbody>
          {Object.entries(thesisDetails).map(([key, value], index) => (
            <tr key={index} className="border-b border-grey">
              <td className="px-1 py-1 font-semibold capitalize" style={{ width: "40%" }}>
                {key.replace(/([A-Z])/g, ' $1')}:
              </td>
              <td className="px-1 py-1 text-sm overflow-hidden text-ellipsis max-w-[200px] whitespace-nowrap">
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Buttons */}
    </div>
  );
};

export default ARAddPreview;
