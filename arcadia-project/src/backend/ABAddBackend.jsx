import { supabase } from "../supabaseClient.js";

//Checks and adds a new entry or increments a current entry to the 'book_titles'
export const checkAndAddBookTitle = async (bookData) => {
    try {
        const { data, error } = await supabase.from('book_titles').select('titleID').eq('title', bookData.title).single();

        if (data) return data.titleID;

        const newTitleData = {
            title: bookData.title,
            author: Array.isArray(bookData.author) ? bookData.author : bookData.author.split(/[;,]/).map(item => item.trim()).filter(item => item !== ""),
            synopsis: bookData.synopsis,
            keywords: Array.isArray(bookData.keywords) ? bookData.keywords : bookData.keywords.split(/[;,]/).map(item => item.trim()).filter(item => item !== ""),
            publisher: bookData.publisher,
            currentPubDate: bookData.currentPubDate,
            originalPubDate: bookData.originalPubDate,
            procurementDate: bookData.procurementDate,
            cover: bookData.cover,
            isbn: bookData.isbn,
            location: bookData.location,
            price: bookData.price,
            arcID: bookData.titleARCID,
        };

        const { data: newTitle, error: insertError } = await supabase.from('book_titles').insert([newTitleData]).select('titleID').single();
        if (insertError) throw insertError;

        const newTitleID = newTitle.titleID;
        console.log("New titleID:", newTitleID);

        console.log(bookData.genres)

        // Fetch genre IDs from Supabase based on selected genre names
        const { data: genreData, error: genreFetchError } = await supabase
            .from("genres")
            .select("genreID, genreName")
            .in("genreName", bookData.genres); // bookData.genre contains ["Horror", "Mystery"]

        if (genreFetchError) {
            console.error("Error fetching genre IDs:", genreFetchError);
            alert("Failed to fetch genres. Please try again.");
        } else {
            console.log("Fetched genre data:", genreData);

            if (genreData.length > 0) {
                // Map fetched genre IDs for insertion
                const genreLinks = genreData.map((genres) => ({
                    titleID: newTitleID,
                    genreID: genres.genreID,
                }));

                // Insert the genre-title links
                const { error: genreInsertError } = await supabase
                    .from("book_genre_link")
                    .insert(genreLinks);

                if (genreInsertError) {
                    console.error("Error inserting book genres:", genreInsertError);
                    alert("Failed to save genres. Please try again.");
                } else {
                    console.log("Book genres added successfully!");
                }
            }
        }


        return newTitle.titleID;
    } catch (err) {
        console.error("Error in checkAndAddBookTitle:", err);
        return null;
    }
}

//Adds a new record to the book and book_update table
export const addBook = async (bookData) => {
    try {
        console.log("bookData", bookData)
        const titleID = await checkAndAddBookTitle(bookData);

        if (!titleID) {
            console.error("Failed to retrieve the title ID for the book.");
            return false;
        }

        const specificBookData = {
            bookID: bookData.bookID,
            titleID: titleID,
            bookARCID: bookData.bookARCID,
            bookStatus: "Available",
            bookAcqDate: bookData.procurementDate,
            bookBarcode: bookData.bookBarcode,
        };

        // Insert into 'book' table
        const { error: bookInsertError } = await supabase.from('book_indiv').insert([specificBookData]);

        if (bookInsertError) {
            console.error("Error adding book to 'book' table:", bookInsertError);
            return false;
        }

        console.log("Book added successfully.");
        return true;
    } catch (error) {
        console.error("Error in addBook:", error);
        return false;
    }
};

//Gets ALL the data from the book table
export const fetchBooks = async () => {
    try {
        const { data, error } = await supabase.from('book_indiv').select('*');
        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Supabase Error: ", error);
    }
};

export const generateNewBookID = async (setFormData) => {
    try {
        const { data, error } = await supabase
            .from('book_indiv')
            .select('bookID')
            .order('bookID', { ascending: false })
            .limit(1);

        if (error) throw error;

        const newID = (data && data.length > 0) ? data[0].bookID + 1 : 1;

        setFormData((prevData) => ({
            ...prevData,
            bookID: newID,
        }));
    } catch (error) {
        console.error("Error generating new bookID:", error);
    }
};

export const generateProcDate = (setFormData) => {
    try {
        const newProcDate = new Date().toISOString().split('T')[0];

        setFormData((prevData) => ({
            ...prevData,
            procurementDate: newProcDate,
        }));
    } catch (error) {
        console.error("Error generating procDate:", error);
    }
};