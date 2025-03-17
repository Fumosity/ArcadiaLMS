import { useState } from "react"
import { ChevronRight } from "lucide-react"
import UpdateProfilePic from "../../z_modals/UpdateProfilePic" // Adjust the import path as needed
import { useNavigate } from "react-router-dom"
import { useUser } from "../../backend/UserContext" // Adjust the path

// Settings options with actions and links
const settingsOptions = [
  {
    title: "Update Profile Photo",
    description: "Change your profile photo.",
    action: "openModal", // Modal for updating profile photo
  },
  {
    title: "Change Password",
    description: "Change your password through your registered email account.",
    href: "/admin/useraccounts/viewusers"
  },
  {
    title: "Update User Data",
    description: "Edit your user data.",
    href: "/admin/useraccounts/viewusers", // Navigate to UserInformations
  },
]

// Individual settings option component
const SettingsOption = ({ title, description, onClick }) => (
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
)

export const AdminSettings = ({ options = settingsOptions }) => {
  const { user } = useUser() // Access the current user
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOptionClick = (option) => {
    if (option.action === "openModal") {
      setIsModalOpen(true) // Open modal for updating profile photo
    } else if (option.href) {
      if (option.href === "/admin/useraccounts/viewusers") {
        // Navigate to AUAccView and pass the full user object and source
        navigate(option.href, {
          state: {
            user: user,
            userId: user.userID,
            source: "settings",
          },
        })
      } else {
        // Redirect to the provided link
        navigate(option.href)
      }
    }
  }

  return (
    <div className="uMain-cont bg-light-white">
      <h2 className="text-xl font-medium text-arcadia-black mb-6">Account Settings</h2>
      <div className="space-y-4">
        {options.map((option) => (
          <SettingsOption
            key={option.title}
            title={option.title}
            description={option.description}
            onClick={() => handleOptionClick(option)}
          />
        ))}
      </div>

      {/* Render the modal */}
      {isModalOpen && <UpdateProfilePic isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
    </div>
  )
}

