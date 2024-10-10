import React from "react";

const SimilarTo = () => {
  const similarBooks = [
    { book: "Pride and Prejudice", rating: "3.98" },
    { book: "1984", rating: "4.51" },
    { book: "Animal Farm", rating: "4.02" },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">Similar To</h3>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="font-semibold pb-2">Book</th>
            <th className="font-semibold pb-2">Avg. Rating</th>
          </tr>
        </thead>
        <tbody>
          {similarBooks.map((book, index) => (
            <tr key={index}>
              <td className="py-2">{book.book}</td>
              <td className="py-2">{book.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SimilarTo;