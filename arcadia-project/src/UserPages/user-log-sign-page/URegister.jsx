import { useState } from "react";
import RegisterForm from "../../components/UserComponents/user-login-sign-up-comp/RegisterForm";
import UCopyright from "../../components/UserComponents/user-main-comp/UCopyright";
import UserInterests from "../../components/UserComponents/user-login-sign-up-comp/UserInterests";
import DataPrivacy from "../../components/UserComponents/user-login-sign-up-comp/DataPrivacy";
import Onboarding from "../../components/UserComponents/user-login-sign-up-comp/Onboarding";

export default function URegister() {
    const [step, setStep] = useState("privacy");
    const [userData, setUserData] = useState(null); // Store user data
    const [selectedGenres, setSelectedGenres] = useState(null); // Store user data

    const handleRegister = (data) => {
        setUserData(data); // Save user data
        setStep("interests");
    };

    const handleContinue = (data) => {
        setSelectedGenres(data); // Save user data
        setStep("finish");
    };

    return (
        <div className="min-h-screen  flex flex-col relative">
            <div className="absolute inset-0">
                <img
                    src="/image/login-bg.jpeg"
                    alt="Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-arcadia-red opacity-95" />
            </div>

            <main className="relative flex-1 flex justify-center items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
                <div className="userContent-container flex justify-center items-center">
                    {step === "privacy" && <DataPrivacy  onContinue={() => setStep("register")} />}
                                                        {/* onBack={() => setStep("interests")}     */}
                    {step === "register" && <RegisterForm onBack={() => setStep("privacy")} onRegister={handleRegister} />}
                    {step === "interests" && (
                        <UserInterests userData={userData} onBack={() => setStep("register")} onContinue={handleContinue} />
                    )}
                    {/* {step === "privacy" && <DataPrivacy onBack={() => setStep("interests")} onContinue={() => setStep("finish")} />} */}
                    {step === "finish" && (
                        <Onboarding userData={userData} selectedGenres={selectedGenres} />
                    )}
                </div>
            </main>
            <div className="relative z-10">
            <UCopyright />
            </div>
        </div>
    )
};

