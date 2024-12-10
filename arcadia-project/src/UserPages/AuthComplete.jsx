import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const AuthComplete = () => {
    const navigate = useNavigate(); // Initialize the navigate function

    const handleReturnHome = () => {
        navigate("/"); // Navigate to the home page
    };

    return (
        <div className="min-h-screen bg-light-white">
            <div className="flex items-center justify-center text-center" style={{ minHeight: "calc(100vh - 4rem)" }}>
                <div className="space-y-4">
                    <h4 className="text-2xl font-semibold text-black">Your Account has been verified
                        ! <br /> You may close this tab.</h4>

                    
                    <div>
                        <button className="whiteButtons" onClick={handleReturnHome}>
                            Return to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthComplete;
