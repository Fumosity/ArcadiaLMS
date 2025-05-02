import { useState, useEffect } from "react"
import { Check, X } from "lucide-react"
import { supabase } from "../supabaseClient"
import bcrypt from "bcryptjs"

export default function UserChangePass({ isOpen, onClose, userID }) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordsMatch, setPasswordsMatch] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [showRequirements, setShowRequirements] = useState(false)

  const passwordRequirements = [
    {
      id: "length",
      label: "At least 8 characters",
      validator: (password) => password.length >= 8,
    },
    {
      id: "lowercase",
      label: "At least one lowercase letter",
      validator: (password) => /[a-z]/.test(password),
    },
    {
      id: "uppercase",
      label: "At least one uppercase letter",
      validator: (password) => /[A-Z]/.test(password),
    },
    {
      id: "number",
      label: "At least one number",
      validator: (password) => /[0-9]/.test(password),
    },
    {
      id: "special",
      label: "At least one special character",
      validator: (password) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    },
  ]

  useEffect(() => {
    setPasswordsMatch(confirmPassword === "" || newPassword === confirmPassword)
  }, [newPassword, confirmPassword])

  useEffect(() => {
    if (newPassword) {
      setShowRequirements(true)
    }
  }, [newPassword])

  if (!isOpen) return null

  const handleSubmit = async () => {
    // Reset error state
    setError("")

    // Check if current password is provided
    if (!currentPassword) {
      setError("Please enter your current password")
      return
    }

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setPasswordsMatch(false)
      return
    }

    // Validate all requirements are met
    const allRequirementsMet = passwordRequirements.every((req) => req.validator(newPassword))
    if (!allRequirementsMet) {
      setError("Password does not meet all requirements")
      return
    }

    // Start submission
    setIsSubmitting(true)

    try {
      // Get the current user ID from session storage or context
      // This assumes you're storing the user ID somewhere after login
      let currentUserId = userID
      if (!currentUserId) {
        const storedUser = JSON.parse(localStorage.getItem("user"))
        currentUserId = storedUser?.userID
      }

      if (!currentUserId) {
        throw new Error("User ID not found")
      }

      // Verify current password
      const { data: userData, error: fetchError } = await supabase
        .from("user_accounts")
        .select("userPassword")
        .eq("userID", currentUserId)
        .single()

      if (fetchError || !userData) {
        throw new Error("Failed to verify current password")
      }

      // Compare the current password with the stored hash
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, userData.userPassword)

      if (!isCurrentPasswordValid) {
        setError("Current password is incorrect")
        setIsSubmitting(false)
        return
      }

      // Hash the new password with bcrypt
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(newPassword, salt)

      // Update the password in the user_accounts table
      const { error: updateError } = await supabase
        .from("user_accounts")
        .update({ userPassword: hashedPassword })
        .eq("userID", currentUserId)

      if (updateError) {
        throw new Error("Failed to update password")
      }

      // Success - close the modal
      onClose()

      // You might want to show a success message here
      // For example, using a toast notification
    } catch (err) {
      console.error("Failed to change password:", err)
      setError(err.message || "Failed to change password. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl p-8">
        <h1 className="text-2xl font-semibold mb-6 text-center">Change Password</h1>

        <div className="space-y-6">
          {/* Current Password Input */}
          <div className="flex items-center justify-between">
            <label htmlFor="current-password" className="w-40 text-left">
              Current Password:
            </label>
            <div className="flex items-center gap-2 flex-grow">
              <input
                type={showCurrentPassword ? "text" : "password"}
                id="current-password"
                className="input-bar w-full"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <button
                onClick={() => setShowCurrentPassword((prev) => !prev)}
                className="border border-grey px-2.5 py-0.5 rounded-full text-sm text-blue-600 hover:text-blue-800"
                type="button"
              >
                {showCurrentPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* New Password Input */}
          <div className="flex items-center justify-between">
            <label htmlFor="new-password" className="w-40 text-left">
              New Password:
            </label>
            <div className="flex items-center gap-2 flex-grow">
              <input
                type={showNewPassword ? "text" : "password"}
                id="new-password"
                className="input-bar w-full"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="border border-grey px-2.5 py-0.5 rounded-full text-sm text-blue-600 hover:text-blue-800"
                type="button"
              >
                {showNewPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          {showRequirements && (
            <div className="ml-40 mt-2">
              <p className="text-sm font-medium mb-1">Password Requirements:</p>
              <ul className="space-y-1">
                {passwordRequirements.map((requirement) => (
                  <li key={requirement.id} className="flex items-center text-sm">
                    {requirement.validator(newPassword) ? (
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                    ) : (
                      <X className="mr-2 h-4 w-4 text-gray-300" />
                    )}
                    <span className={requirement.validator(newPassword) ? "text-green-500" : "text-gray-500"}>
                      {requirement.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Confirm Password Input */}
          <div className="flex items-center justify-between">
            <label htmlFor="confirm-password" className="w-40 text-left">
              Confirm Password:
            </label>
            <div className="flex items-center gap-2 flex-grow">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-password"
                className={`input-bar w-full ${!passwordsMatch ? "border-red-500" : ""}`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="border border-grey px-2.5 py-0.5 rounded-full text-sm text-blue-600 hover:text-blue-800"
                type="button"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {!passwordsMatch && <p className="text-sm text-red-500 ml-40">Passwords do not match</p>}

          {/* Error message */}
          {error && <p className="text-sm text-red-500 text-center mt-4">{error}</p>}

          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              className="modifyButton"
              onClick={handleSubmit}
              disabled={isSubmitting || !currentPassword || !newPassword || !confirmPassword}
            >
              {isSubmitting ? "Changing..." : "Change"}
            </button>
            <button onClick={onClose} className="cancelButton" disabled={isSubmitting} type="button">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
