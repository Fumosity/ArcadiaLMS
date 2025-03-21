import { useEffect, useState } from "react"

const defaultUser = {
  name: "Shiori Novella",
  schoolId: "2021-2-01080",
  college: "COECSA",
  department: "DCS",
  email: "shiori.novella@punetwork.edu.ph",
  accountType: "Student",
  photoUrl: "/placeholder.svg?height=100&width=100",
  userPicture: "/placeholder.svg?height=100&width=100",
}

export function AdminCredentials({ user = defaultUser }) {
  const [currentUser, setCurrentUser] = useState(user)

  useEffect(() => {
    // Fetch the current user data from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
    if (storedUser) {
      setCurrentUser({
        name: `${storedUser.userFName} ${storedUser.userLName}`,
        schoolId: storedUser.userLPUID,
        college: storedUser.userCollege,
        department: storedUser.userDepartment,
        email: storedUser.userEmail,
        accountType: storedUser.userAccountType,
        // Use userPicture or fallback to placeholder
        photoUrl: storedUser.userPicture || "/placeholder.svg?height=100&width=100",
      })
    }
  }, [])

  // Format student ID to match RegisterForm.jsx format
  const formatStudentId = (id) => {
    if (!id) return ""

    // If the ID is already formatted (contains hyphens), return as is
    if (id.includes("-")) return id

    // Assuming the format is YYYY-T-NNNNN (year-term-sequence)
    if (id.length >= 9) {
      const year = id.substring(0, 4)
      const term = id.substring(4, 5)
      const sequence = id.substring(5)
      return `${year}-${term}-${sequence.padStart(5, "0")}`
    }

    return id
  }

  return (
    <div className="uMain-cont bg-light-white">
      {/* User Profile Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 border border-grey rounded-full overflow-hidden mb-4">
          <img
            src={currentUser.photoUrl || "/placeholder.svg"}
            alt={`${currentUser.name}'s profile photo`}
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-xl font-medium text-arcadia-black">{currentUser.name}</h2>
      </div>

      {/* User Information Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Left Column */}
        <div className="space-y-2">
          <div>
            <span className="text-sm text-dark-gray">Name:</span>
            <input type="text" value={currentUser.name} className="inputBox w-full" readOnly />
          </div>
          <div>
            <span className="text-sm text-dark-gray">College:</span>
            <input type="text" value={currentUser.college} className="inputBox w-full" readOnly />
          </div>
          <div>
            <span className="text-sm text-dark-gray">Email:</span>
            <input type="email" value={currentUser.email} className="inputBox w-full" readOnly />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-2">
          <div>
            <span className="text-sm text-dark-gray">School ID No.:</span>
            <input type="text" value={currentUser.schoolId} className="inputBox w-full" readOnly />
          </div>
          <div>
            <span className="text-sm text-dark-gray">Department:</span>
            <input type="text" value={currentUser.department} className="inputBox w-full" readOnly />
          </div>
          <div>
            <span className="text-sm text-dark-gray">Account Type:</span>
            <input type="text" value={currentUser.accountType} className="inputBox w-full" readOnly />
          </div>
        </div>
      </div>
    </div>
  )
}

