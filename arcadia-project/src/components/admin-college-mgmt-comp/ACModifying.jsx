import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { toast } from "react-toastify";

const ACModifying = ({ formData, setFormData, selectedCollege, refreshColleges, onReturn }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [departments, setDepartments] = useState([{ name: "", abbrev: "" }]);

    // Load existing data when the component mounts
    useEffect(() => {
        if (selectedCollege) {
            setFormData({
                collegeName: selectedCollege.collegeName || "",
                college: selectedCollege.college || "",
            });
            fetchDepartments(selectedCollege.collegeID);
        }
    }, [selectedCollege, setFormData]);

    // Fetch departments of the selected college
    const fetchDepartments = async (collegeID) => {
        try {
            const { data, error } = await supabase
                .from("department_list")
                .select("departmentName, departmentAbbrev")
                .eq("collegeID", collegeID);

            if (error) throw error;

            // Map fetched data to the expected format for the form
            const formattedDepartments = data.map((dept) => ({
                name: dept.departmentName,
                abbrev: dept.departmentAbbrev,
            }));

            setDepartments(formattedDepartments.length ? formattedDepartments : [{ name: "", abbrev: "" }]);
        } catch (error) {
            console.error("Error fetching departments:", error.message);
            setDepartments([{ name: "", abbrev: "" }]);  // Fallback to empty if error
        }
    };


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addDepartmentRow = () => {
        setDepartments([...departments, { name: "", abbrev: "" }]);
    };

    const removeDepartmentRow = (index) => {
        const newDepartments = departments.filter((_, i) => i !== index);
        setDepartments(newDepartments);
    };

    const handleDepartmentChange = (index, field, value) => {
        const newDepartments = [...departments];
        newDepartments[index][field] = value;
        setDepartments(newDepartments);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Update college info
            const { error: collegeError } = await supabase
                .from("college_list")
                .update({
                    collegeName: formData.collegeName,
                    college: formData.college,
                })
                .eq("collegeID", selectedCollege.collegeID);

            if (collegeError) throw collegeError;

            // Delete old departments
            await supabase
                .from("department_list")
                .delete()
                .eq("collegeID", selectedCollege.collegeID);

            // Insert updated departments
            const departmentData = departments
                .filter((dept) => dept.name.trim() && dept.abbrev.trim())
                .map((dept) => ({
                    collegeID: selectedCollege.collegeID,
                    departmentName: dept.name,
                    departmentAbbrev: dept.abbrev,
                }));

            if (departmentData.length) {
                const { error: deptError } = await supabase
                    .from("department_list")
                    .insert(departmentData);

                if (deptError) throw deptError;
            }

            toast.success("College and departments updated successfully!");
            refreshColleges();
        } catch (error) {
            console.error("Error updating college or departments:", error.message);
            toast.error("Failed to update college or departments.");
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
                <h2 className="text-2xl font-semibold mb-4">Modify College</h2>
                <form className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="w-1/3">College Name:</label>
                        <input
                            type="text"
                            name="collegeName"
                            className="w-2/3 px-3 py-1 rounded-full border border-grey"
                            value={formData.collegeName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <label className="w-1/3">College Abbreviation:</label>
                        <input
                            type="text"
                            name="college"
                            className="w-2/3 px-3 py-1 rounded-full border border-grey"
                            value={formData.college}
                            onChange={handleChange}
                        />
                    </div>

                    <h3 className="text-xl font-semibold mb-2">Departments</h3>
                    {departments.map((dept, index) => (
                        <div key={index} className="flex gap-2 mb-2 items-center">
                            <input
                                className="w-3/4 px-3 py-1 rounded-full border border-grey"
                                placeholder="Department Name"
                                value={dept.name}
                                onChange={(e) => handleDepartmentChange(index, "name", e.target.value)}
                            />
                            <input
                                className="w-1/4 px-3 py-1 rounded-full border border-grey"
                                placeholder="Abbreviation"
                                value={dept.abbrev}
                                onChange={(e) => handleDepartmentChange(index, "abbrev", e.target.value)}
                            />
                            <button
                                className="px-2 py-1 text-red-500"
                                onClick={() => removeDepartmentRow(index)}
                            >
                                X
                            </button>
                        </div>
                    ))}

                    <div className="flex justify-end">
                        <button
                            className="add-book w-1/4 mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
                            onClick={addDepartmentRow}
                            type="button"
                        >
                            Add Department
                        </button>
                    </div>

                    <div className="flex justify-center mt-4">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="add-book w-1/4 mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
                        >
                            {isSubmitting ? "Submitting..." : "Modify College"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ACModifying;
