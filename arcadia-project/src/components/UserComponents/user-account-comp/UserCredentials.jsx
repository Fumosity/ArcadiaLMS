import { ChevronRight } from "lucide-react";

const defaultUser = {
    name: "Shiori Novella",
    schoolId: "2021-2-01080",
    college: "COECSA",
    department: "DCS",
    email: "shiori.novella@punetwork.edu.ph",
    accountType: "Student",
    photoUrl: "/placeholder.svg?height=100&width=100"
};

export function UserCredentials({ user = defaultUser }) {
    return (
        <div className="uMain-cont">
            {/* User Profile Section */}
            <div className="flex flex-col items-center mb-8">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                    <img
                        src={user.photoUrl}
                        alt={`${user.name}'s profile photo`}
                        className="w-full h-full object-cover"
                    />
                </div>
                <h2 className="text-xl font-medium text-arcadia-black">{user.name}</h2>
            </div>

            {/* User Information Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="space-y-2">
                    {/* Left Column */}
                    <div>
                        <span className="text-sm text-dark-gray mb-2">Name:</span>
                        <input
                            type="text"
                            value={user.name}
                            className="inputBox w-full"
                            readOnly
                        />
                    </div>
                    <div>
                        <span className="text-sm text-dark-gray mb-2">College:</span>
                        <input
                            type="text"
                            value={user.college}
                            className="inputBox w-full"
                            readOnly
                        />
                    </div>
                    <div>
                        <span className="text-sm text-dark-gray mb-2">Email:</span>
                        <input
                            type="email"
                            value={user.email}
                            className="inputBox w-full"
                            readOnly
                        />
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-2">
                    <div>
                        <span className="text-sm text-dark-gray mb-2">School ID No.:</span>
                        <input
                            type="text"
                            value={user.schoolId}
                            className="inputBox w-full"
                            readOnly
                        />
                    </div>
                    <div>
                        <span className="text-sm text-dark-gray mb-2">Department:</span>
                        <input
                            type="text"
                            value={user.department}
                            className="inputBox w-full"
                            readOnly
                        />
                    </div>
                    <div>
                        <span className="text-sm text-dark-gray mb-2">Account Type:</span>
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
