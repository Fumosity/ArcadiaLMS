import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UserInformationModal from "../../z_modals/UserInformationModal";
import DeleteUserAcc from "../../z_modals/attention-modals/DeleteUserAcc";
import AccountModifier from "../../z_modals/AccountModifier";
import DeleteSupadminAcc from "../../z_modals/attention-modals/DeleteSupadminAcc";
import DeleteAdminAcc from "../../z_modals/attention-modals/DeleteAdminAcc";
import { supabase } from "../../supabaseClient"; // Ensure correct path

const UserInformations = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state || {}; // Extract userId from route state
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSuperadminModalOpen, setIsSuperadminModalOpen] = useState(false);

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

  const formatSchoolNo = (value) => {
    // Remove non-numeric characters
    let numericValue = value.replace(/\D/g, "");

    // Apply the XXXX-X-XXXXX format
    if (numericValue.length > 4) {
      numericValue = `${numericValue.slice(0, 4)}-${numericValue.slice(4)}`;
    }
    if (numericValue.length > 6) {
      numericValue = `${numericValue.slice(0, 6)}-${numericValue.slice(6, 11)}`;
    }
    return numericValue;
  };

  // Determine the account title based on user type
  const accountTitle =
    user.userAccountType === "Student" ||
      user.userAccountType === "Teacher" ||
      user.userAccountType === "Intern"
      ? "User Account Information"
      : user.userAccountType === "Admin" ||
      user.userAccountType === "Superadmin"
        ? "Admin Account Information"
        : "Account Information";

  return (
    <div className="bg-white p-4 rounded-lg border-grey border">
      <h3 className="text-2xl font-semibold mb-4">{accountTitle}</h3>
      <div className="flex flex-col items-center mb-4">
        <div className="w-24 h-24 border border-grey rounded-full overflow-hidden mb-4">
          <img
            src={user.userPicture || "/image/arcadia_gray.png"}
            alt={`${user.userFName}'s profile photo`}
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-xl font-medium text-arcadia-black">
          {user.userFName || ""} {user.userLName || ""}
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-4">
          <div className="flex items-center">
            <label className="w-1/3 text-md ">Name:</label>
            <input
              className="px-3 py-1 rounded-full border border-grey w-2/3"
              value={`${user.userFName || ""} ${user.userLName || ""}`}
              readOnly
            />
          </div>
          <div className="flex items-center">
            <label className="w-1/3 text-md ">Type:</label>
            <input
              className="px-3 py-1 rounded-full border border-grey w-2/3"
              value={user.userAccountType || ""}
              readOnly
            />
          </div>
          <div className="flex items-center">
            <label className="w-1/3 text-md ">School ID No.:</label>
            <input
              className="px-3 py-1 rounded-full border border-grey w-2/3"
              value={formatSchoolNo(user.userLPUID) || ""}
              readOnly
            />
          </div>
          <div className="flex items-center">
            <label className="w-1/3 text-md ">Is Verified:</label>
            <input
              className="px-3 py-1 rounded-full border border-grey w-2/3 capitalize"
              value={user.userVerifyStatus || "False"}
              readOnly
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="flex items-center">
            <label className="w-1/3 text-md ">College:</label>
            <input
              className="px-3 py-1 rounded-full border border-grey w-2/3"
              value={user.userCollege || ""}
              readOnly
            />
          </div>
          <div className="flex items-center">
            <label className="w-1/3 text-md ">Department:</label>
            <input
              className="px-3 py-1 rounded-full border border-grey w-2/3"
              value={user.userDepartment || ""}
              readOnly
            />
          </div>
          <div className="flex items-center">
            <label className="w-1/3 text-md ">Email:</label>
            <input
              className="px-3 py-1 rounded-full border border-grey w-2/3"
              value={user.userEmail || ""}
              readOnly
            />
          </div>
          <div className="flex items-center">
            <label className="w-1/3 text-md ">Password:</label>
            <input
              type="password"
              className="px-3 py-1 rounded-full border border-grey w-2/3"
              value="********"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center space-x-4 mt-6">
        <button
          className="add-book w-1/4 mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
          onClick={handleModify}
        >
          Modify
        </button>
        <button
          className="add-book w-1/4 mb-2 px-4 py-2 rounded-lg border-grey hover:bg-arcadia-red hover:text-white transition"
          onClick={() => setIsDeleteModalOpen(true)}
        >
          Delete
        </button>
      </div>

      {/* Modals */}
      {user.userAccountType === "Admin" || 
        user.userAccountType === "Superadmin" ? (
        <>
          <UserInformationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            user={user}
            onUpdate={handleUserUpdate}
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
        </>
      ) : (
        <>
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
        </>
      )}

    </div>
  );
};

export default UserInformations;
