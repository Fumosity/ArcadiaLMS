import React from "react";

const PopularAmong = () => {
  const demogs = [
    { demog: 'MEN', rating: '4.21' },
    { demog: 'CLAE', rating: '4.86' },
  ];

  return (
    <div className="bg-white p-4 rounded-lg border-grey border w-full">
      <h3 className="text-2xl font-semibold mb-2">Popular Among</h3>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
            >Demographic
            </th>
            <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
            >Avg. Rating
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {demogs.map((demog, index) => (
            <tr key={index} className="hover:bg-light-gray cursor-pointer">
              <td className="py-2 text-center">{demog.demog}</td>
              <td className="py-2 text-center">{demog.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PopularAmong;
