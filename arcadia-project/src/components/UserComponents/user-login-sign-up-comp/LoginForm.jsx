//Import Section
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../../supabaseClient.js";

//Main Function
export default function LoginForm() {
  const [email, setEmail] = useState(""); //userEmail
  const [password, setPassword] = useState(""); //userPassword
  const [error, setError] = useState(""); //Error storage
  const navigate = useNavigate(); //Command to navigate to a desired page

  //Submit Function
  const handleSubmit = async (e) => {
    e.preventDefault(); //Disable default behavior
    setError(""); //Clear error storage
    
    try {
      //Grab emails from database
      const { data: emailCheck, error: emailError } = await supabase
        .from("user_accounts")
        .select("*")
        .eq("userEmail", email)
        .single();

        //Check if inputted email is in the database
      if (emailError || !emailCheck) {
        window.alert("This email does not exist. Please register or try again.");
        return;
      }

      //Grab passwords from database
      const { data: loginData, error: loginError } = await supabase
        .from("user_accounts")
        .select("*")
        .eq("userEmail", email)
        .eq("userPassword", password) // Consider hashing passwords for security
        .single();

        //Check if inputted password is in the database
      if (loginError || !loginData) {
        window.alert("Incorrect password. Please try again.");
        return;
      }

      localStorage.setItem("user", JSON.stringify(loginData)); //Set persistence to logged on user
      if (loginData.userRole === "Admin" || "Superadmin" || "Intern") {
        navigate("/admin"); // Redirect to admin dashboard
      } else if (loginData.userRole === "Student" || "Teacher") {
        navigate("/"); // Redirect to user homepage
      } else {
        window.alert("Unknown account type. Contact support.");
      } //Go to homepage
    } catch (err) {
      setError("Unable to connect to the server. Please check your network.");
    }
  };

  //Frontend Section
  return (
    <div className="uMain-cont max-w-md mx-auto p-8 bg-white rounded-2xl">
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-1">
          <img src="/image/arcadia.png" alt="Book icon" className="h-13 w-13"  />
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
            className="w-full px-3 py-1 border  border-grey rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password:
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-a-t-red hover:text-a-t-red underline"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-1 border border-grey rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex gap-4 justify-center items-center">
          <Link
            to="/user/register"
            className="whiteButtons"
          >
            Register
          </Link>
          <button
            type="submit"
            className="genRedBtns"
          >
            Login
          </button>
        </div>
      </form>

      <div className="mt-6 space-y-4 flex flex-col items-center text-center">
        <div className="text-sm text-gray-600">
          You may use your Library Card to log in!
        </div>
        <button className="genWhiteButtons">
          Scan Library Card
        </button>

        <div className="text-sm text-gray-600">
          Or you may also browse as a guest!
        </div>
        <button className="genWhiteButtons">
          Browse as guest
        </button>
      </div>
    </div>
  );
}
