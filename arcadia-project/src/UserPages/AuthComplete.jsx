import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_URL } from "../api.js"

const AuthComplete = () => {
    const [status, setStatus] = useState("verifying");
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await fetch(`${API_URL}/verify?token=${token}`);
                if (response.ok) {
                    const data = await response.json();
                    setStatus("success");

                    // Store session token in localStorage (or use cookies for HTTP-only storage)
                    localStorage.setItem("sessionToken", data.sessionToken);

                    // Redirect to dashboard after 2 seconds
                    setTimeout(() => {
                        navigate("/user/login");
                    }, 2000);
                } else {
                    setStatus("failure");
                }
            } catch (error) {
                console.error("Error during token verification:", error);
                setStatus("failure");
            }
        };

        if (token) {
            verifyToken();
        } else {
            setStatus("failure");
        }
    }, [token, navigate]);

    const handleReturnHome = () => {
        navigate("/");
    };

    if (status === "verifying") {
        return <h4>Verifying your account...</h4>;
    }

    return (
        <div className="min-h-screen bg-light-white">
            <div
                className="flex items-center justify-center text-center"
                style={{ minHeight: "calc(100vh - 4rem)" }}
            >
                <div className="space-y-4">
                    {status === "success" ? (
                        <h4 className="text-2xl font-semibold text-black">
                            Your Account has been verified and logged in! <br /> Redirecting to login...
                        </h4>
                    ) : (
                        <h4 className="text-2xl font-semibold text-black">
                            Verification failed. <br /> Please try again later.
                        </h4>
                    )}
                    {status === "failure" && (
                        <div>
                            <button className="whiteButtons" onClick={handleReturnHome}>
                                Return to Home
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthComplete;