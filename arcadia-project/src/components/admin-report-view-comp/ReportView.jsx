import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { supabase } from "/src/supabaseClient.js";

const ReportView = () => {
  const { state } = useLocation();
  const ticket = state?.ticket;
  const [isLoading, setIsLoading] = useState(true);
  const [reply, setReply] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  const updateStatus = async (newStatus) => {
    if (!ticket) return;
  
    // Capitalize only the first letter and make the rest lowercase
    const formattedStatus = newStatus.charAt(0).toUpperCase() + newStatus.slice(1).toLowerCase();
  
    const { data, error } = await supabase
      .from('support_ticket')
      .update({ status: formattedStatus })  // Use formattedStatus here
      .eq('ticket_id', ticket.ticket_id);  // Match the ticket by its unique ID
  
    if (error) {
      console.error("Error updating status:", error);
    } else {
      console.log("Status updated:", data);
      alert(`Status updated to ${formattedStatus}`);
    }
  };
  

  const reportFields = [
    { label: 'User ID*:', value: ticket?.user_id || 'Not Available' },
    { label: 'School ID No.*:', value: ticket?.school_id || 'Not Available' },
    { label: 'Name*:', value: ticket?.name || 'Not Available' },
    { label: 'College*:', value: ticket?.college || 'Not Available' },
    { label: 'Department*:', value: ticket?.department || 'Not Available' },
    { label: 'Date and time of report:', value: ticket?.date || 'Not Available' },
  ];

  const responseFields = [
    { label: 'Type:', value: ticket?.type || 'Not Available' },
    { label: 'Subject:', value: ticket?.subject || 'Not Available' },
  ];

  const buttons = [
    { label: 'Mark as Resolved', status: 'Resolved' },
    { label: 'Mark as Ongoing', status: 'Ongoing' },
    { label: 'Mark as Intended', status: 'Intended' },
  ];

  return (
    <section>
      <h2 className="px-2.5 text-zinc-900 w-full">Report Details</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-2.5 w-full text-base text-black">
        <div className="space-y-2">
          {reportFields.map((field, index) => (
            <div key={index} className="flex justify-between w-full">
              <label className="text-sm">{field.label}</label>
              <div className="px-2 py-1 border border-grey rounded-md text-sm w-[60%] text-zinc-700">
                {isLoading ? (
                  <Skeleton width="100%" height={15} />
                ) : (
                  field.value
                )}
              </div>
            </div>
          ))}
          <p className="mt-2 text-xs text-gray-500">*Autofilled data</p>
        </div>

        <div className="space-y-2">
          {responseFields.map((field, index) => (
            <div key={index} className="flex justify-between w-full">
              <label className="text-sm">{field.label}</label>
              <div className="px-2 py-1 border border-grey rounded-md text-sm w-[60%] text-zinc-700">
                {isLoading ? (
                  <Skeleton width="100%" height={10} />
                ) : (
                  field.value
                )}
              </div>
            </div>
          ))}
          <label className="mt-4 text-sm">Content:</label>
          <div className="p-2 border border-grey rounded-md text-sm text-dark-grey min-h-[100px] mt-2">
            {isLoading ? <Skeleton count={3} height={20} /> : (ticket?.content || 'No content available')}
          </div>
        </div>
      </div>

      <h2 className="px-2.5 mt-4 w-full">Response</h2>

      <div className="flex flex-wrap lg:flex-nowrap gap-4 p-1 w-full text-base">
        <div className="flex flex-col items-center justify-center lg:w-1/2 space-y-4">
          {buttons.map((button, index) => (
            <button
              key={index}
              className="px-1 py-1 border rounded-full w-[200px]"
              onClick={() => updateStatus(button.status)}
            >
              {button.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col w-full lg:w-1/2">
          <label className="text-black">Reply:</label>
          <textarea
            className="p-2 mt-2 w-full rounded-md border border-zinc-300 text-sm min-h-[100px]"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Enter your reply here..."
          />
        </div>
      </div>
    </section>
  );
};

export default ReportView;
