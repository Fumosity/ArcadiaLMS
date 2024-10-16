import React from "react";

const Services = () => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Services</h2>
            <ul className="space-y-3 text-sm text-gray-600 divide-y divide-grey">
                <li className="py-2">Chat with Arcadia</li>
                <li className="py-2">Access Book Catalog</li>
                <li className="py-2">Access Research Catalog</li>
                <li className="py-2">Reserve Discussion Room</li>
                <li className="py-2">Browse FAQs</li>
                <li className="py-2">Contact Us</li>
            </ul>
        </div>
    )
}

export default Services;