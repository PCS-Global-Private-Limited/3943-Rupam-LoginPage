import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CustomCalendar = (props) => {
  const [value, setValue] = useState(new Date());
  const [today] = useState(new Date());

  const tileClassName = ({ date, view }) => {
    if (view === 'month' && date.toDateString() === today.toDateString()) {
      return 'bg-blue-500 text-white font-bold rounded-full';
    }
    return '';
  };

  const customNavigation = ({ label, onClick }) => (
    <button
      className="text-blue-600 font-semibold px-2 py-1 mx-1 rounded hover:bg-blue-50 transition"
      onClick={onClick}
    >
      {label}
    </button>
  );

  return (
    <div className="w-[42%] max-w-lg mx-auto bg-white p-3 rounded-2xl shadow-2xl flex flex-col items-center">
      {/* <h2 className="text-3xl font-extrabold text-blue-700 mb-6 text-center flex items-center gap-2">
        <span role="img" aria-label="calendar">📅</span>
        Live Calendar
      </h2> */}
      <div className="mb-4 text-lg text-gray-700 text-center">
        Selected Date: <span className="font-bold text-blue-600">{value.toDateString()}</span>
      </div>
      <Calendar
        onChange={setValue}
        value={value}
        className="react-calendar rounded-xl w-full shadow"
        tileClassName={tileClassName}
        prevLabel={<span className="text-lg">&lt;</span>}
        nextLabel={<span className="text-lg">&gt;</span>}
        navigationLabel={customNavigation}
        {...props} 
      />
    </div>
  );
};

export default CustomCalendar;