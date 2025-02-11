import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const CheckingContainer = () => {
  const [checkMode, setCheckMode] = useState('Check Out');
  const [isSubmitting, setIsSubmitting] = useState(false); // State for loading indicator
  const [emptyFields, setEmptyFields] = useState({}); // Track empty fields
  const [isDamaged, setIsDamaged] = useState(false); // Track if the book is marked as damaged

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

  const [bookCover, setBookCover] = useState(''); // State for the book cover image URL

  useEffect(() => {
    if (formData.bookID) {
      const fetchBookData = async () => {
        try {
          // Fetch title and cover from the book_titles table using titleID from book_indiv
          const { data, error } = await supabase
            .from('book_indiv')
            .select('book_titles(title, cover)') // Include the cover field
            .eq('bookID', formData.bookID)
            .single();

          if (error || !data) {
            setFormData((prev) => ({
              ...prev,
              bookTitle: '',
            }));
            setBookCover(''); // Clear cover if no book data found
          } else {
            setFormData((prev) => ({
              ...prev,
              bookTitle: data.book_titles.title, // Set the title value
            }));
            setBookCover(data.book_titles.cover); // Set the cover URL
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
      setBookCover(''); // Clear cover if no bookID is provided
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
      const { userID, bookID, schoolNo, name, college, department, bookTitle, date, time, deadline } = formData;
      const currentTime = getLocalTime();

      const transactionType = checkMode === 'Check Out' ? 'Borrowed' : 'Returned';

      // If the mode is 'Check Out', perform the checkout logic
      if (checkMode === 'Check Out') {
        const { data: existingTransaction, error: fetchError } = await supabase
          .from('book_transactions')
          .select('transactionType')
          .eq('bookID', bookID)
          .eq('transactionType', 'Borrowed') // Check if the book is already borrowed
          .order('checkoutDate', { ascending: false })
          .limit(1)
          .single();

        if (fetchError) {
          console.error('Error fetching existing transaction:', fetchError);
        }

        // Prevent checkout if a "Borrowed" transaction exists
        if (existingTransaction) {
          alert('This book is already borrowed. You cannot check it out again.');
          return; // Exit the function if the book is already borrowed
        }

        // Update the status to 'Unavailable' when checking out
        const { error: updateError } = await supabase
          .from('book_indiv')
          .update({ bookStatus: 'Unavailable' })
          .eq('bookID', bookID);

        if (updateError) {
          console.error('Error updating book status to Unavailable:', updateError);
          return; // Exit if there's an error updating the status
        }

        // Insert a new transaction for Check Out
        const transactionData = {
          userID: userID,
          bookID: bookID,
          checkoutDate: date,
          checkoutTime: time,
          deadline: deadline,
          transactionType: transactionType,
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

      // If the mode is 'Check In', perform the check-in logic
      if (checkMode === 'Check In') {
        const { data: existingTransaction, error: fetchError } = await supabase
          .from('book_transactions')
          .select('*')
          .eq('bookID', bookID)
          .eq('userID', userID)
          .eq('transactionType', 'Borrowed') // Only allow check-in if the book is borrowed
          .order('checkoutDate', { ascending: false })
          .limit(1)
          .single();

        if (fetchError) {
          console.error('Error fetching existing transaction:', fetchError);
        }

        // Prevent check-in if the book is not currently borrowed
        if (!existingTransaction) {
          alert('This book is not marked as borrowed or has already been checked in.');
          return; // Exit the function if the book is not currently borrowed
        }

        // Update the transaction with check-in details (checkin_date and checkin_time)
        const { error: updateTransactionError } = await supabase
          .from('book_transactions')
          .update({
            checkinDate: date,
            checkinTime: time,
            transactionType: 'Returned', // Change transaction type to 'Returned'
          })
          .eq('transactionID', existingTransaction.transactionID); // Use the existing transactionID

        if (updateTransactionError) {
          console.error('Error updating transaction:', updateTransactionError);
          return; // Exit if there's an error updating the transaction
        }

        // If the book is marked as damaged, update the status to 'Damaged'
        const updatedStatus = isDamaged ? 'Damaged' : 'Available';

        // Update the book status to 'Available' or 'Damaged' when checking in
        const { error: checkinUpdateError } = await supabase
          .from('book_indiv')
          .update({ bookStatus: updatedStatus })
          .eq('bookID', bookID);

        if (checkinUpdateError) {
          console.error('Error updating book status:', checkinUpdateError);
          return; // Exit if there's an error updating the status
        }

        alert('Book checked in successfully and transaction updated!');
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
      <div className="flex items-center mb-5">
        {checkMode === 'Check In' && (
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isDamaged}
              onChange={() => setIsDamaged(!isDamaged)}
              className="mr-2"
            />
            Mark as Damaged
          </label>
        )}
      </div>
      {/* Book Cover Image Section */}
      <div className="flex flex-col items-center mb-5">
        <label className="text-sm font-medium mb-2">Book Cover:</label>
        {formData.bookID && formData.bookTitle && (
          <div className="w-full flex justify-center">
            <img
              src={bookCover}
              alt="Book Cover"
              className="w-35 h-52 object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      <div className="flex justify-center mb-4">
        <button
          onClick={handleSubmit}
          className="border px-4 py-2 rounded-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default CheckingContainer;
