import { useState, useEffect } from "react"
import bcrypt from "bcryptjs"
import { supabase } from "../supabaseClient"

export function useRegisterForm(onBack, onRegister, userData) {
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

  const colleges = ["CLAE", "CFAD", "COECSA", "CITHM", "CAMS", "CON", "CBA", "LAW", "IS", "ASP", "Graduate School"]

  const departments = {
    COECSA: ["DCS", "DOA", "DOE"],
    CLAE: [],
    CITHM: [],
    CAMS: [],
    CON: [],
    CBA: [],
    LAW: [],
    CFAD: [],
    IS: ["JHS", "SHS"],
    ASP: [],
    "Graduate School": [],
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
      department: ["COECSA", "IS"].includes(prev.college) ? prev.department : "",
    }))
  }, [new_data.college])

  const handleChange = (e) => {
    const { id, value } = e.target
    setNewData((prev) => ({ ...prev, [id]: value }))
  }

  const checkPasswordStrength = (password) => {
    // Initialize criteria checks
    const criteria = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^a-zA-Z0-9]/.test(password),
    }
  
    // Calculate strength based on criteria
    let strength = 0
  
    // Length contributes up to 20% of strength
    if (password.length === 0) {
      strength = 0
    } else if (password.length < 8) {
      // Scale from 0-15% based on length
      strength += Math.floor((password.length / 8) * 15)
    } else {
      // Full 20% for 8+ characters
      strength += 20
  
      // Each additional criterion adds 20%
      if (criteria.lowercase) strength += 20
      if (criteria.uppercase) strength += 20
      if (criteria.number) strength += 20
      if (criteria.special) strength += 20
    }
  
    // Ensure strength is capped at 100
    strength = Math.min(100, strength)
  
    setPasswordStrength(strength)
    setNewData((prev) => ({ ...prev, password }))
    setFormError("")
  }
  
  const getStrengthColor = () => {
    if (passwordStrength <= 20) return "bg-red" // Very Weak
    if (passwordStrength <= 40) return "bg-orange" // Weak
    if (passwordStrength <= 60) return "bg-yellow" // Medium
    if (passwordStrength <= 80) return "bg-green" // Strong
    return "bg-resolved" // Very Strong
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

  const handleRegister = async (e, userType = "student") => {
    e.preventDefault()
  
    // Check if any required fields are empty
    const requiredFields = [
      { field: "firstName", label: "First Name" },
      { field: "lastName", label: "Last Name" },
      { field: "studentNumber", label: userType === "student" ? "School ID" : "Faculty ID" },
      { field: "email", label: "Email" },
      { field: "college", label: "College/High School" },
    ]
  
    for (const { field, label } of requiredFields) {
      if (!new_data[field]) {
        setFormError(`Please enter your ${label}`)
        return
      }
    }
  
    // Department is required for COECSA and IS
    if (["COECSA", "IS"].includes(new_data.college) && !new_data.department) {
      setFormError("Please select a department for your college")
      return
    }
  
    if (!new_data.password) {
      setFormError("Please enter a password")
      return
    }
  
    // Check password length first
    if (new_data.password.length < 8) {
      setFormError("Password must be at least 8 characters long")
      return
    }
  
    if (new_data.password !== new_data.confirmPassword) {
      setFormError("Passwords do not match")
      return
    }
  
    // Check for password complexity
    const hasLower = /[a-z]/.test(new_data.password)
    const hasUpper = /[A-Z]/.test(new_data.password)
    const hasNumber = /[0-9]/.test(new_data.password)
    const hasSpecial = /[^a-zA-Z0-9]/.test(new_data.password)
  
    if (!hasLower || !hasUpper || !hasNumber || !hasSpecial) {
      setFormError("Password must include uppercase, lowercase, numbers, and special characters")
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
  
    // Set the correct email suffix based on user type
    submissionData.emailSuffix = userType === "student" ? "@lpunetwork.edu.ph" : "@lpu.edu.ph"
  
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

  return {
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
  }
}

