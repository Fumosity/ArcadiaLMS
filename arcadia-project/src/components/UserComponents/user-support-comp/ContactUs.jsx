import React from "react";

const ContactUs = () => {
    const contactlink = [
        {
            email: "cav-arc@lpu.edu.ph",
            fbpage: "https://www.facebook.com/LPUCaviteARC",
        },
    ];

    return (
        <div className="uMain-cont">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Contact Us</h2>
            </div>
            
            <p className="text-sm mb-4">
                If you have any inquiries or want to book an appointment with the staff, then you may contact us through these lines of communication:
            </p>

            {contactlink.map((contacts, index) => (
                <div key={index} className="mb-4">
                    <p className="text-sm mb-1">
                        <span className="font-medium">Email: </span>
                        <a href={`mailto:${contacts.email}`} className="text-arcadia-red hover:underline">
                            {contacts.email}
                        </a>
                    </p>
                    <p className="text-sm mb-1">
                        <span className="font-medium">Facebook Page: </span>
                        <a
                            href={contacts.fbpage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-arcadia-red hover:underline"
                        >
                            {contacts.fbpage}
                        </a>
                    </p>
                </div>
            ))}

            <p className="text-sm">
                Or see us in-person at the ARC grounds in the LPU-C campus!
            </p>
        </div>
    );
};

export default ContactUs;
