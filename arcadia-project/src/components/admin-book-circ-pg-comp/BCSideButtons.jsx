import React from "react";
import { useNavigate } from "react-router-dom";

const BCSideButtons = () => {
  const navigate = useNavigate();

  const actions = [
    { action: 'Access Book Checking', path: '/admin/bookcheckinout' },
    { action: 'Access Book Circulation', path: '/admin/abcirculationpage' },
  ];

  return (
    <div className="flex-col justify-center w-full space-y-2">
      {actions.map((item, index) => (
        <div
          key={index}
          onClick={() => navigate(item.path)}
        >
          <button className="h-10 flex items-center justify-center border border-lg w-full px-2 rounded-lg border-grey  hover:bg-arcadia-red hover:text-white"
          >
            {item.action}
          </button>
        </div>
      ))}
    </div>
  );
};

export default BCSideButtons;
