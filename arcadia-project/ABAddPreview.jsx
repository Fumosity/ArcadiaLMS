import React from "react";

const ABAddPreview = ({ formData }) => {
  const bookDetails = {
    title: formData.title || '',
    author: Array.isArray(formData.author) ? formData.author.join(',') : formData.author.split(';').join(',') || '',
    genre: Array.isArray(formData.genre) ? formData.genre.join(',') : formData.genre.split(';').join(',') || '',
    category: Array.isArray(formData.category) ? formData.category.join(',') : formData.category.split(';').join(',') || '',
    publisher: formData.publisher || '',
    synopsis: formData.synopsis || '',  
    keyword: Array.isArray(formData.keyword) ? formData.keyword.join(',') : formData.keyword.split(';').join(',') || '',
    datePublished: `${formData.currentPubDate} (original ${formData.originalPubDate})` || '',
    procDate: formData.procDate || '',
    location: formData.location || '',
    databaseID: formData.bookID || '',
    arcID: formData.arcID || '',
    isbn: formData.isbn || '',
    quantity: formData.quantity || '',
    cover: formData.cover || '',
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {/* Book Front Page */}
      <h3 className="text-xl font-semibold mb-3">Preview</h3>
      <div className="relative bg-white p-2 mb-4 rounded-lg">
        <img src={bookDetails.cover} alt="Book cover" className="h-200 w-150 mx-auto mb-2 rounded" />
      </div>

      {/* Book details with horizontal lines only */}
      <table className="min-w-full border-collapse">
        <tbody>
          {Object.entries(bookDetails).map(([key, value], index) => (
            <tr key={index} className="border-b border-grey">
              <td className="px-1 py-1 font-semibold capitalize" style={{ width: "40%" }}>
                {key === 'databaseID' ? 'Database ID' : key === 'arcID' ? 'ARC ID' : key.replace(/([A-Z])/g, ' $1')}:
              </td>
              <td className="px-1 py-1 text-sm flex justify-between items-center">
                <span>{value}</span>
                {key === 'synopsis' ? (
                  <button className="ml-2 border border-blue-500 px-2 py-0.5 rounded-xl">
                    View
                  </button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Buttons */}
    </div>
  );
};

export default ABAddPreview;
