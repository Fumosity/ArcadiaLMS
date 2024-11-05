import React, { useState } from 'react';

const AdminAccount = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // State to manage the current type
  const [userType, setUserType] = useState("Intern");

  // Function to handle changing the user type
  const handleChangeType = () => {
    setUserType((prevType) => {
      if (prevType === "Intern") return "Admin";
      if (prevType === "Admin") return "Superadmin";
      return "Intern"; // Loop back to Student
    });
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
                  value={userType} // Use state variable for the value
                  className="flex-1 px-3 py-1.5 border border-grey rounded-full text-right pr-20" // Add padding for the button
                  readOnly
                />
                <button 
                  className="inputWithChangeBttn"
                  onClick={handleChangeType} // Change type on button click
                >
                  Change
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">User ID:</span>
              <input
                type="text"
                defaultValue="1-00923"
                className="inputBox"
                readOnly
              />
            </div>

            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">School ID No.:</span>
              <input
                type="text"
                defaultValue="2021-2-01090"
                className="inputBox"
                readOnly
              />
            </div>

            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">Name:</span>
              <input
                type="text"
                defaultValue="Alexander B. Corrine"
                className="inputBox"
                readOnly
              />
            </div>
          </div>

          <div className="flex-1 space-y-4 min-w-0">
            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">College:</span>
              <input
                type="text"
                defaultValue="COECSA"
                className="inputBox"
                readOnly
              />
            </div>

            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">Department:</span>
              <input
                type="text"
                defaultValue="DCS"
                className="inputBox"
                readOnly
              />
            </div>

            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">Email:</span>
              <input
                type="email"
                defaultValue="a.corrine@ipunetwork.edu.ph"
                className="inputBox"
                readOnly
              />
            </div>

            <div className="flex items-center">
              <span className="w-32 text-sm font-medium">Password:</span>
              <div className="flex-1 flex items-center relative">
                <input
                  type="password"
                  defaultValue="********"
                  className="flex-1 px-3 py-1.5 border border-grey rounded-full text-right pr-20" // Add padding for the button
                  readOnly
                />
                <button className="inputWithChangeBttn">
                  Change
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4 mt-10">
          <button
            className="modifyButton"
            onClick={onClose}
          >
            Modify
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

export default AdminAccount;
