import React from "react";
import { Star } from "lucide-react";

export default function BookInformation({ book }) {
    if (!book) {
        return <p className="text-center text-gray-500">No book information available.</p>;
    }

    // Helper function to safely join array fields
    const joinArray = (arr) => (Array.isArray(arr) ? arr.join("; ") : "");

    return (
        <div className="uMain-cont">
            {/* Main Book Info */}
            <div className="flex w-[950px] gap-4 p-4 border border-grey bg-silver rounded-lg shadow-sm">
                <div className="flex-shrink-0 w-[200px]">
                    <img
                        src={book.image_url || "https://via.placeholder.com/150x300"}
                        alt={book.title}
                        className="w-full h-[300px] bg-grey object-cover border border-grey rounded-md"
                    />

                    <p className="text-arcadia-red text-xs mt-2 cursor-pointer text-center underline">
                        Report a broken link or error
                    </p>
                </div>

                <div className="flex-1">
                    <h3 className="text-lg font-semibold">{book.title}</h3>
                    <div className="text-sm text-gray-700 mt-1">
                        <p><span className="font-semibold">Author:</span> {book.author}</p>
                        <p><span className="font-semibold">Published:</span> {book.publishedYear}</p>
                        <p className="mt-2"><span className="font-semibold"></span> {book.synopsis || "No synopsis available."}</p>
                    </div>

                    <div className="flex items-center justify-start gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < Math.floor(book.rating) ? " fill-bright-yellow" : "fill-grey"}`} />
                        ))}
                        <span className="text-sm text-gray-600 ml-1">{book.rating}</span>

                        <button className="viewBk-btn ml-3">Rate</button>
                    </div>
                </div>
            </div>

            {/* Additional Information Section */}
            <div className="mt-4 border-t border-grey">
                <h4 className="text-lg font-semibold mt-4 mb-2">Additional Information</h4>
                <div>
                    <p><span className="font-semibold">Category:</span> {book.category || "No category available"}</p>
                    <br />
                    <p><span className="font-semibold">Genre:</span> {joinArray(book.genre) || "No genre available"}</p>
                    <br />
                    <p><span className="font-semibold">Publisher:</span> {book.publisher || "No publisher information"}</p>
                    <br />
                    <p><span className="font-semibold">Keywords:</span> {joinArray(book.keyword) || "No keywords available"}</p>
                    <br />
                    <p><span className="font-semibold">Location:</span> {book.location || "No location available"}</p>
                    <br />
                    <p><span className="font-semibold">ISBN:</span> {joinArray(book.isbn) || "No ISBN available"}</p>
                    <br />
                    <p><span className="font-semibold">Language:</span> {book.language || "No information available"}</p>
                </div>
            </div>
        </div>
    );
}
