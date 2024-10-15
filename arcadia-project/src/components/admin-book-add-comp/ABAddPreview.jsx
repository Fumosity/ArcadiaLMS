import React from "react";

const ABAddPreview = () => {
  const bookDetails = {
    title: 'The Metamorphosis',
    author: 'Franz Kafka',
    genre: 'Franz Kafka',
    category: 'College of Engineering, Computer Studies, and Architecture',
    publisher: 'Department of Computer Studies (DCS)',
    synopsis: 'Update',
    keywords: 'kafkaesque, morbid',
    datePublished: '2001 (original 1915)',
    location: '2F, Shelf A24',
    databaseID: 'B-04321',
    arcID: '00750095'
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {/* Book Front Page */}
      <h3 className="text-xl font-semibold mb-3">Preview</h3>
      <div className="relative bg-white p-2 mb-4 rounded-lg">
        <img src="image/bkfrontpg.png" alt="Book cover" className="h-200 w-150 mx-auto mb-2 rounded" />
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
