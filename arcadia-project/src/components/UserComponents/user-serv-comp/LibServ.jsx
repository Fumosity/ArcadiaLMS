import React, { useState } from "react";

const LibServ = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalEntries = 5;
    const entriesPerPage = 4;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);

    const libserv = [
        { title: "ARC E-Library", desc: "Connect to the internet to do your own research, create your presentations, or simply learn how to code through our e-library!", img: "/image/arc7.JPG" },
        { title: "Printing Services", desc: "Need a document printed? Our library offers convenient and affordable printing services. Simply bring in your digital file (USB, email, or cloud storage) and we'll print it out for you. We have a variety of paper options and printing sizes to suit your needs.", img: "/image/print.png" },
        { title: "ARC Café", desc: "Take a break and enjoy a delicious treat. Our cafe offers a variety of snacks and beverages to enjoy while you relax and recharge. From coffee and tea to pastries and sandwiches, there's something for everyone.", img: "/image/cafe.png" },
        { title: "Electronic Databases", desc: "Expand on your research on related literature through the electronic databases that the ARC is affiliated with!", img: "/image/e-db.png" },
    ];

    return (
        <div className="uMain-cont">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Library Services</h2>
            </div>

            <div className="space-y-6">
                {/* First set of cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center">
                    {libserv.slice(0, 3).map((services, index) => (
                        <div
                            key={index}
                            className="genCard-cont flex flex-col justify-between bg-white border border-grey rounded-lg p-4 w-full h-[450px]"
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

                {/* Second set of cards */}
                <div className="flex flex-col md:flex-row md:space-x-6">
                    {libserv.slice(3).map((services, index) => (
                        <div
                            key={index}
                            className="genCard-cont w-full flex-none h-[450px] bg-white border border-grey rounded-lg p-4 flex flex-col justify-between"
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
