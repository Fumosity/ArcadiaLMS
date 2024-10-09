import React from "react";

const ReservationsTable = () => (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booker</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {[
          { room: 'Cafe-Left', time: '11:00-12:00', booker: 'A. Jones' },
          { room: 'Cafe-Left', time: '11:00-12:00', booker: 'A. Jones' },
          { room: 'Cafe-Left', time: '11:00-12:00', booker: 'A. Jones' },
        ].map((item, index) => (
          <tr key={index}>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.room}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.time}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.booker}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  export default ReservationsTable;