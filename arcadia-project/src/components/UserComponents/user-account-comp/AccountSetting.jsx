import React from 'react';
import { ChevronRight } from 'lucide-react';

// Default settings options
const settingsOptions = [
  {
    title: "Update Profile Photo",
    description: "Change your profile photo.",
    href: "/update-photo"
  },
  {
    title: "Change Password",
    description: "Change your password through your registered email account.",
    href: "/change-password"
  },
  {
    title: "Update User Data",
    description: "File a support ticket to update your data like email, college, or department.",
    href: "/user/support/supportticket?type=Account&title=Request%20to%20Update%20User%20Data"
  },
  {
    title: "Delete Account",
    description: "File a support ticket to request for account deletion.",
    href: "/user/support/supportticket?type=Account&title=Request%20to%20Delete%20Account"
  }
];

// Individual settings option component
const SettingsOption = ({ title, description, href }) => (
  <a
    href={href}
    className="flex items-center border border-grey justify-between p-4 rounded-2xl hover:bg-light-gray transition-colors group"
  >
    <div>
      <h3 className="font-medium text-arcadia-black mb-1">{title}</h3>
      <p className="text-sm text-dark-gray">{description}</p>
    </div>
    <ChevronRight className="w-5 h-5 text-dark-gray group-hover:text-arcadia-black transition-colors" />
  </a>
);

export const AccountSettings = ({ options = settingsOptions }) => (
  <div className="uMain-cont">
    <h2 className="text-xl font-medium text-arcadia-black mb-6">Account Settings</h2>
    <div className="space-y-4">
      {options.map((option) => (
        <SettingsOption
          key={option.title}
          title={option.title}
          description={option.description}
          href={option.href}
        />
      ))}
    </div>
  </div>
);
