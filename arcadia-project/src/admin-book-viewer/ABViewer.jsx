import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AboutPage from '../components/admin-book-viewer-comp/AboutPage';
import PastReviews from '../components/admin-book-viewer-comp/PastReviews';
import BookInfo from '../components/admin-book-viewer-comp/BookInfo';
import Analytics from '../components/admin-book-viewer-comp/Analytics';
import PopularAmong from '../components/admin-book-viewer-comp/PopularAmong';
import SimilarTo from '../components/admin-book-viewer-comp/SimilarTo';
import CompareTo from '../components/admin-book-viewer-comp/CompareTo';
import Title from '../components/main-comp/Title';
import { supabase } from '/src/supabaseClient.js'; // Import Supabase client

export default function ABViewer() {
  const location = useLocation();
  const [book, setBook] = useState(null); // State to hold the fetched book details
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchBookDetails = async () => {
      const query = new URLSearchParams(location.search);
      const title = query.get('title');

      if (title) {
        const { data, error } = await supabase
          .from('book')
          .select('*')
          .eq('title', title)
          .single(); // Fetch the book with the matching title

        if (error) {
          console.error("Error fetching book:", error);
        } else {
          setTimeout(() => {
            setBook(data); // Set the fetched book details in state
            setLoading(false); 
          }, 1500); 
        }
      }
    };

    fetchBookDetails();
  }, [location.search]); // Fetch book details when the component mounts

  return (
    <div className="min-h-screen bg-gray-100">
      <Title>Book Viewer</Title>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-8">
            <BookInfo book={book} loading={loading} /> {/* Pass loading prop */}
            <Analytics />
            <PastReviews />
          </div>
          <div className="lg:col-span-1 space-y-8">
            <AboutPage book={book} loading={loading} /> {/* Pass loading prop */}
            <div className="w-full">
              <PopularAmong />
            </div>
            <div className="w-full">
              <SimilarTo />
            </div>
            <div className="w-full">
              <CompareTo />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
