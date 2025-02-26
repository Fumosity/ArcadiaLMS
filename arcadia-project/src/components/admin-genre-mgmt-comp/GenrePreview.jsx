import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const GenrePreview = ({ genre }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    // Simulate loading effect when a genre is selected
    useEffect(() => {
        if (genre) {
            // Simulate a delay to show the skeleton effect
            const timer = setTimeout(() => setLoading(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [genre]);

    // Show a message if no genre is selected
    if (!genre) {
        return <div className="bg-white p-4 rounded-lg border-grey border text-center mt-12">Select a genre to view its details.</div>;
    }

    // Show skeletons while loading
    if (loading) {
        return (
            <div className="bg-white p-4 rounded-lg border-grey border mt-12">
                <h3 className="text-xl font-semibold mb-3">
                    <Skeleton width={150} />
                </h3>
                <div className="relative bg-white p-2 mb-4 rounded-lg">
                    <Skeleton height={200} width={150} className="mx-auto mb-2 rounded" />
                </div>
                <table className="min-w-full border-collapse">
                    <tbody>
                        {[...Array(3)].map((_, index) => (
                            <tr key={index} className="border-b border-grey">
                                <td className="px-1 py-1 font-semibold capitalize" style={{ width: "40%" }}>
                                    <Skeleton width={80} />
                                </td>
                                <td className="px-1 py-1 text-sm">
                                    <Skeleton width={150} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    const genreDetails = {
        genre: genre.genreName,
        category: genre.category,
        description: genre.description,
    };

    // Create a function to handle navigation
    const handleModifyGenre = () => {
        console.log("Title ID in BookPreviewInventory:", genreDetails.genreID);
        const queryParams = new URLSearchParams(genreDetails).toString();
        navigate(`/admin/genremodify?${queryParams}`);
    };

    return (
        <div className="">
            <div className="flex justify-center gap-2">
                <button
                    className="add-book w-full mb-2 px-2 py-2 rounded-lg border-grey  hover:bg-arcadia-red hover:text-white"
                    onClick={handleModifyGenre}
                >
                    Modify Selected Genre
                </button>
                <button
                    className="add-book w-full mb-2 px-2 py-2 rounded-lg border-grey  hover:bg-arcadia-red hover:text-white"
                    onClick={handleModifyGenre}
                >
                    Delete Selected Genre
                </button>
            </div>

            <div className="bg-white p-4 rounded-lg border-grey border w-full">
                <h3 className="text-2xl font-semibold mb-2">Genre Preview</h3>
                <div className="w-full h-fit flex justify-center">
                    <div className="border border-grey p-4 w-full rounded-lg  hover:bg-light-gray transition">
                        <img src={genre.img || "image/book_research_placeholder.png"} alt="genre img" className="h-[250px] w-full object-cover rounded-lg border border-grey" />
                    </div>
                </div>
                <table className="w-full border-collapse">
                    <tbody>
                        {Object.entries(genreDetails).map(([key, value], index) => (
                            <tr key={index} className="border-b border-grey">
                                <td className="px-1 py-1 font-semibold capitalize">
                                    {key.replace(/([A-Z])/g, ' $1')}:
                                </td>
                                <td className="px-1 py-1 text-sm w-full text-right">{value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GenrePreview;
