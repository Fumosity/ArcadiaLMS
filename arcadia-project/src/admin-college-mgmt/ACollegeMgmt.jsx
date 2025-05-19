import React, { useEffect, useState } from "react";
import Title from "../components/main-comp/Title";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import CollegeList from "./CollegeList";
import CollegeView from "../components/admin-college-mgmt-comp/CollegeView";
import ACAdding from "../components/admin-college-mgmt-comp/ACAdding";
import ACModifying from "../components/admin-college-mgmt-comp/ACModifying";
import { supabase } from "../supabaseClient";

export default function ACollegeMgmt() {
    useEffect(() => {
        document.title = "Arcadia | College Management";
    }, []);
    const navigate = useNavigate(); // Initialize useNavigate
    const [selectedCollege, setSelectedCollege] = useState(null); // State to hold the selected book details
    const [isAddingCollege, setIsAddingCollege] = useState(false)
    const [isModifyingCollege, setIsModifyingCollege] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        abbreviation: '',
    })
    const [colleges, setColleges] = useState([]);

    // Fetch colleges
    const fetchColleges = async () => {
        try {
            const { data: collegeData, error: collegeError } = await supabase
                .from("college_list")
                .select("*")
                .order("collegeAbbrev", { ascending: true });

            if (collegeError) throw collegeError;
            setColleges(collegeData);
        } catch (error) {
            console.error("Error fetching colleges:", error.message);
        }
    };

    useEffect(() => {
        fetchColleges();
    }, []);

    const handleCollegeSelect = (college) => {
        setIsAddingCollege(false);
        setSelectedCollege(college);
    };

    const handleModifyCollege = (college) => {
        setSelectedCollege(college);
        setIsModifyingCollege(true);
        setIsAddingCollege(false);
    };

    const handleCollegeDeleted = (college) => {
        if (college === null) {
            // College deleted, clear selection and refresh list
            setSelectedCollege(null);
            fetchColleges();
            setIsAddingCollege(false);
            setIsModifyingCollege(false);
        } else {
            // If needed, handle other logic (like for modify)
            setSelectedCollege(college);
        }
    };


    return (
        <div className="bg-white">
            <Title>College Management</Title>
            <div className="flex justify-center items-start space-x-2 pb-12 pt-8 px-12 min-h-[85vh]">
                <div className="flex-shrink-0 w-2/4">
                    <div className="flex justify-between w-full gap-2 h-fit">
                        <button
                            className="add-book w-full mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
                            onClick={() => navigate('/admin/useraccounts')}
                        >
                            Return to User Accounts
                        </button>
                        <button
                            className="add-book w-full mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
                            onClick={() => { setIsAddingCollege(true), setIsModifyingCollege(false) }}
                        >
                            Add a College
                        </button>
                    </div>
                    <div className="flex justify-between w-full gap-2 h-full">
                        <CollegeList
                            colleges={colleges}
                            onCollegeSelect={handleCollegeSelect}
                            fetchColleges={fetchColleges}
                        />
                    </div>
                </div>
                <div className="flex flex-col items-start flex-shrink-0 w-2/4">
                    <div className="w-full">
                        {isAddingCollege ? (
                            <ACAdding
                                formData={formData}
                                setFormData={setFormData}
                                refreshColleges={fetchColleges}
                                isModifying={isModifyingCollege}
                            />
                        ) : isModifyingCollege ? (
                            <ACModifying
                                formData={formData}
                                setFormData={setFormData}
                                selectedCollege={selectedCollege}  // Corrected the variable name
                                refreshColleges={fetchColleges}
                                onReturn={() => setIsModifyingCollege(false)}  // Properly set the state to false
                            />
                        ) : (
                            <CollegeView
                                college={selectedCollege}
                                onCollegeDeleted={handleCollegeDeleted}  // for deletions
                                onModifyCollege={handleModifyCollege}   // for modifications
                            />
                        )}

                    </div>
                </div>
            </div>
        </div>
    );

}