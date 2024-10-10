import React from "react";

const AccessTable = () => (
  <table className="min-w-full divide-y divide-gray-200">
    <tbody className="bg-white divide-y divide-gray-200">
      {[
        { action: 'Access Book Checking' },
        { action: 'Access Book Circulation' },
        { action: 'Access Book Inventory' },
        { action: 'Access Research Inventory' }
      ].map((item, index) => (
        <tr key={index}>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.action}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default AccessTable;
