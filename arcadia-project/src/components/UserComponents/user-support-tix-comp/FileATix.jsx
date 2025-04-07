import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom"
import { supabase } from "/src/supabaseClient.js";
import { toast } from "react-toastify";

const FileATix = () => {
    const [searchParams] = useSearchParams();
    const [type, setType] = useState("General Inquiry");
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
            toast.warn("Please fill out all fields.", {
                position: "bottom-right",
                autoClose: true,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
              })
            return;
        }

        if (!userID) {
            toast.warn("You need to log in first.",{
                position: "bottom-right",
                autoClose: true,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
        
              })
            return;
        }

        const date = new Date().toLocaleDateString();
        const time = new Date().toLocaleTimeString();

        const { error } = await supabase.from("support_ticket").insert([
            {
                userID,
                type,
                status: "Pending",
                date,
                time,
                subject,
                content,
            },
        ]);

        if (error) {
            console.error("Error submitting ticket:", error);
            toast.error("Failed to submit the ticket. Please try again.", {
                position: "bottom-right",
                autoClose: true,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
        
              });
        } else {
            toast.success("Ticket filed successfully!", {
              position: "bottom-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: false,

            });
          
            // Reset form fields
            setType("select-type");
            setSubject("");
            setContent("");
          
            // Navigate after toast
            setTimeout(() => {
              window.location.reload()
            }, 3000);
          }
    };

    // Define the placeholder based on the selected type
    const contentPlaceholder =
        type === "Room Reservation"
            ? `Enter Room Name Here:\nDate:\nSet Starting & End Time:\nReason for reserving the room:`
            : "Enter the content of your ticket.";

    return (
        <div className="uHero-cont max-w-[1200px] w-full p-6 bg-white rounded-lg border border-grey">
            <h3 className="text-2xl font-semibold mb-4">File A Ticket</h3>
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
                    <option value="Room Reservation" className="text-center">Room Reservation</option>
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
                placeholder={contentPlaceholder}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6} // Optional: makes it bigger if needed
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
