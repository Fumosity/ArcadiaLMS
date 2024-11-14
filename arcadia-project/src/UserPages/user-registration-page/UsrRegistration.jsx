import React, { useState, useCallback } from 'react';
import bcrypt from 'bcryptjs';
import PasswordStrengthBar from 'react-password-strength-bar';
import { supabase } from "../../supabaseClient.js";

//Handles the input fields; checks if they are a text field or a dropdown selection field
const InputField = React.memo(({ label, placeholder, options, type, value, onChange }) => {
  const id = label ? label.toLowerCase().replace(/\s+/g, '-') : 'input-field';
  return (
    <div className="flex overflow-hidden flex-col flex-1 shrink basis-0">
      { label && (
        <label htmlFor={ id } className="overflow-hidden gap-2.5 self-stretch w-full">
          {label}:
        </label>
      )}
      {options ? (
        <select
          id={ id }
          className="overflow-hidden gap-2.5 self-stretch px-2.5 py-0.5 mt-2.5 w-full whitespace-nowrap rounded-2xl border border-solid border-zinc-300"
          value={ value }
          onChange={ onChange }
        >
          {options.map((option, index) => (
            <option key={ index } value={ option }>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type || 'text'}
          id={ id }
          placeholder={ placeholder }
          className="overflow-hidden gap-2.5 self-stretch px-2.5 py-0.5 mt-2.5 w-full whitespace-nowrap rounded-2xl border border-solid border-zinc-300"
          value={ value }
          onChange={ onChange }
        />
      )}
    </div>
  );
});

const UsrRegistration = () => {
  // Individual states for each field to minimize unnecessary re-renders
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [lpuID, setLPUID] = useState('');
  const [college, setCollege] = useState('COECSA');
  const [department, setDepartment] = useState('DCS');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const collegeOptions = ['COECSA', 'Other College'];
  const departmentOptions = ['DCS', 'DOA', 'DOE'];

  const handleCollegeChange = useCallback((e) => {
    const selectedCollege = e.target.value;
    setCollege(selectedCollege);
  }, []);

  const handleDepartmentChange = useCallback((e) => {
    const selectedDepartment = e.target.value;
    setDepartment(selectedDepartment);
  }, []);

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = {
        userFName: firstName,
        userLName: lastName,
        userLPUID: lpuID,
        userCollege: college,
        userDepartment: department,
        userEmail: `${email}@lpunetwork.edu.ph`,
        userPassword: hashedPassword,
        userAccountType: "User",
        userARCID: Math.random().toString(36).substr(2, 9),
        userCreationDate: new Date().toISOString().slice(0, 10),
        userUpdateDate: new Date().toISOString().slice(0, 10),
      };

      const { data, error } = await supabase.from('user_accounts').insert([newUser]);
      if (error) throw error;
      alert("Please check your LPU email to authenticate your account.");
      setFirstName('');
      setLastName('');
      setLPUID('');
      setCollege('COECSA');
      setDepartment('DCS');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setErrorMessage('');
    } catch (error) {
      console.error("Error inserting data: ", error);
      setErrorMessage("Registration failed: " + error.message);
    }
  };

  const handleFirstNameChange = useCallback((e) => setFirstName(e.target.value), []);
  const handleLastNameChange = useCallback((e) => setLastName(e.target.value), []);

  const handleLPUIDChange = useCallback((e) => {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length > 4) value = value.slice(0, 4) + '-' + value.slice(4);
    if (value.length > 6) value = value.slice(0, 6) + '-' + value.slice(6, 11);

    setLPUID(value);
    setEmail(value);
  }, []);

  const handleEmailChange = useCallback((e) => setEmail(e.target.value), []);
  const handlePasswordChange = useCallback((e) => setPassword(e.target.value), []);
  const handleConfirmPasswordChange = useCallback((e) => setConfirmPassword(e.target.value), []);

  return (
    <main className="flex overflow-hidden flex-col px-64 pt-12 pb-24 text-base font-medium text-black max-md:px-5">
      <section className="flex gap-5 justify-center w-full max-md:max-w-full">
        <div className="flex overflow-hidden flex-col justify-between items-center min-w-[240px] w-[500px]">
          <form onSubmit={handleSubmit} className="flex overflow-hidden flex-col px-6 py-12 w-full rounded-3xl border border-solid bg-neutral-50 border-zinc-300 max-w-[500px] max-md:px-5 max-md:max-w-full">
            <h1 className="overflow-hidden self-stretch mt-12 w-full max-md:mt-10 max-md:max-w-full text-center">
              Sign up to access all the features of Arcadia!
            </h1>
            <div className="flex gap-2.5 items-start mt-12 w-full max-md:mt-10 max-md:max-w-full">
              <InputField label="First Name" value={ firstName } onChange={ handleFirstNameChange } />
              <InputField label="Last Name" value={ lastName } onChange={ handleLastNameChange } />
              <InputField label="LPU ID Number" value={ lpuID } onChange={ handleLPUIDChange } />
            </div>
            <div className="flex gap-2.5 items-start mt-4 w-full whitespace-nowrap max-md:max-w-full">
              <InputField label="College" options={ collegeOptions } value={ college } onChange={ handleCollegeChange } />
              <InputField label="Department" options={ departmentOptions } value={ department } onChange={ handleDepartmentChange } />
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
                  value={ email }
                  onChange={ handleEmailChange }
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
                value={ password }
                onChange={ handlePasswordChange }
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
                value={ confirmPassword }
                onChange={ handleConfirmPasswordChange }
                className="overflow-hidden gap-2.5 self-stretch px-2.5 py-0.5 mt-2.5 w-full whitespace-nowrap rounded-2xl border border-solid border-zinc-300"
              />
            </div>
            <button
              type="submit"
              className="overflow-hidden gap-2.5 self-center px-2.5 py-1.5 mt-12 text-center text-red-800 border border-red-800 border-solid rounded-[40px] w-[135px] max-md:mt-10"
            >
              Register
            </button>
            {errorMessage && <p className="text-red-500 mt-4">{ errorMessage }</p>}
          </form>
        </div>
      </section>
    </main>
  );
};

export default UsrRegistration;