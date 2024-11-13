import React from "react";
import UNavbar from "../../components/UserComponents/user-main-comp/UNavbar";
import Title from "../../components/main-comp/Title";
import RegisterForm from "../../components/UserComponents/user-login-sign-up-comp/RegisterForm";

const URegister = () => {
    return (
        <div className="min-h-screen bg-light-white">
            <UNavbar />

            <Title>Login</Title>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Content Container */}
                
                <div className="userContent-container flex flex-col lg:flex-row gap-8 justify-center items-start">
                    {/* Sidebar */}
                    <RegisterForm />
                </div>
            </main>

        </div>
    )
};

export default URegister;