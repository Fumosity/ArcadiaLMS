import React from "react";
import { Link } from "react-router-dom";
import USupportTix from "../../../UserPages/user-support-tickets-page/USupportTix";
import { useUser } from "../../../backend/UserContext"; // Adjust path as needed

const SupportCont = () => {
    const { user } = useUser();
    let libsupport = [
        {
            title: "FAQs",
            desc: "Do you have some questions or inquiries? Maybe it has been answered before! Check out our FAQs to see if your questions may be answered here.",
            more: "Read the FAQs",
            link: "/user/faqs",
        },
        
    ];

    if (user?.userID) {
        libsupport = [
            {
                title: "User Reports",              
                desc: "With your help, make the ARC better by reporting problems within the ARC or in our system, like erroneous information or the lack of stocks in our inventories. Together, we can make our library the best it could be!",
                more: "Make a report",
                link: "/user/support/reportticket",
            },
            {
                title: "Support Tickets",
                desc: "Do you have problems with your account, library card, or transactions? File a support ticket so we can help you!",
                more: "File a support ticket",
                link: "/user/support/supportticket",
            },
            ...libsupport,
        ];
    }

    return (
        <div className="uMain-cont">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">User Support</h2>
            </div>

            {/* Library Services Cards */}
            <div className="space-y-6">
                {/* Display all support items */}
                <div className={`grid grid-cols-${libsupport.length} gap-6`}>
                    {libsupport.map((support, index) => (
                        <div
                            key={index}
                            className="genCard-cont flex-none bg-white border border-gray-200 rounded-lg p-4 flex flex-col justify-between"
                        >
                            <div>
                                <h3 className="text-lg font-semibold mb-2">{support.title}</h3>
                                <p className="text-sm text-justify text-gray-500 mb-4">{support.desc}</p>
                            </div>
                            <div className="mt-auto">
                                <Link
                                    to={support.link}
                                    className="text-sm text-arcadia-red font-medium hover:underline"
                                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}

                                >
                                    {support.more}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SupportCont;
