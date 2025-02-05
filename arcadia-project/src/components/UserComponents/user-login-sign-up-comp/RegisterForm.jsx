import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function RegisterForm({ onRegister }) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordError, setPasswordError] = useState("")

  const [firstName, setFirstName] = useState("first name")
  const [lastName, setLastName] = useState("surname")
  const [studentNumber, setStudentNumber] = useState("")
  const [formattedStudentNumber, setFormattedStudentNumber] = useState("xxxx-2-xxxx")
  const [email, setEmail] = useState("type email here")
  const [college, setCollege] = useState("")
  const [department, setDepartment] = useState("")

  const colleges = [
    "COECSA",
    "CITHM",
    "CEAS",
    "CON",
    "CBA",
  ]

  const departments = {
    "COECSA": [
      "Computer Science",
      "Information Technology",
      "Computer Engineering",
      "Civil Engineering",
      "Architecture",
    ],
    "CITHM": [],
    "CEAS": [],
    "CON": [],
    "CBA": [],
  }

  useEffect(() => {
    if (college !== "COECSA") {
      setDepartment("No departments")
    } else {
      setDepartment("")
    }
  }, [college])

  const handleRegister = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }
    if (passwordStrength < 60) {
      setPasswordError("Password is not strong enough")
      return
    }
    onRegister()
  };

  const checkPasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength += 20
    if (password.match(/[a-z]/)) strength += 20
    if (password.match(/[A-Z]/)) strength += 20
    if (password.match(/[0-9]/)) strength += 20
    if (password.match(/[^a-zA-Z0-9]/)) strength += 20
    setPasswordStrength(strength)
    setPassword(password)
    setPasswordError("")
  }

  const getStrengthColor = () => {
    if (passwordStrength <= 20) return "bg-arcadia-red"
    if (passwordStrength <= 40) return "bg-red"
    if (passwordStrength <= 60) return "bg-yellow"
    if (passwordStrength <= 80) return "bg-green"
    return "bg-green-500"
  }

  const getStrengthText = () => {
    if (passwordStrength <= 20) return "Very Weak"
    if (passwordStrength <= 40) return "Weak"
    if (passwordStrength <= 60) return "Medium"
    if (passwordStrength <= 80) return "Strong"
    return "Very Strong"
  }

  const handleInputFocus = (setter, defaultValue) => {
    return (e) => {
      if (e.target.value === defaultValue) {
        setter("")
      }
    }
  }

  const handleInputBlur = (setter, defaultValue) => {
    return (e) => {
      if (e.target.value === "") {
        setter(defaultValue)
      }
    }
  }

  const formatStudentNumber = (value) => {
    const numbers = value.replace(/[^\d]/g, "")
    const parts = [numbers.slice(0, 4), numbers.slice(4, 5), numbers.slice(5, 10)]

    if (parts[0]) {
      if (parts[1]) {
        if (parts[2]) {
          return `${parts[0]} - ${parts[1]} - ${parts[2]}`
        }
        return `${parts[0]} - ${parts[1]} -`
      }
      return `${parts[0]} -`
    }
    return ""
  }

  const handleStudentNumberChange = (e) => {
    const input = e.target.value
    const formatted = formatStudentNumber(input)
    setStudentNumber(input.replace(/[^\d]/g, ""))
    setFormattedStudentNumber(formatted || "xxxx-x-xxxxx")
  }

  return (
    <div className="uMain-cont flex">
      <div className="max-w-md mx-auto p-8 bg-white rounded-2xl">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-1">
            <h1 className="text-3xl font-semibold">Sign up</h1>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name:
              </label>
              <input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onFocus={handleInputFocus(setFirstName, "first name")}
                onBlur={handleInputBlur(setFirstName, "first name")}
                className="w-full px-2.5 py-1 border border-grey rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ color: firstName === "first name" ? "gray" : "black" }}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name:
              </label>
              <input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onFocus={handleInputFocus(setLastName, "surname")}
                onBlur={handleInputBlur(setLastName, "surname")}
                className="w-full px-2.5 py-1 border border-grey rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ color: lastName === "surname" ? "gray" : "black" }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="studentNumber" className="block text-sm font-medium text-gray-700">
              Student Number:
            </label>
            <input
              id="studentNumber"
              value={formattedStudentNumber}
              onChange={handleStudentNumberChange}
              onFocus={() => {
                if (formattedStudentNumber === "xxxx-x-xxxxx") {
                  setFormattedStudentNumber("")
                }
              }}
              onBlur={() => {
                if (formattedStudentNumber === "") {
                  setFormattedStudentNumber("xxxx-x-xxxxx")
                }
              }}
              className="w-full px-2.5 py-1 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              style={{ color: formattedStudentNumber === "xxxx-x-xxxxx" ? "gray" : "black" }}
              maxLength={16}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="college" className="block text-sm font-medium text-gray-700">
                College:
              </label>
              <select
                id="college"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full px-2.5 py-1 border border-gray-300 rounded-full bg-gray-50 appearance-none"
              >
                <option value="">Select College</option>
                {colleges.map((c, index) => (
                  <option key={index} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                Department:
              </label>
              <select
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                disabled={college !== "COECSA"}
                className="w-full px-2.5 py-1 border border-gray-300 rounded-full bg-gray-50 appearance-none disabled:bg-gray-200 disabled:text-gray-500"
              >
                <option value="">Select Department</option>
                {college === "COECSA" ? (
                  departments[college].map((d, index) => (
                    <option key={index} value={d}>
                      {d}
                    </option>
                  ))
                ) : (
                  <option value="No departments">No departments</option>
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="emailPrefix" className="block text-sm font-medium text-gray-700">
                Email (LPU Account):
              </label>
              <input
                id="emailPrefix"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={handleInputFocus(setEmail, "type email here")}
                onBlur={handleInputBlur(setEmail, "type email here")}
                className="w-full px-2.5 py-1 border border-grey rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ color: email === "type email here" ? "gray" : "black" }}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="emailSuffix" className="block text-sm font-medium text-gray-700">
                Suffix
              </label>
              <select
                id="emailSuffix"
                className="w-full px-2.5 py-1 border border-grey rounded-full bg-gray-50 appearance-none"
              >
                <option>@lpunetwork.edu.ph</option>
                <option>@lpu.edu.net</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password:
            </label>
            <input
              id="password"
              type="password"
              onChange={(e) => checkPasswordStrength(e.target.value)}
              className="w-full px-2.5 py-1 border border-grey rounded-full focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue"
            />
            <div className="space-y-1">
              <div className="h-2 bg-grey rounded-full">
                <div
                  className={`h-full ${getStrengthColor()} rounded-full transition-all duration-300 ease-in-out`}
                  style={{ width: `${passwordStrength}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500">Strength: {getStrengthText()}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-grey">
              Confirm Password:
            </label>
            <input
              id="confirmPassword"
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-2.5 py-1 border border-grey rounded-full focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue"
            />
          </div>

          {passwordError && <p className="text-red text-sm">{passwordError}</p>}

          <div className="flex justify-center items-center gap-4">
            <Link to="/user/login" className="registerBtn">
              Return
            </Link>
            <button
              type="submit"
              className="genRedBtns"
            >
              Register
            </button>

          </div>
        </form>
      </div>
      {/* Right Section */}
      <div className=" w-1/2 relative bg-grey rounded-2xl">
        <div className="absolute inset-0 flex items-end p-12">
          <h2 className="text-white text-4xl text-right font-semibold">Knowledge that empowers.</h2>
        </div>
      </div>
    </div>
  );
}
