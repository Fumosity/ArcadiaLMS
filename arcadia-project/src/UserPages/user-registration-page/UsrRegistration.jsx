import React, { useState } from 'react';
import PasswordStrengthBar from 'react-password-strength-bar';

const UsrRegistration = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const collegeOptions = ['COECSA', 'Other College'];
  const departmentOptions = ['DCS', 'Other Department'];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', { password, confirmPassword });
  };

  const InputField = ({ label, placeholder, options, type, value, onChange }) => {
    const id = label ? label.toLowerCase().replace(/\s+/g, '-') : 'input-field'; // Handle undefined label
    return (
      <div className="flex overflow-hidden flex-col flex-1 shrink basis-0">
        {label && ( // Only render label if it's defined
          <label htmlFor={id} className="overflow-hidden gap-2.5 self-stretch w-full">
            {label}:
          </label>
        )}
        {options ? (
          <select
            id={id}
            className="overflow-hidden gap-2.5 self-stretch px-2.5 py-0.5 mt-2.5 w-full whitespace-nowrap rounded-2xl border border-solid border-zinc-300"
          >
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type || 'text'} // Default to text if type is undefined
            id={id}
            placeholder={placeholder}
            className="overflow-hidden gap-2.5 self-stretch px-2.5 py-0.5 mt-2.5 w-full whitespace-nowrap rounded-2xl border border-solid border-zinc-300"
            value={value}
            onChange={onChange}
          />
        )}
      </div>
    );
  };

  return (
    <main className="flex overflow-hidden flex-col px-64 pt-12 pb-24 text-base font-medium text-black max-md:px-5">
      <section className="flex gap-5 justify-center w-full max-md:max-w-full">
        <div className="flex overflow-hidden flex-col justify-between items-center min-w-[240px] w-[500px]">
          <form onSubmit={handleSubmit} className="flex overflow-hidden flex-col px-6 py-12 w-full rounded-3xl border border-solid bg-neutral-50 border-zinc-300 max-w-[500px] max-md:px-5 max-md:max-w-full">
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/337c7359904a6a158acbe431ab19bcdcaf71a71157ec9bfa8f986315f0d745cc?placeholderIfAbsent=true&apiKey=620028e28bca4cb69d65313d900a8f5f"
           className="object-contain self-center max-w-full aspect-[4.72] w-[274px]" alt="Arcadia logo" />
            <h1 className="overflow-hidden self-stretch mt-12 w-full max-md:mt-10 max-md:max-w-full text-center">
              Sign up to access all the features of Arcadia!
            </h1>
            <div className="flex gap-2.5 items-start mt-12 w-full max-md:mt-10 max-md:max-w-full">
              <InputField label="First Name" placeholder="Shiori" />
              <InputField label="Last Name" placeholder="Novella" />
            </div>
            <InputField label="Student Number" placeholder="2021-2-01090" />
            <div className="flex gap-2.5 items-start mt-4 w-full whitespace-nowrap max-md:max-w-full">
              <InputField label="College" placeholder="COECSA" options={collegeOptions} />
              <InputField label="Department" placeholder="DCS" options={departmentOptions} />
            </div>
            <div className="flex overflow-hidden flex-col mt-4 w-full max-md:max-w-full">
              <label htmlFor="email" className="overflow-hidden gap-2.5 self-stretch w-full max-md:max-w-full">
                Email (LPU Account):
              </label>
              <div className="flex gap-2.5 items-start mt-2.5 w-full whitespace-nowrap max-md:max-w-full">
                <input
                  type="text"
                  id="email"
                  className="overflow-hidden gap-2.5 self-stretch px-2.5 py-0.5 rounded-2xl border border-solid border-zinc-300 min-h-[27px] min-w-[240px] w-[275px]"
                  placeholder="shiori.novella"
                />
                <span className="overflow-hidden flex-1 shrink gap-2.5 self-stretch px-2.5 py-0.5 rounded-2xl border border-solid border-zinc-300 min-h-[27px]">
                  @lpunetwork.edu.ph
                </span>
              </div>
            </div>
            {/* Password Field */}
            <div className="flex overflow-hidden flex-col mt-4 w-full max-md:max-w-full">
              <label htmlFor="password" className="overflow-hidden gap-2.5 self-stretch w-full max-md:max-w-full">
                Password:
              </label>
              <input
                type="password"
                id="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="overflow-hidden gap-2.5 self-stretch px-2.5 py-0.5 mt-2.5 w-full whitespace-nowrap rounded-2xl border border-solid border-zinc-300"
              />
              <PasswordStrengthBar password={password} />
            </div>
            {/* Confirm Password Field */}
            <div className="flex overflow-hidden flex-col w-full max-md:max-w-full">
              <label htmlFor="confirmPassword" className="overflow-hidden gap-2.5 self-stretch w-full max-md:max-w-full">
                Confirm Password:
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="overflow-hidden gap-2.5 self-stretch px-2.5 py-0.5 mt-2.5 w-full whitespace-nowrap rounded-2xl border border-solid border-zinc-300"
              />
            </div>
            <button
              type="submit"
              className="overflow-hidden gap-2.5 self-center px-2.5 py-1.5 mt-12 text-center text-red-800 border border-red-800 border-solid rounded-[40px] w-[135px] max-md:mt-10"
            >
              Register
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default UsrRegistration;
