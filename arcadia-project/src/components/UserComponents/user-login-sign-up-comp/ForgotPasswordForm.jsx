import React, { useState } from 'react';
import { API_URL } from '../../../api.js';

export default function ForgotPasswordForm() {
  const [userEmail, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch(`${API_URL}/forgot-password`, { // Assuming your FastAPI endpoint for forgot password is '/api/forgot-password'
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail: userEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message); // Display success message
      } else {
        setError(data.detail || 'An error occurred.'); // Display error message
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setError('Failed to send reset link. Please try again later.');
    }
  };

  return (
    <div className="uMain-cont flex max-h-auto max-w-[950px] h-full w-full bg-white">
      <div className="w-full mx-auto p-8">
        <p className="text-2xl text-center font-bold text-gray-600 mb-4">Forgot Password?</p>
        <p className="text-sm text-center text-gray-700 mb-6">
          Enter the email that is associated with your account,
          <br />
          and we will send you a link to reset your password.
        </p>

        {message && <p className="text-green-500 text-center mb-4">{message}</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700">
              Email:
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full px-3 py-1 border border-gray rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter Email"
              value={userEmail}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex justify-center items-center gap-4">
            <button type="submit" className="genRedBtns">
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}