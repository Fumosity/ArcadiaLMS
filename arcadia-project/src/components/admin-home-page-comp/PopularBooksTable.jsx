import React from "react";

const PopularBooksTable = () => (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {[
          { book: 'Oxford English Dict.', rating: '4.38' },
          { book: 'Oxford English Dict.', rating: '4.38' },
          { book: 'Oxford English Dict.', rating: '4.38' },
        ].map((item, index) => (
          <tr key={index}>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.book}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.rating}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  export default PopularBooksTable;