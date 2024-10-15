import React from "react";

const AccessTable = () => (
  <div className="bg-white p-6 rounded-lg shadow">
    <table className="min-w-full divide-y divide-grey">
      <tbody className="bg-white divide-y divide-grey">
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
  </div>
);

export default AccessTable;
