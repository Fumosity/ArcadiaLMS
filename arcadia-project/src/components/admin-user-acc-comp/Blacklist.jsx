import React from "react";

const Blacklist = () => {
    const dataBlacklist = [
        { user: "Von Fadri", userID: "1D3" },
        { user: "Von Fadri", userID: "1D3" },
        { user: "Von Fadri", userID: "1D3" }
      ];

    return(
      <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">Blacklist</h3>
      <table className="w-full text-left">
          <thead>
              <tr>
                  <th className="font-semibold pb-1 border-b border-grey">User</th>
                  <th className="font-semibold pb-1 border-b border-grey">User ID</th>
              </tr>
          </thead>
          <tbody>
              {dataBlacklist.map((user, index) => (
                  <tr key={index} className="border-b border-grey">
                      <td className="py-2">{user.user}</td>
                      <td className="py-2">{user.userID}</td>
                  </tr>
              ))}
          </tbody>
      </table>
  </div>
    )
};
export default Blacklist;