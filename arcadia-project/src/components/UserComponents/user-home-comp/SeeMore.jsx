import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import BookGrid from "./BookGrid";
import { supabase } from "../../../supabaseClient.js";

const SeeMore = ({ selectedComponent, onBackClick, fetchBooks }) => {
  const [heroDescription, setDescription] = useState("");
  const [heroImage, setHeroImage] = useState("");

  const heroDetails = {
    "Recommended for You": {
      description: "See what books might catch your interest!",
      img: "/image/recommended.jpg",
    },
    "Most Popular": {
      description: "The most borrowed, most requested titles of Arcadia!",
      img: "/image/mostpopular.jpg",
    },
    "Highly Rated": {
      description: "Just the best, all in one place!",
      img: "/image/highlyrated.jpg",
    },
    "Newly Added": {
      description: "Fresh Picks, Latest Arrivals!",
      img: "/image/newlyadded.jpg",
    },
    "Released This Year": {
      description: "Hot off the shelf!",
      img: "/image/releasedthisyear.jpg",
    },
    "Fiction": {
      description: "Escape into new worlds",
      img: "/image/fiction.jpg",
    },
    "Non-fiction": {
      description: "Knowledge at your fingertips.",
      img: "/image/nonfiction.jpg",
    },
    default: {
      description: "A flourish of titles!",
      img: "/image/default.jpg",
    },
  };

  const heroDesc = async (selectedComponent) => {
    console.log(selectedComponent);

    if (selectedComponent.startsWith("Because you like")) {
      const genre = selectedComponent.replace("Because you like ", "").trim(); // Extract genre name

      // Fetch genre image from Supabase
      const { data, error } = await supabase
        .from("genres")
        .select("img, description")
        .eq("genreName", genre)
        .single();

      if (error) {
        console.error("Error fetching genre image:", error);
      }

      setDescription(data?.description || "Check out these books and see if you will love them too!");
      setHeroImage(data?.img || "/image/becauseyoulike.jpg"); // Fallback image
      return;
    }

    const { description, img } = heroDetails[selectedComponent] || heroDetails.default;
    setDescription(description);
    setHeroImage(img);
  };

  useEffect(() => {
    heroDesc(selectedComponent);
  }, [selectedComponent]);

  return (
    <div className="min-h-screen bg-light-white">
      <button
        onClick={onBackClick}
        className="w-[300px] h-[44px] border mb-4 border-grey rounded-xl px-5 text-md text-black hover:bg-light-gray transition-colors flex items-center justify-center gap-2"
        >
      <span className="w-5 h-5 border border-grey rounded-full bg-gray-100 flex items-center justify-center">
        <ArrowLeft className="w-3 h-3 text-black" />
      </span>       
        Back to Home
      </button>

      <div className="uHero-cont mb-4">
        <div
          className="relative w-full h-full rounded-xl md:h-64 lg:h-72 xl:h-80 flex items-center justify-center bg-cover bg-center text-white"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-black/25 to-black/50"></div>
          <div className="relative z-10 text-center">
            <h4 className="text-xl md:text-2xl"></h4>
            <h1 className="text-4xl md:text-5xl p-4 font-bold drop-shadow-lg">
              {selectedComponent}
            </h1>
            <p className="text-sm md:text-lg drop-shadow-md">
              {heroDescription}
            </p>
          </div>
        </div>
      </div>

      <BookGrid title={selectedComponent} fetchBooks={fetchBooks} />
    </div>
  );
};

export default SeeMore;
