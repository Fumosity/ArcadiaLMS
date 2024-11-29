import React, { useState } from 'react';

export default function UserChangePass({ isOpen, onClose }) {
  const [confirmationCode, setConfirmationCode] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(0);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!isOpen) return null;

  const handleCodeChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...confirmationCode];
      newCode[index] = value;
      setConfirmationCode(newCode);

      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleResendCode = () => {
    if (countdown > 0) return;

    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl p-8">
        <h1 className="text-2xl font-semibold mb-6 text-center">Change Password</h1>

        <div className="space-y-6">
          {/* New Password Input */}
          <div className="flex items-center justify-between">
            <label htmlFor="new-password" className="w-40 text-left">New Password:</label>
            <div className="flex items-center gap-2 flex-grow">
              <input
                type={showNewPassword ? "text" : "password"}
                id="new-password"
                className="input-bar w-full"
              />
              <button
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="border border-grey px-2.5 py-0.5 rounded-full text-sm text-blue-600 hover:text-blue-800"
              >
                {showNewPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="flex items-center justify-between">
            <label htmlFor="confirm-password" className="w-40 text-left">Confirm Password:</label>
            <div className="flex items-center gap-2 flex-grow">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-password"
                className="input-bar w-full"
              />
              <button
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="border border-grey px-2.5 py-0.5 rounded-full text-sm text-blue-600 hover:text-blue-800"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Confirmation Code */}
          <div className="flex items-center justify-between">
            <label className="w-40 text-left">Confirmation Code:</label>
            <div className="flex justify-start items-center gap-4">
              <button
                onClick={handleResendCode}
                disabled={countdown > 0}
                className= "resendCode"
              >
                Resend Code {countdown > 0 ? `(${countdown}s)` : ''}
              </button>
              <div className="flex gap-2">
                {confirmationCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    className="w-[27px] h-[27px] border border-grey rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ))}
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600 text-center">
            Check your registered email address for your confirmation code.
          </p>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button className="modifyButton">Change</button>
            <button onClick={onClose} className="cancelButton">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
