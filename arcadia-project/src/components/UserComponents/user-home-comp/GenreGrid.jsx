import React, { useState, useEffect } from "react";
import { supabase } from "/src/supabaseClient.js";

const GenreGrid = ({ onGenreClick, title, fetchGenres }) => {
    const [genres, setGenres] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Add loading state

    const entriesPerRow = 5;

    useEffect(() => {
        const fetchData = async () => {
          try {
            const fetchedGenres = await fetchGenres;
            setGenres(fetchedGenres || []);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
        fetchData();
      }, [fetchGenres]);

    const generatePlaceholders = () => {
        const remainder = genres.length % entriesPerRow;
        return remainder === 0 ? [] : Array(entriesPerRow - remainder).fill(null);
    };

    return (
        <div className="uMain-cont">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-6">
            {genres.map((genre) => (
              <div key={genre.genreID} className="genCard-cont" onClick={() => onGenreClick(genre)}>
                <div className="relative w-[145px] h-[300px] rounded-xl overflow-hidden cursor-pointer group">
                  <img src={genre.img || "/placeholder.svg"} alt={genre.genreName} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 p-4 text-white">
                    <p className="text-sm opacity-90">{genre.category}</p>
                    <h3 className="text-xl font-semibold">{genre.genreName}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
};

export default GenreGrid;
