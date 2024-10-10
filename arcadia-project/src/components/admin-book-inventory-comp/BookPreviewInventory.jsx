import React from "react";

const BookPreviewInventory = () => {
  const bookDetails = {
    title: 'The Metamorphosis',
    author: 'Franz Kafka',
    genre: 'Novella, Absurdist, Fantasy',
    category: 'Fiction',
    publisher: 'Diamond Pocket Books',
    synopsis: 'Update',
    keywords: 'kafkaesque, morbid',
    datePublished: '2001 (original 1915)',
    republished: '2023',
    location: '2F, Shelf A24',
    databaseID: 'B-04321',
    arcID: '00750095',
    isbn: '9789390740246, 9390740243',
    quantity: 2
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md" style={{ maxWidth: "350px", margin: "0 auto" }}>
      {/* Book Front Page */}
      <h3 className="text-xl font-semibold mb-3">About</h3>
      <div className="relative bg-white p-2 mb-4 rounded-lg hover:bg-grey transition-all duration-300 ease-in-out hover:shadow-md">
        <img src="image/bkfrontpg.png" alt="Book cover" className="h-200 w-150 mx-auto mb-2 rounded" />
        <p className="text-xs text-gray-500 mb-2 text-center">Click to update book cover</p>
      </div>

      {/* Book details with horizontal lines only */}
      <table className="min-w-full border-collapse">
        <tbody>
          {Object.entries(bookDetails).map(([key, value], index) => (
            <tr key={index} className="border-b border-grey"> {/* Change border color to light gray */}
              <td className="px-1 py-1 font-semibold capitalize" style={{ width: "40%" }}>
                {key.replace(/([A-Z])/g, ' $1')}:
              </td>
              <td className="px-1 py-1 text-sm">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Buttons */}
      <div className="mt-3 flex justify-center space-x-2"> {/* Center the buttons */}
        <button className="px-2 py-1 bg-gray-200 text-gray-800 rounded text-xs">Discard Changes</button>
        <button className="px-2 py-1 bg-blue-600 text-gray-800 rounded text-xs">Save Changes</button>
      </div>
    </div>
  );
};

export default BookPreviewInventory;
