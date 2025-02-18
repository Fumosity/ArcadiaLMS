import React from "react";
import { useNavigate } from "react-router-dom";

const AccessTable = () => {
  const navigate = useNavigate();

  const actions = [
    { action: 'Access Book Checking', path: '/admin/bookcheckinout' },
    { action: 'Access Book Circulation', path: '/admin/abcirculationpage' },
  ];

  return (
    <div className="bg-white p-2 rounded-lg border-grey border">
      <table className="min-w-full divide-y divide-gray-200">
        <tbody className="bg-white divide-y divide-gray-200">
          {actions.map((item, index) => (
            <tr 
              key={index} 
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => navigate(item.path)}
            >
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                {item.action}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccessTable;
