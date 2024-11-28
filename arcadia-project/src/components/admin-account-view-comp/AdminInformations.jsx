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
    if (location.state?.user) {
      setUser(location.state.user); // Use the user passed from ListOfAdminAcc
    } else {
      // Fetch user if not passed through navigation
      const fetchUserData = async () => {
        const userId = location.pathname.split("/").pop(); // Assumes user ID is in the URL
        const { data, error } = await supabase
          .from("user_accounts")
          .select("*")
          .eq("userID", userId)
          .single();

        if (error) {
          console.error("Error fetching user data:", error);
        } else {
          setUser(data);
        }
      };

      fetchUserData();
    }
  }, [location.state?.user, location.pathname]);

  if (!user) {
    return <p>Loading user data...</p>;
  }

  const handleModify = () => setIsModalOpen(true);

  const handleDeleteAttempt = () => {
    if (user.type === "Superadmin") {
      setIsSuperadminModalOpen(true); // Open Superadmin modal
    } else {
      setIsDeleteModalOpen(true); // Open Delete Admin modal
    }
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
            { label: "Type", value: user?.type || user?.userAccountType || "N/A" },
            { label: "User ID", value: user?.userId || user?.userID || "N/A" },
            { label: "School ID No.", value: user?.schoolId || user?.userLPUID|| "N/A" },
            { label: "Name", value: `${user?.userFName || ""} ${user?.userLName || ""}`.trim() || "N/A" },
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
            { label: "College", value: user?.college || user?.userCollege || "N/A" },
            { label: "Department", value: user?.department || user?.userDepartment || "N/A" },
            { label: "Email", value: user?.email || user?.userEmail || "N/A" },
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
