import React from "react";

const PopularAmong = () => {
  const demogs = [
    { demog: 'MEN', rating: '4.21' },
    { demog: 'CLAE', rating: '4.86' },
  ];

  return (
    <div className="bg-white p-4 rounded-lg border-grey border mt-2">
      <h3 className="text-xl font-semibold mb-2">Popular Among</h3>
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="font-semibold pb-1 border-b border-grey">Demographics</th>
            <th className="font-semibold pb-1 border-b border-grey">Avg. Rating</th>
          </tr>
        </thead>
        <tbody>
          {demogs.map((demog, index) => (
            <tr key={index} className="border-b border-grey">
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
