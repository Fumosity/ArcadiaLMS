import React, { useState } from "react";

const LibServ = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalEntries = 5;
    const entriesPerPage = 4;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);

    const libserv = [
        { title: "ARC E-Library", desc: "Connect to the internet to do your own research, create your presentations, or simply learn how to code through our e-library!", more: "Make a Request", img: "https://via.placeholder.com/475x535"},
        { title: "Electronic Databases", desc: "Expand on your research on related literature through the electronic databases that the ARC is affiliated with!", more: "Try it out", img: "https://via.placeholder.com/475x535"},
        { title: "Printing Services", desc: "Need a document printed? Our library offers convenient and affordable printing services. Simply bring in your digital file (USB, email, or cloud storage) and we'll print it out for you. We have a variety of paper options and printing sizes to suit your needs.", more: "Make a Request", img: "https://via.placeholder.com/315x535"},
        { title: "Arcadia Chatbot", desc: "Ask questions, get answers. Our chatbot is here to help you 24/7. Need help finding a book? Want to know our hours? Have a question about your library account? Just ask!", more: "Try it out", img: "https://via.placeholder.com/315x535"},
        { title: "ARC Café", desc: "Take a break and enjoy a delicious treat. Our cafe offers a variety of snacks and beverages to enjoy while you relax and recharge. From coffee and tea to pastries and sandwiches, there's something for everyone.", more: "Read More", img: "https://via.placeholder.com/315x535"},
    ];

    return (
        <div className="uHero-cont">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Library Services</h2>
            </div>

            {/* Library Services Cards */}
            <div className="space-y-6">
                {/* Top Row - 2 Large Cards */}
                <div className="flex flex-col md:flex-row md:space-x-6">
                    {libserv.slice(0, 2).map((services, index) => (
                        <div
                            key={index}
                            className="genCard-cont flex-none w-[465px] h-[535px] bg-white border border-gray-200 rounded-lg p-4 flex flex-col justify-between"
                        >
                            <div>
                                <img
                                    src={services.img}
                                    alt={services.title}
                                    className="w-full h-[300px] object-cover rounded-lg mb-4"
                                />
                                <h3 className="text-lg font-semibold mb-2">{services.title}</h3>
                                <p className="text-sm text-gray-500 mb-4 line-clamp-3">{services.desc}</p>
                            </div>
                            <a href="#" className="text-sm text-arcadia-red font-medium hover:underline mt-auto">
                                {services.more}
                            </a>
                        </div>
                    ))}
                </div>

                {/* Bottom Row - 3 Smaller Cards */}
                <div className="flex flex-col md:flex-row md:space-x-6">
                    {libserv.slice(2).map((services, index) => (
                        <div
                            key={index}
                            className="genCard-cont flex-none w-[300px] h-[535px] bg-white border border-gray-200 rounded-lg p-4 flex flex-col justify-between"
                        >
                            <div>
                                <img
                                    src={services.img}
                                    alt={services.title}
                                    className="w-full h-[280px] object-cover rounded-lg mb-4"
                                />
                                <h3 className="text-lg font-semibold mb-2">{services.title}</h3>
                                <p className="text-sm text-gray-500 mb-4 line-clamp-3">{services.desc}</p>
                            </div>
                            <a href="#" className="text-sm text-arcadia-red font-medium hover:underline mt-auto">
                                {services.more}
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LibServ;
