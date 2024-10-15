import React from "react";

const PopularAmong = () => {
  const Demogs = [
    { demog: 'MEN', rating: '4.21' },
    { demog: 'CLAE', rating: '4.86' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow"> {/* Adjusted padding */}
      <h3 className="text-xl font-semibold mb-2">Popular Among</h3> {/* Updated font size and margin */}
      
      {/* Table with horizontal lines only */}
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="font-semibold pb-1 border-b border-grey">Demographics</th> {/* Light gray line */}
            <th className="font-semibold pb-1 border-b border-grey">Avg. Rating</th> {/* Light gray line */}
          </tr>
        </thead>
        <tbody>
          {Demogs.map((demog, index) => (
            <tr key={index} className="border-b border-grey"> {/* Light gray line */}
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
