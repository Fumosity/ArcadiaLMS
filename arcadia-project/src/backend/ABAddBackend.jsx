import { supabase } from "../supabaseClient.js";

//Checks and adds a new entry to the 'book_titles' table and returns the ID for the 'book' table
export const checkAndAddBookTitle = async (title) => {
    const { data, error } = await supabase.from('book_titles').select('titleID, quantity').eq('title', title).single();

    if (error) {
        if (error.code === "PGRST116") {
            const { data: newTitle, error: insertError } = await supabase.from('book_titles').insert([{ title, quantity: 0 }]).select('titleID').single();

            if (insertError) {
                console.error("Error adding a new title: ", insertError);
                return null;
            }

            return newTitle.titleID;
        } else {
            console.error("Error fetching title: ", error);
            return null;
        }
    }

    return data.titleID;
}

//Adds a new record to the book and book_update table
export const addBook = async (bookData) => {
    try {
        const titleID = await checkAndAddBookTitle(bookData.title);

        if (!titleID) {
            console.error("Failed to retrieve the title ID for the book: ", error);
            return false;
        }

        const { data: bookInsertData, error: bookInsertError } = await supabase .from('book').insert([{ ...bookData, titleID: titleID, }]);
        
        if (bookInsertError) {
            console.error("Error adding book:", bookInsertError);
            return false;
        } 

        const { data: titleData, error: fetchQuantityError } = await supabase.from('book_titles').select('quantity').eq('titleID', titleID).single();

        if (fetchQuantityError) {
            console.error("Error fetching current quantity:", fetchQuantityError);
            return false;
        }

        const newQuantity = titleData.quantity + 1;
        const { error: updateError } = await supabase.from('book_titles') .update({ quantity: newQuantity }).eq('titleID', titleID);

        if (updateError) {
            console.error("Error updating book quantity in book_titles:", updateError);
            return false;
        }

        console.log("Book added and quantity updated successfully:", bookInsertData);
        return true;
    } catch (error) {
        console.error("Supabase Error: ", error);
        return false;
    }
};

//Gets ALL the data from the book table
export const fetchBooks = async () => {
    try {
        const { data, error } = await supabase.from('book').select('*');
        if (error) {
            console.error("Error fetching books: ", error);
        } else {
            return data;
        }
    } catch (error) {
        console.error("Supabase Error: ", error);
    }
};

//Checks for the current date and latest bookID number and generates new ones
export const newIDAndProcDateGenerator = async (formData, setFormData) => {
    const { data, error } = await supabase.from('book').select('bookID').order('bookID', { ascending: false }).limit(1);

    if (error) {
        console.error("Error retrieving book ID: ", error);
    } else if (data && data.length > 0) {
        const newID = data[0].bookID + 1;   
        const newProcDate = new Date().toISOString().split('T')[0];

        setFormData ({
            ...formData,
            bookID: newID,
            procDate: newProcDate,
        });
    } else {
        const newID = 1;   
        const newProcDate = new Date().toISOString().split('T')[0];

        setFormData ({
            ...formData,
            bookID: newID,
            procDate: newProcDate,
        });
    };
}
