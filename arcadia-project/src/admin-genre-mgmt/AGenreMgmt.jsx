import React, { useEffect, useState } from "react";
import Title from "../components/main-comp/Title";
import FictionList from "../components/admin-genre-mgmt-comp/FictionList";
import NonFictionList from "../components/admin-genre-mgmt-comp/Nonfictionlist";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import GenrePreview from "../components/admin-genre-mgmt-comp/GenrePreview";

export default function AGenreMgmt() {
    const navigate = useNavigate(); // Initialize useNavigate
    const [selectedGenre, setSelectedGenre] = useState(null); // State to hold the selected book details

    const handleGenreSelect = (genre) => {
        setSelectedGenre(genre); // Update selected book
      };

    return (
        <div className="bg-white">
            <Title>Genre Management</Title>
            <div className="flex justify-center items-start space-x-2 pb-12 pt-8 px-12">
                <div className="flex-shrink-0 w-2/4">
                    <div className="flex justify-between w-full gap-2 h-fit">
                        <button
                            className="add-book w-full mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
                            onClick={() => navigate('/admin/bookmanagement')}
                        >
                            Return to Book Inventory
                        </button>
                        <button
                            className="add-book w-full mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
                            onClick={() => navigate('/admin/genreadding')}
                        >
                            Add a Genre
                        </button>
                    </div>
                    <div className="flex justify-between w-full gap-2 h-full">
                        <FictionList onGenreSelect={handleGenreSelect} />
                        <NonFictionList onGenreSelect={handleGenreSelect} />
                    </div>
                </div>
                <div className="flex flex-col items-start flex-shrink-0 w-2/4">
                    <div className="w-full">
                        <GenrePreview genre={selectedGenre} />
                    </div>
                </div>
            </div>
        </div>
    )
}