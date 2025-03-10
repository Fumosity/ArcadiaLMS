import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AboutPage from '../components/admin-book-viewer-comp/AboutPage';
import PastReviews from '../components/admin-book-viewer-comp/PastReviews';
import BookInfo from '../components/admin-book-viewer-comp/BookInfo';
import Analytics from '../components/admin-book-viewer-comp/Analytics';
import PopularAmong from '../components/admin-book-viewer-comp/PopularAmong';
import SimilarTo from '../components/admin-book-viewer-comp/SimilarTo';
import Title from '../components/main-comp/Title';
import { supabase } from '/src/supabaseClient.js'; // Import Supabase client
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function ABViewer() {
  const navigate = useNavigate(); // Initialize useNavigate
  const location = useLocation();
  const [book, setBook] = useState(null); // State to hold the fetched book details
  const [titleID, setTitleID] = useState(null); // State to store the titleID
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchBookDetails = async () => {
      const query = new URLSearchParams(location.search);
      const fetchedTitleID = query.get('titleID'); // Get titleID from query params

      if (fetchedTitleID) {
        console.log("fetchedTitleID", fetchedTitleID);

        // Fetch book details
        const { data, error } = await supabase
          .from('book_titles')
          .select('*')
          .eq('titleID', fetchedTitleID) // Fetch the book with the matching titleID
          .single(); // Ensure we get a single result

        if (error) {
          console.error("Error fetching book:", error);
          setLoading(false);
          return;
        }

        console.log("Fetched book data:", data);

        // Fetch genres for this book
        const { data: bookGenres, error: genreError } = await supabase
          .from("book_genre_link")
          .select("titleID, genres(genreID, genreName, category)") // Join with genres table
          .eq("titleID", fetchedTitleID); // Corrected to use .eq() since titleID is a single value

        if (genreError) {
          console.error("Error fetching book genres:", genreError.message);
          setLoading(false);
          return;
        }

        // Process genre data
        let category = "Uncategorized";
        let genres = [];
        if (bookGenres.length > 0) {
          category = bookGenres[0].genres.category; // Assuming all belong to the same category
          genres = bookGenres.map(item => item.genres.genreName);
        }

        // Combine data
        const combinedData = {
          ...data,
          category,
          genres,
        };

        console.log("Combined data:", combinedData);

        setTimeout(() => {
          setBook(combinedData); // Set the fetched book details in state
          setLoading(false);
          setTitleID(fetchedTitleID);
        }, 1000);
      } else {
        console.error('No titleID found in URL parameters');
      }
    };

    fetchBookDetails();
  }, [location.search]); // Fetch book details when the component mounts

  return (
    <div className="min-h-screen bg-white">
      <Title>Book Viewer</Title>
      <div className="flex justify-center items-start space-x-2 pb-12 pt-8 px-12">
        <div className="flex-shrink-0 w-3/4 space-y-2">
          <div className="flex justify-between w-full gap-2">
            <button
              className="add-book mb-0 w-1/2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
              onClick={() => navigate('/admin/bookmanagement')}
            >
              Return to Book Inventory
            </button>
          </div>
          <BookInfo book={book} loading={loading} /> {/* Pass loading prop */}
          <div className="flex w-full space-x-2">
            <PopularAmong />
            <SimilarTo />
          </div>
          <Analytics titleID={book?.titleID || titleID} />
          <PastReviews titleID={book?.titleID || titleID} />
        </div>
        <div className="flex flex-col items-start flex-shrink-0 w-1/4">
          <AboutPage book={book} loading={loading} /> {/* Pass loading prop */}
        </div>
      </div>
    </div>
  );
}
