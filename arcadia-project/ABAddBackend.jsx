import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_ANON_KEY);

//Adds a new record to the book table
export const addBook = async (bookData) => {
    try {
        const { data, error } = await supabase 
            .from('book')
            .insert([
                {
                    ...bookData,
                }
            ]);
        
        if (error) {
            console.error("Error adding book:", error);
            return false;
        } else {
            console.log("Book added successfully: ", data);
            return true;
        }
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

export const newIDAndProcDateGenerator = async (formData, setFormData) =>{
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
            id: newID,
            procDate: newProcDate,
        });
    };
}