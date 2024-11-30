import React from "react";
import { Link } from "react-router-dom";


const MostPopBk = () => {
    return (
        <div className="uSidebar-filter">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold mb-2.5">Most Popular Books</h2>
                <Link to="/user/mostpopularbooks" className="uSidebar-Seemore">
                    See more
                </Link>
            </div>
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