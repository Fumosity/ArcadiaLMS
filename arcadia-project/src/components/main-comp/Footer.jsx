import React from "react";

const Footer = () => (
    <footer className="bg-arcadia-black w-full px-8 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-7 gap-8">
            <div>
                <h4 className="text-sm font-semibold mb-4 text-white">Library Analytics</h4>
                <ul className="text-sm text-gray-600 space-y-2 text-white">
                    <li>Most Popular Books</li>
                    <li>Highest Rated Books</li>
                    <li>Most Popular Theses</li>
                    <li>Highest Rated Theses</li>
                </ul>
            </div>
            <div>
                <h4 className="text-sm font-semibold mb-4 text-white">Circulation</h4>
                <ul className="text-sm text-gray-600 space-y-2 text-white">
                    <li>Book Checking</li>
                    <li>History</li>
                    <li>Borrowed Books</li>
                    <li>Returned Books</li>
                    <li>Overdue Books</li>
                </ul>
            </div>
            <div>
                <h4 className="text-sm font-semibold mb-4 text-white">Book Management</h4>
                <ul className="text-sm text-gray-600 space-y-2 text-white">
                    <li>Inventory</li>
                    <li>Add Books</li>
                    <li>Remove Books</li>
                    <li>Modify Books</li>
                    <li>Book Ratings and Reviews</li>
                    <li>Categories</li>
                </ul>
            </div>
            <div>
                <h4 className="text-sm font-semibold mb-4 text-white">Research Management</h4>
                <ul className="text-sm text-gray-600 space-y-2 text-white">
                    <li>Inventory</li>
                    <li>Add Theses</li>
                    <li>Remove Theses</li>
                    <li>Modify Theses</li>
                    <li>Research Ratings</li>
                </ul>
            </div>
            <div>
                <h4 className="text-sm font-semibold mb-4 text-white">User Accounts</h4>
                <ul className="text-sm text-gray-600 space-y-2 text-white">
                    <li>Accounts List</li>
                    <li>Library Cards</li>
                    <li>Whitelist and Blacklist</li>
                </ul>
            </div>
            <div>
                <h4 className="text-sm font-semibold mb-4 text-white">Support</h4>
                <ul className="text-sm text-gray-600 space-y-2 text-white">
                    <li>User Reports</li>
                    <li>Support Tickets</li>
                    <li>Contacts</li>
                </ul>
            </div>
            <div>
                <h4 className="text-sm font-semibold mb-4 text-white">Reservations</h4>
                <ul className="text-sm text-gray-600 space-y-2 text-white">
                    <li>Reservation History</li>
                    <li>Room Status</li>
                </ul>
            </div>
        </div>
    </div>
    </footer>
)
export default Footer;

