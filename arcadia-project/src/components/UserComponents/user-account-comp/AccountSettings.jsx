import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import UpdateProfilePic from "../../../z_modals/UpdateProfilePic"
import UserChangePass from "../../../z_modals/UserChangePass"

const settingsOptions = [
  {
    title: "Update Profile Photo",
    description: "Change your profile photo.",
    action: "openProfilePicModal",
  },
  {
    title: "Change Password",
    description: "Change your password through your registered email account.",
    action: "openChangePassModal",
  },
  {
    title: "Update User Data",
    description: "File a support ticket to update your data like email, college, or department.",
    path: "/user/support/supportticket",
    params: { type: "Account", subject: "Request to Update User Data" },
  },
  {
    title: "Delete Account",
    description: "File a support ticket to request account deletion.",
    path: "/user/support/supportticket",
    params: { type: "Account", subject: "Request to Delete Account" },
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

export const AccountSettings = ({ options = settingsOptions }) => {
  const navigate = useNavigate()
  const [isProfilePicModalOpen, setIsProfilePicModalOpen] = useState(false)
  const [isChangePassModalOpen, setIsChangePassModalOpen] = useState(false)

  // Get user ID from session storage or context
  const storedUser = JSON.parse(localStorage.getItem("user"))
  const userID = storedUser?.userID

  const handleOptionClick = (option) => {
    if (option.action === "openProfilePicModal") {
      setIsProfilePicModalOpen(true)
    } else if (option.action === "openChangePassModal") {
      setIsChangePassModalOpen(true)
    } else if (option.path) {
      const queryParams = new URLSearchParams(option.params).toString()
      navigate(`${option.path}?${queryParams}`)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <div className="uMain-cont">
      <h2 className="text-2xl font-medium text-arcadia-black mb-6">Account Settings</h2>
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

      {/* Profile Picture Modal */}
      {isProfilePicModalOpen && (
        <UpdateProfilePic isOpen={isProfilePicModalOpen} onClose={() => setIsProfilePicModalOpen(false)} />
      )}

      {/* Change Password Modal */}
      {isChangePassModalOpen && (
        <UserChangePass
          isOpen={isChangePassModalOpen}
          onClose={() => setIsChangePassModalOpen(false)}
          userID={userID}
        />
      )}
    </div>
  )
}
