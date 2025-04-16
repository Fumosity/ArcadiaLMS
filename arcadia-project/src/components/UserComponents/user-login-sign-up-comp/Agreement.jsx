import { useState, useRef } from "react";
import { Link } from "react-router-dom";

export default function Agreement({ onContinue }) {
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [privacyAccepted, setPrivacyAccepted] = useState(false);
    const [scrolledToBottom, setScrolledToBottom] = useState(false);

    const privacyTextRef = useRef(null);

    const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = privacyTextRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 1) {
            setScrolledToBottom(true);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!privacyAccepted) {
            alert(
                "Please accept Data Privacy Agreement to continue."
            );
            return;
        }
        // if (!termsAccepted || !privacyAccepted) {
        //     alert(
        //         "Please accept both Terms and Conditions and Data Privacy Agreement to continue."
        //     );
        //     return;
        // }
        // Your logic here after successful submission
    };

    const isContinueEnabled = privacyAccepted;
    // const isContinueEnabled = termsAccepted && privacyAccepted;

    return (
        <div className="uMain-cont flex max-h-auto max-w-[950px] h-full w-full bg-white">
            <div className="w-1/2 max-w-md mx-auto p-8 flex flex-col items-center justify-center text-center">
                <div className="mb-6">
                    <h3 className="text-5xl font-semibold">Before we start...</h3>
                </div>

                <p className="text-black mb-6">
                    Please read the Terms and Conditions and the <br />
                    Data Privacy Agreement to continue.
                </p>

                {/* Privacy Agreement Scrollable Box */}
                <div className="w-[425px] h-[250px] border border-grey rounded-md p-4 custom-scrollbar overflow-y-scroll text-left text-black mb-4"
                    ref={privacyTextRef}
                    onScroll={handleScroll}
                >
                    <p className="text-sm whitespace-pre-line text-justify">
                        In Lyceum of the Philippines University we value your privacy and aim to uphold the same when processing your personal data. <br />
                        <br />
                        For purposes of account registration we may collect basic information about you such as your Name, Student Number, College, Department and LPU-assigned email address. <br />
                        <br />
                        We are committed to protecting your personal data from loss, misuse, and any unauthorized processing activities, and will take all reasonable precautions to safeguard its security and confidentiality. Neither will we disclose, share, or transfer the same to any third party without your consent. <br />
                        <br />
                        Unless you agree to have us retain your personal data for the purposes stated above, your data will only be kept for a limited period as soon as the purpose for their use has been achieved after which, they will be disposed of in a safe and secure manner. <br />
                        <br />
                        This website is being managed by the Academic Resource Center. To contact the website owner, please send an email to: cav-arc@lpu.edu.ph.<br />
                        <br />
                        We recognize your rights with respect to your personal data. Should you wish to exercise any of them or if you have any concerns regarding our processing activities, you may contact us privacy.cavite@lpu.edu.ph.
                        <br />
                        <br />
                        <br />
                        Thank you.
                        <br />
                        <br />
                        <br />
                        By choosing "I Agree" and clicking the "Continue" button below, I hereby acknowledge and certify that I have carefully read and understood the Terms and Conditions of the Data Privacy Policy/Notice of the Lyceum of the Philippine University Cavite. By providing personal information to LPU, I am confirming that the data is true and correct. I understand that LPU reserves the right to revise any decision made on the basis of the information I provided should the information be found to be untrue or incorrect. I likewise agree that any issue that may arise in connection with the processing of my personal information will be settled amicably with LPU before resorting to appropriate arbitration or court proceedings within the Philippine jurisdiction. Finally, I am providing my voluntary consent and authorization to LPU and its authorized representatives to lawfully process my data/information.
                    </p>

                    {/* Radio buttons inside the scrollable box */}
                    <div className="mt-4">
                        <p className="font-semibold">Do you agree to the Data Privacy Policy?</p>
                        <div className="flex gap-4 mt-2">
                            <label className={`flex items-center gap-1 ${!scrolledToBottom ? "opacity-50 cursor-not-allowed" : ""}`}>
                                <input
                                    type="radio"
                                    name="privacyAgree"
                                    disabled={!scrolledToBottom}
                                    onChange={() => setPrivacyAccepted(true)}
                                />
                                I Agree
                            </label>
                            <label className={`flex items-center gap-1 ${!scrolledToBottom ? "opacity-50 cursor-not-allowed" : ""}`}>
                                <input
                                    type="radio"
                                    name="privacyAgree"
                                    disabled={!scrolledToBottom}
                                    onChange={() => setPrivacyAccepted(false)}
                                />
                                I Don't Agree
                            </label>
                        </div>
                    </div>
                </div>

                {/* Terms and Conditions Checkbox (assuming you have something similar elsewhere) */}
                {/* <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        id="terms"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mr-2"
                    />
                    <label htmlFor="terms" className="text-black text-sm">
                        I agree to the Terms and Conditions
                    </label>
                </div> */}

                <div className="flex justify-center items-center gap-4">
                    <Link to="/user/login" className="registerBtn">
                        Return
                    </Link>
                    <button
                        onClick={onContinue}
                        disabled={!isContinueEnabled}
                        className={`genRedBtns ${!isContinueEnabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        Continue
                    </button>
                </div>
            </div>

            <div className="w-1/2 relative rounded-2xl bg-cover bg-center hidden md:block max-h-[600px]">
                <img
                    src="/image/hero2.jpeg"
                    alt="Hero Background"
                    className="w-[560px] h-full object-cover rounded-lg"
                />

                <div className="absolute inset-0 bg-black opacity-70 rounded-lg" />

                <div className="absolute inset-0 flex items-end p-12 z-10">
                    <h2 className="text-white text-4xl text-right font-semibold">
                        Knowledge that empowers.
                    </h2>
                </div>
            </div>
        </div>
    );
}
