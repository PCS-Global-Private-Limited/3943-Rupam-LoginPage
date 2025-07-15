import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Dashboard = () => {
  const [startDate, setStartDate] = useState();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const navigate = useNavigate();

  const fetchTodaysData = async () => {
    setShowDatePicker(false); // Hide datepicker when Today is clicked
    setLoading(true);
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
      setLoading(false);
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

  const hendleLogout = async () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/admin/login");
    }
  }, [navigate]);

  return (
    <>
      <div className="bg-gradient-to-br from-white via-blue-100 to-blue-300 min-h-screen">
        <div className="flex justify-end p-3">
          <button
            onClick={hendleLogout}
            className="text-white bg-black hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 shadow-lg transition-colors duration-200"
          >
            Logout
          </button>
        </div>
        <div className="min-h-screen flex flex-col gap-8 items-center justify-start pt-5">
          <div className="flex gap-4 text-white">
            <button
              onClick={fetchTodaysData}
              className="border-2 border-black bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-4xl cursor-pointer font-semibold shadow-md transition-colors duration-200"
            >
              Today
            </button>
            <button
              onClick={handleCustomClick}
              className="border-2 border-black bg-white text-blue-700 hover:bg-blue-100 px-5 py-2 rounded-4xl cursor-pointer font-semibold shadow-md transition-colors duration-200"
            >
              Custom
            </button>
          </div>
          {showDatePicker && (
            <div className="mt-4 bg-white p-4 rounded-xl shadow-lg border border-blue-200">
              <DatePicker
                selected={startDate}
                onChange={handleDateChange}
                className="w-full px-4 py-2 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-black bg-white"
                placeholderText="Click to select a date"
                inline
              />
            </div>
          )}
          <div>
            <div
              className={`p-6 bg-white rounded-2xl shadow-xl border border-blue-200`}
              style={{ display: showDatePicker ? 'none' : 'block' }}
            >
              <h1 className="text-2xl font-bold mb-4 text-blue-800">
                User Registration Data
              </h1>

              {loading ? (
                <p className="text-blue-500">Loading users...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-blue-200 shadow-sm rounded-lg">
                    <thead>
                      <tr className="bg-blue-100 text-left text-sm font-semibold text-blue-900">
                        <th className="px-4 py-2 border-b border-blue-200">
                          Count
                        </th>
                        <th className="px-4 py-2 border-b border-blue-200">
                          Name
                        </th>
                        <th className="px-4 py-2 border-b border-blue-200">
                          Email
                        </th>
                        <th className="px-4 py-2 border-b border-blue-200">
                          Mobile Number
                        </th>
                        <th className="px-4 py-2 border-b border-blue-200">
                          Registered On
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length > 0 ? (
                        users.map((user, index) => (
                          <tr key={user._id} className="hover:bg-blue-50">
                            <td className="px-4 py-2 border-b border-blue-100">
                              {index + 1}
                            </td>
                            <td className="px-4 py-2 border-b border-blue-100 text-black">
                              {user.userName}
                            </td>
                            <td className="px-4 py-2 border-b border-blue-100 text-black">
                              {user.emailId}
                            </td>
                            <td className="px-4 py-2 border-b border-blue-100 text-black">
                              {user.mobileNumber}
                            </td>
                            <td className="px-4 py-2 border-b border-blue-100 text-black">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="5"
                            className="px-4 py-4 text-center text-blue-400"
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
      </div>
    </>
  );
};

export default Dashboard;
