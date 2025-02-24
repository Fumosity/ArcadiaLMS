import React from "react";
import { Link } from "react-router-dom";

const Services = () => {
    return (
        <div className="uSidebar-filter">
            <h2 className="text-xl font-semibold mb-2.5">Services</h2>
            <ul className="space-y-1 text-base text-gray-600 divide-y divide-grey">
                <li className="py-1">
                    <Link to="/user/bookcatalog" className="text-blue-500 hover:underline">
                        Access Book Catalog
                    </Link>
                </li>
                <li className="py-1">
                    <Link to="/user/researchmanagement" className="text-blue-500 hover:underline">
                        Access Research Catalog
                    </Link>
                </li>
                <li className="py-1">
                    <Link to="/user/reservations" className="text-blue-500 hover:underline">
                        Reserve Discussion Room
                    </Link>
                </li>
                <li className="py-1">
                    <Link to="/user/faqs" className="text-blue-500 hover:underline">
                        Browse FAQs
                    </Link>
                </li>
                <li className="py-1">
                    <Link to="/user/support" className="text-blue-500 hover:underline">
                        Contact Us
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Services;
