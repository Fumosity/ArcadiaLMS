import React, { useState } from "react"; 
import { ChevronRight } from "lucide-react";
import UpdateProfilePic from "../../../z_modals/UpdateProfilePic";

// Default settings options
const settingsOptions = [
  {
    title: "Update Profile Photo",
    description: "Change your profile photo.",
    action: "openModal", // Custom action for opening the modal
  },
  {
    title: "Change Password",
    description: "Change your password through your registered email account.",
    href: "/change-password",
  },
  {
    title: "Update User Data",
    description: "File a support ticket to update your data like email, college, or department.",
    href: "/user/support/supportticket?type=Account&subject=Request%20to%20Update%20User%20Data",
  },
  {
    title: "Delete Account",
    description: "File a support ticket to request for account deletion.",
    href: "/user/support/supportticket?type=Account&subject=Request%20to%20Delete%20Account",
  },
];

const SettingsOption = ({ title, description, href, action, onAction }) => {
  const isButton = action !== undefined; // If action exists, render as a button

  if (isButton) {
    return (
      <button
        onClick={() => onAction(action)}
        className="flex items-center border border-grey justify-between p-4 rounded-2xl hover:bg-light-gray transition-colors group cursor-pointer w-full text-left"
        aria-label={`${title}: ${description}`}
      >
        <div>
          <h3 className="font-medium text-arcadia-black mb-1">{title}</h3>
          <p className="text-sm text-dark-gray">{description}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-dark-gray group-hover:text-arcadia-black transition-colors" aria-hidden="true" />
      </button>
    );
  }

  return (
    <a
      href={href}
      className="flex items-center border border-grey justify-between p-4 rounded-2xl hover:bg-light-gray transition-colors group"
      aria-label={`${title}: ${description}`}
    >
      <div>
        <h3 className="font-medium text-arcadia-black mb-1">{title}</h3>
        <p className="text-sm text-dark-gray">{description}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-dark-gray group-hover:text-arcadia-black transition-colors" aria-hidden="true" />
    </a>
  );
};

export const AccountSettings = ({ user, options = settingsOptions }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleAction = (action) => {
    console.log("Opening Modal?", action); // Log action to verify modal trigger
    if (action === "openModal") {
      setModalOpen(true); // Open the modal when "Update Profile Photo" is clicked
    }
  };

  const closeModal = () => {
    console.log("Closing Modal");
    setModalOpen(false); // Close the modal when the close action is triggered
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
            href={option.href}
            action={option.action}
            onAction={handleAction}
          />
        ))}
      </div>

      {/* Render the UpdateProfilePic modal */}
      {isModalOpen && (
        <UpdateProfilePic isOpen={isModalOpen} onClose={closeModal} user={user} />
      )}
    </div>
  );
};
