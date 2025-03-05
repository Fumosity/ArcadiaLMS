import React from "react";

const SimilarTo = () => {
  const similarBooks = [
    { book: "Pride and Prejudice", rating: "3.98" },
    { book: "1984", rating: "4.51" },
    { book: "Animal Farm", rating: "4.02" },
  ];

  return (
    <div className="bg-white p-4 rounded-lg border-grey border w-full">
      <h3 className="text-2xl font-semibold mb-2">Similar To</h3>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
            >Title
            </th>
            <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
            >Avg. Rating
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {similarBooks.map((book, index) => (
            <tr key={index} className="hover:bg-light-gray cursor-pointer"
            >
              <td className="py-2 text-center">{book.book}</td>
              <td className="py-2 text-center">{book.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SimilarTo;
