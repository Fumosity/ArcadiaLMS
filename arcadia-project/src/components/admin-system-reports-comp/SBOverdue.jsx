import { useState, useEffect, useCallback } from "react"
import { supabase } from "/src/supabaseClient.js"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { useNavigate } from "react-router-dom";

const SBOverdue = () => {
    const [bkHistoryData, setBkhistoryData] = useState([]);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const today = new Date();
                const { data, error } = await supabase
                    .from('book_transactions')
                    .select('transactionID, userID, bookBarcode, checkoutDate, checkoutTime, deadline, user_accounts(userFName, userLName, userLPUID)')
                    .not('deadline', 'is.null')
                    .lt('deadline', today.toISOString().split('T')[0]);

                if (error) {
                    console.error("Error fetching data: ", error.message);
                } else {
                    const groupedData = data.reduce((acc, item) => {
                        const userId = item.userID;
                        const deadline = item.deadline;
                        const checkout_date = item.checkoutDate
                        const checkout_time = item.checkoutTime
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
                                deadline,
                                checkout_date,
                                checkout_time
                            };
                        }

                        acc[userId].books_borrowed += 1;
                        acc[userId].total_fine += totalFineForBook;
                        acc[userId].incurred_per_day += penaltyPerDay;

                        return acc;
                    }, {});

                    const formattedData = Object.values(groupedData);

                    setBkhistoryData(formattedData);
                    console.log("bkHistoryData", formattedData);
                }
            } catch (error) {
                console.error("Error: ", error);
            }
        };

        fetchData();
        setIsLoading(false);
    }, []);

    const handleUserClick = (record) => {
        navigate("/admin/useraccounts/viewusers", {
            state: { userId: record.user_id },
        });
    };

    return (
        <div className="bg-white border border-grey p-4 rounded-lg w-full">
            <h3 className="text-2xl font-semibold">Overdue Borrowers</h3>
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <th className="w-2/3 px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Borrower</th>
                        <th className="w-1/3 px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total Fine</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                        [...Array(5)].map((_, index) => (
                            <tr key={index} className="hover:bg-light-gray cursor-pointer">
                                <td className="w-2/3 px-4 py-2 text-center text-sm truncate">
                                    <Skeleton />
                                </td>
                                <td className="w-1/3 px-4 py-2 text-center text-sm truncate">
                                    <Skeleton />
                                </td>
                            </tr>
                        ))
                    ) : bkHistoryData.length > 0 ? (
                        bkHistoryData.map((user, index) => (
                            <tr key={index} className="hover:bg-light-gray cursor-pointer">
                                <td className="w-2/3 px-4 py-2 text-center text-arcadia-red font-semibold">
                                    <button
                                        onClick={() => handleUserClick(record)}
                                        className="text-blue-500 hover:underline"
                                    >
                                        {user.user_name}
                                    </button>
                                </td>
                                <td className="w-1/3 px-4 py-2 text-center text-sm truncate">
                                    {user.total_fine}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3} className="py-4 text-center text-sm text-gray-500">
                                No recent reports found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default SBOverdue;
