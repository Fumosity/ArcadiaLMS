import React, { useState, useEffect } from "react";
import { supabase } from "/src/supabaseClient.js";
import { Link } from "react-router-dom";  // Import Link for navigation
import Skeleton from 'react-loading-skeleton';  // Import Skeleton loader
import 'react-loading-skeleton/dist/skeleton.css';  // Import skeleton styles

const Button = ({ children, onClick, className }) => (
    <button
        onClick={onClick}
        className={`bg-gray-200 py-1 px-3 rounded-full text-xs hover:bg-gray-300 ${className}`}
        style={{ borderRadius: "40px" }}
    >
        {children}
    </button>
);

const TableRow = ({ type, status, subject, date, time, ticketID, ticketDetails }) => {
    const backgroundColor =
        type === "Book" ? "rounded-full" :
        type === "Research" ? "rounded-full" :
        type === "Account" ? "rounded-full" : "";

    // Set the border color for the status
    const statusColor = status === "Resolved"
        ? "bg-green"
        : status === "Ongoing"
        ? "bg-yellow"
        : status === "Intended"
        ? "bg-red"
        : "bg-grey"; 

    return (
        <Link 
            to="/admin/reportticket" 
            state={{ ticket: ticketDetails }}  // Passing ticket details via state
            className="w-full grid grid-cols-7 gap-4 items-center text-center text-sm text-gray-900 mb-2 cursor-pointer hover:bg-gray-100"
        >
            <div className={`${backgroundColor} text-gray-800 py-1 px-3`}>{type || "Not Available"}</div>
            {/* Add border and color for status */}
            <div className={`py-1 px-3 rounded-full ${statusColor}`}>
                {status || "Not Available"}
            </div>
            <div className="truncate max-w-xs">{subject || "Not Available"}</div>
            <div>{date || "Not Available"}</div>
            <div>{time || "Not Available"}</div>
            <div>{ticketID || "Not Available"}</div>
        </Link>
    );
};

const SupportTicket = () => {
    const [tickets, setTickets] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);  // Loading state to control skeleton display

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                // Simulating a delay of 1.5s
                setTimeout(async () => {
                    const { data, error } = await supabase
                        .from('support_ticket')
                        .select('ticket_id, type, status, subject, date, time, content');

                    if (error) {
                        throw error;
                    }

                    setTickets(data);
                    setIsLoading(false);  // Set loading to false after data is fetched
                }, 1500);
            } catch (error) {
                console.error("Error fetching tickets:", error.message);
                setIsLoading(false);  // Set loading to false if error occurs
            }
        };

        fetchTickets();
    }, []);

    const filteredTickets = tickets.filter(ticket =>
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.ticket_id.toString().includes(searchTerm)
    );

    return (
        <>
            <div className="w-full flex justify-between items-center mb-4">
                <h2 className="text-zinc-900 text-xl font-semibold">Support Tickets</h2>
            </div>

            <div className="flex flex-wrap justify-between items-center mb-6 space-x-4">
                <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">Sort By:</span>
                    <Button>Descending</Button>
                    <span className="font-medium text-sm">Filter By:</span>
                    <Button>Type</Button>
                    <Button>College</Button>
                    <Button>Department</Button>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">Search:</span>
                    <input
                        type="text"
                        placeholder="Search by subject or ticket ID"
                        className="border border-gray-300 rounded-md py-1 px-2 text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="w-full grid grid-cols-7 gap-4 text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                <div>Type</div>
                <div>Status</div>
                <div>Subject</div>
                <div>Date</div>
                <div>Time</div>
                <div>TicketID</div>
            </div>
            <div className="w-full border-t border-grey mb-2"></div>

            {isLoading ? (
                // Display skeleton loaders while fetching data
                <div className="space-y-4">
                    {[...Array(5)].map((_, index) => (
                        <div key={index} className="w-full grid grid-cols-7 gap-4 text-center text-sm mb-2">
                            <Skeleton count={1} height={20} />
                            <Skeleton count={1} height={20} />
                            <Skeleton count={1} height={20} />
                            <Skeleton count={1} height={20} />
                            <Skeleton count={1} height={20} />
                            <Skeleton count={1} height={20} />
                        </div>
                    ))}
                </div>
            ) : filteredTickets.length > 0 ? (
                filteredTickets.map(ticket => (
                    <React.Fragment key={ticket.ticket_id}>
                        <TableRow
                            type={ticket.type}
                            status={ticket.status}
                            subject={ticket.subject}
                            date={ticket.date}
                            time={ticket.time}
                            ticketID={ticket.ticket_id}
                            ticketDetails={ticket}  // Passing full ticket details to TableRow
                        />
                        <div className="w-full border-t border-grey mb-2"></div>
                    </React.Fragment>
                ))
            ) : (
                <div className="text-center text-gray-500">No tickets found</div>
            )}
        </>
    );
};

export default SupportTicket;
