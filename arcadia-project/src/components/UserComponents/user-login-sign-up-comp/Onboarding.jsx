import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "../../../supabaseClient.js"
import { useUser } from "../../../backend/UserContext.jsx"
import bcrypt from "bcryptjs"

export default function Onboarding() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const { updateUser } = useUser()

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
                alert("Incorrect email or password. Please try again.")
                return
            }

            const passwordMatches = bcrypt.compareSync(password, loginData.userPassword)
            if (!passwordMatches) {
                alert("Incorrect email or password. Please try again.")
                return
            }

            updateUser(loginData)

            if (["Admin", "Superadmin", "Intern"].includes(loginData.userAccountType)) {
                navigate("/admin")
            } else if (["Student", "Teacher"].includes(loginData.userAccountType)) {
                navigate("/")
            } else {
                alert("Unknown account type. Please contact support.")
            }
        } catch (err) {
            setError("Unable to connect to the server. Please check your network.")
        }
    }

    return (
        <div className="uMain-cont flex h-[600px]">
            {/* Left Section */}
            <div className="max-w-md mx-auto p-8 bg-white flex flex-col items-center text-center">
                <div className="mb-6">
                    <h1 className="text-5xl font-semibold">Congratulations!</h1>
                </div>

                <p className="text-black mb-6">Welcome to Arcadia!</p>
                <p className="text-black mb-6">
                    Please access your email to confirm your account registration. <br />
                    Once done, you may now log in!
                </p>

                <div className="flex justify-center">
                    <button type="submit" className="genRedBtns w-[200px]">Login</button>
                </div>
            </div>


            {/* Right Section */}
            <div className="w-1/2 relative bg-grey rounded-2xl">
                <div className="absolute inset-0 flex items-end p-12">
                    <h2 className="text-white text-4xl text-right font-semibold">Knowledge that empowers.</h2>
                </div>
            </div>
        </div>
    )
}

