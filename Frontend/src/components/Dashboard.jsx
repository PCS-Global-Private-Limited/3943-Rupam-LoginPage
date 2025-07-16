import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Dashboard = () => {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("today");
  const navigate = useNavigate();

  const fecthData = async (startDate, endDate) => {
    setLoading(true);
    try {
      const responce = await axios.post(
        "http://localhost:5080/admin/dashboard",
        {
          startDate: startDate,
          endDate: endDate,
        }
      );

      setUsers(responce.data);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.error("Error fetching users:", error);
    }
  };

  const customSearch = () => {
    fecthData(startDate, endDate);
  };

  const handleCustomTabClick = () => {
    setUsers([]);
    setTab("custom");
  };

  const hendleLogout = async () => {
    localStorage.removeItem("tokenForAdmin");
    navigate("/admin/login");
  };

  const handleTodaySearch = () => {
    setTab("today");
    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
    }).format(new Date());
    fecthData(today, today);
  };

  useEffect(() => {
    if (!localStorage.getItem("tokenForAdmin")) {
      navigate("/admin/login");
    }
    handleTodaySearch();
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
        <div className="min-h-screen flex flex-col gap-5 items-center justify-start pt-5">
          <div className="flex gap-4 text-white">
            <button
              onClick={handleTodaySearch}
              className="border-2 border-black bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-4xl cursor-pointer font-semibold shadow-md transition-colors duration-200"
            >
              Today
            </button>
            <button
              onClick={handleCustomTabClick}
              className="border-2 border-black bg-white text-blue-700 hover:bg-blue-100 px-5 py-2 rounded-4xl cursor-pointer font-semibold shadow-md transition-colors duration-200"
              disabled={tab === "custom"}
            >
              Custom
            </button>
          </div>
          {tab === "custom" && (
            <div className="mt-2 bg-white p-6 rounded-2xl shadow-xl border border-blue-200 flex flex-col gap-4 w-full max-w-md mx-auto">
              <h2 className="text-xl font-bold text-blue-800 mb-2">
                Custom Date Search
              </h2>
              <div className="flex flex-col gap-2">
                <label className="text-blue-700 font-semibold mb-1">
                  Start Date:
                </label>
                <input
                  onChange={(event) => setStartDate(event.target.value)}
                  type="date"
                  value={startDate}
                  className="border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900 shadow-sm"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-blue-700 font-semibold mb-1">
                  End Date:
                </label>
                <input
                  onChange={(event) => setEndDate(event.target.value)}
                  type="date"
                  value={endDate}
                  className="border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900 shadow-sm"
                />
              </div>
              <button
                onClick={customSearch}
                className="mt-4 border-2 border-black bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full cursor-pointer font-semibold shadow-md transition-colors duration-200"
              >
                Search
              </button>
            </div>
          )}
          <div>
            <div>
              {users.length > 0 && (
                <div
                  className={`p-6 bg-white rounded-2xl shadow-xl border border-blue-200 mb-5`}
                  // style={{ display: !users ? "none" : "block" }}
                >
                  <h1 className="text-2xl font-bold mb-4 text-blue-800">
                    User Registration Data
                  </h1>

                  {!users ? (
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
                                  {new Date(
                                    user.createdAt
                                  ).toLocaleDateString()}
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
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
