import React, { useEffect, useState, useRef } from "react";
import apiClient from "../api/apiClient";

interface TanggalKeberangkatanPickerProps {
  value?: string | null;          // YYYY-MM-DD from Redux
  onChange: (date: Date) => void; // pass Date back to parent
}

const daysInMonth = (month: number, year: number) =>
  new Date(year, month + 1, 0).getDate();

const firstDayOfMonth = (month: number, year: number) =>
  new Date(year, month, 1).getDay();

const TanggalKeberangkatanPicker: React.FC<TanggalKeberangkatanPickerProps> = ({
  value = null,
  onChange,
}) => {
  const parsedValue = value ? new Date(value) : null;

  const [selectedDate, setSelectedDate] = useState<Date | null>(parsedValue);
  const [showCalendar, setShowCalendar] = useState(false);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [currentMonth, setCurrentMonth] = useState(
    parsedValue?.getMonth() ?? new Date().getMonth()
  );

  const [currentYear, setCurrentYear] = useState(
    parsedValue?.getFullYear() ?? new Date().getFullYear()
  );

  // Sync with Redux value
  useEffect(() => {
    if (value) {
      const parsed = new Date(value);
      setSelectedDate(parsed);
      setCurrentMonth(parsed.getMonth());
      setCurrentYear(parsed.getFullYear());
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  // Fetch available dates for availability heatmap
  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        const response = await apiClient.get("/schedules/available-dates");
        const dates = response.data?.data || response.data || [];
        setAvailableDates(Array.isArray(dates) ? dates : []);
      } catch (error) {
        console.error("Failed to fetch available dates:", error);
      }
    };
    fetchAvailableDates();
  }, []);

  // Handle click outside to close calendar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDateClick = (day: number | null) => {
    if (!day) return;

    const newDate = new Date(currentYear, currentMonth, day);
    newDate.setHours(12, 0, 0, 0); // timezone safe

    setSelectedDate(newDate);
    setShowCalendar(false);
    onChange(newDate);
  };

  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })
    : "";

  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const daysOfWeek = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  const getDays = () => {
    const totalDays = daysInMonth(currentMonth, currentYear);
    const firstDay = firstDayOfMonth(currentMonth, currentYear);
    return [
      ...Array(firstDay).fill(null),
      ...Array.from({ length: totalDays }, (_, i) => i + 1),
    ];
  };

  const isDateActive = (day: number | null) => {
    if (!day) return false;
    const cellDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return availableDates.includes(cellDateStr);
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      <label className="block text-sm font-bold text-gray-700 mb-2 pl-1">Departure</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
          <span className="material-symbols-outlined text-gray-400 text-[20px]">calendar_month</span>
        </div>
        <button
          type="button"
          onClick={() => setShowCalendar(!showCalendar)}
          className="w-full bg-white dark:bg-[#1a202c] border border-gray-200 dark:border-gray-800 rounded-lg pl-10 pr-10 py-3 text-left flex justify-between items-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 shadow-sm cursor-pointer"
        >
          <span className={selectedDate ? "text-gray-900 dark:text-white" : "text-gray-400 font-normal"}>
            {formattedDate || "Pilih Tanggal"}
          </span>
          <span className="material-symbols-outlined text-gray-400 transition-transform duration-200">
            event
          </span>
        </button>
      </div>

      {showCalendar && (
        <div className="absolute z-50 mt-1.5 p-4 bg-white dark:bg-[#1a202c] border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl w-[320px] left-0 md:left-auto md:right-0 animate-fade-in">
          <div className="flex justify-between items-center mb-3">
            <button
              type="button"
              onClick={() => {
                if (currentMonth === 0) {
                  setCurrentMonth(11);
                  setCurrentYear((y) => y - 1);
                } else {
                  setCurrentMonth((m) => m - 1);
                }
              }}
              className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center cursor-pointer border-0 bg-transparent"
            >
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>
            <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
              {months[currentMonth]} {currentYear}
            </span>
            <button
              type="button"
              onClick={() => {
                if (currentMonth === 11) {
                  setCurrentMonth(0);
                  setCurrentYear((y) => y + 1);
                } else {
                  setCurrentMonth((m) => m + 1);
                }
              }}
              className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center cursor-pointer border-0 bg-transparent"
            >
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>

          <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400 mb-2">
            {daysOfWeek.map((d) => (
              <div key={d} className="py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {getDays().map((day, i) => {
              const active = isDateActive(day);
              const isSelected = selectedDate &&
                selectedDate.getDate() === day &&
                selectedDate.getMonth() === currentMonth &&
                selectedDate.getFullYear() === currentYear;

              return (
                <button
                  key={i}
                  type="button"
                  disabled={!day}
                  onClick={() => handleDateClick(day)}
                  className={`relative p-2 text-xs font-semibold rounded-lg flex flex-col items-center justify-center transition-all duration-150 h-9 w-9 cursor-pointer border-0 bg-transparent
                    ${!day ? "invisible" : ""}
                    ${isSelected ? "bg-primary text-white shadow-md shadow-primary/30" : "text-slate-700 dark:text-slate-300 hover:bg-primary/10 hover:text-primary"}
                  `}
                >
                  <span>{day}</span>
                  {active && !isSelected && (
                    <span className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  )}
                  {active && isSelected && (
                    <span className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-white"></span>
                  )}
                </button>
              );
            })}
          </div>
          
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-[10px] text-slate-400">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            <span>Tersedia jadwal keberangkatan</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TanggalKeberangkatanPicker;
