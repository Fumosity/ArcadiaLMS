import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const CheckingContainer = () => {
  const [checkMode, setCheckMode] = useState('Check Out');
  const [isSubmitting, setIsSubmitting] = useState(false); // State for loading indicator
  const [emptyFields, setEmptyFields] = useState({}); // Track empty fields

  // Function to get the PC's current local time
  const getLocalTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5); // Returns in "HH:MM" format
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Manila' };
    return new Date(date).toLocaleDateString('en-PH', options);
  };

  // Function to calculate deadline 3 days ahead of the given date
  const calculateDeadline = (selectedDate) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 3); // Add 3 days
    return formatDate(date); // Return formatted date
  };

  const [formData, setFormData] = useState({
    userID: '',
    bookID: '',
    schoolNo: '',
    bookTitle: '',
    name: '',
    date: '', // Store date in YYYY-MM-DD format
    college: '',
    time: getLocalTime(), // Set the initial value to the PC's local time
    department: '',
    deadline: '', // Initialize deadline as empty
  });

  useEffect(() => {
    if (checkMode === 'Check In') {
      setFormData((prev) => ({
        ...prev,
        time: getLocalTime(),
        deadline: '', // Clear deadline when "Check In" is selected
      }));
    }
  }, [checkMode]);

  useEffect(() => {
    if (formData.userID) {
      const fetchUserData = async () => {
        try {
          const { data, error } = await supabase
            .from('user_accounts')
            .select('userLPUID, userFName, userLName, userCollege, userDepartment')
            .eq('userID', formData.userID)
            .single();

          if (error || !data) {
            setFormData((prev) => ({
              ...prev,
              schoolNo: '',
              name: '',
              college: '',
              department: '',
            }));
          } else {
            setFormData((prev) => ({
              ...prev,
              schoolNo: data.userLPUID,
              name: `${data.userFName} ${data.userLName}`,
              college: data.userCollege,
              department: data.userDepartment,
            }));
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUserData();
    } else {
      setFormData((prev) => ({
        ...prev,
        schoolNo: '',
        name: '',
        college: '',
        department: '',
      }));
    }
  }, [formData.userID]);

  useEffect(() => {
    if (formData.bookID) {
      const fetchBookData = async () => {
        try {
          const { data, error } = await supabase
            .from('book')
            .select('title')
            .eq('bookID', formData.bookID)
            .single();

          if (error || !data) {
            setFormData((prev) => ({
              ...prev,
              bookTitle: '',
            }));
          } else {
            setFormData((prev) => ({
              ...prev,
              bookTitle: data.title,
            }));
          }
        } catch (error) {
          console.error('Error fetching book data:', error);
        }
      };

      fetchBookData();
    } else {
      setFormData((prev) => ({
        ...prev,
        bookTitle: '',
      }));
    }
  }, [formData.bookID]);

  const handleCheckChange = (e) => {
    setCheckMode(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      let updatedFormData = { ...prev, [name]: value };

      if (name === 'date') {
        updatedFormData.deadline = calculateDeadline(value); // Calculate and set the deadline
      }

      return updatedFormData;
    });
  };

  const handleSubmit = async () => {
    // Check if all required fields are filled
    const requiredFields = [
      'userID', 'bookID', 'date', 'time', 'schoolNo', 'name', 'college', 'department', 'bookTitle'
    ];

    let emptyFields = {};
    for (let field of requiredFields) {
      if (!formData[field]) {
        emptyFields[field] = true; // Mark field as empty
      }
    }

    if (Object.keys(emptyFields).length > 0) {
      setEmptyFields(emptyFields); // Set empty fields state
      alert('Please fill in all required fields.');
      return; // Prevent form submission if any required field is empty
    }

    setIsSubmitting(true); // Set submitting state to true when form is being submitted
    setEmptyFields({}); // Reset empty fields before submission

    try {
      const { userID, schoolNo, name, college, department, bookID, bookTitle, date, time, deadline } = formData;
      const currentTime = getLocalTime();

      const transactionType = checkMode === 'Check Out' ? 'Borrowed' : 'Returned';

      // Check if there's an existing transaction with the same userID, bookID, and bookTitle
      const { data: existingTransaction, error: fetchError } = await supabase
        .from('book_transactions')
        .select('transaction_type')
        .eq('book_id', bookID)
        .eq('user_id', userID)
        .eq('book_title', bookTitle)
        .order('checkout_date', { ascending: false })
        .limit(1)
        .single();

      if (fetchError) {
        console.error('Error fetching existing transaction:', fetchError);
      }

      // If a matching transaction exists and is 'Borrowed', update it to 'Returned' and remove the deadline
      if (existingTransaction && existingTransaction.transaction_type === 'Borrowed' && checkMode === 'Check In') {
        const { error: updateError } = await supabase
          .from('book_transactions')
          .update({
            transaction_type: 'Returned',
            checkin_date: date,
            checkin_time: time,
            deadline: null, // Remove the deadline when returning the book
          })
          .eq('book_id', bookID)
          .eq('user_id', userID)
          .eq('book_title', bookTitle)
          .eq('transaction_type', 'Borrowed');

        if (updateError) {
          console.error('Error updating transaction:', updateError);
          alert('Error updating the transaction. Please try again.');
          return;
        } else {
          alert('Transaction updated to "Returned" successfully!');
        }
      } else {
        // Insert a new transaction for Check Out or Check In
        const transactionData = {
          user_id: userID,
          school_id: schoolNo,
          name: name,
          college: college,
          department: department,
          book_id: bookID,
          book_title: bookTitle,
          checkout_date: checkMode === 'Check Out' ? date : null,
          checkout_time: checkMode === 'Check Out' ? time : null,
          checkin_date: checkMode === 'Check In' ? date : null,
          checkin_time: checkMode === 'Check In' ? time : null,
          ...(checkMode === 'Check Out' && { deadline }),
          book_cover: '/path-to-book-cover.jpg',
          transaction_type: transactionType,
        };

        const { data, error } = await supabase.from('book_transactions').insert([transactionData]);

        if (error) {
          console.error('Error inserting transaction:', error);
          alert('Error submitting the form. Please try again.');
        } else {
          console.log('Transaction successful:', data);
          alert('Transaction completed successfully!');
        }
      }
    } catch (error) {
      console.error('Error processing transaction:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false); // Set submitting state back to false when done
    }
  };



  return (
    <div className="max-w-6xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-lg font-bold mb-3">Checking</h2>

      <div className="flex items-center mb-3">
        <label className="mr-2">
          <input
            type="radio"
            name="check"
            value="Check In"
            className="mr-1"
            checked={checkMode === 'Check In'}
            onChange={handleCheckChange}
          /> Check In
        </label>
        <label className="mr-2">
          <input
            type="radio"
            name="check"
            value="Check Out"
            className="mr-1"
            checked={checkMode === 'Check Out'}
            onChange={handleCheckChange}
          /> Check Out
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        {Object.entries(formData).map(([key, value]) => {
          let label = key.replace(/([A-Z])/g, ' $1');
          let inputType = 'text';

          if (key === 'userID') label = 'User ID';
          if (key === 'bookID') label = 'Book ID*';
          if (key === 'bookTitle') label = 'Book Title*';

          if (key === 'date') {
            label = checkMode === 'Check In' ? 'Check In Date' : 'Check Out Date';
            inputType = 'date';
          } else if (key === 'time') {
            label = checkMode === 'Check In' ? 'Check In Time' : 'Check Out Time';
            inputType = 'time';
          }

          // Hide deadline field for "Check In"
          if (key === 'deadline' && checkMode === 'Check In') {
            return null;
          }

          return (
            <div className="flex items-center" key={key}>
              <label className="w-1/3 text-sm font-medium capitalize">
                {label}:
              </label>
              <input
                type={inputType}
                name={key}
                value={value}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 rounded-full border ${emptyFields[key] ? 'border-red-500' : 'border-gray-300'
                  }`}
                required
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-center mb-4">
        <button
          onClick={handleSubmit}
          className="border px-4 py-2 rounded-full"
          disabled={isSubmitting} // Disable button while submitting
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default CheckingContainer;
