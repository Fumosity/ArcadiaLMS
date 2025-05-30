import React, { useEffect, useState } from 'react';
import { supabase } from "../../supabaseClient.js";
import WrmgDeleteBookCopy from "../../z_modals/warning-modals/WrmgDeleteBookCopy.jsx";
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';

export default function ABCopiesMgmt({ formData, setFormData, originalFormData, setOriginalFormData, onRefresh, titleID, isAddMode }) {
    const [validationErrors, setValidationErrors] = useState({});
    const [statusColor, setStatusColor] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        if (formData?.bookStatus) {
            setStatusColor(statusColorMap[formData.bookStatus] || '');
        } else {
            setStatusColor('');
        }
    }, [formData?.bookStatus]);

    useEffect(() => {
        if (isAddMode) {
            setStatusColor('');
        }
    }, [isAddMode]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

        if (e.target.value) {
            setValidationErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: false }));
        }
    };

    const handleReset = async () => {
        if (!isAddMode && originalFormData) {
            setFormData(originalFormData);
            setStatusColor(statusColorMap[originalFormData.bookStatus] || '');
        } else {
            // Reset to default values for adding
            setFormData({
                bookStatus: '',
                bookBarcode: '',
                titleCallNum: '',
                bookLocation: '',
                bookAcqDate: '',
                bookID: null,
                notes: ''
            });
            setStatusColor('');
        }
    };

    const handleDeleteCopy = async () => {
        if (!formData || !formData.bookID) {
            console.error("No bookID found. Cannot delete.");
            return;
        }
        try {
            const { error } = await supabase
                .from('book_indiv')
                .delete()
                .eq('bookID', formData.bookID);

            if (error) {
                console.error("Error deleting book copy:", error);
            } else {
                console.log("Book copy deleted successfully");
                onRefresh();
                setFormData({}); // Instead of null, reset to an empty object
                setIsDeleteModalOpen(false);
            }
        } catch (error) {
            console.error("An unexpected error occurred:", error);
        }
    };

    const handleSubmit = async () => {

        const requiredFields = ["bookStatus", "bookBarcode", "bookAcqDate", "titleCallNum", "bookLocation"];
        let errors = {};

        requiredFields.forEach(field => {
            if (!formData[field]) {
                errors[field] = true;
            }
        });

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            console.error("Validation failed:", errors);
            toast.error("Please fill in all required fields before adding or saving.");
            return;
        }

        const { bookStatus, bookBarcode, bookAcqDate, notes } = formData;
        console.log("Are we in Add Mode?", isAddMode)
        try {
            if (!isAddMode && formData.bookID) {
                // Editing an existing copy
                const { error } = await supabase
                    .from('book_indiv')
                    .update({ bookStatus, bookBarcode, bookAcqDate, notes})
                    .eq('bookID', formData.bookID);

                if (error) {
                    console.error("Error updating book_indiv:", error);
                } else {
                    console.log("book_indiv updated successfully");
                    toast.success("Book updated successfully");
                    onRefresh();
                }
            } else {
                // Adding a new copy
                if (!titleID) {
                    console.error("titleID is missing for adding a new copy.");
                    return;
                }

                const { error } = await supabase
                    .from('book_indiv')
                    .insert({
                        bookStatus,
                        bookBarcode,
                        bookAcqDate,
                        notes,
                        titleID: titleID, // Add titleID here
                    });

                if (error) {
                    console.error("Error adding new book_indiv:", error);
                    toast.error("Error adding new book copy. Check for duplicates or refresh the page");
                } else {
                    console.log("New book_indiv added successfully");
                    toast.success("Book added successfully");
                    onRefresh();
                }
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    const handleStatusChange = (status) => {
        setFormData({ ...formData, bookStatus: status });
        setStatusColor(statusColorMap[status] || '');
    };

    const statusColorMap = {
        'Available': '#118B50',
        'Unavailable': '#FFB200',
        'Damaged': '#A31D1D',
        'Decommissioned': '#000000',

    };

    const errorStyle = {
        borderColor: 'red',
    };

    // Corrected conditional rendering
    if (formData.bookID === null && !isAddMode) {
        return (
            <div className="bg-white p-4 rounded-lg border-grey border w-1/2 flex justify-center items-center text-center">
                Select a copy on the left to view its details,<br /> or click on the button above to add a copy.
            </div>
        );
    }

    return (
        <div className="bg-white p-4 rounded-lg border-grey border h-fit w-1/2">
            <ToastContainer //this is for incomplete fields
                position="bottom-right"  
                autoClose={3000}
                hideProgressBar
                newestOnTop
                closeOnClick
                pauseOnHover
                draggable
            />

            <h3 className="text-2xl font-semibold mb-4">{isAddMode ? 'Add Copy' : 'Modify Copy'}</h3>
            <h3 className="text-xl font-semibold my-2">Copy Details</h3>
            <form className="space-y-2">
                <div className="flex justify-between items-center" key="bookStatus">
                    <label className="w-1/4">Status:</label>
                    <input
                        type="text"
                        name="bookStatus"
                        required
                        readOnly
                        className="w-2/3 px-3 py-1 rounded-full border border-grey text-center font-medium"
                        value={formData.bookStatus}
                        onChange={handleChange}
                        style={{
                            ...validationErrors.bookStatus ? errorStyle : {},
                            backgroundColor: statusColor,
                            color: formData.bookStatus === 'Available' || formData.bookStatus === 'Damaged' || formData.bookStatus === 'Decommissioned' ? 'white' : 'black',
                        }}
                        placeholder="Book Status"
                    />
                </div>
                <div className="flex justify-between items-center" key="bookBarcode">
                    <label className="w-1/4">Barcode:</label>
                    <input type="text" name="bookBarcode" required
                        className="w-2/3 px-3 py-1 rounded-full border border-grey"
                        value={formData.bookBarcode}
                        onChange={handleChange}
                        style={validationErrors.bookBarcode ? errorStyle : {}}
                        placeholder="Book Barcode"
                    />
                </div>
                <div className="flex justify-between items-center" key="bookCallNo">
                    <label className="w-1/4">Call Number*:</label>
                    <input type="text" name="bookCallNo" required readOnly
                        className="w-2/3 px-3 py-1 rounded-full border border-grey bg-light-gray text-dark-gray"
                        value={formData.titleCallNum}
                        onChange={handleChange}
                        style={validationErrors.titleCallNum ? errorStyle : {}}
                        placeholder="Book Call Number"
                    />
                </div>
                <div className="flex justify-between items-center" key="bookLocation">
                    <label className="w-1/4">Location*:</label>
                    <input type="text" name="bookLocation" required readOnly
                        className="w-2/3 px-3 py-1 rounded-full border border-grey bg-light-gray text-dark-gray"
                        value={formData.bookLocation}
                        onChange={handleChange}
                        style={validationErrors.bookLocation ? errorStyle : {}}
                        placeholder="Book Location"
                    />
                </div>
                <div className="flex justify-between items-center" key="bookAcqDate">
                    <label className="w-1/4">Acquisition Date:</label>
                    <input type="date" name="bookAcqDate" required
                        className="w-2/3 px-3 py-1 rounded-full border border-grey"
                        value={formData.bookAcqDate}
                        onChange={handleChange}
                        style={validationErrors.bookAcqDate ? errorStyle : {}}
                        placeholder="Book Acquisition Date"
                    />
                </div>
                <div className="flex justify-between items-center" key="notes">
                    <label className="w-1/4">Notes:</label>
                    <textarea name="notes" required
                        className="w-2/3 px-3 py-1 rounded-2xl border border-grey"
                        value={formData.notes}
                        onChange={handleChange}
                        style={validationErrors.notes ? errorStyle : {}}
                        placeholder="Enter notes here..."
                    />
                </div>
            </form>
            <h3 className="text-xl font-semibold my-2">{isAddMode ? 'Set Status' : 'Update Status'}</h3>
            <div className="flex-col justify-between w-full gap-2">
                <button
                    className="add-book w-full mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
                    onClick={() => handleStatusChange('Available')}
                >
                    Available
                </button>
                <button
                    className="add-book w-full mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
                    onClick={() => handleStatusChange('Unavailable')}
                >
                    Unavailable
                </button>
                <button
                    className="add-book w-full mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
                    onClick={() => handleStatusChange('Decommissioned')}
                >
                    Decommissioned
                </button>
            </div>
            <div className="flex justify-end w-full gap-2">
                {!isAddMode && (
                    <button
                        className="add-book w-full mb-2 px-4 py-2 rounded-lg bg-arcadia-red text-white hover:bg-red transition"
                        onClick={() => setIsDeleteModalOpen(true)}
                    >
                        Delete Copy
                    </button>
                )}
                <button
                    className="add-book w-full mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
                    onClick={() => handleReset()}
                >
                    {isAddMode ? 'Clear' : 'Reset'}
                </button>
                <button
                    className="add-book w-full mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
                    onClick={() => handleSubmit()}
                >
                    {isAddMode ? 'Add' : 'Save'}

                </button>
            </div>
            <WrmgDeleteBookCopy
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteCopy}
                itemName={formData.bookBarcode || "this book copy"}
            />
        </div>
    )
}