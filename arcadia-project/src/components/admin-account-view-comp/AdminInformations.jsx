import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient.js"; // Adjust the import path as necessary.
import AccountModifier from "../../z_modals/AccountModifier.jsx";
import DeleteSupadminAcc from "../../z_modals/attention-modals/DeleteSupadminAcc";
import DeleteAdminAcc from "../../z_modals/attention-modals/DeleteAdminAcc";

const AdminInformations = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSuperadminModalOpen, setIsSuperadminModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      let userData;
      if (location.state?.user) {
        if (location.state.user.userID) {
          // Data is already complete, use it directly
          userData = location.state.user;
        } else {
          // Fetch data based on userId
          const { data, error } = await supabase
            .from("user_accounts")
            .select("*")
            .eq("userID", location.state.user.userId)
            .single();

          if (error) {
            console.error("Error fetching user data:", error);
            return;
          }
          userData = data;
        }
      } else {
        const userId = location.pathname.split("/").pop();
        const { data, error } = await supabase
          .from("user_accounts")
          .select("*")
          .eq("userID", userId)
          .single();

        if (error) {
          console.error("Error fetching user data:", error);
          return;
        }
        userData = data;
      }

      setUser(userData);
    };

    fetchUserData();
  }, [location.state?.user, location.pathname]);

  if (!user) {
    return <p>Loading user data...</p>;
  }

  const handleModify = () => setIsModalOpen(true);

  const handleDeleteAttempt = () => {
    if (user.userAccountType === "Superadmin") {
      setIsSuperadminModalOpen(true);
    } else {
      setIsDeleteModalOpen(true);
    }
  };

  const handleDelete = async () => {
    try {
      const { data, error } = await supabase
        .from("user_accounts")
        .delete()
        .eq("userID", user.userID);

      if (error) {
        console.error("Error deleting user:", error);
        alert("An error occurred while deleting the user.");
        return;
      }

      console.log("User deleted:", data);
      alert("User account successfully deleted.");
      setIsDeleteModalOpen(false);
      navigate("/admin/useraccounts");
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-center mb-6">Admin Account Information</h2>
      <div className="grid grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          {[
            { label: "Type", value: user.userAccountType || "N/A" },
            { label: "User ID", value: user.userID || "N/A" },
            { label: "School ID No.", value: user.userLPUID || "N/A" },
            { label: "Name", value: `${user.userFName || ""} ${user.userLName || ""}`.trim() || "N/A" },
          ].map(({ label, value }) => (
            <div className="flex items-center" key={label}>
              <label className="w-1/3 text-sm font-medium">{label}:</label>
              <input
                className="border border-gray-300 rounded-lg px-3 py-1 w-full"
                value={value}
                readOnly
              />
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {[
            { label: "College", value: user.userCollege || "N/A" },
            { label: "Department", value: user.userDepartment || "N/A" },
            { label: "Email", value: user.userEmail || "N/A" },
            { label: "Password", value: "********" },
          ].map(({ label, value }) => (
            <div className="flex items-center" key={label}>
              <label className="w-1/3 text-sm font-medium">{label}:</label>
              <input
                className="border border-gray-300 rounded-lg px-3 py-1 w-full"
                value={value}
                readOnly
              />
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center space-x-4 mt-6">
        <button className="modifyButton" onClick={handleModify}>
          Modify
        </button>
        <button className="cancelButton" onClick={handleDeleteAttempt}>
          Delete
        </button>
      </div>

      {/* Modals */}
      <AccountModifier
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
        onUpdate={(updatedUser) => {
          console.log("User updated:", updatedUser);
          setUser(updatedUser);
        }}
      />
      <DeleteAdminAcc
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDelete}
      />
      <DeleteSupadminAcc
        isOpen={isSuperadminModalOpen}
        onClose={() => setIsSuperadminModalOpen(false)}
      />
    </div>
  );
};

export default AdminInformations;

