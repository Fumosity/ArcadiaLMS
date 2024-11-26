import React, { useEffect, useState } from "react";

export function AdminCredentials() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user data from local storage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      const userDetails = {
        name: `${storedUser.userFName} ${storedUser.userLName}`,
        schoolId: storedUser.userLPUID,
        college: storedUser.userCollege,
        department: storedUser.userDepartment,
        email: storedUser.userEmail,
        accountType: storedUser.userAccountType,
        photoUrl: storedUser.photoUrl || "/placeholder.svg?height=100&width=100",
      };
      setUser(userDetails);
    }
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="uMain-cont">
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 border border-grey rounded-full overflow-hidden mb-4">
          <img
            src={user.photoUrl}
            alt={`${user.name}'s profile photo`}
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-xl font-medium text-arcadia-black">{user.name}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="space-y-2">
          <div>
            <span className="text-sm text-dark-gray">Name:</span>
            <input
              type="text"
              value={user.name}
              className="inputBox w-full"
              readOnly
            />
          </div>
          <div>
            <span className="text-sm text-dark-gray">College:</span>
            <input
              type="text"
              value={user.college}
              className="inputBox w-full"
              readOnly
            />
          </div>
          <div>
            <span className="text-sm text-dark-gray">Email:</span>
            <input
              type="email"
              value={user.email}
              className="inputBox w-full"
              readOnly
            />
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <span className="text-sm text-dark-gray">School ID No.:</span>
            <input
              type="text"
              value={user.schoolId}
              className="inputBox w-full"
              readOnly
            />
          </div>
          <div>
            <span className="text-sm text-dark-gray">Department:</span>
            <input
              type="text"
              value={user.department}
              className="inputBox w-full"
              readOnly
            />
          </div>
          <div>
            <span className="text-sm text-dark-gray">Account Type:</span>
            <input
              type="text"
              value={user.accountType}
              className="inputBox w-full"
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
}
