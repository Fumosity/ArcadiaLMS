import React from "react";

const AboutPage = () => {
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
    <div className="bg-white p-6 rounded-lg shadow">
      {/* Book Front Page */}
      <h3 className="text-xl font-semibold mb-4 text-center">About</h3>
      <div className="relative bg-white p-4 mb-4 rounded-lg hover:bg-grey transition-all duration-300 ease-in-out hover:shadow-xl" style={{ borderRadius: "40px" }}>
        <img src="image/bkfrontpg.png" alt="Book cover" className="h-300 w-200 mx-auto mb-4 rounded" />
        <p className="text-sm text-gray-500 mb-2 text-center">Click to update book cover</p>
      </div>



      {Object.entries(bookDetails).map(([key, value]) => (
        <div key={key} className="mb-2">
          <span className="font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}:</span> {value}
        </div>
      ))}
      <div className="mt-4 flex space-x-2">
        <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded">Discard Changes</button>
        <button className="px-4 py-2 bg-blue-600 text-black rounded">Save Changes</button>
      </div>
    </div>
  );
};

export default AboutPage;
