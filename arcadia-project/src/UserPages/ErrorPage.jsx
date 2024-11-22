import React from "react";
import UNavbar from "../components/UserComponents/user-main-comp/UNavbar";

const ErrorPage = () => {
    return (
        <div className="min-h-screen bg-light-white">
            <UNavbar />
            <div className="flex items-center justify-center text-center" style={{ minHeight: "calc(100vh - 4rem)" }}>
                <div className="space-y-4">
                    <p className="text-6xl font-extrabold text-black">404</p>
                    <h4 className="text-2xl font-semibold text-black">Page not Found.</h4>

                    <p className="text-black">
                        The page that you are looking for does not exist.
                        <br />Perhaps you were looking for something else?
                    </p>

                    <div>
                        <button className="whiteButtons">
                            Return to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
