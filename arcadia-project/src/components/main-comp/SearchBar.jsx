import React from "react";
import { FiSearch, FiUser, FiChevronRight } from 'react-icons/fi';

const SearchBar = () => (
    <div className="max-w-auto bg-light-gray mb-8 py-4 px-4">
        <div className="search-bar mb-8 py-4 px-4 max-w-3xl mx-auto rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">What are you looking for?</h2>
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search for a book or research"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-arcadia-red"
                />
                <FiSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="mt-2 flex space-x-2">
                <span className="text-sm text-gray-500">Try:</span>
                {['Tourism', 'Visual Arts', 'Computer Science', 'Pharmacology'].map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-gray-200 text-xs rounded-full">{tag}</span>
                ))}
            </div>
        </div>
    </div>

)
export default SearchBar;