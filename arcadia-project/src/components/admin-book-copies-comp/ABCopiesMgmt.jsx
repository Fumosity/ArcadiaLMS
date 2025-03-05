import React, { useEffect, useState } from 'react';
import { supabase } from "../../supabaseClient.js";

export default function ABCopiesMgmt({ formData, setFormData }) {
    const [validationErrors, setValidationErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

        if (e.target.value) {
            setValidationErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: false }));
        }
    };

    //Handles the submission to the database
    const handleSubmit = async () => {
        console.log("formData before validation:", formData);

        if (!formData || typeof formData !== 'object') {
            console.error("formData is not defined or not an object.");
            return;
        }

        const newValidationErrors = {};

        Object.keys(formData).forEach((field) => {
            const value = formData[field];

            if (!value || (Array.isArray(value) && value.length === 0)) {
                newValidationErrors[field] = true;
            }
        });

        if (!formData.cover) {
            newValidationErrors.cover = true;
        }

        if (Object.keys(newValidationErrors).length > 0) {
            setValidationErrors(newValidationErrors);  // This ensures re-render with red borders
            console.log("something is wrong here at", newValidationErrors)
            return;
        }

        setValidationErrors({});
        setIsSubmitting(true);

        console.log("pre addBook")
        await addBook(formData)
        setFormData({
            bookStatus: '',
            bookBarcode: '',
            bookCallNo: '',
            bookLocation: '',
            bookAcqDate: '',
        });
        console.log("post addBook")

        setCover('');
        setFormData((prevData) => ({ ...prevData, cover: '' }));

        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }

        console.log(formData);
        generateNewBookID(setFormData);
        generateProcDate(setFormData);

        setIsSubmitting(false);
    };

    return (
        <div className="bg-white p-4 rounded-lg border-grey border h-fit w-1/2">
            <h3 className="text-2xl font-semibold mb-4">Overview</h3>

            <h3 className="text-xl font-semibold my-2">Copy Details</h3>
            <form className="space-y-2">
                <div className="flex justify-between items-center" key="bookStatus">
                    <label className="w-1/4">Status:</label>
                    <input type="text" name="bookStatus" required readOnly
                        className="w-2/3 px-3 py-1 rounded-full border border-grey"
                        value={formData.bookStatus}
                        onChange={handleChange}
                        style={validationErrors.bookStatus ? errorStyle : {}}
                        placeholder="Book Status"
                    />
                </div>
                <div className="flex justify-between items-center" key="bookBarcode">
                    <label className="w-1/4">Barcode:</label>
                    <input type="text" name="bookBarcode" required
                        className="w-2/3 px-3 py-1 rounded-full border border-grey"
                        value={formData.bookStatus}
                        onChange={handleChange}
                        style={validationErrors.bookBarcode ? errorStyle : {}}
                        placeholder="Book Barcode"
                    />
                </div>
                <div className="flex justify-between items-center" key="bookCallNo">
                    <label className="w-1/4">Call Number*:</label>
                    <input type="text" name="bookCallNo" required
                        className="w-2/3 px-3 py-1 rounded-full border border-grey bg-light-gray text-grey"
                        value={formData.bookStatus}
                        onChange={handleChange}
                        style={validationErrors.bookCallNo ? errorStyle : {}}
                        placeholder="Book Call Number"
                    />
                </div>
                <div className="flex justify-between items-center" key="bookLocation">
                    <label className="w-1/4">Location*:</label>
                    <input type="text" name="bookLocation" required readOnly
                        className="w-2/3 px-3 py-1 rounded-full border border-grey bg-light-gray text-grey"
                        value={formData.bookStatus}
                        onChange={handleChange}
                        style={validationErrors.bookLocation ? errorStyle : {}}
                        placeholder="Book Location"
                    />
                </div>
                <div className="flex justify-between items-center" key="bookAcqDate">
                    <label className="w-1/4">Acquisition Date:</label>
                    <input type="date" name="bookAcqDate" required
                        className="w-2/3 px-3 py-1 rounded-full border border-grey"
                        value={formData.bookStatus}
                        onChange={handleChange}
                        style={validationErrors.bookAcqDate ? errorStyle : {}}
                        placeholder="Book Acquisition Date"
                    />
                </div>
            </form>
            <h3 className="text-xl font-semibold my-2">Update Status</h3>
            <div className="flex-col justify-between w-full gap-2">
                <button
                    className="add-book w-full mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
                    onClick={console.log("foo")}
                >
                    Available
                </button>
                <button
                    className="add-book w-full mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
                    onClick={console.log("foo")}
                >
                    Unavailable
                </button>
                <button
                    className="add-book w-full mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
                    onClick={console.log("foo")}
                >
                    Damaged
                </button>
            </div>
            <div className="flex justify-between w-full gap-2">
                <button
                    className="add-book w-1/4 mb-2 px-4 py-2 rounded-lg border-grey hover:text-white hover:bg-arcadia-red transition"
                    onClick={console.log("foo")}
                >
                    Delete Copy
                </button>
                <div className="flex justify-between w-1/2 gap-2">
                    <button
                        className="add-book w-1/2 mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
                        onClick={console.log("foo")}
                    >
                        Reset
                    </button>
                    <button
                        className="add-book w-1/2 mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
                        onClick={console.log("foo")}
                    >
                        Save
                    </button>
                </div>

            </div>
        </div>
    )
}