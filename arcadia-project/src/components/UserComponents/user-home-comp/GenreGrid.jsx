import React, { useState, useEffect } from "react";
import { supabase } from "/src/supabaseClient.js";

const GenreGrid = ({ onGenreClick, title, fetchAllGenres }) => {
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const entriesPerRow = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedGenres = await fetchAllGenres;
        setGenres(fetchedGenres || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }

    };
    fetchData();
  }, [fetchAllGenres]);

  const generatePlaceholders = () => {
    const remainder = genres.length % entriesPerRow;
    return remainder === 0 ? [] : Array(entriesPerRow - remainder).fill(null);
  };

  return (
    <div className="uMain-cont">
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {Array(20) // Adjust the number to ensure multiple rows of placeholders
            .fill(null)
            .map((_, index) => (
              <div key={index} className="genCard-cont animate-pulse">
                <div className="relative flex-none w-full h-[300px] rounded-xl overflow-hidden cursor-pointer group">
                  <div className="w-full h-full rounded-lg mb-4 bg-light-gray"></div>
                </div>
              </div>
            ))}
        </div>
      ) : error ? (
        <p className="text-red-500">Error fetching genres: {error.message}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
          {genres.map((genre) => (
            <div
              key={genre.genreID}
              className="transform transition duration-300 hover:shadow-lg hover:scale-105 will-change-transform"
              onClick={() => onGenreClick(genre)}
            >
              <div className="relative flex-none w-full h-[320px] rounded-xl overflow-hidden cursor-pointer group">
                <img
                  src={genre.img || "/placeholder.svg"}
                  alt={`${genre.category} ${genre.genreName} Cover`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-3 text-white">
                  <p className="text-sm opacity-90">{genre.category}</p>
                  <h3 className="text-xl font-semibold mt-1 text-left break-words">
                    {genre.genreName}
                  </h3>
                </div>
              </div>
            </div>
          ))}
          {/* Add placeholders to maintain grid alignment */}
          {generatePlaceholders().map((_, index) => (
            <div key={index} className="transform transition duration-300"> {/* Placeholder div */}
              <div className="w-full h-full rounded-lg mb-4 bg-light-gray"></div> {/* Placeholder image with slightly darker gray */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GenreGrid;
