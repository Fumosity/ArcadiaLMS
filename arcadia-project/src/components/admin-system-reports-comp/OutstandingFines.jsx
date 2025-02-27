import React, { useEffect, useState } from 'react';
import { supabase } from "/src/supabaseClient.js";
import { useNavigate, Link } from "react-router-dom";

function OutstandingFines() {
    const [bkhistoryData, setBkhistoryData] = useState([]);
    const [damageFinesData, setDamageFinesData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const today = new Date();
                const { data, error } = await supabase
                    .from('book_transactions')
                    .select('transactionID, userID, bookID, deadline, user_accounts(userFName, userLName, userLPUID)')
                    .not('deadline', 'is.null')
                    .lt('deadline', today.toISOString().split('T')[0]);

                if (error) {
                    console.error("Error fetching data: ", error.message);
                } else {
                    const groupedData = data.reduce((acc, item) => {
                        const userId = item.userID;
                        const deadline = new Date(item.deadline);

                        // Calculate overdue days excluding Sundays for each book
                        let overdueDays = 0;
                        for (let d = new Date(deadline); d < today; d.setDate(d.getDate() + 1)) {
                            if (d.getDay() !== 0) {
                                overdueDays++;
                            }
                        }

                        const penaltyPerDay = 10;
                        const totalFineForBook = overdueDays * penaltyPerDay;

                        if (!acc[userId]) {
                            acc[userId] = {
                                user_id: userId,
                                user_name: `${item.user_accounts.userFName} ${item.user_accounts.userLName}`,
                                school_id: item.user_accounts.userLPUID,
                                books_borrowed: 0,
                                total_fine: 0,
                                incurred_per_day: 0,
                            };
                        }

                        acc[userId].books_borrowed += 1;
                        acc[userId].total_fine += totalFineForBook;
                        acc[userId].incurred_per_day += penaltyPerDay;

                        return acc;
                    }, {});

                    const formattedData = Object.values(groupedData);

                    setBkhistoryData(formattedData);
                    console.log(formattedData);
                }

                // Fetch fines due to damages
                const { data: damageData, error: damageError } = await supabase
                    .from('book_transactions')
                    .select(`
                        transactionID,
                        userID,
                        bookID,
                        book_indiv (
                            bookID,
                            bookARCID,
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
                if (damageError) {
                    console.error("Error fetching damage fines data: ", damageError.message);
                } else {
                    const filteredDamageData = damageData.filter(item => item.book_indiv?.bookStatus === 'Damaged');
                    setDamageFinesData(filteredDamageData.map(item => {
                        const bookDetails = item.book_indiv?.book_titles || {};
                        const fineAmount = bookDetails.price || 0;
                        return {
                            transaction_id: item.transactionID,
                            user_id: item.userID,
                            book_id: item.book_indiv.bookARCID,
                            book_title: bookDetails.title,
                            book_title_id: bookDetails.titleID,
                            fine: fineAmount,
                            user_name: `${item.user_accounts.userFName} ${item.user_accounts.userLName}`,
                            school_id: item.user_accounts.userLPUID,
                        };
                    }));

                    console.log(filteredDamageData);
                }
            } catch (error) {
                console.error("Error: ", error);
            }
        };

        fetchData();
    }, []);

    const [outstandingSortOrder, setOutstandingSortOrder] = useState('Descending');
    const [outstandingSortBy, setOutstandingSortBy] = useState('total_fine');
    const [outstandingPage, setOutstandingPage] = useState(1);

    const outstandingEntriesPerPage = 10;
    const outstandingSortedData = [...bkhistoryData].sort((a, b) => {
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

    return (
        <div className="aMain-cont">
            <h2 className="text-xl font-semibold mb-4">Accounts With Outstanding Fines</h2>
            <p className="text-sm text-gray-600 mb-4">
                Note: Additional fines are added per school day. Fines are not added when the ARC is closed.
            </p>

            {/* overdue table */}
            <div className="flex justify-between align-middle items-center mb-4">
                <h3 className="text-xl font-semibold">Overdue Books</h3>
                <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">Sort By:</span>
                    <button
                        className="px-3 py-1 bg-gray-200 border border-gray-300 rounded-md text-sm"
                        onClick={() =>
                            setOutstandingSortOrder(outstandingSortOrder === 'Descending' ? 'Ascending' : 'Descending')
                        }
                    >
                        {outstandingSortOrder}
                    </button>
                    <span className="font-medium text-sm">Filter:</span>
                    <select
                        className="text-sm px-3 py-1 bg-gray-200 border border-gray-300 rounded-md "
                        value={outstandingSortBy}
                        onChange={(e) => setOutstandingSortBy(e.target.value)}
                    >
                        <option value="total_fine">Total Fine</option>
                        <option value="user_id">User ID</option>
                    </select>
                </div>

            </div>
            <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead>
                    <tr>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Total Fine</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Incurred per Day</th>

                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Books Borrowed</th>


                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">User ID</th>

                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">School ID</th>


                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {outstandingDisplayedData.length > 0 ? (
                        outstandingDisplayedData.map((record, index) => (
                            <tr key={index} className="whitespace-nowrap">
                                <td className="px-4 py-2 text-center">₱{record.total_fine.toFixed(2)}</td>
                                <td className="px-4 py-2 text-center">₱{record.incurred_per_day.toFixed(2)}/day</td>
                                <td className="px-4 py-2 text-center">{record.books_borrowed}</td>
                                <td className="px-4 py-2 text-center text-arcadia-red font-semibold">
                                    <button
                                        onClick={() => handleUserClick(record)}
                                        className="text-blue-500 hover:underline"
                                    >
                                        {record.user_name}
                                    </button>
                                </td>
                                <td className="px-4 py-2 text-center">{record.user_id}</td>
                                <td className="px-4 py-2 text-center">{record.school_id}</td>
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
                    Page {outstandingPage} of {Math.ceil(bkhistoryData.length / outstandingEntriesPerPage)}
                </span>
                <button
                    className={`uPage-btn ${outstandingPage === Math.ceil(bkhistoryData.length / outstandingEntriesPerPage) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => setOutstandingPage((prev) => Math.min(prev + 1, Math.ceil(bkhistoryData.length / outstandingEntriesPerPage)))}
                    disabled={outstandingPage === Math.ceil(bkhistoryData.length / outstandingEntriesPerPage)}
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
                        className="px-3 py-1 bg-gray-200 border border-gray-300 rounded-md text-sm"
                        onClick={() =>
                            setDamagedSortOrder(damagedSortOrder === 'Descending' ? 'Ascending' : 'Descending')
                        }
                    >
                        {damagedSortOrder}
                    </button>
                    <span className="font-medium text-sm">Filter:</span>
                    <select
                        className="text-sm px-3 py-1 bg-gray-200 border border-gray-300 rounded-md "
                        value={damagedSortBy}
                        onChange={(e) => setDamagedSortBy(e.target.value)}
                    >
                        <option value="fine">Fine</option>
                        <option value="user_id">User ID</option>
                    </select>
                </div>

            </div>
            <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead>
                    <tr>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Fine</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Book ARC ID</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Book Title</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">User ID</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">School ID</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {damagedDisplayedData.length > 0 ? (
                        damagedDisplayedData.map((record, index) => (
                            <tr key={index} className="whitespace-nowrap">
                                <td className="px-4 py-2 text-center">₱{record.fine.toFixed(2)}</td>
                                <td className="px-4 py-2 text-center">{record.book_id}</td>
                                <td className="px-4 py-2 text-center text-arcadia-red font-semibold">
                                    <Link
                                        to={`/admin/abviewer?titleID=${encodeURIComponent(record.book_title_id)}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        {truncateTitle(record.book_title)}
                                    </Link>
                                </td>
                                <td className="px-4 py-2 text-center text-arcadia-red font-semibold">
                                    <button
                                        onClick={() => handleUserClick(record)}
                                        className="text-blue-500 hover:underline"
                                    >
                                        {record.user_name}
                                    </button>
                                </td>
                                <td className="px-4 py-2 text-center">{record.user_id}</td>
                                <td className="px-4 py-2 text-center">{record.school_id}</td>
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
