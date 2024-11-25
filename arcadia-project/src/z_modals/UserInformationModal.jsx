import React, { useState } from 'react';
import { supabase } from './../supabaseClient';

const UserInformationModal = ({ isOpen, onClose, user, onUpdate }) => {
  if (!isOpen) return null;

  const [modifiedUser, setModifiedUser] = useState({
    ...user,
    name: `${user.userFName} ${user.userLName}`
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeType = () => {
    setModifiedUser((prevUser) => ({
      ...prevUser,
      type: prevUser.type === "Student" ? "Teacher" :
        prevUser.type === "Teacher" ? "Intern" : "Student",
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'name') {
      const nameParts = value.split(' ');
      const userLName = nameParts.pop(); // Last word is last name
      const userFName = nameParts.join(' '); // Remaining parts are first name
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
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_accounts')
        .update({
          userAccountType: modifiedUser.type,
          userFName: modifiedUser.userFName,
          userLName: modifiedUser.userLName,
          userCollege: modifiedUser.college,
          userDepartment: modifiedUser.department,
          userEmail: modifiedUser.email,
        })
        .eq('userID', modifiedUser.userId);

      if (error) {
        console.error('Error updating user:', error);
        alert('An error occurred while updating the user.');
        return;
      }

      console.log('User updated:', data);
      onUpdate(modifiedUser);
      onClose();
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl p-8 sm:p-10">
        <h2 className="text-2xl font-semibold mb-8 text-center">Modify User Account Information</h2>

        <div className="flex flex-col sm:flex-row gap-8 sm:gap-12">
          <div className="flex-1 space-y-4 min-w-0">
            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">Type:</span>
              <div className="flex-1 flex items-center relative">
                <input
                  type="text"
                  name="type"
                  value={modifiedUser.type}
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded-full text-right pr-20"
                  readOnly
                />
                <button
                  className="absolute right-0 px-4 py-1 text-sm text-blue-600 hover:text-blue-800"
                  onClick={handleChangeType}
                >
                  Change
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">User ID:</span>
              <input
                type="text"
                name="userId"
                value={modifiedUser.userId}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-full"
                readOnly
              />
            </div>

            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">School ID No.:</span>
              <input
                type="text"
                name="schoolId"
                value={modifiedUser.schoolId}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-full"
                readOnly
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

            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">Password:</span>
              <div className="flex-1 flex items-center relative">
                <input
                  type="password"
                  value="********"
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded-full text-right pr-20"
                  readOnly
                />
                <button className="absolute right-0 px-4 py-1 text-sm text-blue-600 hover:text-blue-800">
                  Change
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
            {isLoading ? 'Saving...' : 'Modify'}
          </button>
          <button
            className="cancelButton"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserInformationModal;

