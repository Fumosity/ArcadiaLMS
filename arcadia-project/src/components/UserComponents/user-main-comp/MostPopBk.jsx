import React from "react";

const MostPopBk = () => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Most Popular Books</h2>
            <ul className="space-y-2 text-sm text-gray-600 divide-y divide-grey">
                <li className="flex justify-between py-2">
                    <span>Touch Me Not</span>
                    <span>4.36</span>
                </li>
                <li className="flex justify-between py-2">
                    <span>The Filibuster</span>
                    <span>4.35</span>
                </li>
                <li className="flex justify-between py-2">
                    <span>All Quiet on the Western Front</span>
                    <span>4.34</span>
                </li>
                <li className="flex justify-between py-2">
                    <span>The Great Gatsby</span>
                    <span>4.33</span>
                </li>
                <li className="flex justify-between py-2">
                    <span>Don Quixote</span>
                    <span>4.32</span>
                </li>
            </ul>
        </div>
    )
}
export default MostPopBk;