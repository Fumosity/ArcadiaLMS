import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function RegisterForm({ onRegister }) {
  const [new_data, setNewData] = useState({
    firstName: "First Name",
    lastName: "Last Name",
    studentNumber: "",
    formattedStudentNumber: "XXXX-X-XXXXX",
    email: "Type email here",
    emailSuffix: "@lpunetwork.edu.ph",
    college: "",
    department: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordError, setPasswordError] = useState("")

  const colleges = ["COECSA", "CITHM", "CAMS", "CON", "CBA",]

  const departments = {
    "COECSA": ["DCS", "DOA", "DOE",],
    "CITHM": [],
    "CAMS": [],
    "CON": [],
    "CBA": [],
  }

  useEffect(() => {
    setNewData((prev) => ({
      ...prev,
      department: prev.college === "COECSA" ? "" : "No departments",
    }));
  }, [new_data.college]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setNewData((prev) => ({ ...prev, [id]: value }));
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (password.match(/[a-z]/)) strength += 20;
    if (password.match(/[A-Z]/)) strength += 20;
    if (password.match(/[0-9]/)) strength += 20;
    if (password.match(/[^a-zA-Z0-9]/)) strength += 20;

    setPasswordStrength(strength);
    setNewData((prev) => ({ ...prev, password }));
    setPasswordError("");
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 20) return "bg-arcadia-red"
    if (passwordStrength <= 40) return "bg-red"
    if (passwordStrength <= 60) return "bg-orange"
    if (passwordStrength <= 80) return "bg-yellow"
    return "bg-green"
  }

  const handleRegister = (e) => {
    e.preventDefault();
    if (new_data.password !== new_data.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    if (passwordStrength < 60) {
      setPasswordError("Password is not strong enough");
      return;
    }
    onRegister(new_data); // Send new_data on form submit
  };

  const formatStudentNumber = (value) => {
    const numbers = value.replace(/[^\d]/g, "");
    const parts = [numbers.slice(0, 4), numbers.slice(4, 5), numbers.slice(5, 10)];
    return parts.filter(Boolean).join(" - ") || "xxxx-x-xxxx";
  };

  return (
    <div className="uMain-cont flex">
      <div className="max-w-md mx-auto p-8 bg-white rounded-2xl">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-1">
            <h1 className="text-3xl font-semibold">Sign up</h1>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* First Name & Last Name */}
          <div className="grid grid-cols-2 gap-4">
            {["firstName", "lastName"].map((field) => (
              <div key={field} className="space-y-2">
                <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                  {field === "firstName" ? "First Name:" : "Last Name:"}
                </label>
                <input
                  id={field}
                  value={new_data[field]}
                  onChange={(e) => setNewData((prev) => ({ ...prev, [field]: e.target.value }))}
                  onFocus={(e) => {
                    if (e.target.value === (field === "firstName" ? "First Name" : "Last Name")) {
                      setNewData((prev) => ({ ...prev, [field]: "" }));
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value === "") {
                      setNewData((prev) => ({ ...prev, [field]: field === "firstName" ? "First Name" : "Last Name" }));
                    }
                  }}
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
                const formatted = formatStudentNumber(e.target.value);
                setNewData((prev) => ({
                  ...prev,
                  studentNumber: e.target.value.replace(/[^\d]/g, ""),
                  formattedStudentNumber: formatted,
                }));
              }}
              className="w-full px-2.5 py-1 border border-gray rounded-full"
              maxLength={16}
            />
          </div>

          {/* College & Department */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="college" className="block text-sm font-medium text-gray-700">
                College:
              </label>
              <select
                id="college"
                value={new_data.college}
                onChange={(e) => setNewData((prev) => ({ ...prev, college: e.target.value }))}
                className="w-full px-2.5 py-1 border border-gray-300 rounded-full"
              >
                <option value="">Select College</option>
                {colleges.map((c) => (
                  <option key={c} value={c}>
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
                value={new_data.department}
                onChange={(e) => setNewData((prev) => ({ ...prev, department: e.target.value }))}
                disabled={new_data.college !== "COECSA"}
                className="w-full px-2.5 py-1 border border-gray-300 rounded-full"
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email:
              </label>
              <input
                id="email"
                value={new_data.email}
                onChange={(e) => setNewData((prev) => ({ ...prev, email: e.target.value }))}
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
              onChange={(e) => checkPasswordStrength(e.target.value)}
              className="w-full px-2.5 py-1 border rounded"
            />
            <div className="h-2 bg-gray-200 rounded">
              <div
                className={`h-full ${getStrengthColor()} rounded transition-all`}
                style={{ width: `${Math.max(passwordStrength, 10)}%` }} // Ensure minimum width
              ></div>
            </div>
            <p className="text-sm">
              Password Strength:{" "}
              {["Very Weak", "Weak", "Medium", "Strong", "Very Strong"][
                Math.floor(passwordStrength / 20)
              ]}
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              id="confirmPassword"
              type="password"
              value={new_data.confirmPassword}
              onChange={handleChange}
              className="w-full px-2.5 py-1 border rounded"
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
