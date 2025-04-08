import React, { useEffect, useState } from "react";
import { supabase } from "/src/supabaseClient.js";

export default function FictionList({onGenreSelect}) {
    const [genres, setGenres] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGenres = async () => {
            setIsLoading(true);
            try {
                const { data: genreData, error: genreError } = await supabase
                    .from("genres")
                    .select("genreID, genreName, img, description, category")
                    .eq("category", "Fiction");
                
                if (genreError) throw genreError;
                if (!genreData || genreData.length === 0) {
                    setGenres([]);
                    return;
                }
                
                const genreIDs = genreData.map(g => g.genreID);
                
                // Fetch book count for each genre
                const { data: bookLinks, error: bookError } = await supabase
                    .from("book_genre_link")
                    .select("genreID");
                
                if (bookError) throw bookError;
                
                const bookCountMap = bookLinks.reduce((acc, { genreID }) => {
                    acc[genreID] = (acc[genreID] || 0) + 1;
                    return acc;
                }, {});
                
                // Fetch user interest count for each genre
                const { data: userLinks, error: userError } = await supabase
                    .from("user_genre_link")
                    .select("genreID");
                
                if (userError) throw userError;
                
                const userCountMap = userLinks.reduce((acc, { genreID }) => {
                    acc[genreID] = (acc[genreID] || 0) + 1;
                    return acc;
                }, {});
                
                // Combine data
                const combinedGenres = genreData.map(genre => ({
                    ...genre,
                    bookCount: bookCountMap[genre.genreID] || 0,
                    userCount: userCountMap[genre.genreID] || 0,
                }));

                console.log("Fiction List", combinedGenres)
                
                setGenres(combinedGenres);
            } catch (error) {
                console.error("Error fetching fiction genres:", error.message);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchGenres();
    }, []);

    const handleRowClick = (genre) => {
        onGenreSelect(genre);
    };

    return (
        <div className="bg-white p-4 rounded-lg border-grey border w-full min-w-min">
            <h3 className="text-2xl font-semibold mb-4">Fiction Genres</h3>
            <div className="max-h-96 overflow-y-auto border border-x-0 border-dark-gray custom-scrollbar">
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-white sticky top-0 z-10 ">
                            <tr>
                                <th className="w-1/2 px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Genre
                                </th>
                                <th className="w-1/4 px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Book Count
                                </th>
                                <th className="w-1/4 px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Interested Users
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {genres.map((genre) => (
                                <tr 
                                    key={genre.genreID}
                                    className="hover:bg-light-gray cursor-pointer border-b border-grey"
                                    onClick={() => handleRowClick(genre)}
                                >
                                    <td className="w-1/2 px-4 py-2 text-sm">{genre.genreName}</td>
                                    <td className="w-1/4 px-4 py-2 text-sm text-center">{genre.bookCount}</td>
                                    <td className="w-1/4 px-4 py-2 text-sm text-center">{genre.userCount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
    
}
