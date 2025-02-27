import React from "react";

const ABAddPreview = ({ formData }) => {
  const bookDetails = {
    title: formData.title || '',
    author: Array.isArray(formData.author) ? formData.author.join(', ') : (formData.author ?? '').split(';').join(',') || '',
    genres: Array.isArray(formData.genres) ? formData.genres.join(', ') : (formData.genres ?? '').split(';').join(',') || '',
    category: Array.isArray(formData.category) ? formData.category.join(', ') : (formData.category ?? '').split(';').join(',') || '',
    publisher: formData.publisher || '',
    synopsis: formData.synopsis || '',
    keywords: Array.isArray(formData.keywords) ? formData.keywords.join(', ') : (formData.keywords ?? '').split(';').join(',') || '',
    currentPubDate: formData.currentPubDate || '',
    originalPubDate: formData.originalPubDate || '',
    procurementDate: formData.procDate || '',
    location: formData.location || '',
    arcID: formData.arcID || '',
    isbn: formData.isbn || '',
    price: formData.price || '',
    cover: formData.cover || '',
  };

  return (
    <div className="w-full">
      <div className="bg-white p-4 rounded-lg border-grey border w-full mt-12">
        <h3 className="text-2xl font-semibold mb-2">Book Preview</h3>
        <div className="w-full h-fit flex justify-center ">
          <div className="relative bg-white p-4 w-fit rounded-lg hover:bg-grey transition-all duration-300 ease-in-out hover:shadow-md border border-grey">
            <img src={bookDetails.cover || "/image/book_research_placeholder.png"} alt="Book cover" className="h-[475px] w-[300px] rounded-lg border border-grey object-cover" />
          </div>
        </div>
        <table className="min-w-full border-collapse">
          <tbody>
            {Object.entries(bookDetails)
              .filter(([key]) => !["cover", "procurementDate", "arcID", "titleID"].includes(key)) // Exclude multiple keys
              .map(([key, value], index) => {
              if (key === 'currentPubDate' || key === 'originalPubDate') {
                return (
                  <>
                    {key === 'currentPubDate' && (
                      <tr key="currentPubDate" className="border-b border-grey">
                        <td className="px-1 py-1 font-semibold capitalize w-1/3">Current Pub. Date:</td>
                        <td className="px-1 py-1 text-sm break-words w-2/3">{value}</td>
                      </tr>
                    )}
                    {key === 'originalPubDate' && (
                      <tr key="originalPubDate" className="border-b border-grey">
                        <td className="px-1 py-1 font-semibold capitalize w-1/3">Original Pub. Date:</td>
                        <td className="px-1 py-1 text-sm break-words w-2/3">{value}</td>
                      </tr>
                    )}
                  </>
                );
              } else {
                return (
                  <tr key={index} className="border-b border-grey">
                    <td className="px-1 py-1 font-semibold capitalize w-1/3">
                      {key === 'databaseID' 
                      ? 'Database ID' 
                      :key === "isbn"
                      ? "ISBN"
                      : key === 'arcID' 
                      ? 'ARC ID' 
                      : key.replace(/([A-Z])/g, ' $1')}:
                    </td>
                    <td className="px-1 py-1 text-sm break-words w-2/3">
                      {value}
                    </td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ABAddPreview;
