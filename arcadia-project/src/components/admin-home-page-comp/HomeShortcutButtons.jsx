import React from "react";
import { useNavigate } from "react-router-dom";

const HomeShortcutButtons = () => {
  const navigate = useNavigate();

  const actions = [
    { action: 'Access Book Checking', path: '/admin/bookcheckinout' },
    { action: 'Book Management', path: '/admin/bookmanagement' },
    { action: 'Research Management', path: '/admin/researchmanagement' },
    { action: 'Room Booking', path: '/admin/reservations' },
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

export default HomeShortcutButtons;
