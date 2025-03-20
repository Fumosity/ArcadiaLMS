import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "/src/supabaseClient.js";

export default function BookAvailability({ book }) {
    const navigate = useNavigate();
    const [availableCount, setAvailableCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAvailability = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("book_indiv")
                .select("bookStatus")
                .eq("titleID", book.titleID);

            if (error) {
                console.error("Error fetching book copies:", error);
            } else {
                const availableBooks = data.filter(indivBook => indivBook.bookStatus === "Available").length;
                setAvailableCount(availableBooks);
            }
            setLoading(false);
        };

        fetchAvailability();
    }, [book.titleID]);

    const isAvailable = availableCount > 0;

    return (
        <div className="uSidebar-filter">
            <div className="flex justify-between items-center mb-2.5">
                <h2 className="text-xl font-semibold">Availability</h2>
            </div>

            {loading ? (
                <p className="text-center text-lg">Checking availability...</p>
            ) : (
                <>
                    <div className="flex m-6 items-center justify-center text-center">
                        {isAvailable ? (
                            <div className="text-lg">
                                <span className="text-green font-semibold">✓</span>
                                <span className="ml-2">Book is Available</span>
                            </div>
                        ) : (
                            <div className="text-lg">
                                <span className="text-red font-semibold">✗</span>
                                <span className="ml-2">Book is Unavailable</span>
                            </div>
                        )}
                    </div>

                    <p className="w-full text-center text-md mb-4">
                        Number available: {availableCount}
                    </p>

                    <div className="item-center justify-center text-center text-black mb-2">
                        <p className="text-sm">Call Number:</p>
                        <h4 className="text-lg font-semibold mb-2">{book.titleCallNum}</h4>
                        <p className="text-sm">Location:</p>
                        <h4 className="text-md">{book.location}</h4>
                    </div>

                    <div className="relative group">
                        <button
                            className={`mt-2 w-full py-1 px-4 rounded-xl text-sm ${isAvailable
                                    ? "bg-arcadia-red hover:bg-red hover:text-white text-white"
                                    : "bg-grey text-black cursor-not-allowed"
                                }`}
                            onClick={() => isAvailable && navigate(`/user/bookreservation?title=${encodeURIComponent(book.title)}`)}
                            disabled={!isAvailable}
                        >
                            Make A Reservation
                        </button>
                        {!isAvailable && (
                            <span className="absolute left-1/2 transform -translate-x-1/2 -top-8 bg-gray-700 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                Book is unavailable
                            </span>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
