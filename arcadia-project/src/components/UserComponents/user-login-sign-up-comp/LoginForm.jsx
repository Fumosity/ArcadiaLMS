import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../../supabaseClient.js";
import { useUser } from "../../../backend/UserContext";
import bcrypt from "bcryptjs";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { updateUser, loginAsGuest } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data: loginData, error: loginError } = await supabase
        .from("user_accounts")
        .select("*")
        .eq("userEmail", email)
        .single();

      if (loginError || !loginData) {
        alert("Incorrect email or password. Please try again.");
        return;
      }

      const passwordMatches = bcrypt.compareSync(password, loginData.userPassword);
      if (!passwordMatches) {
        alert("Incorrect email or password. Please try again.");
        return;
      }

      if (!loginData.userAccountType) {
        alert("User role is missing. Please contact support.");
        return;
      }

      updateUser(loginData);
    } catch (err) {
      setError("Unable to connect to the server. Please check your network.");
    }
  };

  return (
    <div className="uMain-cont flex h-[600px] bg-white">
      <div className="max-w-md mx-auto p-8 ">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-1">
            <img src="/image/arcadia.png" alt="Arcadia logo" className="h-13 w-13" />
            <h1 className="text-5xl font-semibold">Arcadia</h1>
          </div>
        </div>

        <p className="text-center text-gray-600 mb-6">Login to access all the features of Arcadia!</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email:
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-1 border border-gray rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="shiori.novella@punetwork.edu.ph"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password:
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-1 border border-gray rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter password"
            />
          </div>

          <div className="flex justify-center items-center gap-4">
            <Link to="/user/register" className="registerBtn">
              Sign up
            </Link>
            <button type="submit" className="genRedBtns">
              Login
            </button>
          </div>

          <label className="block text-sm text-center text-gray-700">Or you may also browse as a guest!</label>
          <div className="flex justify-center items-center">
            <button
              onClick={loginAsGuest}
              className="border py-1 border-arcadia-red text-arcadia-red p-2 rounded-full w-full hover:bg-red hover:border-red hover:text-white"
            >
              Continue as Guest
            </button>
          </div>
        </form>
      </div>

      <div
        className="w-1/2 relative rounded-2xl bg-cover bg-center"
      >
          <img
                        src="/image/hero2.jpeg"
                        alt="Hero Background"
                        className="w-full h-full object-cover rounded-lg" // Add rounded-lg here
                    />

        <div className="absolute inset-0 bg-black opacity-70 rounded-2xl" />

        <div className="absolute inset-0 flex items-end p-12 z-10">
          <h2 className="text-white text-4xl text-right font-semibold">
            Knowledge that empowers.
          </h2>
        </div>
      </div>

    </div>
  );
}
