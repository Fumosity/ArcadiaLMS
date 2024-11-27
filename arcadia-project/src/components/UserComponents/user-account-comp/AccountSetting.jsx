import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import UpdateProfilePic from '../../../z_modals/UpdateProfilePic'; // Adjust the import path as needed

const settingsOptions = [
  {
    title: "Update Profile Photo",
    description: "Change your profile photo.",
    action: "openModal" // We'll handle this with a custom action
  },
  {
    title: "Change Password",
    description: "Change your password through your registered email account.",
    href: "/change-password"
  },
  {
    title: "Update User Data",
    description: "File a support ticket to update your data like email, college, or department.",
    href: "/user/support/supportticket?type=Account&subject=Request%20to%20Update%20User%20Data"
  },
  {
    title: "Delete Account",
    description: "File a support ticket to request account deletion.",
    href: "/user/support/supportticket?type=Account&subject=Request%20to%20Delete%20Account"
  }
];

// Individual settings option component
const SettingsOption = ({ title, description, onClick, href }) => (
  <div
    onClick={onClick}
    className="flex items-center border border-grey justify-between p-4 rounded-2xl hover:bg-light-gray transition-colors group cursor-pointer"
  >
    <div>
      <h3 className="font-medium text-arcadia-black mb-1">{title}</h3>
      <p className="text-sm text-dark-gray">{description}</p>
    </div>
    <ChevronRight className="w-5 h-5 text-dark-gray group-hover:text-arcadia-black transition-colors" />
  </div>
);

// Main AccountSettings component
export const AccountSettings = ({ options = settingsOptions }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    // Retrieve user data from localStorage or API
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  const handleOptionClick = (option) => {
    if (option.action === "openModal") {
      setIsModalOpen(true);
    } else if (option.href) {
      window.location.href = option.href; // Keep other links working as expected
    }
  };

  return (
    <div className="uMain-cont">
      <h2 className="text-xl font-medium text-arcadia-black mb-6">Account Settings</h2>
      <div className="space-y-4">
        {options.map((option) => (
          <SettingsOption
            key={option.title}
            title={option.title}
            description={option.description}
            onClick={() => handleOptionClick(option)}
            href={option.href}
          />
        ))}
      </div>

      {/* Render the modal */}
      {isModalOpen && (
        <UpdateProfilePic
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={currentUser}
        />
      )}
    </div>
  );
};
