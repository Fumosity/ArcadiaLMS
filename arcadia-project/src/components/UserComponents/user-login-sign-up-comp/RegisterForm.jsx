import { useState, useEffect } from "react"
import { useRegisterForm } from "../../../backend/RegisterFormBackend"
import { Eye, EyeOff } from "lucide-react"

export default function RegisterForm({ onBack, onRegister, userData }) {
  const {
    new_data,
    setNewData,
    placeholders,
    passwordStrength,
    formError,
    isChecking,
    colleges,
    departments,
    handleChange,
    checkPasswordStrength,
    getStrengthColor,
    handleRegister,
    formatStudentNumber,
  } = useRegisterForm(onBack, onRegister, userData)

  const [userType, setUserType] = useState("student")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Update email suffix and student number format when user type changes
  useEffect(() => {
    setNewData((prev) => ({
      ...prev,
      emailSuffix: userType === "student" ? "@lpunetwork.edu.ph" : "@lpu.edu.ph",
      formattedStudentNumber: "", // Clear the formatted student number when switching types
    }))
  }, [userType, setNewData])

  const formatStudentNumberByType = (value) => {
    if (userType === "faculty") {
      // For faculty, limit to 10 characters (XXXX-XXXXX)
      const cleaned = value.replace(/[^\w]/g, "").substring(0, 10)
      const parts = [cleaned.slice(0, 4), cleaned.slice(4, 10)]
      return parts.filter(Boolean).join("-") || "XXXX-XXXXX"
    } else {
      // For students, only allow digits and format as XXXX-X-XXXXX
      const cleaned = value.replace(/[^\d]/g, "").substring(0, 10)
      const parts = [cleaned.slice(0, 4), cleaned.slice(4, 5), cleaned.slice(5, 10)]
      return parts.filter(Boolean).join("-") || ""
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <div className="uMain-cont flex bg-white max-h-auto max-w-[950px] h-full w-full overflow-hidden">
      <div className="w-full max-w-sm mx-auto p-4 rounded-2xl overflow-y-auto">
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-1">
            <h1 className="text-2xl font-semibold">Sign up</h1>
          </div>
        </div>

        {/* User Type Selection */}
        <div className="flex gap-4 mb-4 justify-center">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={userType === "student"}
              onChange={() => setUserType("student")}
              className="mr-2"
            />
            Student
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={userType === "faculty"}
              onChange={() => setUserType("faculty")}
              className="mr-2"
            />
            Faculty
          </label>
        </div>

        <form onSubmit={(e) => handleRegister(e, userType)} className="space-y-3">
          {/* First Name & Last Name */}
          <div className="grid grid-cols-2 gap-3">
            {["firstName", "lastName"].map((field) => (
              <div key={field} className="space-y-2">
                <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                  {field === "firstName" ? "First Name:" : "Last Name:"}
                </label>
                <input
                  id={field}
                  value={new_data[field]}
                  onChange={(e) => setNewData((prev) => ({ ...prev, [field]: e.target.value }))}
                  placeholder={placeholders[field]}
                  className="w-full px-2.5 py-1 border border-gray rounded-full"
                />
              </div>
            ))}
          </div>

          {/* Student Number / School ID */}
          <div className="space-y-2">
            <label htmlFor="studentNumber" className="block text-sm font-medium text-gray-700">
              {userType === "student" ? "School ID:" : "Faculty ID:"}
            </label>
            <input
              id="studentNumber"
              value={new_data.formattedStudentNumber}
              onChange={(e) => {
                let cleanedValue

                if (userType === "faculty") {
                  // For faculty, allow alphanumeric characters, limit to 9 chars
                  cleanedValue = e.target.value.replace(/[^\w]/g, "").substring(0, 10)
                } else {
                  // For students, only allow digits
                  cleanedValue = e.target.value.replace(/[^\d]/g, "").substring(0, 10)
                }

                const formatted = formatStudentNumberByType(cleanedValue)

                setNewData((prev) => ({
                  ...prev,
                  studentNumber: formatted, // Store the formatted value with dashes
                  formattedStudentNumber: formatted,
                }))
              }}
              placeholder={userType === "student" ? "XXXX-X-XXXXX" : "XXXX-XXXXXX"}
              className="w-full px-2.5 py-1 border border-gray rounded-full"
              maxLength={userType === "faculty" ? 11 : 12} // Account for hyphens in display
            />
          </div>

          {/* College & Department */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label htmlFor="college" className="block text-sm font-medium text-gray-700">
                College/High School:
              </label>
              <select
                id="college"
                value={new_data.college}
                onChange={(e) => setNewData((prev) => ({ ...prev, college: e.target.value }))}
                className="w-full px-2.5 py-1 border border-gray rounded-full"
              >
                <option value="">Select Program</option>
                {colleges.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                Department/Year:
              </label>
              <select
                id="department"
                value={new_data.department}
                onChange={(e) => setNewData((prev) => ({ ...prev, department: e.target.value }))}
                disabled={!["COECSA", "IS"].includes(new_data.college)}
                className="w-full px-2.5 py-1 border border-gray rounded-full"
              >
                <option value="">Select Department</option>
                {departments[new_data.college]?.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Email */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email:
              </label>
              <input
                id="email"
                value={new_data.email}
                onChange={(e) => {
                  const value = e.target.value.replace("@", "")
                  setNewData((prev) => ({ ...prev, email: value }))
                }}
                placeholder={placeholders.email}
                className="w-full px-2.5 py-1 border border-gray rounded-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="emailSuffix" className="block text-sm font-medium text-gray-700">
                Suffix:
              </label>
              <div className="w-full px-2.5 py-1 border border-gray rounded-full bg-gray-100">
                {userType === "student" ? "@lpunetwork.edu.ph" : "@lpu.edu.ph"}
              </div>
            </div>
          </div>

          {/* Password & Confirm Password */}
          <div className="space-y-2">
            <label htmlFor="password">Password:</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={new_data.password}
                onChange={(e) => checkPasswordStrength(e.target.value)}
                placeholder={placeholders.password}
                className="w-full px-2.5 py-1 border border-gray rounded-full"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff size={18} className="text-gray-500" />
                ) : (
                  <Eye size={18} className="text-gray-500" />
                )}
              </button>
            </div>
            <div className="h-2 bg-gray-200 rounded relative">
              <div
                className={`h-full ${getStrengthColor()} rounded transition-all duration-300 ease-in-out`}
                style={{ width: `${Math.max(passwordStrength, 5)}%` }} // Ensure minimum width
              ></div>
            </div>
            <p className="text-sm">
              Password Strength:{" "}
              {["Very Weak", "Weak", "Medium", "Strong", "Strong", "Very Strong"][Math.floor(passwordStrength / 20)]}
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={new_data.confirmPassword}
                onChange={handleChange}
                placeholder={placeholders.confirmPassword}
                className="w-full px-2.5 py-1 border border-gray rounded-full"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} className="text-gray-500" />
                ) : (
                  <Eye size={18} className="text-gray-500" />
                )}
              </button>
            </div>
          </div>

          {formError && <p className="text-red text-sm">{formError}</p>}

          <div className="flex justify-center items-center gap-3 mt-2">
            <button type="button" onClick={onBack} className="registerBtn text-sm">
              Return
            </button>
            <button type="submit" className="genRedBtns text-sm" disabled={isChecking}>
              {isChecking ? "Checking..." : "Register"}
            </button>
          </div>
        </form>
      </div>
      <div className="w-1/2 relative rounded-2xl bg-cover bg-center hidden md:block max-h-full">
        <img src="/image/hero2.jpeg" alt="Hero Background" className="w-[560px] h-full object-cover rounded-lg" />

        <div className="absolute inset-0 bg-black opacity-70 rounded-lg" />

        <div className="absolute inset-0 flex items-end p-12 z-10">
          <h2 className="text-white text-4xl text-right font-semibold">Knowledge that empowers.</h2>
        </div>
      </div>
    </div>
  )
}
