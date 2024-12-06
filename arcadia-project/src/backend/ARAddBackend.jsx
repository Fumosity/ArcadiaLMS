import { supabase } from "../supabaseClient.js";

//Adds a new record to the research table
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

//Checks the latest researchID number and generates new ones
export const newThesisIDGenerator = async (formData, setFormData) => {
    const { data, error } = await supabase.from('research').select('researchID').order('researchID', { ascending: false }).limit(1);

    if (error) {
        console.error("Error retrieving thesis ID: ", error);
    } else if (data && data.length > 0) {
        const newID = data[0].researchID + 1;

        setFormData ({
            ...formData,
            researchID: newID,
        });
    } else {
        const newID = 1;

        setFormData ({
            ...formData,
            researchID: newID,
        });
    };
}