import React, { useEffect, useState } from "react";
import UNavbar from "../../components/UserComponents/user-main-comp/UNavbar";
import USearchBar from "../../components/UserComponents/user-main-comp/USearchBar";
import Title from "../../components/main-comp/Title";
import FilterSidebar from "../../components/UserComponents/user-book-search-comp/FilterSidebar";
import Recommended from "../../components/UserComponents/user-home-comp/Recommended";
import MostPopular from "../../components/UserComponents/user-home-comp/MostPopular";
import HighlyRated from "../../components/UserComponents/user-home-comp/HighlyRated";
import NewlyAdded from "../../components/UserComponents/user-book-catalog-comp/NewlyAdded";
import ReleasedThisYear from "../../components/UserComponents/user-book-catalog-comp/ReleasedThisYear";
import Fiction from "../../components/UserComponents/user-book-catalog-comp/Fiction";
import Nonfiction from "../../components/UserComponents/user-book-catalog-comp/Nonfiction";
import UBkResults from "./UBkResults";
import { useUser } from "../../backend/UserContext";

const UBkCatalog = () => {
    const [query, setQuery] = useState("");
    const { user, updateUser } = useUser();
    const queryParams = new URLSearchParams(location.search);
    const titleId = queryParams.get("titleID");
    const [bookDetails, setBookDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    console.log(user)

    useEffect(() => {
        const fetchBookDetails = async () => {
            if (!titleId) {
                setError("Title ID not provided");
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from("book_titles")
                .select("*")
                .eq("titleID", titleId)
                .single();

            if (error || !data) {
                console.error("Error fetching or no data:", error);
                setError("Failed to fetch book details or book not found");
                setLoading(false);
                return;
            }

            const publishedYear = data.originalPubDate
                ? new Date(data.originalPubDate).getFullYear()
                : "Unknown Year";

            setBookDetails({
                ...data,
                image_url: data.cover || "https://via.placeholder.com/150x300",
                publishedYear,
            });
            setLoading(false);
        };

        fetchBookDetails();
    }, [titleId]);

    if (!user) {
        return <div>Loading...</div>; // Or show a user-friendly message
    }

    return (
        <div className="min-h-screen bg-light-white">
            <UNavbar />
            <USearchBar placeholder="Search books..." onSearch={setQuery} />
            <Title>Book Catalog</Title>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="userContent-container flex flex-col lg:flex-row gap-8 justify-center items-start">
                    <div className="lg:w-1/4 md:w-1/3 w-full space-y-8 mr-5">
                        <FilterSidebar />
                    </div>
                    <div className="userMain-content lg:w-3/4 w-full ml-5">
                        {query.trim() && <UBkResults query={query} />}
                        <Recommended titleID={titleId} userID={user.userID} category={bookDetails?.category || "General"} />
                        <MostPopular />
                        <HighlyRated />
                        <NewlyAdded />
                        <ReleasedThisYear />
                        <Fiction />
                        <Nonfiction />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UBkCatalog;
