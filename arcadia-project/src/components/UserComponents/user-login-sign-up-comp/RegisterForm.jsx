import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const [passwordStrength, setPasswordStrength] = useState(20);

  const checkPasswordStrength = (password) => { // Removed ": string"
    // Simple password strength calculation
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (password.match(/[a-z]/)) strength += 20;
    if (password.match(/[A-Z]/)) strength += 20;
    if (password.match(/[0-9]/)) strength += 20;
    if (password.match(/[^a-zA-Z0-9]/)) strength += 20;
    setPasswordStrength(strength);
  };

  return (
    <div className="uMain-cont flex">
      <div className="max-w-md mx-auto p-8 bg-white rounded-2xl">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-1">
            <h1 className="text-3xl font-semibold">Sign up</h1>
          </div>
        </div>

        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name:</label>
              <input
                id="firstName"
                defaultValue="first name"
                className="w-full px-2.5 py-1 border border-grey rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ color: 'grey' }}
                onFocus={(e) => e.target.style.color = 'arcadia-black'}
                onBlur={(e) => e.target.value === '' ? e.target.style.color = 'grey' : e.target.style.color = 'arcadia-black'}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name:</label>
              <input
                id="lastName"
                defaultValue="surname"
                className="w-full px-2.5 py-1 border border-grey rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ color: 'grey' }}
                onFocus={(e) => e.target.style.color = 'arcadia-black'}
                onBlur={(e) => e.target.value === '' ? e.target.style.color = 'grey' : e.target.style.color = 'arcadia-black'}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="studentNumber" className="block text-sm font-medium text-gray-700">Student Number:</label>
            <input
              id="studentNumber"
              defaultValue="xxxx-2-xxxx"
              className="w-full px-2.5 py-1 border border-grey rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              style={{ color: 'grey' }}
              onFocus={(e) => e.target.style.color = 'arcadia-black'}
              onBlur={(e) => e.target.value === '' ? e.target.style.color = 'grey' : e.target.style.color = 'arcadia-black'}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="college" className="block text-sm font-medium text-gray-700">College:</label>
              <input
                id="college"
                defaultValue="college"
                className="w-full px-2.5 py-1 border border-grey rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ color: 'grey' }}
                onFocus={(e) => e.target.style.color = 'arcadia-black'}
                onBlur={(e) => e.target.value === '' ? e.target.style.color = 'grey' : e.target.style.color = 'arcadia-black'}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department:</label>
              <input
                id="department"
                defaultValue="department"
                className="w-full px-2.5 py-1 border border-grey rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ color: 'grey' }}
                onFocus={(e) => e.target.style.color = 'arcadia-black'}
                onBlur={(e) => e.target.value === '' ? e.target.style.color = 'grey' : e.target.style.color = 'arcadia-black'}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="emailPrefix" className="block text-sm font-medium text-gray-700">
                Email (LPU Account):
              </label>
              <input
                id="emailPrefix"
                defaultValue="type email here"
                className="w-full px-2.5 py-1 border border-grey rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ color: 'grey' }}
                onFocus={(e) => (e.target.style.color = 'arcadia-black')}
                onBlur={(e) => (e.target.value === '' ? (e.target.style.color = 'grey') : (e.target.style.color = 'arcadia-black'))}
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
            <input
              id="password"
              type="password"
              onChange={(e) => checkPasswordStrength(e.target.value)}
              className="w-full px-2.5 py-1 border border-grey rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="space-y-1">
              <div className="h-2 bg-grey rounded-full">
                <div
                  className="h-full bg-red rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${passwordStrength}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500">
                Strength: {passwordStrength <= 20 ? "Weak" : "Strong"}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password:</label>
            <input
              id="confirmPassword"
              type="password"
              className="w-full px-2.5 py-1 border border-grey rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

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
