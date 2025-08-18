// src/components/AppointmentModule.js
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import SummaryApi from "../common";

// Toast Component
const Toast = ({ message, type = "error", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <div className="fixed top-4 right-4 z-[9999]">
      <div className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3 animate-slide-in`}>
        <span>{message}</span>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 font-bold text-lg"
        >
          ×
        </button>
      </div>
    </div>
  );
};

const AppointmentModule = ({ doctorId, doctorName, availability, onClose }) => {
  const user = useSelector((state) => state?.user?.user);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [toast, setToast] = useState(null);

  // Map day names to numbers (0 = Sunday)
  const dayMap = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  // Get day name from date
  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return Object.keys(dayMap).find(day => dayMap[day] === date.getDay());
  };

  // Show toast notification
  const showToast = (message, type = "error") => {
    setToast({ message, type });
  };

  // Close toast
  const closeToast = () => {
    setToast(null);
  };

  // Get max date (30 days from today)
  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 30);
    return maxDate.toISOString().split("T")[0];
  };

  // Check if selected date is valid
  const isValidDate = (selectedDate) => {
    if (!selectedDate || !availability?.days) return false;
    
    const selectedDay = getDayName(selectedDate);
    return availability.days.includes(selectedDay);
  };

  // Handle date change with validation
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setDate(selectedDate);
    setTime(""); // Reset time when date changes
    
    if (selectedDate) {
      const selectedDay = getDayName(selectedDate);
      
      if (!isValidDate(selectedDate)) {
        showToast(
          `Dr. ${doctorName} is not available on ${selectedDay}s. Available days: ${availability?.days?.join(", ")}`,
          "error"
        );
        setAvailableTimes([]);
        return;
      }
      
      // If date is valid, set available times
      if (availability?.time) {
        setAvailableTimes(availability.time.split(",").map(t => t.trim()));
      }
    } else {
      setAvailableTimes([]);
    }
  };

  const handleBook = async () => {
    // Validation checks
    if (!date || !time) {
      showToast("Please select both date and time", "error");
      return;
    }

    if (!isValidDate(date)) {
      const selectedDay = getDayName(date);
      showToast(
        `Dr. ${doctorName} is not available on ${selectedDay}s. Available days: ${availability?.days?.join(", ")}`,
        "error"
      );
      return;
    }

    // Check if date is within 30 days
    const selectedDateObj = new Date(date);
    const today = new Date();
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 30);
    
    if (selectedDateObj > maxDate) {
      showToast("Appointments can only be booked up to 30 days in advance", "error");
      return;
    }

    if (selectedDateObj < today) {
      showToast("Please select a future date", "error");
      return;
    }

    const appointmentData = {
      userId: user._id,
      userName: user.name,
      doctorId,
      doctorName,
      appointmentDate: date,
      appointmentTime: time,
      reason: reason.trim(),
      fee: availability?.fee || 0,
    };

    try {
      setLoading(true);
      const res = await fetch(SummaryApi.createAppointment.url, {
        method: SummaryApi.createAppointment.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(appointmentData),
      });

      const data = await res.json();
      
      if (!data.success) {
        throw new Error(data.message || "Failed to book appointment");
      }
      
      showToast("Appointment booked successfully!", "success");
      
      // Close modal after a short delay to show success toast
      setTimeout(() => {
        onClose();
      }, 1000);
      
    } catch (err) {
      showToast(err.message || "Failed to book appointment", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}

      {/* Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Book Appointment</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          
          <div className="border-b pb-2">
            <p className="text-gray-800 font-medium">{doctorName}</p>
            <p className="text-sm text-gray-500">
              Available: {availability?.days?.join(", ")}
            </p>
            <p className="text-sm text-gray-500">
              Fee: ৳{availability?.fee || 0}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Select Date</label>
              <input
                type="date"
                value={date}
                onChange={handleDateChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                min={new Date().toISOString().split("T")[0]}
                max={getMaxDate()}
              />
              <p className="text-xs text-gray-400 mt-1">
                Booking available up to 30 days in advance
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Select Time</label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={!date || !isValidDate(date)}
              >
                <option value="">
                  {!date ? "Select date first" : 
                   !isValidDate(date) ? "Select a valid date" : 
                   "Select time"}
                </option>
                {isValidDate(date) && availableTimes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Reason for Visit (Optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Describe your symptoms or reason for the appointment..."
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows="3"
                maxLength="200"
              />
              <p className="text-xs text-gray-400 mt-1">
                {reason.length}/200 characters
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleBook}
              disabled={loading || !date || !time || !isValidDate(date)}
              className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Booking..." : `Book Now (৳${availability?.fee || 0})`}
            </button>
          </div>
        </div>
      </div>

      {/* CSS for toast animation */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default AppointmentModule;