import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom"; // Import useNavigate
import UNavbar from "../../../components/UserComponents/user-main-comp/UNavbar";
import Title from "../../../components/main-comp/Title";
import { supabase } from "/src/supabaseClient.js";

const BookReservation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate(); // Initialize navigate
  const [reservationDate, setReservationDate] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [titleID, setTitleID] = useState(null);
  const [details, setDetails] = useState("");
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.userID) setUserID(user.userID);
  }, []);

  useEffect(() => {
    const defaultTitle = searchParams.get("title");
    if (defaultTitle) {
      setBookTitle(defaultTitle);
      fetchBookTitleID(defaultTitle);
    }
  }, [searchParams]);

  const fetchBookTitleID = async (title) => {
    const { data, error } = await supabase
      .from("book_titles")
      .select("titleID")
      .eq("title", title)
      .single();
    if (!error) setTitleID(data?.titleID || null);
  };

  const handleSubmit = async () => {
    if (!reservationDate || !bookTitle || !userID || !titleID) {
      alert("Please fill out all fields correctly.");
      return;
    }

    const date = new Date().toISOString().split("T")[0];

    const { error } = await supabase.from("book_reservation").insert([
      {
        userID,
        date,
        status: "Pending",
        titleID,
        details,
      },
    ]);

    if (error) {
      console.error("Error submitting reservation:", error);
      alert("Failed to file the reservation. Please try again.");
    } else {
      alert("Reservation filed successfully!");
      navigate(-1); // Redirect to the previous page
    }
  };

  return (
    <div className="min-h-screen bg-light-white">
      <UNavbar />
      <Title>Book Reservation</Title>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center">
          <div className="uHero-cont max-w-[1200px] w-full p-6 bg-white rounded-lg border border-grey">
            <h3 className="text-lg font-semibold mb-4">Book a Reservation</h3>
            <div className="mb-4">
              <label className="text-sm font-semibold">Reservation Date:</label>
              <input
                type="date"
                className="px-2 py-1 border border-grey rounded-full text-sm"
                value={reservationDate}
                onChange={(e) => setReservationDate(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="text-sm font-semibold">Book:</label>
              <input
                type="text"
                className="w-full px-2 py-1 border border-grey rounded-full text-sm"
                placeholder="Enter the book title here."
                value={bookTitle}
                onChange={(e) => {
                  setBookTitle(e.target.value);
                  fetchBookTitleID(e.target.value);
                }}
              />
            </div>
            <label className="text-sm font-semibold">Details:</label>
            <textarea
              className="w-full px-3 py-2 border border-grey rounded-2xl text-sm mt-2 mb-4"
              placeholder="Enter details of your reservation."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={6}
            ></textarea>
            <div className="flex justify-center">
              <button
                className="px-4 py-1 text-sm bg-arcadia-red text-white rounded-full font-medium hover:bg-red"
                onClick={handleSubmit}
              >
                Submit Reservation
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookReservation;
