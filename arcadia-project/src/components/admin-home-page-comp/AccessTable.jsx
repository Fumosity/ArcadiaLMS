import React from "react";
import { useNavigate } from "react-router-dom";

const AccessTable = () => {
  const navigate = useNavigate();

  const actions = [
    { action: 'Access Book Checking', path: '/admin/bookcheckinout' },
    { action: 'Access Book Circulation', path: '/admin/abcirculationpage' },
  ];

  return (
    <div className="flex-col justify-center gap-2 w-full">
      {actions.map((item, index) => (
        <div
          key={index}
          onClick={() => navigate(item.path)}
        >
          <button className="add-book w-full mb-2 px-2 py-2 rounded-lg border-grey  hover:bg-arcadia-red hover:text-white"
          >
            {item.action}
          </button>
        </div>
      ))}
    </div>
  );
};

export default AccessTable;
