import React, { useEffect, useState } from 'react';
import Title from "../components/main-comp/Title";
import { useNavigate, useLocation } from "react-router-dom"; // Import useNavigate
import ABCopiesPreview from '../components/admin-book-copies-comp/ABCopiesPreview';
import { supabase } from '/src/supabaseClient.js'; // Import Supabase client
import ABCopiesList from '../components/admin-book-copies-comp/ABCopiesList';
import ABCopiesMgmt from '../components/admin-book-copies-comp/ABCopiesMgmt';

const ABCopies = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    const location = useLocation();
    const [book, setBook] = useState(null); // State to hold the fetched book details
    const [titleID, setTitleID] = useState(null); // State to store the titleID
    const [loading, setLoading] = useState(true); // Add loading state
    const [isLoadingTitleID, setIsLoadingTitleID] = useState(true);

    const [formData, setFormData] = useState({
        bookStatus: '',
        bookBarcode: '',
        bookCallNo: '',
        bookLocation: '',
        bookAcqDate: '',
      })

    useEffect(() => {
        const fetchBookDetails = async () => {
            setIsLoadingTitleID(true);

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

                setTimeout(() => {
                    setBook(data); // Set the fetched book details in state
                    setLoading(false);
                    setTitleID(fetchedTitleID);
                }, 1000);
            } else {
                console.error('No titleID found in URL parameters');
            }
            setIsLoadingTitleID(false);

        };

        fetchBookDetails();
    }, [location.search]); // Fetch book details when the component mounts

    return (
        <div className="min-h-screen bg-white">
            <Title>Copy Management</Title>
            <div className="flex justify-center items-start space-x-2 pb-12 pt-8 px-12">
                <div className="flex-shrink-0 w-3/4">
                    {/* Main content for adding research */}
                    <div className="flex justify-between w-full gap-2">
                        <button
                            className="add-book w-1/2 mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
                            onClick={() => navigate('/admin/bookmanagement')}
                        >
                            Return to Book Inventory
                        </button>
                        <button
                            className="add-book w-1/2 mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
                            onClick={() => navigate('/admin/bookmanagement')}
                        >
                            Add a Copy
                        </button>
                    </div>
                    <div className="flex justify-between w-full gap-2">
                        {isLoadingTitleID ? (
                            <div>Loading Book Details...</div> // Or a spinner
                        ) : titleID ? (
                            <ABCopiesList titleID={titleID} />
                        ) : (
                            <div>No Book Selected</div>
                        )}
                        <ABCopiesMgmt formData={formData} setFormData={setFormData}/>
                    </div>
                </div>
                {/* Preview section */}
                <div className="flex flex-col items-start flex-shrink-0 w-1/4">
                    <ABCopiesPreview book={book} loading={loading} /> {/* Pass loading prop */}
                </div>
            </div>
        </div>
    );
};

export default ABCopies;