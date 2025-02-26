import { supabase } from "../supabaseClient.js";

//Checks and adds a new entry or increments a current entry to the 'book_titles'
export const checkAndAddGenre = async (genreData) => {
    try {
        const { data, error } = await supabase.from('genres').select('genreID').eq('genre', genreData.title).single();

        if (data) return data.genreID;

        const newGenreData = {
            genreName: genreData.genre,
            category: genreData.category,
            img: genreData.img,
            description: genreData.description,
        };

        const { data: newGenre, error: insertError } = await supabase.from('genres').insert([newGenreData]).select('genreID').single();
        if (insertError) throw insertError;

        const newGenreID = newGenre.genreID;
        console.log("New genreID:", newGenreID);

        console.log(genreData.genre)

        return newGenre.genreID;
    } catch (err) {
        console.error("Error in checkAndAddGenreTitle:", err);
        return null;
    }
}

//Adds a new record to the genre and book_update table
export const addGenre = async (genreData) => {
    try {
        console.log("genreData", genreData)
        const genreID = await checkAndAddGenre(genreData);

        if (!genreID) {
            console.error("Failed to retrieve the genre ID for the genre.");
            return false;
        }

        console.log("Genre added successfully.");
        return true;
    } catch (error) {
        console.error("Error in addGenre:", error);
        return false;
    }
};

//Gets ALL the data from the genre table
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