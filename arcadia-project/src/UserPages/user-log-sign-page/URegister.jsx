import { useState } from "react";
import RegisterForm from "../../components/UserComponents/user-login-sign-up-comp/RegisterForm";
import UCopyright from "../../components/UserComponents/user-main-comp/UCopyright";
import UserInterests from "../../components/UserComponents/user-login-sign-up-comp/UserInterests";
import DataPrivacy from "../../components/UserComponents/user-login-sign-up-comp/DataPrivacy";
import Onboarding from "../../components/UserComponents/user-login-sign-up-comp/Onboarding";

export default function URegister() {
    const [step, setStep] = useState("register");


    return (
        <div className="min-h-screen  bg-red flex flex-col">

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="userContent-container flex flex-col lg:flex-row gap-8 justify-center items-start">
                {step === "register" && <RegisterForm onRegister={() => setStep("interests")} />}
                    {step === "interests" && <UserInterests onBack={() => setStep("register")} onContinue={() => setStep("privacy")} />}
                    {step === "privacy" && <DataPrivacy onBack={() => setStep("interests")} onContinue={() => setStep("finish")} />}
                    {step === "finish" && <Onboarding />}
                </div>
            </main>
            <UCopyright />
        </div>
    )
};

