import React from "react";


const ListOfAcc = () => {
    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">List of User Accounts</h2>
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-left">Type</th>
                            <th className="text-left">Email</th>
                            <th className="text-left">Name</th>
                            <th className="text-left">User ID</th>
                            <th className="text-left">School ID</th>
                            <th className="text-left">College</th>
                            <th className="text-left">Department</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(5)].map((_, index) => (
                            <tr key={index}>
                                <td>
                                    <span className="px-2 py-1 bg-gray-200 rounded-full text-xs">Student</span>
                                </td>
                                <td>s.alcantara@example.com</td>
                                <td>Samuel Alcantara</td>
                                <td>123</td>
                                <td>2021-01000</td>
                                <td>COECSA</td>
                                <td>DCS</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">List of Admin Accounts</h2>
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-left">Type</th>
                            <th className="text-left">Email</th>
                            <th className="text-left">Name</th>
                            <th className="text-left">User ID</th>
                            <th className="text-left">School ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(5)].map((_, index) => (
                            <tr key={index}>
                                <td>
                                    <span className="px-2 py-1 bg-yellow-200 rounded-full text-xs">Admin</span>
                                </td>
                                <td>l.ejercito@example.com</td>
                                <td>Layla Ejercito</td>
                                <td>123</td>
                                <td>2021-1-01000</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ListOfAcc;