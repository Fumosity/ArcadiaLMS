import React from 'react';
import { ChevronRight } from 'lucide-react';

// Default settings options
const settingsOptions = [
  {
    title: "Update Profile Photo",
    description: "Change your profile photo.",
    href: "#update-photo"
  },
  {
    title: "Change Password",
    description: "Change your password through your registered email account.",
    href: "#change-password"
  },
  {
    title: "Update User Data",
    description: "File a support ticket to update your data like email, college, or department.",
    href: "#update-data"
  },
  {
    title: "Delete Account",
    description: "File a support ticket to request for account deletion.",
    href: "#delete-account"
  }
];

export function AccountSettings({ options = settingsOptions }) {
  return (
    <div className="uMain-cont">
      <h2 className="text-xl font-medium text-arcadia-black mb-6">Account Settings</h2>
      <div className="space-y-4">
        {options.map((option) => (
          <a
            key={option.title}
            href={option.href}
            className="flex items-center border border-grey justify-between p-4 rounded-2xl hover:bg-light-gray transition-colors group"
          >
            <div>
              <h3 className="font-medium text-arcadia-black mb-1">{option.title}</h3>
              <p className="text-sm text-dark-gray">{option.description}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-dark-gray group-hover:text-arcadia-black transition-colors" />
          </a>
        ))}
      </div>
    </div>
  );
}
