import React, { useEffect, useState } from 'react';
import { supabase } from "/src/supabaseClient.js";
import { useNavigate, Link } from "react-router-dom";

function OutstandingFines({ onDataExport }) {
    const [bkHistoryData, setBkhistoryData] = useState([]);
    const [damageFinesData, setDamageFinesData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const today = new Date();
                const { data, error } = await supabase
                    .from('book_transactions')
                    .select(`
                        transactionID, 
                        transactionType,
                        userID, 
                        bookBarcode, 
                        book_indiv (
                            bookBarcode,
                            bookStatus,
                            book_titles (
                                titleID,
                                title,
                                price
                            )
                        ),
                        checkoutDate, 
                        checkoutTime, 
                        deadline, 
                        user_accounts(
                            userFName, 
                            userLName, 
                            userLPUID)
                        `)
                    .not('deadline', 'is.null')
                    .lt('deadline', today.toISOString().split('T')[0])
                    .neq('transactionType', 'Returned');

                if (error) {
                    console.error("Error fetching data: ", error.message);
                } else {
                    const groupedData = data.reduce((acc, item) => {
                        const userId = item.userID;
                        const deadline = item.deadline;
                        const checkout_date = item.checkoutDate
                        const checkout_time = item.checkoutTime
                        // Calculate overdue days excluding Sundays for each book
                        let overdue_days = 0;

                        for (let d = new Date(deadline); d < today; d.setDate(d.getDate() + 1)) {
                            if (d.getDay() !== 0) {
                                overdue_days++;
                            }
                        }

                        const fine_amount = overdue_days * 10;

                        let bookDetails = item.book_indiv

                        if (!acc[userId]) {
                            acc[userId] = {
                                user_id: userId,
                                user_name: `${item.user_accounts.userFName} ${item.user_accounts.userLName}`,
                                school_id: item.user_accounts.userLPUID,
                                book_title: bookDetails.book_titles.title,
                                book_title_id: bookDetails.book_titles.titleID,
                                book_barcode: item.bookBarcode,
                                days_overdue: 0,
                                deadline,
                                checkout_date,
                                checkout_time,
                                fine_amount,
                                overdue_days
                            };
                        }

                        return acc;
                    }, {});

                    const formattedData = Object.values(groupedData);

                    setBkhistoryData(formattedData);
                    console.log("bkHistoryData", formattedData);
                }

                // Fetch fines due to damages
                const { data: damageData, error: damageError } = await supabase
                    .from('book_transactions')
                    .select(`
    transactionID,
    userID,
    bookBarcode,
    book_indiv!inner (
        bookBarcode,
        bookStatus,
        book_titles (
            titleID,
            title,
            price
        )
    ),
    user_accounts (
        userFName,
        userLName,
        userLPUID
    )
`)
                    .eq('book_indiv.bookStatus', 'Damaged') // Get only damaged book transactions
                    .order('transactionID', { ascending: false }); // Get latest transactions first

                if (damageError) {
                    console.error("Error fetching latest damaged book transactions:", damageError.message);
                } else {
                    // Use JavaScript to filter only the most recent damaged transaction per bookBarcode
                    const latestDamageData = Object.values(
                        damageData.reduce((acc, item) => {
                            if (!acc[item.bookBarcode]) {
                                acc[item.bookBarcode] = item; // Store only the latest transaction per bookBarcode
                            }
                            return acc;
                        }, {})
                    );

                    const formattedDamageData = latestDamageData.map(item => {
                        const bookDetails = item.book_indiv?.book_titles || {};
                        return {
                            transaction_id: item.transactionID,
                            user_id: item.userID,
                            book_barcode: item.book_indiv.bookBarcode,
                            book_title: bookDetails.title,
                            book_title_id: bookDetails.titleID,
                            fine: bookDetails.price || 0,
                            user_name: `${item.user_accounts.userFName} ${item.user_accounts.userLName}`,
                            school_id: item.user_accounts.userLPUID,
                        };
                    });

                    setDamageFinesData(formattedDamageData);
                    console.log("Latest damage transactions per book:", formattedDamageData);
                }

            } catch (error) {
                console.error("Error: ", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (bkHistoryData.length > 0 || damageFinesData.length > 0) {
            console.log("onDataExport", bkHistoryData, damageFinesData);
            onDataExport({ bkhistoryData: bkHistoryData, damageFinesData });
        }
    }, [bkHistoryData, damageFinesData]);

    const [outstandingSortOrder, setOutstandingSortOrder] = useState('Descending');
    const [outstandingSortBy, setOutstandingSortBy] = useState('total_fine');
    const [outstandingPage, setOutstandingPage] = useState(1);

    const outstandingEntriesPerPage = 10;
    const outstandingSortedData = [...bkHistoryData].sort((a, b) => {
        if (outstandingSortOrder === 'Descending') {
            return b[outstandingSortBy] > a[outstandingSortBy] ? 1 : -1;
        } else {
            return a[outstandingSortBy] > b[outstandingSortBy] ? 1 : -1;
        }
    });

    const outstandingStartIndex = (outstandingPage - 1) * outstandingEntriesPerPage;
    const outstandingDisplayedData = outstandingSortedData.slice(outstandingStartIndex, outstandingStartIndex + outstandingEntriesPerPage);

    const [damagedSortOrder, setDamagedSortOrder] = useState('Descending');
    const [damagedSortBy, setDamagedSortBy] = useState('fine');
    const [damagedPage, setDamagedPage] = useState(1);

    const damagedEntriesPerPage = 10;
    const damagedSortedData = [...damageFinesData].sort((a, b) => {
        if (damagedSortOrder === 'Descending') {
            return b[damagedSortBy] > a[damagedSortBy] ? 1 : -1;
        } else {
            return a[damagedSortBy] > b[damagedSortBy] ? 1 : -1;
        }
    });

    const damagedStartIndex = (damagedPage - 1) * damagedEntriesPerPage;
    const damagedDisplayedData = damagedSortedData.slice(damagedStartIndex, damagedStartIndex + damagedEntriesPerPage);

    const handleUserClick = (record) => {
        navigate("/admin/useraccounts/viewusers", {
            state: { userId: record.user_id },
        });
    };

    const truncateTitle = (title, maxLength = 25) => {
        return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
    };

    const formatSchoolNo = (value) => {
        // Remove non-numeric characters
        let numericValue = value.replace(/\D/g, "");

        // Apply the XXXX-X-XXXXX format
        if (numericValue.length > 4) {
            numericValue = `${numericValue.slice(0, 4)}-${numericValue.slice(4)}`;
        }
        if (numericValue.length > 6) {
            numericValue = `${numericValue.slice(0, 6)}-${numericValue.slice(6, 11)}`;
        }
        return numericValue;
    };

    return (
        <div className="bg-white p-4 rounded-lg border-grey border">
            <h3 className="text-2xl font-semibold mb-4">Accounts with Outstanding Fines</h3>
            <p className="text-sm text-gray-600 mb-4">
                Note: Additional fines are added per school day. Fines are not added when the ARC is closed.
            </p>

            <div className="flex justify-between align-middle items-center mb-4">
                <h3 className="text-xl font-semibold">Overdue Books</h3>
                <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">Sort By:</span>
                    <button
                        className="px-3 py-1 bg-gray-200 border border-gray-300 rounded-md text-sm w-32"
                        onClick={() =>
                            setOutstandingSortOrder(outstandingSortOrder === 'Descending' ? 'Ascending' : 'Descending')
                        }
                    >
                        {outstandingSortOrder}
                    </button>
                    <span className="font-medium text-sm">Filter:</span>
                    <select
                        className="text-sm px-3 py-1 bg-gray-200 border border-gray-300 rounded-md w-44 "
                        value={outstandingSortBy}
                        onChange={(e) => setOutstandingSortBy(e.target.value)}
                    >
                        <option value="fine_amount">Total Fine</option>
                        <option value="overdue_days">Days Overdue</option>
                        <option value="user_name">Name</option>
                    </select>
                </div>

            </div>
            <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead>
                    <tr>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Fine</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">No. of Days Overdue</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Book Title</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Book Barcode</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">School ID</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {outstandingDisplayedData.length > 0 ? (
                        outstandingDisplayedData.map((record, index) => (
                            <tr key={index} className="whitespace-nowrap hover:bg-light-gray cursor-pointer">
                                <td className="px-4 py-2 text-center">₱{record.fine_amount}</td>
                                <td className="px-4 py-2 text-center">{record.overdue_days} days</td>
                                <td className="px-4 py-2 text-center text-arcadia-red font-semibold">
                                    <Link
                                        to={`/admin/abviewer?titleID=${encodeURIComponent(record.book_title_id)}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        {truncateTitle(record.book_title)}
                                    </Link>
                                </td>
                                <td className="px-4 py-2 text-center">{record.book_barcode}</td>
                                <td className="px-4 py-2 text-center text-arcadia-red font-semibold">
                                    <button
                                        onClick={() => handleUserClick(record)}
                                        className="text-blue-500 hover:underline"
                                    >
                                        {record.user_name}
                                    </button>
                                </td>
                                <td className="px-4 py-2 text-center">{formatSchoolNo(record.school_id)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="px-4 py-2 text-center">
                                No data available.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {/* Pagination */}
            <div className="flex justify-center items-center mt-6 space-x-4">
                <button
                    className={`uPage-btn ${outstandingPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => setOutstandingPage((prev) => Math.max(prev - 1, 1))}
                    disabled={outstandingPage === 1}
                >
                    Previous Page
                </button>
                <span className="text-xs">
                    Page {outstandingPage} of {Math.ceil(bkHistoryData.length / outstandingEntriesPerPage)}
                </span>
                <button
                    className={`uPage-btn ${outstandingPage === Math.ceil(bkHistoryData.length / outstandingEntriesPerPage) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => setOutstandingPage((prev) => Math.min(prev + 1, Math.ceil(bkHistoryData.length / outstandingEntriesPerPage)))}
                    disabled={outstandingPage === Math.ceil(bkHistoryData.length / outstandingEntriesPerPage)}
                >
                    Next Page
                </button>
            </div>


            {/* Fines Due to Damages Table */}
            <div className="flex justify-between align-middle items-center mb-4 mt-4">
                <h3 className="text-xl font-semibold">Fines Due To Damages</h3>
                <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">Sort By:</span>
                    <button
                        className="px-3 py-1 bg-gray-200 border border-gray-300 rounded-md text-sm w-32"
                        onClick={() =>
                            setDamagedSortOrder(damagedSortOrder === 'Descending' ? 'Ascending' : 'Descending')
                        }
                    >
                        {damagedSortOrder}
                    </button>
                    <span className="font-medium text-sm">Filter:</span>
                    <select
                        className="text-sm px-3 py-1 bg-gray-200 border border-gray-300 rounded-md w-44 "
                        value={damagedSortBy}
                        onChange={(e) => setDamagedSortBy(e.target.value)}
                    >
                        <option value="fine">Fine</option>
                        <option value="user_name">Name</option>
                    </select>
                </div>

            </div>
            <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead>
                    <tr>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Fine</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Barcode</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Book Title</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">School ID</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {damagedDisplayedData.length > 0 ? (
                        damagedDisplayedData.map((record, index) => (
                            <tr key={index} className="whitespace-nowrap hover:bg-light-gray cursor-pointer">
                                <td className="px-4 py-2 text-center">₱{record.fine.toFixed(2)}</td>
                                <td className="px-4 py-2 text-center text-arcadia-red font-semibold">
                                    <Link
                                        to={`/admin/abviewer?titleID=${encodeURIComponent(record.book_title_id)}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        {truncateTitle(record.book_title)}
                                    </Link>
                                </td>
                                <td className="px-4 py-2 text-center">{record.book_barcode}</td>
                                <td className="px-4 py-2 text-center text-arcadia-red font-semibold">
                                    <button
                                        onClick={() => handleUserClick(record)}
                                        className="text-blue-500 hover:underline"
                                    >
                                        {record.user_name}
                                    </button>
                                </td>
                                <td className="px-4 py-2 text-center">{formatSchoolNo(record.school_id)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="px-4 py-2 text-center">
                                No data available.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {/* Pagination */}
            <div className="flex justify-center items-center mt-6 space-x-4">
                <button
                    className={`uPage-btn ${damagedPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => setDamagedPage((prev) => Math.max(prev - 1, 1))}
                    disabled={damagedPage === 1}
                >
                    Previous Page
                </button>
                <span className="text-xs">
                    Page {damagedPage} of {Math.ceil(damageFinesData.length / damagedEntriesPerPage)}
                </span>
                <button
                    className={`uPage-btn ${damagedPage === Math.ceil(damageFinesData.length / damagedEntriesPerPage) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => setDamagedPage((prev) => Math.min(prev + 1, Math.ceil(damageFinesData.length / damagedEntriesPerPage)))}
                    disabled={damagedPage === Math.ceil(damageFinesData.length / damagedEntriesPerPage)}
                >
                    Next Page
                </button>
            </div>

        </div>
    );
}

export default OutstandingFines;
