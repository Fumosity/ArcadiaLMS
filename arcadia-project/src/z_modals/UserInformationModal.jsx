"use client"

import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"
import WrngPromoteToIntern from "./warning-modals/WrngPromoteToIntern"
import WrngDemoteFromIntern from "./warning-modals/WrngDemoteFromIntern"
import DemoteToAdmin from "./attention-modals/DemoteToAdmin";
import PromoteToSuperadmin from "./attention-modals/PromoteToSuperadmin";
import PromoteAdminModal from "./PromoteAdmin";
import WrngDemote from "./warning-modals/WrngDemote";
import bcrypt from "bcryptjs"

const UserInformationModal = ({ isOpen, onClose, user, onUpdate }) => {
  const [modifiedUser, setModifiedUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAttentionModalOpen, setIsAttentionModalOpen] = useState(false)
  const [isDemotionModalOpen, setIsDemotionModalOpen] = useState(false)
  const [isDemoteModalOpen, setIsDemoteModalOpen] = useState(false);
  const [isDemoteToInternModalOpen, setIsDemoteToInternModalOpen] = useState(false);
  const [isPromoteToSuperadminModalOpen, setIsPromoteToSuperadminModalOpen] = useState(false);
  const [isPromoteToAdminModalOpen, setIsPromoteToAdminModalOpen] = useState(false);
  
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [newPassword, setNewPassword] = useState("")

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

  const handleChangeType = (e) => {
    const newType = e.target.value
    setModifiedUser((prevUser) => ({
      ...prevUser,
      userAccountType: newType,
    }))
  }

  const handleSubmit = async () => {
    if (user.userAccountType === "Admin" || user.userAccountType === "Superadmin") {
      if (modifiedUser.userAccountType === "Admin" && user.userAccountType === "Superadmin") {
        setIsDemoteModalOpen(true);
        return;
      }
  
      if (modifiedUser.userAccountType === "Intern" && (user.userAccountType === "Superadmin" || user.userAccountType === "Admin")) {
        setIsDemoteToInternModalOpen(true);
        return;
      }
  
      if (modifiedUser.userAccountType === "Superadmin" && user.userAccountType === "Admin") {
        setIsPromoteToSuperadminModalOpen(true);
        return;
      }
  
      if (modifiedUser.userAccountType === "Admin" && user.userAccountType === "Intern") {
        setIsPromoteToAdminModalOpen(true);
        return;
      }
    } else {
      if (modifiedUser.userAccountType === "Intern" && user.userAccountType !== "Intern") {
        setIsAttentionModalOpen(true);
        return;
      }
  
      if (modifiedUser.userAccountType !== "Intern" && user.userAccountType === "Intern") {
        setIsDemotionModalOpen(true);
        return;
      }
    }
  
    await updateUserInDatabase();
  };
  
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setModifiedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }))
  }

  const handlePasswordChange = (e) => {
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
    setIsDemoteModalOpen(false);
    await updateUserInDatabase();
  };

  const handleDemoteToInternConfirm = async () => {
    setIsDemoteToInternModalOpen(false);
    await updateUserInDatabase();
  };

  const handlePromoteToSuperadminConfirm = async () => {
    setIsPromoteToSuperadminModalOpen(false);
    await updateUserInDatabase();
  };

  const handlePromoteToAdminConfirm = async () => {
    setIsPromoteToAdminModalOpen(false);
    await updateUserInDatabase();
  };
  // end

  const updateUserInDatabase = async () => {
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
  user.userAccountType === "Student" ||
    user.userAccountType === "Teacher" ||
    user.userAccountType === "Intern"
    ? "Modify User Account Information"
    : user.userAccountType === "Admin" ||
      user.userAccountType === "Superadmin"
      ? "Modify Admin Account Information"
      : "Account Information";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl p-8 sm:p-10">
        <h3 className="text-2xl font-semibold mb-4 text-center">{accountTitle}</h3>

        <div className="flex flex-col sm:flex-row gap-8 sm:gap-12">
          <div className="flex-1 space-y-4 min-w-0">
            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">Type:</span>
              <select
                name="userAccountType"
                value={modifiedUser.userAccountType}
                onChange={handleChangeType}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-full"
              >
                {user.userAccountType === "Admin" || user.userAccountType === "Superadmin" ? (
                  <>
                    <option value="Intern">Intern</option>
                    <option value="Admin">Admin</option>
                    <option value="Superadmin">Superadmin</option>
                  </>
                ) : (
                  <>
                    <option value="Intern">Intern</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Student">Student</option>
                    <option value="User">User</option>
                  </>
                )}
              </select>
            </div>


            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">User ID:</span>
              <input
                type="text"
                name="userID"
                value={modifiedUser.userID}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-full"
                onChange={handleInputChange}
              />
            </div>

            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">School ID No.:</span>
              <input
                type="text"
                name="userLPUID"
                value={modifiedUser.userLPUID}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-full"
                onChange={handleInputChange}
              />
            </div>

            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">First Name:</span>
              <input
                type="text"
                name="userFName"
                value={modifiedUser.userFName}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-full"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">Last Name:</span>
              <input
                type="text"
                name="userLName"
                value={modifiedUser.userLName}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-full"
                onChange={handleInputChange}
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
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-full"
                onChange={handleInputChange}
              />
            </div>

            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">Department:</span>
              <input
                type="text"
                name="userDepartment"
                value={modifiedUser.userDepartment}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-full"
                onChange={handleInputChange}
              />
            </div>

            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">Email:</span>
              <input
                type="email"
                name="userEmail"
                value={modifiedUser.userEmail}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-full"
                onChange={handleInputChange}
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
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded-full"
                  placeholder="Enter new password"
                />
                
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 text-sm text-blue-600 hover:text-blue-800"
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
            {isLoading ? "Saving..." : "Modify"}
          </button>
          <button className="cancelButton" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>


      {user.userAccountType === "Admin" || 
        user.userAccountType === "Superadmin" ? (
        <>
          <DemoteToAdmin
            isOpen={isDemoteModalOpen}
            onClose={() => setIsDemoteModalOpen(false)}
            onDemote={handleDemoteConfirm}
          />

          <WrngDemote
            isOpen={isDemoteToInternModalOpen}
            onClose={() => setIsDemoteToInternModalOpen(false)}
            userFName={modifiedUser.userFName}
            userLName={modifiedUser.userLName}
            onDemote={handleDemoteToInternConfirm}
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
      ) : (
        <>
          <WrngPromoteToIntern
            isOpen={isAttentionModalOpen}
            onClose={() => setIsAttentionModalOpen(false)}
            userFName={modifiedUser.userFName}
            userLName={modifiedUser.userLName}
            onPromote={handleAttentionConfirm}
          />

          <WrngDemoteFromIntern
            isOpen={isDemotionModalOpen}
            onClose={() => setIsDemotionModalOpen(false)}
            userFName={modifiedUser.userFName}
            userLName={modifiedUser.userLName}
            onDemote={handleDemotionConfirm}
          />
        </>
      )}
    </div>
  )
}

export default UserInformationModal

