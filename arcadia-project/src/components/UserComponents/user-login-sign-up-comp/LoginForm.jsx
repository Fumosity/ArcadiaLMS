import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "../../../supabaseClient.js"
import { useUser } from "../../../backend/UserContext"
import bcrypt from "bcryptjs"
import { toast } from "react-toastify"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { updateUser, loginAsGuest } = useUser()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const { data: loginData, error: loginError } = await supabase
        .from("user_accounts")
        .select("*")
        .eq("userEmail", email)
        .single()

      if (loginError || !loginData) {
        toast.error("Email not registered. Please check your email or sign up for a new account.", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
        return
      }

      const passwordMatches = bcrypt.compareSync(password, loginData.userPassword)
      if (!passwordMatches) {
        alert("Incorrect email or password. Please try again.")
        return
      }

      // Check if user email is verified
      if (!loginData.userVerifyStatus) {
        toast.error("Your email is not verified. Please check your inbox and verify your email to continue.", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
        return
      }

      if (!loginData.userAccountType) {
        alert("User role is missing. Please contact support.")
        return
      }

      updateUser(loginData)
    } catch (err) {
      setError("Unable to connect to the server. Please check your network.")
    }
  }

  const handleForgotPassword = () => {
    window.location.href = "mailto:cav-arc@lpu.edu.ph?subject=Password Reset Request"
  }

  const handleGuestLogin = (e) => {
    e.preventDefault()
    loginAsGuest()
    // Guest login is handled by the UserContext
  }

  return (
    <div className="uMain-cont flex max-h-auto max-w-[950px] h-full w-full bg-white">
      {/* Add Toaster component for displaying notifications */}

      <div className="w-1/2 max-w-md mx-auto p-8">
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

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div className="flex justify-center items-center gap-4">
            <Link to="/user/register" className="registerBtn">
              Sign up
            </Link>
            <button type="submit" className="genRedBtns">
              Login
            </button>
          </div>

          <div className="text-center">
            <button type="button" onClick={handleForgotPassword} className="text-sm text-arcadia-red hover:underline">
              Forgot Password
            </button>
          </div>

          <p className="text-sm text-center text-gray-700">Or you may also browse as a guest!</p>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleGuestLogin}
              className="border py-0.5 px-8 border-arcadia-red text-arcadia-red rounded-full w-auto hover:bg-red hover:border-red hover:text-white"
            >
              Continue as Guest
            </button>
          </div>
        </form>
      </div>

      <div className="w-1/2 relative rounded-2xl bg-cover bg-center hidden md:block max-h-[600px]">
        <img src="/image/hero2.jpeg" alt="Hero Background" className="w-full h-full object-cover rounded-lg" />
        <div className="absolute inset-0 bg-black opacity-70 rounded-lg" />
        <div className="absolute inset-0 flex items-end p-12 z-10">
          <h2 className="text-white text-4xl text-right font-semibold">Knowledge that empowers.</h2>
        </div>
      </div>
    </div>
  )
}

