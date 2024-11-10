import React, { useState } from "react";
import { Star } from "lucide-react";

export default function BookInformation() {
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 4;
    const books = [
        {
            title: "Robinson Crusoe",
            author: "Daniel Defoe",
            published: "2016",
            rating: 4.5,
            img: "/placeholder.svg",
            synopsis:
                "A shipwreck. A sole survivor, stranded on a deserted island. What could be more appealing to children than Robinson Crusoe’s amazing adventure? Set in the 17th century, and unfolding over a 30-year period, it offers plenty of suspense and everyday detail about how Crusoe manages to stay alive. Additionally, it paints a fascinating portrait of the age—including references to slavery and Europe’s view of the 'New World.'",
            category: "Fiction",
            genre: ["Young Adult", "Juvenile Literature", "Robinsonades", "Survival", "Castaway", "Adventure"],
            publisher: "Madrid ; Cambridge : Cambridge University Press, ©2016",
            keywords: ["shipwreck", "survival", "adventure"],
            notes: "Originally published 1719, often used for Senior High School English Literature",
            location: "ARC 3rd Floor, Senior High School Library, Shelf M-Z",
            isbn: ["9788483235508", "8483235501", "9788483235539", "8483235536"],
            language: "English",
        },
    ];
    const totalPages = Math.ceil(books.length / entriesPerPage);

    const displayedBooks = books.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

    return (
        <div className="uMain-cont">


            {/* Book Entry */}
            {displayedBooks.map((book, index) => (
                <div key={index} className="mb-8">
                    {/* Main Book Info */}
                    <div className="flex w-[950px] gap-4 p-4 border border-grey bg-silver rounded-lg shadow-sm">
                        <div className="flex-shrink-0 w-[200px]">
                            <img
                                src={book.img || "https://via.placeholder.com/150x300"}
                                alt={`${book.title} Book Cover`}
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
                                <p><span className="font-semibold">Published:</span> {book.published}</p>
                            </div>

                            <p className="text-sm text-gray-600 mt-2">
                                {book.synopsis}
                            </p>

                            <div className="flex items-center justify-start gap-1 mt-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(book.rating) ? " fill-bright-yellow" : "fill-grey"}`} />
                                ))}
                                <span className="text-sm text-gray-600 ml-1">{book.rating}</span>

                                <button className="viewBk-btn ml-3">
                                    Rate
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Additional Information Section */}
                    <div className="mt-4 border-t border-grey">
                        <h4 className="text-lg font-semibold mt-4 mb-2">Additional Information</h4>
                        <div>
                            <p><span className="font-semibold">Category:</span> {book.category}</p>
                            <br />
                            <p><span className="font-semibold">Genre:</span> {book.genre.join("; ")}</p>
                            <br />
                            <p><span className="font-semibold">Publisher:</span> {book.publisher}</p>
                            <br />
                            <p><span className="font-semibold">Keywords:</span> {book.keywords.join("; ")}</p>
                            <br />
                            <p><span className="font-semibold">Notes:</span> {book.notes}</p>
                            <br />
                            <p><span className="font-semibold">Location:</span> {book.location}</p>
                            <br />
                            <p><span className="font-semibold">ISBN:</span> {book.isbn.join(", ")}</p>
                            <br />
                            <p><span className="font-semibold">Language:</span> {book.language}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
