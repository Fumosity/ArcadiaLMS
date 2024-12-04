import { supabase } from "../supabaseClient.js";

//Checks and adds a new entry or increments a current entry to the 'book_titles'
export const checkAndAddBookTitle = async (bookData) => {
    try {
        const { data, error } = await supabase.from('book_titles').select('titleID').eq('title', bookData.title).single();

        if (error) {
            if (error.code === "PGRST116") {
                const newTitleData = {
                    title: bookData.title,
                    author: Array.isArray(bookData.author) ? bookData.author : bookData.author.split(';'),
                    genre: Array.isArray(bookData.genre) ? bookData.genre : bookData.genre.split(';'),
                    category: Array.isArray(bookData.category) ? bookData.category : bookData.category.split(';'),
                    synopsis: bookData.synopsis,
                    keyword: Array.isArray(bookData.keyword) ? bookData.keyword : bookData.keyword.split(';'),
                    publisher: bookData.publisher,
                    currentPubDate: bookData.currentPubDate,
                    originalPubDate: bookData.originalPubDate,
                    procurementDate: bookData.procDate,
                    cover: bookData.cover,
                    ISBN: bookData.isbn,
                    location: bookData.location,
                    price: bookData.price,
                    titleARCID: bookData.titleARCID,
                };

                const { data: newTitle, error: insertError } = await supabase.from('book_titles').insert([newTitleData]).select('titleID').single();
                if (insertError) throw insertError;

                return newTitle.titleID;
            } else {
                throw error;
            }
        }

        if (error) throw error;

        return data.titleID;
    } catch (err) {
        console.error("Error in checkAndAddBookTitle:", err);
        return null;
    }
}

//Adds a new record to the book and book_update table
export const addBook = async (bookData) => {
    try {
        const titleID = await checkAndAddBookTitle(bookData);

        if (!titleID) { 
            console.error("Failed to retrieve the title ID for the book.");
            return false;
        }

        const specificBookData = {
            bookID: bookData.bookID,
            titleID: titleID,
            bookARCID: bookData.arcID,
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
            procDate: newProcDate,
        }));
    } catch (error) {
        console.error("Error generating procDate:", error);
    }
};