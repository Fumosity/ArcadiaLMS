import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { toast } from "react-toastify";

const ACModifying = ({ formData, setFormData, selectedSection, refreshSections, onReturn }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load existing data when the component mounts
    useEffect(() => {
        if (selectedSection) {
            setFormData({
                sectionStandard: selectedSection.standard || "",
                sectionClass: selectedSection.class || "",
                sectionClassDesc: selectedSection.classDesc || "",
                sectionSubclass: selectedSection.subclass || "",
                sectionSubclassDesc: selectedSection.subclassDesc || "",
            });
        }
    }, [selectedSection, setFormData]);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Update section info
            const { error: sectionError } = await supabase
                .from("library_sections")
                .update({
                    standard: formData.sectionStandard || "",
                    class: formData.sectionClass || "",
                    classDesc: formData.sectionClassDesc || "",
                    subclass: formData.sectionSubclass || "",
                    subclassDesc: formData.sectionSubclassDesc || "",
                })
                .eq("sectionID", selectedSection.sectionID);

            if (sectionError) throw sectionError;

            toast.success("Section updated successfully!");
            refreshSections();
        } catch (error) {
            console.error("Error updating section:", error.message);
            toast.error("Failed to update section.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="flex justify-center gap-2 w-1/2">
                <button
                    className="add-book w-full mb-2 px-2 py-2 rounded-lg border-grey hover:bg-arcadia-red hover:text-white"
                    onClick={onReturn}
                >
                    Return
                </button>
            </div>
            <div className="bg-white border border-grey rounded-lg p-4 w-full h-fit">
                <h2 className="text-2xl font-semibold mb-4">Modify Section</h2>
                <form className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="w-1/3">Standard:</label>
                        <select
                            type="text"
                            name="sectionStandard"
                            className="w-2/3 px-3 py-1 rounded-full border border-grey"
                            value={formData?.sectionStandard || ""}
                            onChange={handleChange}
                        >
                            <option value={"LOC"}>LOC</option>
                            <option value={"DDC"}>DDC</option>
                        </select>
                    </div>

                    <div className="flex justify-between items-center">
                        <label className="w-1/3">Class:</label>
                        <input
                            type="text"
                            name="sectionClass"
                            className="w-2/3 px-3 py-1 rounded-full border border-grey"
                            value={formData?.sectionClass || ""}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <label className="w-1/3">Class Description:</label>
                        <textarea
                            type="text"
                            name="sectionClassDesc"
                            className="w-2/3 px-3 py-1 rounded-2xl border border-grey"
                            value={formData?.sectionClassDesc || ""}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <label className="w-1/3">Subclass:</label>
                        <input
                            type="text"
                            name="sectionSubclass"
                            className="w-2/3 px-3 py-1 rounded-full border border-grey"
                            value={formData?.sectionSubclass || ""}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <label className="w-1/3">Subclass Description:</label>
                        <textarea
                            type="text"
                            name="sectionSubclassDesc"
                            className="w-2/3 px-3 py-1 rounded-2xl border border-grey"
                            value={formData?.sectionSubclassDesc || ""}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex justify-center mt-4">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="add-book w-1/4 mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
                        >
                            {isSubmitting ? "Submitting..." : "Modify Section"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ACModifying;
