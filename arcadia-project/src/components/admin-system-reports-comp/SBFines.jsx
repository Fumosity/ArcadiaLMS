import { useState, useEffect, useCallback } from "react"
import { supabase } from "/src/supabaseClient.js"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { useNavigate } from "react-router-dom";

const SBFines = () => {
    const [damageFinesData, setDamageFinesData] = useState([]);

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
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
                    })

                    setDamageFinesData(formattedDamageData);

                }
            } catch (error) {
                console.error("Error: ", error);
            }
        };

        fetchData();
        setIsLoading(false);
    }, []);

    const handleUserClick = (user) => {
        navigate("/admin/useraccounts/viewusers", {
            state: { userId: user.user_id },
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="bg-white border border-grey p-4 rounded-lg w-full">
            <h3 className="text-2xl font-semibold">Outstanding Fines</h3>
            <div className="overflow-auto">
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
                    ) : damageFinesData.length > 0 ? (
                        damageFinesData.map((user, index) => (
                            <tr key={index} className="hover:bg-light-gray cursor-pointer">
                                <td className="w-2/3 px-4 py-2 text-sm text-left text-arcadia-red font-semibold">
                                    <button
                                        onClick={() => handleUserClick(user)}
                                        className="text-blue-500 hover:underline"
                                    >
                                        {user.user_name}
                                    </button>
                                </td>
                                <td className="w-1/3 px-4 py-2 text-center text-sm truncate">
                                    ₱{user.fine}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={2} className="py-4 text-center text-sm text-gray-500">
                                No recent reports found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            </div>
        </div>
    );
};

export default SBFines;
