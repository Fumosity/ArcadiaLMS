import React from "react";
import UNavbar from "../../components/UserComponents/user-main-comp/UNavbar";
import UsearchBar from "../../components/UserComponents/user-main-comp/USerachBar";
import Title from "../../components/main-comp/Title";

import SimBooks from "../../components/UserComponents/user-book-catalog-comp/SimBooks";

import ArcOpHr from "../../components/UserComponents/user-home-comp/ArcOpHr";
import UpEvents from "../../components/UserComponents/user-home-comp/UpEvents";
import Services from "../../components/UserComponents/user-main-comp/Services";
import UHero from "../../components/UserComponents/user-home-comp/UHero";
import LibServ from "../../components/UserComponents/user-serv-comp/LibServ";
import SupportCont from "../../components/UserComponents/user-support-comp/SupportCont";
import ContactUs from "../../components/UserComponents/user-support-comp/ContactUs";
import FAQSection from "../../components/UserComponents/user-faq-comp/FAQSection";
import LoginCont from "../../components/UserComponents/user-login-sign-up-comp/LoginForm";
import LoginForm from "../../components/UserComponents/user-login-sign-up-comp/LoginForm";
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