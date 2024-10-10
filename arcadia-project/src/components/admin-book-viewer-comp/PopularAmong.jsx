import React from "react";

const PopularAmong = () => {
    const Demogs = [
        {demog: 'MEN', rating: '4.21'},
        {demog: 'CLAE', rating: '4.86'},
    ];

      return (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Popular Among</h3>
          <table className="w-full text-left">
        <thead>
          <tr>
            <th className="font-semibold pb-2">Demographics</th>
            <th className="font-semibold pb-2">Avg. Rating</th>
          </tr>
        </thead>
        <tbody>
          {Demogs.map((demog, index) => (
            <tr key={index}>
              <td className="py-2">{demog.demog}</td>
              <td className="py-2">{demog.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
        </div>
      );
    }

export default PopularAmong;
