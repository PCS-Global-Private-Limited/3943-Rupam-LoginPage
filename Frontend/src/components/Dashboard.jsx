import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

const Dashboard = () => {
  const [startDate, setStartDate] = useState();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fetchTodaysData = async () => {
    const today = Date.now();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
    try {
      const responce = await axios.post(
        "http://localhost:5080/admin/dashboard",
        {
          from: startOfDay,
          to: endOfDay,
        }
      );
      setUsers(responce.data);
      setLoading(false)
    } catch (e) {
      setLoading(false);
      console.error("Error fetching users:", error);
    }
  };

  const fetchData = async (date) => {
    const selectedDate = date || startDate;
    if (!selectedDate) return;
    setLoading(true);
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);
    try {
      const response = await axios.post(
        "http://localhost:5080/admin/dashboard",
        {
          from: startOfDay,
          to: endOfDay,
        }
      );
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching users:", error);
    }
  };

  const handleCustomClick = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleDateChange = (date) => {
    setStartDate(date);
    setShowDatePicker(false);
    fetchData(date);
  };

  return (
    <div className="min-h-screen flex flex-col gap-8 items-center justify-start pt-5 bg-gray-300">
      <div className="flex gap-4 text-white">
        <button
          onClick={fetchTodaysData}
          className="border-2 bg-gray-700 px-5 py-2 rounded-4xl cursor-pointer"
        >
          Today
        </button>
        <button
          onClick={handleCustomClick}
          className="border-2 bg-blue-500 px-5 py-2 rounded-4xl cursor-pointer"
        >
          Custom
        </button>
      </div>
      {showDatePicker && (
        <div className="mt-4">
          <DatePicker
            selected={startDate}
            onChange={handleDateChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholderText="Click to select a date"
            inline
          />
        </div>
      )}
      <div>
        <div className="p-6">
          <h1 className="text-xl font-bold mb-4">User Registration Data</h1>

          {loading ? (
            <p className="text-gray-500">Loading users...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
                <thead>
                  <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                    <th className="px-4 py-2 border-b">Count</th>
                    <th className="px-4 py-2 border-b">Name</th>
                    <th className="px-4 py-2 border-b">Email</th>
                    <th className="px-4 py-2 border-b">Mobile Number</th>
                    <th className="px-4 py-2 border-b">Registered On</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user, index) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border-b">{index + 1}</td>
                        <td className="px-4 py-2 border-b">{user.userName}</td>
                        <td className="px-4 py-2 border-b">{user.emailId}</td>
                        <td className="px-4 py-2 border-b">
                          {user.mobileNumber}
                        </td>
                        <td className="px-4 py-2 border-b">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-4 py-4 text-center text-gray-500"
                      >
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
