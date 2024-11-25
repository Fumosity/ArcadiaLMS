import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserInformationModal from "../../z_modals/UserInformationModal";
import DeleteUserAcc from "../../z_modals/attention-modals/DeleteUserAcc"; // Ensure correct path
import { supabase } from "../../supabaseClient"; // Ensure correct path

const UserInformations = ({ user: initialUser }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(initialUser || {});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (!user || Object.keys(user).length === 0) {
    navigate("/admin/userinformation");
    return null;
  }

  const handleModify = () => {
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      const { data, error } = await supabase
        .from("user_accounts")
        .delete()
        .eq("userID", user.userId);

      if (error) {
        console.error("Error deleting user:", error);
        alert("An error occurred while deleting the user.");
        return;
      }

      console.log("User deleted:", data);
      alert("User account successfully deleted.");
      setIsDeleteModalOpen(false);
      navigate("/admin/useraccounts"); // Navigate back to the user list
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred.");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    setIsModalOpen(false);
    console.log("User updated:", updatedUser);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-center mb-6">User Account Information</h2>
      <div className="grid grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          <div className="flex items-center">
            <label className="w-1/3 text-sm font-medium">Type:</label>
            <input
              className="border border-gray-300 rounded-lg px-3 py-1 w-full"
              value={user.type || ""}
              readOnly
            />
          </div>
          <div className="flex items-center">
            <label className="w-1/3 text-sm font-medium">User ID:</label>
            <input
              className="border border-gray-300 rounded-lg px-3 py-1 w-full"
              value={user.userId || ""}
              readOnly
            />
          </div>
          <div className="flex items-center">
            <label className="w-1/3 text-sm font-medium">School ID No.:</label>
            <input
              className="border border-gray-300 rounded-lg px-3 py-1 w-full"
              value={user.schoolId || ""}
              readOnly
            />
          </div>
          <div className="flex items-center">
            <label className="w-1/3 text-sm font-medium">Name:</label>
            <input
              className="border border-gray-300 rounded-lg px-3 py-1 w-full"
              value={`${user.userFName || ""} ${user.userLName || ""}`}
              readOnly
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="flex items-center">
            <label className="w-1/3 text-sm font-medium">College:</label>
            <input
              className="border border-gray-300 rounded-lg px-3 py-1 w-full"
              value={user.college || ""}
              readOnly
            />
          </div>
          <div className="flex items-center">
            <label className="w-1/3 text-sm font-medium">Department:</label>
            <input
              className="border border-gray-300 rounded-lg px-3 py-1 w-full"
              value={user.department || ""}
              readOnly
            />
          </div>
          <div className="flex items-center">
            <label className="w-1/3 text-sm font-medium">Email:</label>
            <input
              className="border border-gray-300 rounded-lg px-3 py-1 w-full"
              value={user.email || ""}
              readOnly
            />
          </div>
          <div className="flex items-center">
            <label className="w-1/3 text-sm font-medium">Password:</label>
            <input
              type="password"
              className="border border-gray-300 rounded-lg px-3 py-1 w-full"
              value="********"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center space-x-4 mt-6">
        <button className="modifyButton" onClick={handleModify}>
          Modify
        </button>
        <button
          className="cancelButton"
          onClick={() => setIsDeleteModalOpen(true)}
        >
          Delete
        </button>
      </div>

      <UserInformationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        user={user}
        onUpdate={handleUserUpdate}
      />

      <DeleteUserAcc
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default UserInformations;
