import { supabase } from "../supabaseClient.js";

export const addResearch = async (formData) => {
    try {
        const { data, error } = await supabase.from('research').insert([
            { 
                ...formData, 
            }
        ]);

        if (error) {
            console.error("Error adding research: ", error);
            return false;
        } else {
            console.log("Research added successfully: ", data);
            return true;
        }
    } catch (error) {
        console.error("Supabase error: ", error);
    }
};

export const newThesisIDGenerator = async (formData, setFormData) => {
    const { data, error } = await supabase.from('research').select('thesisID').order('thesisID', { ascending: false }).limit(1);

    if (error) {
        console.error("Error retrieving thesis ID: ", error);
    } else if (data && data.length > 0) {
        const newID = data[0].thesisID + 1;

        setFormData ({
            ...formData,
            thesisID: newID,
        });
    } else {
        const newID = 1;

        setFormData ({
            ...formData,
            thesisID: newID,
        });
    };
}