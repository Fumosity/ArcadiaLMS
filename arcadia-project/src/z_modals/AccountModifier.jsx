import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import DemoteToAdmin from "./attention-modals/DemoteToAdmin";
import DeleteSupadminAcc from "./attention-modals/DeleteSupadminAcc";
import PromoteToSuperadmin from "./attention-modals/PromoteToSuperadmin";
import PromoteAdminModal from "./PromoteAdmin";
import WrngDemote from "./warning-modals/WrngDemote";

const AccountModifier = ({ isOpen, onClose, user, onUpdate }) => {
  if (!isOpen) return null;

  const [modifiedUser, setModifiedUser] = useState({
    ...user,
    userID: user.userID || '',
    userLPUID: user.userLPUID || '',
    userFName: user.userFName || '',
    userLName: user.userLName || '',
    userEmail: user.userEmail || '',
    userPassword: user.userPassword || '',
    userCollege: user.userCollege || '',
    userDepartment: user.userDepartment || '',
    userAccountType: user.userAccountType || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoteModalOpen, setIsDemoteModalOpen] = useState(false);
  const [isDemoteToInternModalOpen, setIsDemoteToInternModalOpen] = useState(false);
  const [isPromoteToSuperadminModalOpen, setIsPromoteToSuperadminModalOpen] = useState(false);
  const [isPromoteToAdminModalOpen, setIsPromoteToAdminModalOpen] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleChangeType = (e) => {
    const newType = e.target.value;
    setModifiedUser((prevUser) => ({
      ...prevUser,
      userAccountType: newType,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModifiedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
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

    await updateUserInDatabase();
  };

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

  const updateUserInDatabase = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_accounts")
        .update({
          userID: modifiedUser.userID,
          userLPUID: modifiedUser.userLPUID,
          userFName: modifiedUser.userFName,
          userLName: modifiedUser.userLName,
          userEmail: modifiedUser.userEmail,
          userPassword: modifiedUser.userPassword,
          userCollege: modifiedUser.userCollege,
          userDepartment: modifiedUser.userDepartment,
          userAccountType: modifiedUser.userAccountType,
        })
        .eq("userID", user.userID);

      if (error) {
        console.error("Supabase update error:", error.message);
        alert(`Failed to save changes: ${error.message}`);
        return;
      }

      console.log("User successfully updated:", data);
      onUpdate(modifiedUser);
      onClose();
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred while saving changes.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl p-8 sm:p-10">
        <h2 className="text-2xl font-semibold mb-8 text-center">
          Modify Admin Account Information
        </h2>

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
                <option value="Intern">Intern</option>
                <option value="Admin">Admin</option>
                <option value="Superadmin">Superadmin</option>
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
              <span className="w-32 text-sm font-medium">Password:</span>
              <div className="flex-1 flex items-center relative">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  name="userPassword"
                  value={modifiedUser.userPassword}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded-full"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 text-sm text-blue-600 hover:text-blue-800"
                >
                  {isPasswordVisible ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4 mt-10">
          <button
            className="modifyButton"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Modify"}
          </button>
          <button
            className="cancelButton"
            onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>

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
    </div>
  );
};

export default AccountModifier;

