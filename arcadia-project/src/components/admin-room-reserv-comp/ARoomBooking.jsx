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

    // If the school ID field is updated and cleared, reset the dependent fields
    if (name === "schoolId" && value.trim() === "") {
      setFormData((prev) => ({
        ...prev,
        schoolId: value,
        userId: "",
        name: "",
        college: "",
        department: "",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "schoolId" && value.trim() !== "") {
      try {
        let new_value = value.replace(/\D/g, "");  
        const { data, error } = await supabase
          .from("user_accounts")
          .select("userID, userFName, userLName, userCollege, userDepartment")
          .eq("userLPUID", new_value); // Query using school ID instead of user ID

        if (error) {
          console.error("Error fetching user details:", error.message);
          return;
        }

        if (!data || data.length === 0) {
          console.log("No user found with the provided School ID");
          return;
        }

        if (data.length > 1) {
          console.error("Multiple users found with the same School ID");
          return;
        }

        console.log("User found with the provided School ID");

        const user = data[0];
        setFormData((prev) => ({
          ...prev,
          userId: user.userID,
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
        .select("reservationData")
        .filter("reservationData->>room", "eq", formData.room)
        .filter("reservationData->>date", "eq", formData.date)
        .filter("reservationData->>startTime", "lt", formData.endTime)
        .filter("reservationData->>endTime", "gt", formData.startTime);

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
          reservationData: reserveData,
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
      <h3 className="text-2xl font-semibold mb-4">Room Booking</h3>
      <div className="flex space-x-4">
        <div className="space-y-2 flex-1">
          <div className="flex items-center">
            <span className="w-1/3 text-md capitalize">School ID*:</span>
            <div className="w-2/3 flex items-center">
              <input
                type="text"
                name="schoolId"
                value={formData.schoolId ? formatSchoolNo(formData.schoolId) : ""}
                onChange={handleInputChange} // Allow changes
                className="px-3 py-1 rounded-full border border-grey w-full"
                required
              />
            </div>
          </div>
          <div className="flex items-center">
            <span className="w-1/3 text-md capitalize">Name:</span>
            <div className="w-2/3 flex items-center">
              <input
                type="text"
                name="name"
                value={formData.name}
                className="px-3 py-1 rounded-full border border-grey w-full"
                readOnly
                required
              />
            </div>
          </div>
          <div className="flex items-center">
            <span className="w-1/3 text-md capitalize">College:</span>
            <div className="w-2/3 flex items-center">
              <input
                type="text"
                name="college"
                value={formData.college}
                className="px-3 py-1 rounded-full border border-grey w-full"
                readOnly
                required
              />
            </div>
          </div>
          <div className="flex items-center">
            <span className="w-1/3 text-md capitalize">Department:</span>
            <div className="w-2/3 flex items-center">
              <input
                type="text"
                name="department"
                value={formData.department}
                className="px-3 py-1 rounded-full border border-grey w-full"
                readOnly
                required
              />
            </div>
          </div>
          <div className="items-center hidden">
            <span className="w-1/3 text-md capitalize">User ID:</span>
            <div className="w-2/3 flex items-center">
              <input
                type="text"
                name="userId"
                value={formData.userId}
                onChange={handleInputChange}
                className="px-3 py-1 rounded-full border border-grey w-full"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-2 flex-1">
          <div className="flex items-center">
            <span className="w-1/3 text-md capitalize">Department:</span>
            <div className="w-2/3 flex items-center">
              <select
                name="room"
                value={formData.room}
                onChange={handleInputChange}
                className="px-3 py-1 rounded-full border border-grey w-full"
              >
                <option value="A701-A">Discussion Room 1 (A701-A)</option>
                <option value="A701-B">Discussion Room 2 (A701-B)</option>
                <option value="A701-C">Discussion Room 3 (A701-C)</option>
                <option value="A701-D">Discussion Room 4 (A701-D)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center">
            <span className="w-1/3 text-md capitalize">Reservation Date:</span>
            <div className="w-2/3 flex items-center">
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="px-3 py-1 rounded-full border border-grey w-full"
              />
            </div>
          </div>

          <div className="flex w-full items-center">
            <span className="w-1/3 text-md capitalize">Start / End Time:</span>
            <div className=" w-2/3 flex items-center space-x-2">
              <div className="w-full flex items-center">
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="px-3 py-1 rounded-full border border-grey w-full"
                />
              </div>
              <div className="w-full flex items-center">
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="px-3 py-1 rounded-full border border-grey w-full"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <span className="w-1/3 text-md capitalize">Title:</span>
            <div className="w-2/3 flex items-center">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="px-3 py-1 rounded-full border border-grey w-full"
              />
            </div>
          </div>

        </div>
      </div>
      <div className="flex justify-center mt-8">
        <button           
        className="add-book w-1/4 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
        onClick={handleFormSubmit}
        >
          Reserve a Room
        </button>
      </div>
    </div>
  );
}
