import { useEffect, useState, useCallback } from "react";
import { ArrowLeft } from "lucide-react"
import BookCards from "./BookCards"
import BookGrid from "./BookGrid";

const SeeMore = ({ selectedComponent, onBackClick, fetchBooks }) => {
  const [heroDescription, setDescription] = useState("");

  const heroDesc = (selectedComponent) => {
    if (selectedComponent.startsWith("Because you like")) {
      selectedComponent = "Because you like"
    }
    console.log(selectedComponent)
    if (selectedComponent == 'Recommended for You') {
      setDescription('See what books might catch your interest!')
    } else if (selectedComponent == 'Most Popular') {
      setDescription('The most borrowed, most requested titles of Arcadia!')
    } else if (selectedComponent == 'Highly Rated') {
      setDescription('Just the best, all in one place!')
    } else if (selectedComponent == 'Because you like') {
      setDescription('Check out these books and see if you will love them too!')
    } else {
      setDescription('A fluorish of titles!')
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        heroDesc(selectedComponent)
      } catch (error) {
        setError(error.message);
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  });

  return (
    <div className="min-h-screen bg-light-white">
      <button
        onClick={onBackClick}
        className="w-[200px] h-[44px] mb-4 border border-grey rounded-full px-5 inline-flex items-center gap-2 text-sm text-black hover:bg-light-gray transition-colors"
      >
        <span className="w-5 h-5 border border-black rounded-full bg-gray-100 flex items-center justify-center">
          <ArrowLeft className="w-3 h-3" />
        </span>
        Back to Home
      </button>

      <div className="uHero-cont mb-4">
        <div
          className="relative w-full h-full rounded-xl md:h-64 lg:h-72 xl:h-80 flex items-center justify-center bg-cover bg-center text-white"
          style={{ backgroundImage: `url(/public/image/fantasy.png)` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-25 rounded-xl"></div>
          <div className="relative z-10 text-center">
            <h4 className="text-xl md:text-2xl"></h4>
            <h1 className="text-4xl md:text-5xl p-4 font-bold">{selectedComponent}</h1>
            <p className="text-sm md:text-lg">{heroDescription}</p>
          </div>
        </div>
      </div>

      <BookGrid title={selectedComponent} fetchBooks={fetchBooks} />
    </div>
  )
}

export default SeeMore

