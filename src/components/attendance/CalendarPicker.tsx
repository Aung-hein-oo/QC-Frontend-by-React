import React, { useState, useRef } from "react";
import { Calendar } from "lucide-react";

const CalendarPicker: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  // Get current month YYYY-MM
  const today = new Date();
  const maxMonth = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}`;


  // Format YYYY-MM → MM/YYYY
  const formatDate = (date: string) => {
    if (!date) return "";
    const [year, month] = date.split("-");
    return `${month}/${year}`;
  };

  return (
    <div className="flex items-center gap-2">
      {/* Searching Text */}
      <span className="text-lg text-gray-700 font-semibold">
        Record pr Monthdly:
      </span>
      {/* Calendar Icon */}
      <div className="relative">
        <Calendar
          size={32}
          className="text-blue-600 cursor-pointer hover:text-blue-800 transition-colors"
          onClick={handleClick}
        />

        {/* Month Picker */}
        <input
          type="month"
          ref={inputRef}
          value={selectedDate}
          max={maxMonth}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="absolute top-0 left-0 opacity-0 w-full h-full cursor-pointer"
        />
      </div>

      {/* Display Selected Month/Year */}
      {selectedDate && (
        <span className="text-lg font-semibold text-gray-700 ml-1">
          {formatDate(selectedDate)}
        </span>
      )}
    </div>
  );
};

export default CalendarPicker;