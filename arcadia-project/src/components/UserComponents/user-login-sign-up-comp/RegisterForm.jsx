import { useState, useEffect } from "react"
import bcrypt from "bcryptjs"
import { supabase } from "./../../../supabaseClient"

export default function RegisterForm({ onBack, onRegister, userData }) {
  const [new_data, setNewData] = useState({
    firstName: "",
    lastName: "",
    studentNumber: "",
    formattedStudentNumber: "",
    email: "",
    emailSuffix: "@lpunetwork.edu.ph",
    college: "",
    department: "",
    password: "",
    confirmPassword: "",
  })

  const [placeholders, setPlaceholders] = useState({
    firstName: "First Name",
    lastName: "Last Name",
    formattedStudentNumber: "XXXX-X-XXXXX",
    email: "Type email here",
    college: "Select Program",
    password: "Enter password",
    confirmPassword: "Confirm password",
  })

  const [passwordStrength, setPasswordStrength] = useState(0)
  const [formError, setFormError] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [isPasswordHashed, setIsPasswordHashed] = useState(false)

  const colleges = ["COECSA", "CITHM", "CAMS", "CON", "CBA", "Law", "IHS"]

  const departments = {
    COECSA: ["DCS", "DOA", "DOE"],
    CLAE: [],
    CITHM: [],
    CAMS: [],
    CON: [],
    CBA: [],
    Law: [],
    IHS: ["JHS", "SHS"],
  }

  // Initialize form with userData if available (when returning from next step)
  useEffect(() => {
    if (userData) {
      setNewData({
        ...userData,
        // Clear password fields when returning from next step
        password: "",
        confirmPassword: "",
      })

      // Reset password strength when returning
      setPasswordStrength(0)
    }
  }, [userData])

  useEffect(() => {
    setNewData((prev) => ({
      ...prev,
      department: ["COECSA", "IHS"].includes(prev.college) ? prev.department : "",
    }))
  }, [new_data.college])

  const handleChange = (e) => {
    const { id, value } = e.target
    setNewData((prev) => ({ ...prev, [id]: value }))
  }

  const checkPasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength += 20
    if (password.match(/[a-z]/)) strength += 20
    if (password.match(/[A-Z]/)) strength += 20
    if (password.match(/[0-9]/)) strength += 20
    if (password.match(/[^a-zA-Z0-9]/)) strength += 20

    setPasswordStrength(strength)
    setNewData((prev) => ({ ...prev, password }))
    setFormError("")
  }

  const getStrengthColor = () => {
    if (passwordStrength <= 20) return "bg-arcadia-red"
    if (passwordStrength <= 40) return "bg-red"
    if (passwordStrength <= 60) return "bg-orange"
    if (passwordStrength <= 80) return "bg-yellow"
    return "bg-green"
  }

  // Check if student number already exists
  const checkStudentNumberExists = async (studentNumber) => {
    try {
      setIsChecking(true)
      const { data, error } = await supabase
        .from("users") // Adjust table name if needed
        .select("studentNumber")
        .eq("studentNumber", studentNumber)
        .single()

      setIsChecking(false)

      if (error && error.code !== "PGRST116") {
        console.error("Error checking student number:", error)
        return false
      }

      return !!data // Return true if data exists (student number is taken)
    } catch (error) {
      console.error("Error checking student number:", error)
      setIsChecking(false)
      return false
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    // Check if any required fields are empty
    const requiredFields = [
      { field: "firstName", label: "First Name" },
      { field: "lastName", label: "Last Name" },
      { field: "studentNumber", label: "Student Number" },
      { field: "email", label: "Email" },
      { field: "college", label: "College/High School" },
    ]

    for (const { field, label } of requiredFields) {
      if (!new_data[field]) {
        setFormError(`Please enter your ${label}`)
        return
      }
    }

    // Department is required for COECSA and IHS
    if (["COECSA", "IHS"].includes(new_data.college) && !new_data.department) {
      setFormError("Please select a department for your college")
      return
    }

    if (!new_data.password) {
      setFormError("Please enter a password")
      return
    }

    if (new_data.password !== new_data.confirmPassword) {
      setFormError("Passwords do not match")
      return
    }

    if (passwordStrength < 80) {
      setFormError("Password is not strong enough")
      return
    }

    // Check if student number already exists
    const studentNumberExists = await checkStudentNumberExists(new_data.studentNumber)
    if (studentNumberExists) {
      setFormError("This account is taken")
      return
    }

    // Create a copy of the data for submission
    const submissionData = { ...new_data }

    // Convert college to uppercase before sending to database
    submissionData.college = submissionData.college.toUpperCase()

    // Only hash the password if it's not already hashed
    if (!isPasswordHashed) {
      submissionData.password = bcrypt.hashSync(submissionData.password, 10) // Salt rounds: 10
    }

    onRegister(submissionData) // Send submissionData on form submit
  }

  const formatStudentNumber = (value) => {
    const numbers = value.replace(/[^\d]/g, "")
    const parts = [numbers.slice(0, 4), numbers.slice(4, 5), numbers.slice(5, 10)]
    return parts.filter(Boolean).join(" - ") || "XXXX-X-XXXXX"
  }

  return (

      <div className="uMain-cont flex bg-white max-h-auto max-w-[950px] h-full w-full overflow-hidden">
        <div className="w-full max-w-sm mx-auto p-4 rounded-2xl overflow-y-auto">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-1">
              <h1 className="text-2xl font-semibold">Sign up</h1>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-3">
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

            {/* Student Number */}
            <div className="space-y-2">
              <label htmlFor="studentNumber" className="block text-sm font-medium text-gray-700">
                Student Number:
              </label>
              <input
                id="studentNumber"
                value={new_data.formattedStudentNumber}
                onChange={(e) => {
                  const formatted = formatStudentNumber(e.target.value)
                  setNewData((prev) => ({
                    ...prev,
                    studentNumber: e.target.value.replace(/[^\d]/g, ""),
                    formattedStudentNumber: formatted,
                  }))
                }}
                placeholder={placeholders.formattedStudentNumber}
                className="w-full px-2.5 py-1 border border-gray rounded-full"
                maxLength={16}
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
                  disabled={!["COECSA", "IHS"].includes(new_data.college)}
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
                <select
                  id="emailSuffix"
                  value={new_data.emailSuffix}
                  onChange={(e) => setNewData((prev) => ({ ...prev, emailSuffix: e.target.value }))}
                  className="w-full px-2.5 py-1 border border-gray rounded-full"
                >
                  <option>@lpunetwork.edu.ph</option>
                  <option>@lpu.edu.ph</option>
                </select>
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="password">Password:</label>
              <input
                id="password"
                type="password"
                value={new_data.password}
                onChange={(e) => checkPasswordStrength(e.target.value)}
                placeholder={placeholders.password}
                className="w-full px-2.5 py-1 border border-gray rounded-full"
              />
              <div className="h-2 bg-gray-200 rounded">
                <div
                  className={`h-full ${getStrengthColor()} rounded transition-all`}
                  style={{ width: `${Math.max(passwordStrength, 10)}%` }} // Ensure minimum width
                ></div>
              </div>
              <p className="text-sm">
                Password Strength:{" "}
                {["Very Weak", "Weak", "Medium", "Strong", "Very Strong"][Math.floor(passwordStrength / 20)]}
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                id="confirmPassword"
                type="password"
                value={new_data.confirmPassword}
                onChange={handleChange}
                placeholder={placeholders.confirmPassword}
                className="w-full px-2.5 py-1 border border-gray rounded-full"
              />
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
        <div className="w-1/2 relative rounded-2xl bg-cover bg-center hidden md:block max-h-[600px]">
          <img src="/image/hero2.jpeg" alt="Hero Background" className="w-full h-full object-cover rounded-lg" />

          <div className="absolute inset-0 bg-black opacity-70 rounded-lg" />

          <div className="absolute inset-0 flex items-end p-12 z-10">
            <h2 className="text-white text-4xl text-right font-semibold">Knowledge that empowers.</h2>
          </div>
        </div>
      </div>
  )
}

