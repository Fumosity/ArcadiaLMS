import { supabase } from "/src/supabaseClient.js";
import React, { useEffect, useState } from "react";
import { useUser } from "../../../backend/UserContext"; // Adjust path as needed

export default function SearchByGenre({ onGenreClick, onSeeMoreGenresClick }) {
  const { user } = useUser();
  const [genres, setGenres] = useState([]);

  const fetchGenres = async () => {
    if (!user?.userID) return;
    try {
      const { data: userGenres, error: userGenresError } = await supabase
        .from("user_genre_link")
        .select("genres(genreID, genreName, category, img, description)")
        .eq("userID", user.userID);
  
      if (userGenresError) throw userGenresError;
  
      let userGenreList = userGenres.map(({ genres }) => genres).filter(Boolean);
      let selectedGenres = [];
      let uniqueGenres = new Set();
  
      while (selectedGenres.length < 5 && userGenreList.length > 0) {
        const randomIndex = Math.floor(Math.random() * userGenreList.length);
        const randomGenre = userGenreList.splice(randomIndex, 1)[0];
  
        if (!uniqueGenres.has(randomGenre.genreID)) {
          uniqueGenres.add(randomGenre.genreID);
          selectedGenres.push(randomGenre);
        }
      }
  
      if (selectedGenres.length < 5) {
        const { data: allGenres, error: allGenresError } = await supabase
          .from("genres")
          .select("genreID, genreName, category, img, description");
  
        if (allGenresError) throw allGenresError;
  
        const remainingGenres = allGenres.filter(
          (genre) => !uniqueGenres.has(genre.genreID)
        );
  
        while (selectedGenres.length < 5 && remainingGenres.length > 0) {
          const randomIndex = Math.floor(Math.random() * remainingGenres.length);
          const randomGenre = remainingGenres.splice(randomIndex, 1)[0];
          uniqueGenres.add(randomGenre.genreID);
          selectedGenres.push(randomGenre);
        }
      }
  
      console.log("search by genre", selectedGenres);
      setGenres(selectedGenres);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, [user?.userID]);
  
  return (
    <div className="uMain-cont w-full px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Search by Genre</h2>
        <button
          className="uSee-more"
          onClick={() => onSeeMoreGenresClick("Search by Genre", genres)}
        >
          See more
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4">
        {genres.map((genre, index) => (
          <div key={genre.genreID || index} className="genCard-cont" onClick={() => onGenreClick(genre)}>
            <div className="relative flex-none w-[145px] h-[300px] rounded-xl overflow-hidden cursor-pointer group">
              <img
                src={genre.img || "/placeholder.svg"}
                alt={`${genre.category} ${genre.genreName} Cover`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <p className="text-sm opacity-90">{genre.category}</p>
                <h3 className="text-xl font-semibold mt-1 text-left">{genre.genreName}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
