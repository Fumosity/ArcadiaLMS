import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ResetPasswordForm() {
  const { token } = useParams(); // Get the token from the URL
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isValidToken, setIsValidToken] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verify the token on component mount
    const verifyResetToken = async () => {
      try {
        const response = await fetch(`/api/verify-reset-token?token=${token}`);
        const data = await response.json();
        if (response.ok) {
          setIsValidToken(true);
        } else {
          setError(data.detail || 'Invalid or expired reset link.');
        }
      } catch (error) {
        console.error('Error verifying reset token:', error);
        setError('Failed to verify reset link.');
      } finally {
        setLoading(false);
      }
    };
    if(token){ //make sure token is not undefined before calling verifyResetToken
      verifyResetToken();
    }
    else{
        setError('Token is missing from the URL.');
        setLoading(false);
    }
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message + ' You will be redirected to the login page shortly.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data.detail || 'Failed to reset password.');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError('Failed to reset password. Please try again later.');
    }
  };

  if (loading) {
    return <p className="text-center">Verifying reset link...</p>;
  }

  if (!isValidToken) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="uMain-cont flex max-h-auto max-w-[950px] h-full w-full bg-white">
      <div className="w-full mx-auto p-8">
        <p className="text-2xl text-center font-bold text-gray-600 mb-4">Reset Your Password</p>
        {message && <p className="text-green-500 text-center mb-4">{message}</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password:
            </label>
            <input
              id="newPassword"
              type="password"
              required
              className="w-full px-3 py-1 border border-gray rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm New Password:
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              className="w-full px-3 py-1 border border-gray rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-center items-center gap-4">
            <button type="submit" className="genRedBtns">
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
