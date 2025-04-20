import { supabase } from "/src/supabaseClient.js";
import React, { useEffect, useState } from "react";
import { useUser } from "../../../backend/UserContext"; // Adjust path as needed

export default function SearchByGenre({ onGenreClick, onSeeMoreGenresClick }) {
  const { user } = useUser();
  const [genres, setGenres] = useState([]);
  const [allGenres, setAllGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const fetchGenres = async () => {
    try {
      let selectedGenres = [];
      let uniqueGenres = new Set();
  
      if (user?.userID) {
        // Fetch genres linked to the user
        const { data: userGenres, error: userGenresError } = await supabase
          .from("user_genre_link")
          .select("genres(genreID, genreName, category, img, description)")
          .eq("userID", user.userID);
  
        if (userGenresError) throw userGenresError;
  
        let userGenreList = userGenres.map(({ genres }) => genres).filter(Boolean);
  
        while (selectedGenres.length < 5 && userGenreList.length > 0) {
          const randomIndex = Math.floor(Math.random() * userGenreList.length);
          const randomGenre = userGenreList.splice(randomIndex, 1)[0];
  
          if (!uniqueGenres.has(randomGenre.genreID)) {
            uniqueGenres.add(randomGenre.genreID);
            selectedGenres.push(randomGenre);
          }
        }
      }
  
      // If less than 5 genres are selected (or no userID is provided), fetch random genres
      if (selectedGenres.length < 5) {
        const { data: allGenres, error: allGenresError } = await supabase
          .from("genres")
          .select("genreID, genreName, category, img, description");
  
        if (allGenresError) throw allGenresError;
  
        let remainingGenres = allGenres.filter(
          (genre) => !uniqueGenres.has(genre.genreID)
        );
  
        while (selectedGenres.length < 5 && remainingGenres.length > 0) {
          const randomIndex = Math.floor(Math.random() * remainingGenres.length);
          const randomGenre = remainingGenres.splice(randomIndex, 1)[0];
          uniqueGenres.add(randomGenre.genreID);
          selectedGenres.push(randomGenre);
        }
      }
  
      console.log("Fetched genres:", selectedGenres);
      setGenres(selectedGenres);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };
  

  const fetchAllGenres = async () => {
    try {
      const { data: allGenres, error } = await supabase
        .from("genres")
        .select("genreID, genreName, category, img, description, book_genre_link!inner(*) ")
        ;

      if (error) throw error;

      // Sort genres alphabetically by genreName
      const sortedGenres = allGenres?.sort((a, b) =>
        a.genreName.localeCompare(b.genreName)
      ) || [];

      console.log("Fetched all genres (sorted):", sortedGenres);
      setAllGenres(sortedGenres);
    } catch (error) {
      console.error("Error fetching all genres:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        fetchGenres();
        fetchAllGenres();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user?.userID]);

  return (
    <div className="uMain-cont px-4 py-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Search by Genre</h2>
        <button
          className="uSee-more"
          onClick={() => onSeeMoreGenresClick("All Genres", allGenres)}
        >
          See more
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 mt-4">
        {isLoading
          ? // **Show placeholders while loading**
          (Array(5)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="genCard-cont animate-pulse">
                <div className="relative flex-none w-full h-[300px] rounded-xl overflow-hidden cursor-pointer group">
                  <div className="w-full h-full rounded-lg bg-light-gray"></div>
                </div>
              </div>
            ))
          ):( // **Show actual genres when loaded**
          genres.map((genre, index) => (
            <div
              key={genre.genreID || index}
              className="transform transition duration-300 hover:shadow-lg hover:scale-105 will-change-transform"
              onClick={() => onGenreClick(genre)}
            >
              <div className="relative flex-none w-full h-[45vh] rounded-xl overflow-hidden cursor-pointer group">
                <img
                  src={genre.img || "/placeholder.svg"}
                  alt={`${genre.category} ${genre.genreName} Cover`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-3 text-white">
                  <p className="text-sm font-semibold opacity-90">{genre.category}</p>
                  <h3 className="text-xl font-semibold mt-1 text-left break-words">
                    {genre.genreName}
                  </h3>
                </div>
              </div>
            </div>
          )))}
      </div>
    </div>
  );
}
