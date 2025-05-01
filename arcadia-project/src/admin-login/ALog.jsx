import React, { useState, useEffect} from "react";
import Title from "../components/main-comp/Title";

const ALog = ({ onLogin, onForgotPassword }) => {
    useEffect(() => {
        document.title = "Arcadia | Login";
    }, []);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        onLogin({ email, password });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Title>Login</Title>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center">
                <div className="w-96 bg-neutral-50 rounded-2xl border border-grey p-6 flex flex-col items-center space-y-12">
                    <img className="w-72 h-14" src="image\arclogtex.png" alt="Logo" />
                    <div className="w-full space-y-6">
                        <div className="flex flex-col space-y-2">
                            <label className="text-base font-medium">Email:</label>
                            <input
                                type="email"
                                className="border border-grey rounded-2xl p-1.5 w-full"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-base font-medium">Password:</label>
                                <button 
                                    onClick={onForgotPassword}
                                    className="text-xs text-[#902323] underline"
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <input
                                type="password"
                                className="border border-grey rounded-2xl p-1.5 w-full"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>
                    <button 
                        className="bg-grey text-neutral-50 rounded-3xl px-5 py-2 text-base w-72" 
                        onClick={handleLogin}
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ALog;
