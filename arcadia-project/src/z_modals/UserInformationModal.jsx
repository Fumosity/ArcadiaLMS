import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"
import DemoteToAdmin from "./attention-modals/DemoteToAdmin"
import PromoteToSuperadmin from "./attention-modals/PromoteToSuperadmin"
import PromoteAdminModal from "./PromoteAdmin"
import bcrypt from "bcryptjs"
import { useUser } from "../backend/UserContext"

const UserInformationModal = ({ isOpen, onClose, user, onUpdate }) => {
  const { user: currentUser } = useUser() // Get current user from context
  const [modifiedUser, setModifiedUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAttentionModalOpen, setIsAttentionModalOpen] = useState(false)
  const [isDemotionModalOpen, setIsDemotionModalOpen] = useState(false)
  const [isDemoteModalOpen, setIsDemoteModalOpen] = useState(false)
  const [isDemoteToInternModalOpen, setIsDemoteToInternModalOpen] = useState(false)
  const [isPromoteToSuperadminModalOpen, setIsPromoteToSuperadminModalOpen] = useState(false)
  const [isPromoteToAdminModalOpen, setIsPromoteToAdminModalOpen] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [newPassword, setNewPassword] = useState("")

  // Check if current user can edit this account
  const canEditAccount = () => {
    if (!currentUser) return false

    // Superadmin can edit any account
    if (currentUser.userAccountType === "Superadmin") return true

    // Admin can only edit their own account or non-admin accounts
    if (currentUser.userAccountType === "Admin") {
      return (
        user.userID === currentUser.userID || // their own account
        (user.userAccountType !== "Admin" && user.userAccountType !== "Superadmin") // non-admin accounts
      )
    }

    // Other account types can only edit their own account
    return user.userID === currentUser.userID
  }

  // Check if current user can change account type
  const canChangeAccountType = () => {
    if (!currentUser) return false

    // Superadmin can change any account type
    if (currentUser.userAccountType === "Superadmin") {
      return true
    }

    return false
  }
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isOpen || !user.userID) return

      setIsLoading(true)
      try {
        const { data, error } = await supabase.from("user_accounts").select("*").eq("userID", user.userID).single()

        if (error) {
          console.error("Error fetching user data:", error)
          alert("Failed to fetch user data. Please try again.")
        } else if (data) {
          setModifiedUser(data)
        }
      } catch (error) {
        console.error("Unexpected error:", error)
        alert("An unexpected error occurred while fetching user data.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [isOpen, user.userID])

  // Effect to hide toast after 1500ms
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [showToast])

  const handleChangeType = (e) => {
    if (!canChangeAccountType()) return

    const newType = e.target.value
    setModifiedUser((prevUser) => ({
      ...prevUser,
      userAccountType: newType,
    }))
  }

  const handleSubmit = async () => {
    if (!canEditAccount()) {
      alert("You don't have permission to modify this account.")
      return
    }

    if (user.userAccountType === "Admin" || user.userAccountType === "Superadmin") {
      if (modifiedUser.userAccountType === "Admin" && user.userAccountType === "Superadmin") {
        setIsDemoteModalOpen(true)
        return
      }

      if (modifiedUser.userAccountType === "Superadmin" && user.userAccountType === "Admin") {
        setIsPromoteToSuperadminModalOpen(true)
        return
      }
    }
    await updateUserInDatabase()
  }

  const handleInputChange = (e) => {
    if (!canEditAccount()) return

    const { name, value } = e.target
    setModifiedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }))
  }

  const handlePasswordChange = (e) => {
    if (!canEditAccount()) return
    setNewPassword(e.target.value)
  }

  const handleAttentionConfirm = async () => {
    setIsAttentionModalOpen(false)
    await updateUserInDatabase()
  }

  const handleDemotionConfirm = async () => {
    setIsDemotionModalOpen(false)
    await updateUserInDatabase()
  }

  // Admin handle modals
  const handleDemoteConfirm = async () => {
    setIsDemoteModalOpen(false)
    await updateUserInDatabase()
  }

  const handlePromoteToSuperadminConfirm = async () => {
    setIsPromoteToSuperadminModalOpen(false)
    await updateUserInDatabase()
  }

  const handlePromoteToAdminConfirm = async () => {
    setIsPromoteToAdminModalOpen(false)
    await updateUserInDatabase()
  }

  const updateUserInDatabase = async () => {
    if (!canEditAccount()) {
      alert("You don't have permission to modify this account.")
      return
    }

    setIsLoading(true)
    try {
      const userToUpdate = { ...modifiedUser }

      if (newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        userToUpdate.userPassword = hashedPassword
      } else {
        delete userToUpdate.userPassword
      }

      const { data, error } = await supabase.from("user_accounts").update(userToUpdate).eq("userID", user.userID)

      if (error) {
        console.error("Error updating user:", error)
        alert("An error occurred while updating the user.")
        return
      }

      console.log("User updated:", data)
      setShowToast(true)
      onUpdate(modifiedUser)
      onClose()
    } catch (error) {
      console.error("Unexpected error:", error)
      alert("An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  if (!isOpen) return null

  if (isLoading || !modifiedUser) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <p className="text-lg font-semibold">Loading user data...</p>
        </div>
      </div>
    )
  }

  const accountTitle =
    user.userAccountType === "Student" || user.userAccountType === "Faculty"
      ? "Modify User Account Information"
      : user.userAccountType === "Admin" || user.userAccountType === "Superadmin"
        ? "Modify Admin Account Information"
        : "Account Information"

  const isEditable = canEditAccount()
  const canChangeType = canChangeAccountType()

  // Determine which account type options to show based on current user and target user
  const getAccountTypeOptions = () => {
    if (currentUser?.userAccountType === "Superadmin") {
      // If Superadmin is editing a Student or Faculty account, only show Student, Faculty, Admin options
      if (user.userAccountType === "Student" || user.userAccountType === "Faculty") {
        return (
          <>
            <option value="Student">Student</option>
            <option value="Faculty">Faculty</option>
            <option value="Admin">Admin</option>
          </>
        )
      }
      // If Superadmin is editing an Admin or Superadmin account, show Admin and Superadmin options
      else if (user.userAccountType === "Admin") {
        return (
          <>
          <option value="Student">Student</option>
          <option value="Faculty">Faculty</option>
            <option value="Admin">Admin</option>
            <option value="Superadmin">Superadmin</option>
          </>
        )
      }

      else if (user.userAccountType === "Superadmin") {
        return (
          <>
            <option value="Admin">Admin</option>
            <option value="Superadmin">Superadmin</option>
          </>
        )
      }
      // For any other account types
      else {
        return (
          <>
            <option value="Student">Student</option>
            <option value="Faculty">Faculty</option>
            <option value="Admin">Admin</option>
            <option value="Superadmin">Superadmin</option>
          </>
        )
      }
    }
    // For non-Superadmin users, just show the current account type
    else {
      return <option value={user.userAccountType}>{user.userAccountType}</option>
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl p-8 sm:p-10">
        <h3 className="text-2xl font-semibold mb-4">{accountTitle}</h3>

        {!isEditable && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
            <p>You don't have permission to edit this account.</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-8 sm:gap-12">
          <div className="flex-1 space-y-4 min-w-0">
            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">Type:</span>
              <select
                name="userAccountType"
                value={modifiedUser.userAccountType}
                onChange={handleChangeType}
                className={`flex-1 px-3 py-1.5 border border-gray-300 rounded-full ${!canChangeType ? "bg-gray-100 cursor-not-allowed" : ""}`}
                disabled={!canChangeType}
              >
                {getAccountTypeOptions()}
              </select>
            </div>

            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">School ID No.:</span>
              <input
                type="text"
                name="userLPUID"
                value={modifiedUser.userLPUID}
                className={`flex-1 px-3 py-1.5 border border-gray-300 rounded-full ${!isEditable ? "bg-gray-100 cursor-not-allowed" : ""}`}
                onChange={handleInputChange}
                disabled={!isEditable}
              />
            </div>

            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">First Name:</span>
              <input
                type="text"
                name="userFName"
                value={modifiedUser.userFName}
                className={`flex-1 px-3 py-1.5 border border-gray-300 rounded-full ${!isEditable ? "bg-gray-100 cursor-not-allowed" : ""}`}
                onChange={handleInputChange}
                disabled={!isEditable}
              />
            </div>
            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">Last Name:</span>
              <input
                type="text"
                name="userLName"
                value={modifiedUser.userLName}
                className={`flex-1 px-3 py-1.5 border border-gray-300 rounded-full ${!isEditable ? "bg-gray-100 cursor-not-allowed" : ""}`}
                onChange={handleInputChange}
                disabled={!isEditable}
              />
            </div>
          </div>

          <div className="flex-1 space-y-4 min-w-0">
            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">College:</span>
              <input
                type="text"
                name="userCollege"
                value={modifiedUser.userCollege}
                className={`flex-1 px-3 py-1.5 border border-gray-300 rounded-full ${!isEditable ? "bg-gray-100 cursor-not-allowed" : ""}`}
                onChange={handleInputChange}
                disabled={!isEditable}
              />
            </div>

            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">Department:</span>
              <input
                type="text"
                name="userDepartment"
                value={modifiedUser.userDepartment}
                className={`flex-1 px-3 py-1.5 border border-gray-300 rounded-full ${!isEditable ? "bg-gray-100 cursor-not-allowed" : ""}`}
                onChange={handleInputChange}
                disabled={!isEditable}
              />
            </div>

            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">Email:</span>
              <input
                type="email"
                name="userEmail"
                value={modifiedUser.userEmail}
                className={`flex-1 px-3 py-1.5 border border-gray-300 rounded-full ${!isEditable ? "bg-gray-100 cursor-not-allowed" : ""}`}
                onChange={handleInputChange}
                disabled={!isEditable}
              />
            </div>

            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">New Password:</span>
              <div className="flex-1 items-center relative">
                <div className="flex-1 flex items-center relative">
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    name="newPassword"
                    value={newPassword}
                    onChange={handlePasswordChange}
                    className={`flex-1 px-3 py-1.5 border border-gray-300 rounded-full ${!isEditable ? "bg-gray-100 cursor-not-allowed" : ""}`}
                    placeholder="Enter new password"
                    disabled={!isEditable}
                  />

                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 text-sm text-blue-600 hover:text-blue-800"
                    disabled={!isEditable}
                  >
                    {isPasswordVisible ? "Hide" : "Show"}
                  </button>
                </div>
                <p className="italic text-arcadia-red text-xs text-left ml-3">leave empty to keep current*</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4 mt-10">
          <button className="modifyButton" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </button>
          <button className="cancelButton" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>

      {user.userAccountType === "Admin" || user.userAccountType === "Superadmin" ? (
        <>
          <DemoteToAdmin
            isOpen={isDemoteModalOpen}
            onClose={() => setIsDemoteModalOpen(false)}
            onDemote={handleDemoteConfirm}
          />

          <PromoteToSuperadmin
            isOpen={isPromoteToSuperadminModalOpen}
            onClose={() => setIsPromoteToSuperadminModalOpen(false)}
            onPromote={handlePromoteToSuperadminConfirm}
          />

          <PromoteAdminModal
            isOpen={isPromoteToAdminModalOpen}
            onClose={() => setIsPromoteToAdminModalOpen(false)}
            onPromote={handlePromoteToAdminConfirm}
          />
        </>
      ) : null}
    </div>
  )
}

export default UserInformationModal

