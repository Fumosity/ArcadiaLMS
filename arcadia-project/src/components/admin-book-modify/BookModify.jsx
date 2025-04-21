import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient.js";
import { v4 as uuidv4 } from "uuid";
import WrngDeleteTitle from "../../z_modals/warning-modals/WrmgDeleteTitle";
import { toast } from "react-toastify";


const BookModify = ({ formData, setFormData, onSave }) => {
  const fileInputRef = useRef(null);
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cover, setCover] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [genres, setGenres] = useState([])
  const [selectedGenres, setSelectedGenres] = useState([])
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [loading, setLoading] = useState(true)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [formDataState] = useState(formData);
  const errorStyle = {
    border: "2px solid red",
    backgroundColor: "#ffe6e6",
  };

  const navigate = useNavigate();


  const handleDeleteBook = async () => {
    const titleID = formDataState.titleID;
    if (!titleID) {
      alert("No book title selected for deletion.");
      return;
    }

    const { error } = await supabase.from("book_titles").delete().eq("titleID", titleID);
    if (error) {
      alert("Failed to delete book: " + error.message);
    } else {
      toast.success("Book deleted successfully!", {
              position: "bottom-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: false,
            })
      navigate("/admin/bookmanagement");
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const initialFormData = {
      title: params.get("title") || "",
      author: params.get("author") || [],
      genres: params.get("genres") ? params.get("genres").split(", ").map((g) => g.trim()) : [],
      category: params.get("category") || "",
      publisher: params.get("publisher") || "",
      synopsis: params.get("synopsis") || "",
      keywords: params.get("keywords") || [],
      pubDate: params.get("pubDate") || "",
      cover: params.get("cover") || "",
      location: params.get("location") || "",
      isbn: params.get("isbn") || "",
      price: params.get("price") || "",
      titleID: params.get("titleID") || null,
      titleCallNum: params.get("titleCallNum") || null,
    };

    setFormData(initialFormData);
    setCategoryFilter(initialFormData.category || null);
  }, [location.search, setFormData]);

  const currentYear = (new Date().getFullYear()) + 10;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'pubDate' && value.length > 4) {
      setFormData({ ...formData, [name]: value.slice(0, 4) });
      return;
    }

    setFormData({ ...formData, [name]: value });

    if (value) {
      setValidationErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
    }
  };

  const uploadCover = async (e) => {
    let coverFile = e.target.files[0];
    const filePath = `${uuidv4()}_${coverFile.name}`;

    const { data, error } = await supabase.storage.from("book-covers").upload(filePath, coverFile, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      console.error("Error uploading image: ", error);
    } else {
      const { data: publicData, error: urlError } = supabase.storage.from("book-covers").getPublicUrl(filePath);

      if (urlError) {
        console.error("Error getting public URL: ", urlError.message);
      } else {
        setFormData({ ...formData, cover: publicData.publicUrl });
      }
    }
  };

  const handleDivClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    const fetchGenres = async () => {
      const { data, error } = await supabase.from("genres").select("genreID, genreName, category");
      if (error) {
        console.error("Error fetching genres:", error);
      } else {
        const sortedData = data.sort((a, b) => {
          return a.genreName.localeCompare(b.genreName); 
        });
        console.log(data)
        setGenres(sortedData)
        
        // Map the genre names from formData to their corresponding genreIDs
        const selectedGenreIDs = data
          .filter((genre) => formData.genres.includes(genre.genreName))
          .map((genre) => genre.genreID);

        setSelectedGenres(selectedGenreIDs);
      }
      setLoading(false);
    };
    fetchGenres();
  }, [formData.genres]); // Depend on formData.genres so it updates correctly  

  const [selectedGenresByCategory, setSelectedGenresByCategory] = useState({});

  const handleCategoryChange = (category) => {
    // Save the current selection before switching categories
    setSelectedGenresByCategory((prev) => ({
      ...prev,
      [categoryFilter]: selectedGenres, // Store the selected genres for the previous category
    }));

    // Restore the genres for the newly selected category (if any were previously selected)
    const restoredGenres = selectedGenresByCategory[category] || [];
    const restoredGenreNames = genres
      .filter((g) => restoredGenres.includes(g.genreID))
      .map((g) => g.genreName);

    setCategoryFilter(category);
    setSelectedGenres(restoredGenres);
    setFormData((prev) => ({ ...prev, category, genres: restoredGenreNames }));
  };

  const toggleGenre = (genreID) => {
    setSelectedGenres((prev) => {
      const newSelection = prev.includes(genreID)
        ? prev.filter((id) => id !== genreID)
        : [...prev, genreID];

      // Update formData with selected genres names
      const selectedGenreNames = genres
        .filter((genres) => newSelection.includes(genres.genreID))
        .map((genres) => genres.genreName);

      setFormData((prev) => ({ ...prev, genres: selectedGenreNames }));
      return newSelection;
    });
  };

  const handleReset = async () => {
    const params = new URLSearchParams(location.search);
    const initialFormData = {
      title: params.get("title") || "",
      author: params.get("author") || [],
      genres: params.get("genres") || [],
      category: params.get("category") || [],
      publisher: params.get("publisher") || "",
      synopsis: params.get("synopsis") || "",
      keywords: params.get("keywords") || [],
      pubDate: params.get("pubDate") || "",
      quantity: params.get("quantity") || 0,
      cover: params.get("cover") || "",
      location: params.get("location") || "",
      isbn: params.get("isbn") || "",
      price: params.get("price") || "",
      titleID: params.get("titleID") || null,
      titleCallNum: params.get("titleCallNum") || null,
    };

    console.log(initialFormData)

    setFormData(initialFormData);
    setCategoryFilter(initialFormData.category || null);
    setSelectedGenres(initialFormData.genres);
  }

  const handleSave = async () => {

    const requiredFields = [
      "title", "author", "publisher", "synopsis", "keywords",
      "pubDate", "location", "isbn",
      "price", "titleID", "titleCallNum", "category", "genres"
    ];

    const errors = {};
    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].length === 0) {
        errors[field] = true;
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast.error("Please fill in all required fields before saving.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      return;
    }

    console.log(formData)

    if (!formData || !formData.titleID) {
      console.error("Invalid form data or missing titleID");
      return;
    }

    const { titleID, genres: selectedGenreNames, ...rest } = formData;

    // Convert `keywords` into an array for JSONB storage
    const processKeywords = (keywords) => {
      if (!keywords) return [];
      return Array.isArray(keywords)
        ? keywords.map((k) => k.trim()).filter((k) => k !== "")
        : keywords.split(/[,;]+/).map((k) => k.trim()).filter((k) => k !== "");
    };

    // Convert array/string values properly (excluding category since it's derived from genres)
    const updateData = Object.fromEntries(
      Object.entries(rest)
        .filter(([key]) => key !== 'category')
        .map(([key, value]) => {
          if (key === "keywords") {
            return [key, processKeywords(value)]; // Store as JSONB array
          }
          if (key === "author") {
            return [key, processKeywords(value)]; // Store as JSONB array
          }
          return [key, value];
        })
    );

    //  Step 1: Fetch genreIDs for selected genreNames
    if (!selectedGenreNames || selectedGenreNames.length === 0) {
      console.error("No genres selected.");
      return;
    }

    const { data: genreData, error: genreError } = await supabase
      .from("genres")
      .select("genreID, genreName, category")
      .in("genreName", selectedGenreNames);

    if (genreError) {
      console.error("Error fetching genre IDs:", genreError);
      return;
    }

    // Extract genreIDs and determine new category
    const newGenreIDs = genreData.map((g) => g.genreID);
    const newCategory = genreData.length > 0 ? genreData[0].category : null;

    //  Step 2: Fetch current genres linked to the book
    const { data: currentGenres, error: currentGenresError } = await supabase
      .from("book_genre_link")
      .select("genreID")
      .eq("titleID", titleID);

    if (currentGenresError) {
      console.error("Error fetching current genres:", currentGenresError);
      return;
    }

    const currentGenreIDs = currentGenres.map((g) => g.genreID);

    //  Step 3: Check if category has changed
    let currentCategory = null;
    if (currentGenreIDs.length > 0) {
      const { data: currentGenreData, error: currentGenreError } = await supabase
        .from("genres")
        .select("category")
        .in("genreID", currentGenreIDs)
        .limit(1);

      if (currentGenreError) {
        console.error("Error fetching current category:", currentGenreError);
        return;
      }

      currentCategory = currentGenreData?.[0]?.category || null;
    }

    //  Step 4: Remove old genres if switching categories
    if (currentCategory && newCategory && currentCategory !== newCategory) {
      const { error: deleteError } = await supabase
        .from("book_genre_link")
        .delete()
        .eq("titleID", titleID);

      if (deleteError) {
        console.error("Error removing old genres:", deleteError);
        return;
      }
    }

    //  Step 5: Insert new genres only if they have changed
    const genreChanges = new Set([...currentGenreIDs, ...newGenreIDs]);

    if (genreChanges.size !== currentGenreIDs.length) {
      // Remove old genres before inserting new ones
      const { error: deleteOldGenresError } = await supabase
        .from("book_genre_link")
        .delete()
        .eq("titleID", titleID);

      if (deleteOldGenresError) {
        console.error("Error removing old genres:", deleteOldGenresError);
        return;
      }

      // Insert new genres
      if (newGenreIDs.length > 0) {
        const newGenreLinks = newGenreIDs.map((genreID) => ({
          titleID,
          genreID,
        }));

        const { error: insertGenresError } = await supabase
          .from("book_genre_link")
          .insert(newGenreLinks);

        if (insertGenresError) {
          console.error("Error inserting new genres:", insertGenresError);
          return;
        }
      }
    }


    console.log("updateData", updateData)

    //  Step 6: Update book details (EXCLUDING `category`)
    const { data: updateBook, error: updateError } = await supabase
      .from("book_titles")
      .update(updateData)
      .eq("titleID", titleID);

    if (updateError) {
      console.error("Error updating book:", updateError);
      return;
    }

    console.log("Book updated successfully:", updateBook);
    toast.success("Book updated successfully", {
      position: "bottom-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      className: "bg-green text-white",
    })


    //  Step 7: Trigger onSave callback if provided
    if (onSave) {
      await onSave(formData);
    }
    setTimeout(() => {
      navigate(-1);
    }, 1500);
  };


  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border border-grey rounded-lg p-4 w-full h-fit">
        <h2 className="text-2xl font-semibold mb-4">Book Modify</h2>
        <div className='flex'>
          {/* Left Side: Form Section */}
          <div className="w-2/3">
            <p className="text-gray-600 mb-8">
              Data points marked with an asterisk (*) are autofilled. Use a semicolon (;) or comma (,) to add multiple authors and keywords.
            </p>

            <h3 className="text-xl font-semibold my-2">Book Title Information</h3>

            {/* Form Section */}
            <form className="space-y-2">
              <div className="flex justify-between items-center" key="title">
                <label className="w-1/4">Title:</label>
                <input type="text" name="title" required
                  className="w-2/3 px-3 py-1 rounded-full border border-grey"
                  value={formData.title}
                  onChange={handleChange}
                  style={validationErrors.title ? errorStyle : {}}
                  placeholder="Full Book Title"
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Authors:</label>
                <input type="text" name="author" required
                  className="w-2/3 px-3 py-1 rounded-full border border-grey"
                  value={formData.author}
                  onChange={handleChange}
                  style={validationErrors.author ? errorStyle : {}}
                  placeholder="Author 1; Author 2; Author 3; ..."
                />
              </div>

              <div className="flex justify-between items-center">
                <label className="w-1/4">Category:</label>
                {/* Category selection buttons */}
                <div className="flex gap-4 w-2/3">
                  {["Fiction", "Non-fiction"].map((category) => (
                    <button
                      key={category}
                      onClick={(e) => {
                        e.preventDefault();
                        handleCategoryChange(category);
                      }}
                      className={`px-4 py-1 rounded-full w-full text-sm transition-colors ${categoryFilter === category ? "bg-arcadia-red border-arcadia-red border text-white"
                        : "border border-arcadia-red text-arcadia-red hover:bg-arcadia-red/5"
                        }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <label className="w-1/4">Genres:</label>

                {loading ? (
                  <p>Loading genres...</p>
                ) : (
                  <div className="flex flex-wrap gap-2 w-2/3">
                    {genres
                      .filter((genres) => genres.category === categoryFilter)
                      .map((genres) => (
                        <button
                          key={genres.genreID}
                          onClick={(e) => {
                            e.preventDefault();
                            toggleGenre(genres.genreID);
                          }}
                          className={`px-4 py-1 rounded-full text-sm transition-colors ${selectedGenres.includes(genres.genreID) ? "bg-arcadia-red border-arcadia-red border text-white"
                            : "border border-arcadia-red text-arcadia-red hover:bg-arcadia-red/5"
                            }`}
                        >
                          {genres.genreName}
                        </button>
                      ))}
                  </div>
                )}
                <input type="text" name="genres" required
                  className="input-field w-2/3 p-2 border hidden"
                  value={formData.genres}
                  onChange={handleChange}
                  style={validationErrors.genres ? errorStyle : {}}
                />
              </div>

              <div className="flex justify-between items-center">
                <label className="w-1/4">Publisher:</label>
                <input type="text" name="publisher" required
                  className="w-2/3 px-3 py-1 rounded-full border border-grey"
                  value={formData.publisher}
                  onChange={handleChange}
                  style={validationErrors.publisher ? errorStyle : {}}
                  placeholder="Publishing Company Name"
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Synopsis:</label>
                <textarea name="synopsis" required
                  className="w-2/3 px-3 py-1 rounded-2xl border border-grey min-h-24"
                  rows="3"
                  value={formData.synopsis}
                  onChange={handleChange}
                  style={validationErrors.synopsis ? errorStyle : {}}
                  placeholder="Book Synopsis"
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Keywords:</label>
                <input type="text" name="keywords"
                  className="w-2/3 px-3 py-1 rounded-full border border-grey"
                  value={formData.keywords}
                  onChange={handleChange}
                  placeholder="Keyword 1; Keyword 2; Keyword 3; ..."
                />
              </div>

              <div className="flex justify-between items-center">
                <label className="w-1/4">Year Published:</label>
                <input
                  type="number"
                  name="pubDate"
                  className="w-2/3 px-3 py-1 rounded-full border border-grey"
                  value={formData.pubDate}
                  onChange={handleChange}
                  max={currentYear}
                  placeholder="YYYY"
                />
              </div>

              <div className="flex justify-between items-center">
                <label className="w-1/4">Location:</label>
                <div className="select-dropdown-wrapper w-2/3">
                  <select
                    name="location"
                    required
                    className="w-full px-3 py-1 rounded-full border border-grey appearance-none"
                    value={formData.location}
                    onChange={handleChange}
                    style={validationErrors.location ? errorStyle : {}}
                  >
                    <option value="" disabled>Select Location</option>
                    <option value="2nd Floor, Circulation Section">2nd Floor, Circulation Section</option>
                    <option value="4th Floor, Circulation Section">4th Floor, Circulation Section</option>
                    <option value="4th Floor, Highschool and Multimedia Section">4th Floor, Highschool and Multimedia Section</option>
                  </select>
                </div>
              </div>

              <div className="justify-between items-center hidden">
                <label className="w-1/4">Title ID*:</label>
                <input type="text" name="titleID" required
                  className="w-2/3 px-3 py-1 rounded-full border border-grey"
                  value={formData.titleID}
                  onChange={handleChange}
                  style={validationErrors.titleID ? errorStyle : {}}
                  placeholder="Database ID"
                />
              </div>


              <div className="flex justify-between items-center">
                <label className="w-1/4">Call No.:</label>
                <input type="text" name="titleCallNum" required
                  className="w-2/3 px-3 py-1 rounded-full border border-grey"
                  value={formData.titleCallNum}
                  onChange={handleChange}
                  style={validationErrors.titleCallNum ? errorStyle : {}}
                  placeholder="Book Title Call Number"
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">ISBN:</label>
                <input type="text" name="isbn" required
                  className="w-2/3 px-3 py-1 rounded-full border border-grey"
                  value={formData.isbn}
                  onChange={handleChange}
                  style={validationErrors.isbn ? errorStyle : {}}
                  placeholder="ISBN Number"
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="w-1/4">Price:</label>
                <input type="number" name="price" required
                  className="w-2/3 px-3 py-1 rounded-full border border-grey"
                  value={formData.price}
                  onChange={handleChange}
                  style={validationErrors.price ? errorStyle : {}}
                  placeholder="Market Price"
                />
              </div>
            </form>

          </div>

          {/* Right Side: Book Cover Placeholder */}
          <div className="flex flex-col items-center px-2 w-1/3">
            <label className="text-md mb-2">Book Cover:</label>
            <div className="w-full h-fit flex justify-center">
              <div className="border border-grey p-4 w-fit rounded-lg  hover:bg-light-gray transition" onClick={handleDivClick}>
                <img
                  src={formData.cover || '/image/book_research_placeholder.png'}
                  alt="Book cover placeholder"
                  className="h-[375px] w-[225px] object-cover rounded-lg border border-grey"
                />
              </div>
            </div>
            <p className="text-sm text-gray-500 text-center m-2">Click to change book cover</p>

            <input type="file" ref={fileInputRef} required className="hidden" onChange={uploadCover} accept="image/png, image/jpeg, image/jpg" />
          </div>
        </div>
        <div className="flex justify-center mt-8 gap-2">
          <button
            className="add-book w-1/4 mb-2 px-4 py-2 rounded-lg bg-arcadia-red text-white hover:bg-red transition"
            onClick={() => setDeleteModalOpen(true)}
          >
            Delete Book
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="add-book w-1/4 mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
          >
            Reset Changes
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="add-book w-1/4 mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
          >
            Save Changes
          </button>
        </div>
        <WrngDeleteTitle
          isOpen={isDeleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteBook}
          itemName={formDataState.title}
        />
      </div>
    </div>
  );
};

export default BookModify;
