import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ARoomBooking({ addReservation }) {
  const [formData, setFormData] = useState({
    userId: "",
    schoolId: "",
    name: "",
    college: "",
    department: "",
    room: "A701-A",
    date: "",
    startTime: "09:00",
    endTime: "10:00",
    title: "New Reservation",
  });

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]; 
    setFormData((prev) => ({
      ...prev,
      date: today,
    }));
  }, []);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
  
    // Check if userId field is being updated
    if (name === "userId" && value.trim() === "") {
      // If userId is cleared, reset the dependent fields
      setFormData((prev) => ({
        ...prev,
        userId: value,
        schoolId: "",
        name: "",
        college: "",
        department: "",
      }));
      return; // No need to fetch user details if userId is empty
    }
  
    setFormData((prev) => ({ ...prev, [name]: value }));
  
    if (name === "userId" && value.trim() !== "") {
      try {
        const { data, error } = await supabase
          .from("user_accounts")
          .select("userLPUID, userFName, userLName, userCollege, userDepartment")
          .eq("userID", value);
  
        if (error) {
          console.error("Error fetching user details:", error.message);
          return;
        }
  
        if (!data || data.length === 0) {
          console.error("No user found with the provided User ID");
          return;
        }
  
        if (data.length > 1) {
          console.error("Multiple users found with the same User ID");
          return;
        }
  
        const user = data[0];
        setFormData((prev) => ({
          ...prev,
          schoolId: user.userLPUID,
          name: `${user.userFName} ${user.userLName}`,
          college: user.userCollege,
          department: user.userDepartment,
        }));
      } catch (error) {
        console.error("Error fetching user details:", error.message);
      }
    }
  };
  
  const checkExistingReservation = async () => {
    try {
      const { data, error } = await supabase
        .from("reservation")
        .select("reserve_data")
        .filter("reserve_data->>room", "eq", formData.room)
        .filter("reserve_data->>date", "eq", formData.date)
        .filter("reserve_data->>startTime", "lt", formData.endTime)
        .filter("reserve_data->>endTime", "gt", formData.startTime);

      if (error) {
        throw new Error(`Error checking existing reservations: ${error.message}`);
      }

      if (data.length > 0) {
        toast.warn("This room is already reserved for the selected time!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          className: "bg-yellow-500 text-white",
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error(error.message);
      toast.error("Error checking existing reservations", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        className: "bg-red-600 text-white",
      });
      return false;
    }
  };

  const handleFormSubmit = async () => {
    // Check if all fields are filled
    if (
      !formData.userId ||
      !formData.schoolId ||
      !formData.name ||
      !formData.college ||
      !formData.room ||
      !formData.date ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.title
    ) {
      toast.error("Please fill in all required fields.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        className: "bg-red-600 text-white",
      });
      return;
    }
  
    const isReserved = await checkExistingReservation();
    if (isReserved) {
      return; // Prevent form submission if the room is already booked
    }
  
    const newEvent = {
      id: String(Date.now()),
      resourceId: formData.room,
      title: formData.title,
      start: `${formData.date}T${formData.startTime}`,
      end: `${formData.date}T${formData.endTime}`,
    };
  
    addReservation(newEvent);
  
    const reserveData = {
      room: formData.room,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      title: formData.title,
    };
  
    try {
      const { data, error } = await supabase
        .from("reservation")
        .insert({
          userID: formData.userId,
          reserve_data: reserveData,
        });
  
      if (error) {
        console.error("Error saving reservation:", error.message);
        toast.error("Error saving reservation", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          className: "bg-red-600 text-white",
        });
      } else {
        console.log("Reservation successfully saved:", data);
        toast.success("Reservation successfully saved", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          className: "bg-green-600 text-white",
        });
      }
    } catch (error) {
      console.error("Error while submitting reservation:", error.message);
      toast.error("Error while submitting reservation", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        className: "bg-red-600 text-white",
      });
    }
  };
  
  return (
    <div className="bg-white overflow-hidden border border-grey mb-8 p-6 rounded-lg w-full">
      <h2 className="text-2xl font-semibold mb-2">Booking</h2>
      <div className="flex gap-8">
        {/* Left Section */}
        <div className="space-y-4 flex-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-dark-gray">User ID:</span>
            <input
              type="text"
              name="userId"
              value={formData.userId}
              onChange={handleInputChange}
              className="input-space"
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-dark-gray">School ID No.*:</span>
            <input
              type="text"
              name="schoolId"
              value={formData.schoolId}
              className="input-space"
              readOnly
              required
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-dark-gray">Name*:</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              className="input-space"
              readOnly
              required
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-dark-gray">College*:</span>
            <input
              type="text"
              name="college"
              value={formData.college}
              className="input-space"
              readOnly
              required
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-dark-gray">Department*:</span>
            <input
              type="text"
              name="department"
              value={formData.department}
              className="input-space"
              readOnly
              required
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-4 flex-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-dark-gray">Room:</span>
            <select
              name="room"
              value={formData.room}
              onChange={handleInputChange}
              className="input-space"
            >
              <option value="A701-A">Discussion Room 1 (A701-A)</option>
              <option value="A701-B">Discussion Room 2 (A701-B)</option>
              <option value="A701-C">Discussion Room 3 (A701-C)</option>
              <option value="A701-D">Discussion Room 4 (A701-D)</option>
            </select>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-dark-gray">Date:</span>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="input-space"
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-dark-gray">Start Time:</span>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleInputChange}
              className="input-space"
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-dark-gray">End Time:</span>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleInputChange}
              className="input-space"
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-dark-gray">Purpose:</span>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="input-space"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-8">
        <button className="reservButton" onClick={handleFormSubmit}>
          Reserve a Room
        </button>
      </div>
    </div>
  );
}
