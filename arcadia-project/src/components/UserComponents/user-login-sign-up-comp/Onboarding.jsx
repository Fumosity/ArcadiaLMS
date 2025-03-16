import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "../../../supabaseClient.js"
import { useUser } from "../../../backend/UserContext.jsx"
import bcrypt from "bcryptjs"

export default function Onboarding({ userData, selectedGenres }) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const { updateUser } = useUser()

    console.log(userData)
    console.log(selectedGenres)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        /* user account submission to user_accounts supabase table */
        let account_type
        if (userData.emailSuffix == "@lpunetwork.edu.ph") {
            account_type = "Student"
        } else if (userData.emailSuffix == "@lpu.edu.ph") {
            account_type = "Faculty"
        }

        const userPayload = {
            userFName: userData.firstName,
            userLName: userData.lastName,
            userLPUID: userData.studentNumber,
            userEmail: userData.email + userData.emailSuffix,
            userCollege: userData.college,
            userDepartment: userData.department,
            userPassword: userData.password,
            userAccountType: account_type,
        };

        const { data: userInsertData, error: userInsertError } = await supabase
            .from("user_accounts")
            .insert([userPayload])
            .select("userID");  // Get the inserted user's ID directly

        if (userInsertError || !userInsertData) {
            console.error("Error inserting user:", userInsertError);
            alert("Failed to register. Please try again.");
            return;
        }

        const newUserID = userInsertData[0].userID;
        console.log("New userID:", newUserID);

        // Send authentication email
        try {
            const response = await fetch("http://localhost:5000/send-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: userData.email + userData.emailSuffix,
                    firstName: userData.firstName,
                    lpuID: userData.studentNumber,
                }),
            });

            const result = await response.json();
            if (response.ok) {
                console.log("Verification email sent:", result);
                alert("A verification email has been sent. Please check your inbox.");
            } else {
                console.error("Email sending failed:", result.error);
                alert("Failed to send verification email. Please try again.");
            }
        } catch (error) {
            console.error("Error sending verification email:", error);
            alert("An error occurred while sending the verification email.");
        }

        /* user interest submission to user_genre_link supabase table */

        if (selectedGenres.length > 0) {
            const genreLinks = selectedGenres.map((genreID) => ({
                userID: newUserID,
                genreID: genreID,
            }));

            const { error: genreInsertError } = await supabase
                .from("user_genre_link")
                .insert(genreLinks);

            if (genreInsertError) {
                console.error("Error inserting user interests:", genreInsertError);
                alert("Failed to save interests. Please try again.");
            } else {
                console.log("User interests added successfully!");
            }
        }
    }

    return (
        <div className="uMain-cont flex h-[600px] bg-white">
            {/* Left Section */}
            <div className="max-w-md mx-auto p-8  flex flex-col items-center text-center">
                <div className="mb-6">
                    <h3 className="text-5xl font-semibold">Congratulations!</h3>
                </div>

                <p className="text-black mb-6">Welcome to Arcadia, <b>{userData.firstName}</b>!</p>
                <p className="text-black mb-6">
                    Please press the button below and check your registered email
                    afterwards to confirm your account registration. <br /><br />
                    Once done, you may now log in!
                </p>

                <div className="flex justify-center">
                    {/* <button type="submit" className="genRedBtns" onClick={handleSubmit}>Continue</button> */}
                    <Link to="/user/login" className="genRedBtns" type="submit" onClick={handleSubmit}>
                        Continue
                    </Link>
                </div>

            </div>


            <div
                className="w-1/2 relative rounded-2xl bg-cover bg-center"
            >
                <img
                    src="/image/hero2.jpeg"
                    alt="Hero Background"
                    className="w-full h-full object-cover rounded-lg" // Add rounded-lg here
                />

                <div className="absolute inset-0 bg-black opacity-70 rounded-lg" />

                <div className="absolute inset-0 flex items-end p-12 z-10">
                    <h2 className="text-white text-4xl text-right font-semibold">
                        Knowledge that empowers.
                    </h2>
                </div>
            </div>
        </div>
    )
}

