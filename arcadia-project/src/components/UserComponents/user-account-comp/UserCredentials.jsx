import { useEffect, useState } from "react"

const defaultUser = {
  name: "Juan dela Cruz",
  schoolId: "2000-2-00001",
  college: "COECSA",
  department: "DCS",
  email: "jua.delacruz@punetwork.edu.ph",
  accountType: "Student",
  photoUrl: "/placeholder.svg?height=100&width=100",
  userPicture: "/placeholder.svg?height=100&width=100",
}

export function UserCredentials({ user = defaultUser }) {
  const [currentUser, setCurrentUser] = useState(user)

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"))
    if (
      storedUser &&
      (storedUser.userAccountType === "Student" ||
        storedUser.userAccountType === "Faculty" ||
        storedUser.userAccountType === "Admin" ||
        storedUser.userAccountType === "Superadmin" ||
        storedUser.userAccountType === "Intern")
    ) {
      setCurrentUser({
        name: `${storedUser.userFName} ${storedUser.userLName}`,
        schoolId: storedUser.userLPUID,
        college: storedUser.userCollege,
        department: storedUser.userDepartment,
        email: storedUser.userEmail,
        accountType: storedUser.userAccountType,
        photoUrl: storedUser.photoUrl || "/placeholder.svg?height=100&width=100",
        userPicture: storedUser.userPicture || "/placeholder.svg?height=100&width=100",
        userCreationDate: storedUser.userCreationDate,
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

  // Format date to show only the date part (YYYY-MM-DD)
  const formatDate = (dateString) => {
    if (!dateString) return ""

    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return "" // Invalid date

      return date.toISOString().split("T")[0] // Get only YYYY-MM-DD part
    } catch (error) {
      return ""
    }
  }

  return (
    <div className="uMain-cont relative">
      {/* User Profile Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 border border-grey rounded-full overflow-hidden mb-4">
          <img
            src={currentUser.userPicture || currentUser.photoUrl}
            alt={`${currentUser.name}'s profile photo`}
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-xl font-medium text-arcadia-black">{currentUser.name}</h2>
      </div>

      {/* User Information Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
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

      {/* Account Creation Date - Positioned at bottom right */}
      <div className="w-full flex justify-end">
        <span className="text-xs text-dark-gray">Account Created at: {formatDate(currentUser.userCreationDate)}</span>
      </div>
    </div>
  )
}
