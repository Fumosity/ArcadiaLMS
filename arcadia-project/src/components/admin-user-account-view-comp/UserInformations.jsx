import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UserInformationModal from "../../z_modals/UserInformationModal";
import DeleteUserAcc from "../../z_modals/attention-modals/DeleteUserAcc"; // Ensure correct path
import { supabase } from "../../supabaseClient"; // Ensure correct path

const UserInformations = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state || {}; // Extract userId from route state
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch user data from Supabase
  useEffect(() => {
    if (!userId) {
      navigate("/admin/userinformation");
      return;
    }
    const fetchUser = async () => {
      const { data, error } = await supabase
        .from("user_accounts")
        .select("*")
        .eq("userID", userId)
        .single();
      if (error) {
        console.error("Error fetching user data:", error);
        navigate("/admin/userinformation");
      } else {
        setUser(data);
      }
    };
    fetchUser();
  }, [userId, navigate]);

  if (!user) return <p>Loading user data...</p>;

  const handleModify = () => setIsModalOpen(true);

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("user_accounts")
        .delete()
        .eq("userID", user.userID);
      if (error) throw error;
      alert("User account successfully deleted.");
      navigate("/admin/useraccounts");
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred.");
    }
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
              value={user.userAccountType || ""}
              readOnly
            />
          </div>
          <div className="flex items-center">
            <label className="w-1/3 text-sm font-medium">User ID:</label>
            <input
              className="border border-gray-300 rounded-lg px-3 py-1 w-full"
              value={user.userID || ""}
              readOnly
            />
          </div>
          <div className="flex items-center">
            <label className="w-1/3 text-sm font-medium">School ID No.:</label>
            <input
              className="border border-gray-300 rounded-lg px-3 py-1 w-full"
              value={user.userLPUID || ""}
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
              value={user.userCollege || ""}
              readOnly
            />
          </div>
          <div className="flex items-center">
            <label className="w-1/3 text-sm font-medium">Department:</label>
            <input
              className="border border-gray-300 rounded-lg px-3 py-1 w-full"
              value={user.userDepartment || ""}
              readOnly
            />
          </div>
          <div className="flex items-center">
            <label className="w-1/3 text-sm font-medium">Email:</label>
            <input
              className="border border-gray-300 rounded-lg px-3 py-1 w-full"
              value={user.userEmail || ""}
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
        onClose={() => setIsModalOpen(false)}
        user={user}
        onUpdate={handleUserUpdate}
      />

      <DeleteUserAcc
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default UserInformations;
