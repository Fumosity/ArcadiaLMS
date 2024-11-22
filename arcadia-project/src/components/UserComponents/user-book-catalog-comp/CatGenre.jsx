import React, { useState } from 'react'

export default function CatGenre() {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchGenre, setSearchGenre] = useState([]);
    const [excludeGenre, setExcludeGenre] = useState([]);
    const [isAndSearch, setIsAndSearch] = useState(true);

    const genres = ['Novella', 'Adventure', 'Fantasy', 'Historical', 'Science Fiction', 'Mystery'];

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };

    const handleGenreSelect = (genre, setGenreFunction, genreList) => {
        if (!genreList.includes(genre)) {
            setGenreFunction([...genreList, genre]);
        }
    };

    const handleRemoveGenre = (genre, setGenreFunction, genreList) => {
        setGenreFunction(genreList.filter(g => g !== genre));
    };

    return (
        <div className='uSidebar-filter'>
            <h2 className="text-xl font-semibold mb-2.5">Category and Genre</h2>

            {/* Category checkboxes with single-select behavior and custom styles */}
            <div className="space-y-2 mb-2">
                {['All', 'Fiction', 'Nonfiction'].map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                        {/* Custom checkbox styling */}
                        <input
                            type="checkbox"
                            id={`category-${option.toLowerCase()}`}
                            checked={selectedCategory === option}
                            onChange={() => handleCategorySelect(option)}
                            className="custom-checkbox" // This is the custom class we defined in CSS
                        />
                        <label htmlFor={`category-${option.toLowerCase()}`} className="text-sm">
                            {option}
                        </label>
                    </div>
                ))}
            </div>

            {/* Search Genre dropdown */}
            <div className="space-y-2 border-t border-grey">
                <div className="flex items-center mt-2 justify-between">
                    <p className="text-sm font-medium">Search for Genre:</p>
                    <div className="flex items-center space-x-1 text-sm">
                        <button
                            onClick={() => setIsAndSearch(true)}
                            className={`font-medium ${isAndSearch ? 'text-arcadia-red font-bold' : 'text-black'}`}
                        >
                            AND
                        </button>
                        <span className="text-gray-400">┃</span>
                        <button
                            onClick={() => setIsAndSearch(false)}
                            className={`font-medium ${!isAndSearch ? 'text-arcadia-red font-bold' : 'text-black'}`}
                        >
                            OR
                        </button>
                    </div>
                </div>

                {/* Select Dropdown with Custom Arrow */}
                <div className="relative w-full">
                    <select
                        onChange={(e) => handleGenreSelect(e.target.value, setSearchGenre, searchGenre)}
                        className="w-full px-2 py-0.5 text-sm text-dark-grey border border-grey rounded-2xl bg-white appearance-none pr-8"
                        defaultValue=""
                    >
                        <option value="" disabled>Select a genre...</option>
                        {genres.map((genre) => (
                            <option key={genre} value={genre}>{genre}</option>
                        ))}
                    </select>

                    <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                        <svg
                            className="w-4 h-4 text-black"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </span>
                </div>

                {/* Display selected genres for Search Genre */}
                <div className="flex flex-wrap gap-2 mt-2">
                    {searchGenre.map((genre) => (
                        <div key={genre} className="flex items-center border-grey rounded-2xl bg-grey text-arcadia-black px-2 py-0.5">
                            <button
                                className="mr-2 text-arcadia-black text-left"
                                onClick={() => handleRemoveGenre(genre, setSearchGenre, searchGenre)}
                            >
                                ×
                            </button>
                            <span>{genre}</span>
                        </div>
                    ))}
                </div>
            </div>


            {/* Exclude Genre dropdown */}
            <div className="space-y-2 mt-2 border-t border-grey">
                <p className="text-sm font-medium mt-2">Exclude Genre:</p>
                <div className="relative w-full">
                    <select
                        onChange={(e) => handleGenreSelect(e.target.value, setExcludeGenre, excludeGenre)}
                        className="w-full px-2 py-0.5 text-sm text-dark-grey border border-grey rounded-2xl bg-white appearance-none pr-8"
                        defaultValue=""
                    >
                        <option value="" disabled>Select a genre to exclude...</option>
                        {genres.map((genre) => (
                            <option key={genre} value={genre}>{genre}</option>
                        ))}
                    </select>
                    <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                        <svg
                            className="w-4 h-4 text-black"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </span>

                </div>
                {/* Display selected genres for Exclude Genre */}
                <div className="flex flex-wrap gap-2 mt-2">
                    {excludeGenre.map((genre) => (
                        <div key={genre} className="flex items-center border-grey rounded-2xl bg-grey text-arcadia-black px-2 py-0.5">
                            <button
                                className="mr-2 text-arcadia-black text-left"
                                onClick={() => handleRemoveGenre(genre, setExcludeGenre, excludeGenre)} // Correct state and function
                            >
                                ×
                            </button>

                            <span>{genre}</span>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
