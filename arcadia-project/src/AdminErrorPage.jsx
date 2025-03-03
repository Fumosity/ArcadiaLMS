import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate


const AdminErrorPage = () => {
    const navigate = useNavigate(); // Initialize the navigate function

    const handleReturnHome = () => {
        navigate("/admin"); // Navigate to the home page
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="flex items-center justify-center text-center" style={{ minHeight: "calc(100vh - 4rem)" }}>
                <div className="space-y-4">
                    <p className="text-6xl font-extrabold text-black">404</p>
                    <h4 className="text-2xl font-semibold text-black">Page not Found.</h4>

                    <p className="text-black">
                        The page that you are looking for does not exist.
                        <br />Perhaps you were looking for something else?
                    </p>

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

export default AdminErrorPage;
