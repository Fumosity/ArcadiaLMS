import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../../supabaseClient.js";
import { useUser } from "../../../backend/UserContext";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { updateUser } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data: loginData, error: loginError } = await supabase
        .from("user_accounts")
        .select("*")
        .eq("userEmail", email)
        .eq("userPassword", password) // Replace with hashing in production
        .single();

      if (loginError || !loginData) {
        alert("Incorrect email or password. Please try again.");
        return;
      }

      updateUser(loginData); // Persist user globally

      if (["Admin", "Superadmin", "Intern"].includes(loginData.userAccountType)) {
        navigate("/admin");
      } else if (["Student", "Teacher"].includes(loginData.userAccountType)) {
        navigate("/");
      } else {
        alert("Unknown account type. Please contact support.");
      }
    } catch (err) {
      setError("Unable to connect to the server. Please check your network.");
    }
  };

  return (
    <div className="uMain-cont max-w-md mx-auto p-8 bg-white rounded-2xl">
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-1">
          <img src="/image/arcadia.png" alt="Arcadia logo" className="h-13 w-13" />
          <h1 className="text-5xl font-semibold">Arcadia</h1>
        </div>
      </div>

      <p className="text-center text-gray-600 mb-6">
        Login to access all the features of Arcadia!
      </p>

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
          />
        </div>

        <div className="flex justify-center items-center gap-4">
          <Link to="/user/register" className="registerBtn">
            Register
          </Link>
          <button type="submit" className="genRedBtns">
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
