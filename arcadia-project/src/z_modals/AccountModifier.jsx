import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import DemoteToAdmin from "./attention-modals/DemoteToAdmin";
import PromoteToSuperadmin from "./attention-modals/PromoteToSuperadmin";
import PromoteAdminModal from "./PromoteAdmin";
import WrngDemote from "./warning-modals/WrngDemote";

const AccountModifier = ({ isOpen, onClose, user, onUpdate }) => {
  if (!isOpen) return null;

  const [modifiedUser, setModifiedUser] = useState({
    ...user,
    name: `${user.userFName} ${user.userLName}`,
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoteModalOpen, setIsDemoteModalOpen] = useState(false);
  const [isDDemoteToInternModalOpen, setIsDemoteToInternModalOpen] = useState(false);
  const [isPromoteToSuperadminModalOpen, setIsPromoteToSuperadminModalOpen] = useState(false);
  const [isPromoteToAdminModalOpen, setIsPromoteToAdminModalOpen] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleChangeType = (e) => {
    const newType = e.target.value;

    setModifiedUser((prevUser) => ({
      ...prevUser,
      type: newType,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      const nameParts = value.split(" ");
      const userLName = nameParts.pop();
      const userFName = nameParts.join(" ");
      setModifiedUser((prevUser) => ({
        ...prevUser,
        userFName,
        userLName,
        name: value,
      }));
    } else {
      setModifiedUser((prevUser) => ({
        ...prevUser,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    if (modifiedUser.type === "Admin" && user.type === "Superadmin") {
      setPendingSubmit(true); // Wait for demotion confirmation
      setIsDemoteModalOpen(true);
      return;
    }

    if (modifiedUser.type === "Intern" && (user.type === "Superadmin" || user.type === "Admin")) {
      setPendingSubmit(true); // Wait for demotion confirmation
      setIsDemoteToInternModalOpen(true);
      return;
    }

    if (modifiedUser.type === "Superadmin" && user.type === "Admin") {
      setPendingSubmit(true); // Wait for promotion confirmation
      setIsPromoteToSuperadminModalOpen(true);
      return;
    }

    if (modifiedUser.type === "Admin" && user.type === "Intern") {
      setPendingSubmit(true); // Wait for promotion confirmation
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
          userAccountType: modifiedUser.type,
          userFName: modifiedUser.userFName,
          userLName: modifiedUser.userLName,
          userCollege: modifiedUser.college,
          userDepartment: modifiedUser.department,
          userEmail: modifiedUser.email,
        })
        .eq("userID", modifiedUser.userId);
      
        if (modifiedUser.password) {
          updateData.userPassword = modifiedUser.password;
        }

      if (error) {
        console.error("Error updating user:", error);
        alert("An error occurred while updating the user.");
        return;
      }

      console.log("User updated:", data);
      onUpdate(modifiedUser);
      onClose();
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred.");
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
          Modify User Account Information
        </h2>

        <div className="flex flex-col sm:flex-row gap-8 sm:gap-12">
          <div className="flex-1 space-y-4 min-w-0">
            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">Type:</span>
              <select
                name="type"
                value={modifiedUser.type}
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
                name="userId"
                value={modifiedUser.userId || modifiedUser.userID}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-full"
                onChange={handleInputChange}
              />
            </div>

            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">School ID No.:</span>
              <input
                type="text"
                name="schoolId"
                value={modifiedUser.schoolId || modifiedUser.userLPUID}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-full"
                onChange={handleInputChange}
              />
            </div>

            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">First Name:</span>
              <input
                type="text"
                name="userFName"
                value={modifiedUser.userFName || ""}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-full"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">Last Name:</span>
              <input
                type="text"
                name="userLName"
                value={modifiedUser.userLName || ""}
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
                name="college"
                value={modifiedUser.college || modifiedUser.userCollege}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-full"
                onChange={handleInputChange}
              />
            </div>

            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">Department:</span>
              <input
                type="text"
                name="department"
                value={modifiedUser.department || modifiedUser.userDepartment}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-full"
                onChange={handleInputChange}
              />
            </div>

            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">Email:</span>
              <input
                type="email"
                name="email"
                value={modifiedUser.email || modifiedUser.userEmail}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-full"
                onChange={handleInputChange}
              />
            </div>

            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">Password:</span>
              <div className="flex-1 flex items-center relative">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  name="password"
                  value={modifiedUser.password || modifiedUser.userPassword}
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
          <button className="cancelButton" onClick={onClose}>
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
        isOpen={isDDemoteToInternModalOpen}
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
