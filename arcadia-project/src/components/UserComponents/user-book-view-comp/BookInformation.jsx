import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { supabase } from "../../../supabaseClient"; // Import your Supabase client
import { useUser } from "../../../backend/UserContext"; // Import UserContext
import { useNavigate } from "react-router-dom";

export default function BookInformation({ book }) {
    const { user } = useUser(); // Access user from context
    const navigate = useNavigate();
    const [selectedRating, setSelectedRating] = useState(0); // Track selected rating
    const [existingRatingID, setExistingRatingID] = useState(null); // Track existing rating ID
    const [message, setMessage] = useState(""); // Feedback message

    useEffect(() => {
        // Fetch the user's existing rating for the book
        const fetchExistingRating = async () => {
            if (!user || !user.userID || !book) return;

            try {
                const { data, error } = await supabase
                    .from("ratings")
                    .select("ratingID, ratingValue")
                    .eq("userID", user.userID)
                    .eq("titleID", book.titleID)
                    .single();

                if (error && error.code !== "PGRST116") {
                    console.error("Error fetching existing rating:", error);
                } else if (data) {
                    setSelectedRating(data.ratingValue);
                    setExistingRatingID(data.ratingID);
                }
            } catch (err) {
                console.error("Unexpected error fetching rating:", err);
            }
        };

        fetchExistingRating();
    }, [user, book]);

    const handleStarClick = (rating) => {
        setSelectedRating(rating); // Set the clicked rating
        setMessage(""); // Clear any previous message
    };

    const handleSubmitRating = async () => {
        if (!user) {
            navigate("/user/login"); // Redirect to login if not logged in
            return;
        }

        if (selectedRating === 0) {
            setMessage("Please select a rating before submitting!");
            return;
        }

        try {
            if (existingRatingID) {
                // Update existing rating
                const { error } = await supabase
                    .from("ratings")
                    .update({
                        ratingValue: selectedRating,
                        ratingDateTime: new Date().toISOString(),
                    })
                    .eq("ratingID", existingRatingID);

                if (error) {
                    console.error("Error updating rating:", error);
                    setMessage("Error updating rating. Please try again.");
                } else {
                    setMessage("Rating updated successfully!");
                }
            } else {
                // Add new rating
                const { data, error } = await supabase
                    .from("ratings")
                    .insert({
                        ratingValue: selectedRating,
                        ratingDateTime: new Date().toISOString(),
                        titleID: book.titleID,
                        userID: user.userID,
                    })
                    .select()
                    .single();

                if (error) {
                    console.error("Error submitting new rating:", error);
                    setMessage("Error submitting rating. Please try again.");
                } else {
                    setExistingRatingID(data.ratingID); // Save the new rating ID
                    setMessage("Rating submitted successfully!");
                }
            }
        } catch (err) {
            console.error("Unexpected error:", err);
            setMessage("Unexpected error occurred. Please try again.");
        }
    };

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
                            <Star
                                key={i}
                                className={`w-4 h-4 cursor-pointer ${
                                    i < selectedRating ? "fill-bright-yellow" : "fill-grey"
                                }`}
                                onClick={() => handleStarClick(i + 1)} // Update rating on star click
                            />
                        ))}
                        <span className="text-sm text-gray-600 ml-1">{selectedRating || "No rating selected"}</span>
                    </div>

                    <button
                        className="viewBk-btn ml-3"
                        onClick={() => {
                            if (!user) {
                                navigate("/user/login"); // Redirect to login if not logged in
                            } else {
                                handleSubmitRating(); // Submit or update rating
                            }
                        }}
                    >
                        {!user ? "Log In to Rate" : existingRatingID ? "Update Rating" : "Rate"}
                    </button>

                    {message && <p className="text-sm text-center mt-2 text-gray-500">{message}</p>}
                </div>
            </div>

            {/* Additional Information Section */}
            <div className="mt-4 border-t border-grey">
                <h4 className="text-lg font-semibold mt-4 mb-2">Additional Information</h4>
                <div>
                    <p><span className="font-semibold">Category:</span> {book.category || "No category available"}</p>
                    <br />
                    <p><span className="font-semibold">Genre:</span> {book.genre || "No genre available"}</p>
                    <br />
                    <p><span className="font-semibold">Publisher:</span> {book.publisher || "No publisher information"}</p>
                    <br />
                    <p><span className="font-semibold">Keywords:</span> {book.keyword || "No keywords available"}</p>
                    <br />
                    <p><span className="font-semibold">Location:</span> {book.location || "No location available"}</p>
                    <br />
                    <p><span className="font-semibold">ISBN:</span> {book.ISBN || "No ISBN available"}</p>
                    <br />
                    <p><span className="font-semibold">Language:</span> {book.language || "No information available"}</p>
                </div>
            </div>
        </div>
    );
}