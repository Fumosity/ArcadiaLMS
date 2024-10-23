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
    currentPubDate: formData.currentPubDate || '',
    originalPubDate: formData.originalPubDate || '',
    procDate: formData.procDate || '',
    location: formData.location || '',
    databaseID: formData.bookID || '',
    arcID: formData.arcID || '',
    isbn: formData.isbn || '',
    quantity: formData.quantity || '',
    cover: formData.cover || '',
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md" style={{ maxWidth: "350px", margin: "0 auto" }}>
      <h3 className="text-xl font-semibold mb-3">Preview</h3>
      <div className="relative bg-white p-2 mb-4 rounded-lg hover:bg-grey transition-all duration-300 ease-in-out hover:shadow-md">
        <img src={bookDetails.cover || "image/bkfrontpg.png"} alt="Book cover" className="h-200 w-150 mx-auto mb-2 rounded" />
      </div>

      <table className="min-w-full border-collapse">
        <tbody>
          {Object.entries(bookDetails).map(([key, value], index) => {
            if (key === 'currentPubDate' || key === 'originalPubDate') {
              return (
                <>
                  {key === 'currentPubDate' && (
                    <tr key="currentPubDate" className="border-b border-grey">
                      <td className="px-1 py-1 font-semibold capitalize" style={{ width: "40%" }}>Date Published (Current):</td>
                      <td className="px-1 py-1 text-sm break-words whitespace-normal" style={{ wordBreak: 'break-all' }}>{value}</td>
                    </tr>
                  )}
                  {key === 'originalPubDate' && (
                    <tr key="originalPubDate" className="border-b border-grey">
                      <td className="px-1 py-1 font-semibold capitalize" style={{ width: "40%" }}>Date Published (Original):</td>
                      <td className="px-1 py-1 text-sm break-words whitespace-normal" style={{ wordBreak: 'break-all' }}>{value}</td>
                    </tr>
                  )}
                </>
              );
            } else {
              return (
                <tr key={index} className="border-b border-grey">
                  <td className="px-1 py-1 font-semibold capitalize" style={{ width: "40%" }}>
                    {key === 'databaseID' ? 'Database ID' : key === 'arcID' ? 'ARC ID' : key.replace(/([A-Z])/g, ' $1')}:
                  </td>
                  <td className="px-1 py-1 text-sm break-words whitespace-normal" style={{ wordBreak: 'break-all' }}>
                    {value}
                  </td>
                </tr>
              );
            }
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ABAddPreview;
