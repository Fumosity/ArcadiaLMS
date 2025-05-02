import React from "react";
import { Link } from "react-router-dom";

const Services = () => {
    return (
        <div className="uSidebar-filter">
            <h2 className="text-xl font-semibold mb-2.5">Services</h2>
            <ul className="space-y-1 text-base text-gray-600 divide-y divide-grey">
                <li className="py-1">
                    <Link to="/user/bookmanagement" className=" hover:underline"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                        Access Book Catalog
                    </Link>
                </li>
                <li className="py-1">
                    <Link to="/user/researchmanagement" className="hover:underline"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                        Access Research Catalog
                    </Link>
                </li>
                <li className="py-1">
                    <Link to="/user/reservations" className="hover:underline"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                        View Room Schedule
                    </Link>
                </li>
                <li className="py-1">
                    <Link to="/user/faqs" className="hover:underline"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                        Browse FAQs
                    </Link>
                </li>
                <li className="py-1">
                    <Link to="/user/support" className="hover:underline"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                        Contact Us
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Services;
