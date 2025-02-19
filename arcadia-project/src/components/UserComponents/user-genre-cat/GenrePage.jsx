import { useEffect, useState, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import BookGrid from "../user-home-comp/BookGrid";
import { supabase } from "../../../supabaseClient";

const GenrePage = ({ selectedGenre, onBackClick }) => {
  console.log("selectedGenre", selectedGenre);

  const fetchBooks = useCallback(async () => {
    try {
      console.log("Fetching books for genre:", selectedGenre.genreName);
  
      // 🟢 Fetch all book titles first
      const { data: bookTitles, error: titleError } = await supabase
        .from("book_titles")
        .select("titleID, title, author, cover");
  
      if (titleError) throw titleError;
  
      const titleIDs = bookTitles.map(book => book.titleID);
  
      // 🟢 Fetch genre data
      const { data: genreData, error: genreError } = await supabase
        .from("book_genre_link")
        .select("titleID, genres(genreID, genreName, category)")
        .in("titleID", titleIDs);
  
      if (genreError) throw genreError;
  
      // 🟢 Organize genre data properly
      const genreMap = {};
      genreData.forEach(({ titleID, genres }) => {
        if (!genreMap[titleID]) {
          genreMap[titleID] = { genres: [], categories: new Set() };
        }
        genreMap[titleID].genres.push(genres.genreName);
        genreMap[titleID].categories.add(genres.category);
      });
  
      // Convert category Set back to an array
      Object.keys(genreMap).forEach((titleID) => {
        genreMap[titleID].categories = Array.from(genreMap[titleID].categories);
      });
  
      // 🟢 Filter books correctly
      const filteredBooks = bookTitles.filter(book => {
        const titleID = book.titleID;
        return genreMap[titleID] && genreMap[titleID].genres.includes(selectedGenre.genreName);
      });
  
      // 🟢 Fetch borrow count data
      const { data: transactions, error: transactionError } = await supabase
        .from("book_transactions")
        .select("bookID");
  
      if (transactionError) throw transactionError;
  
      const borrowCountMap = transactions.reduce((acc, transaction) => {
        acc[transaction.bookID] = (acc[transaction.bookID] || 0) + 1;
        return acc;
      }, {});
  
      // 🟢 Fetch ratings data
      const { data: ratings, error: ratingError } = await supabase
        .from("ratings")
        .select("ratingValue, titleID");
  
      if (ratingError) throw ratingError;
  
      const ratingMap = ratings.reduce((acc, { titleID, ratingValue }) => {
        if (!acc[titleID]) {
          acc[titleID] = { total: 0, count: 0 };
        }
        acc[titleID].total += ratingValue;
        acc[titleID].count += 1;
        return acc;
      }, {});
  
      // 🟢 Format books correctly
      const formattedBooks = filteredBooks.map(book => {
        const titleID = book.titleID;
        const borrowCount = borrowCountMap[book.titleID] || 0;
        const avgRating = ratingMap[titleID]?.total / ratingMap[titleID]?.count || 0;
        return {
          title: book.title,
          author: book.author,
          cover: book.cover,
          genre: selectedGenre.genreName,
          category: genreMap[titleID]?.categories.join(", ") || "Unknown",
          borrowCount,
          weightedAvg: avgRating,
        };
      });
  
      // 🟢 Sort books properly
      formattedBooks.sort((a, b) => {
        if (b.borrowCount !== a.borrowCount) return b.borrowCount - a.borrowCount;
        return b.weightedAvg - a.weightedAvg;
      });
  
      let bookList = { books: formattedBooks };
  
      console.log("Fetched Books:", bookList);
      return bookList;
    } catch (err) {
      console.error("Error fetching books:", err);
      return { books: [] };
    }
  }, [selectedGenre]);
  

  useEffect(() => {
    if (selectedGenre.genreName) {
      fetchBooks();
    }
  }, [fetchBooks]);

  return (
    <div className="min-h-screen bg-light-white">
      <div className="uHero-cont mb-6">
        <div
          className="relative w-[950px] h-[280px] rounded-xl md:h-64 lg:h-72 xl:h-80 flex items-center justify-center bg-cover bg-center text-white"
          style={{ backgroundImage: `url('${selectedGenre.img}')` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl"></div>
          <div className="relative z-10 text-center">
            <h4 className="text-xl md:text-2xl">{selectedGenre.category}</h4>
            <h1 className="text-4xl md:text-5xl p-4 font-bold">{selectedGenre.genreName}</h1>
            <p className="text-sm md:text-lg">{selectedGenre.description}</p>
          </div>
        </div>
      </div>

      <button
        onClick={onBackClick}
        className="w-[200px] h-[44px] mb-8 border border-grey rounded-full px-5 inline-flex items-center gap-2 text-sm text-black hover:bg-light-gray transition-colors"
      >
        <span className="w-5 h-5 border border-black rounded-full bg-gray-100 flex items-center justify-center">
          <ArrowLeft className="w-3 h-3" />
        </span>
        Back to Home
      </button>

      <BookGrid title={`${selectedGenre.genreName} Books`} fetchBooks={fetchBooks} />
    </div>
  );
};

export default GenrePage;
