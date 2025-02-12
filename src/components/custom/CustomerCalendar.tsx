import React, { useState } from "react";
import CustomSelect from "./CustomSelect";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Define the type for highlighted dates
type HighlightedDates = Set<string>;

interface CustomerCalendarProps {
  dates: string[];
}

export default function CustomerCalendar({ dates }: CustomerCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [highlightedDates, setHighlightedDates] = useState<HighlightedDates>(
    new Set(dates)
  );

  // Function to handle month navigation
  const changeMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === "prev" ? -1 : 1));
    setCurrentDate(newDate);
  };

  // Function to handle year change
  const changeYear = (year: number) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    setCurrentDate(newDate);
  };

  // Function to handle date highlighting
  const toggleHighlightDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]; // Convert date to YYYY-MM-DD format
    const newHighlightedDates = new Set(highlightedDates);

    if (newHighlightedDates.has(dateString)) {
      newHighlightedDates.delete(dateString);
    } else {
      newHighlightedDates.add(dateString);
    }

    setHighlightedDates(newHighlightedDates);
  };

  // Function to render the calendar grid
  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDay = firstDayOfMonth.getDay();

    const calendarDays = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      calendarDays.push(
        <div key={`empty-${i}`} className="text-center p-2"></div>
      );
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateString = date.toISOString().split("T")[0];
      const isHighlighted = highlightedDates.has(dateString);

      calendarDays.push(
        <div
          key={dateString}
          className={`text-center w-8 h-8 rounded-full cursor-pointer rounded transition-colors ${
            isHighlighted
              ? "bg-primary  flex items-center justify-center"
              : "hover:bg-secondary"
          }`}
          // onClick={() => toggleHighlightDate(date)}
        >
          {i}
        </div>
      );
    }

    return calendarDays;
  };

  // Generate a list of years for the dropdown
  const years = Array.from({ length: 31 }, (_, i) => 2000 + i); // 2000 to 2030

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">
            {currentDate.toLocaleString("default", { month: "long" })}
          </h2>
          <CustomSelect
            value={currentDate.getFullYear()}
            onChange={(e: any) => changeYear(parseInt(e.target.value))}
            className="p-1 border rounded w-[80]"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </CustomSelect>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => changeMonth("prev")}
            className="text-gray-600 hover:text-gray-900 bg-gray-100 p-2 rounded-md"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={() => changeMonth("next")}
            className="text-gray-600 hover:text-gray-900 bg-gray-100 p-2 rounded-md"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center font-medium text-gray-700 flex items-center"
          >
            {day}
          </div>
        ))}
        {renderCalendar()}
      </div>
    </div>
  );
}
