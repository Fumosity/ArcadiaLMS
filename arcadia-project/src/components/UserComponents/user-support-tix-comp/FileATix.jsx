import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "/src/supabaseClient.js";

const FileATix = () => {
    const [searchParams] = useSearchParams();
    const [type, setType] = useState("select-type");
    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");
    const [userID, setUserID] = useState(null);

    // Set default values from query parameters
    useEffect(() => {
        const defaultType = searchParams.get("type");
        const defaultSubject = searchParams.get("subject");
        if (defaultType) setType(defaultType);
        if (defaultSubject) setSubject(defaultSubject);
    }, [searchParams]);

    // Retrieve the user_ID from localStorage
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.userID) {
            setUserID(user.userID);
        }
    }, []);

    const handleSubmit = async () => {
        if (type === "select-type" || !subject || !content) {
            alert("Please fill out all fields.");
            return;
        }

        if (!userID) {
            alert("Unable to identify the user. Please log in again.");
            return;
        }

        const date = new Date().toLocaleDateString();
        const time = new Date().toLocaleTimeString();

        const { error } = await supabase.from("support_ticket").insert([
            {
                user_ID: userID,
                type,
                status: "Ongoing",
                date,
                time,
                subject,
                content,
            },
        ]);

        if (error) {
            console.error("Error submitting ticket:", error);
            alert("Failed to file the ticket. Please try again.");
        } else {
            alert("Ticket filed successfully!");
            setType("select-type");
            setSubject("");
            setContent("");
        }
    };

    return (
        <div className="uHero-cont p-6 bg-white rounded-lg border border-grey">
            <h3 className="text-lg font-semibold mb-4">File A Ticket</h3>
            <div className="flex items-center mb-4">
                <label className="text-sm mr-2 font-semibold">Type:</label>
                <select
                    className="w-[136px] px-2 py-1 border text-a-t-red border-a-t-red rounded-full text-center text-sm focus:outline-none focus:ring-0 appearance-none"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                >
                    <option value="select-type" className="text-center text-grey">
                        Select Type
                    </option>
                    <option value="Account" className="text-center">Account</option>
                    <option value="Book" className="text-center">Book</option>
                    <option value="Research" className="text-center">Research</option>
                </select>

                <label className="text-sm ml-4 mr-2 font-semibold">Subject:</label>
                <input
                    type="text"
                    className="flex-1 px-2 py-1 border border-grey rounded-full text-sm"
                    placeholder="Enter the subject of the ticket here."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                />
            </div>
            <label className="text-sm text-left mb-4 mr-2 font-semibold">Content:</label>
            <textarea
                className="w-full px-3 py-2 border border-grey rounded-2xl text-sm mt-2 mb-4"
                placeholder="Enter the content of your ticket."
                value={content}
                onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <div className="flex justify-center">
                <button
                    className="px-4 py-1 text-sm bg-arcadia-red text-white rounded-full font-medium hover:bg-red"
                    onClick={handleSubmit}
                >
                    File Ticket
                </button>
            </div>
        </div>
    );
};

export default FileATix;
