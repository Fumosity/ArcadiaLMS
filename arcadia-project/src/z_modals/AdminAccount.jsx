import React, { useState } from "react";
import { supabase } from "./../supabaseClient";
import DemoteToAdmin from "../z_modals/attention-modals/DemoteToAdmin";
import PromoteToSuperadmin from "./attention-modals/PromoteToSuperadmin";
import PromoteAdminModal from "./PromoteAdmin";
import WrngDemote from "./warning-modals/WrngDemote";

const AdminAccount = ({ isOpen, onClose, user, onUpdate }) => {
  if (!isOpen) return null;

  const [modifiedUser, setModifiedUser] = useState({
    ...user,
    name: `${user.userFName} ${user.userLName}`,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoteModalOpen, setIsDemoteModalOpen] = useState(false);
  const [isDDemoteToInternModalOpen, setIsDemoteToInternModalOpen] = useState(false);
  const [isPromoteToSuperadminModalOpen, setIsPromoteToSuperadminModalOpen] = useState(false);
  const [isPromoteToAdminModalOpen, setIsPromoteToAdminModalOpen] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);

  const handleChangeType = (e) => {
    const newType = e.target.value;

    if (modifiedUser.type === "Superadmin" && newType === "Admin") {
      setIsDemoteModalOpen(true);
    }

    if (modifiedUser.type === "Superadmin" || "Admin" && newType === "Intern") {
      setIsDemoteToInternModalOpen(true);
    }

    if (modifiedUser.type === "Admin" && newType === "Superadmin") {
      setIsPromoteToSuperadminModalOpen(true);
    }

    if (modifiedUser.type === "Intern" && newType === "Admin") {
      setIsPromoteToAdminModalOpen(true);
    }

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

    if (modifiedUser.type === "Intern" && user.type === "Superadmin" || "Admin") {
      setPendingSubmit(true); // Wait for demotion confirmation
      setIsDemoteToInternModalOpen(true);
      return;
    }

    if (modifiedUser.type === "Superadmin" && user.type === "Admin") {
      setPendingSubmit(true); // Wait for demotion confirmation
      setIsPromoteToSuperadminModalOpen(true);
      return;
    }

    if (modifiedUser.type === "Admin" && user.type === "Intern") {
      setPendingSubmit(true); // Wait for demotion confirmation
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
          userPassword: modifiedUser.password,
        })
        .eq("userID", modifiedUser.userId);

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
                value={modifiedUser.userId}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-full"
                onChange={handleInputChange}
              />
            </div>

            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">School ID No.:</span>
              <input
                type="text"
                name="schoolId"
                value={modifiedUser.schoolId}
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
                value={modifiedUser.college}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-full"
                onChange={handleInputChange}
              />
            </div>

            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">Department:</span>
              <input
                type="text"
                name="department"
                value={modifiedUser.department}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-full"
                onChange={handleInputChange}
              />
            </div>

            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">Email:</span>
              <input
                type="email"
                name="email"
                value={modifiedUser.email}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-full"
                onChange={handleInputChange}
              />
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
        onPromote={handleDemoteToInternConfirm}
      />

      <PromoteToSuperadmin
        isOpen={isPromoteToSuperadminModalOpen}
        onClose={() => setIsPromoteToSuperadminModalOpen(false)}
        onPromote={handlePromoteToSuperadminConfirm}
      />
      <PromoteAdminModal
        isOpen={isPromoteToAdminModalOpen}
        onClose={() => setIsPromoteToAdminModalOpen(false)}
        userFName={modifiedUser.userFName}
        userLName={modifiedUser.userLName}
        onPromote={handlePromoteToAdminConfirm}
      />



    </div>
  );
};

export default AdminAccount;
