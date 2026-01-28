import React, { useEffect, useState } from "react";

interface TanggalKeberangkatanPickerProps {
  value?: string | null;          // dari Redux
  onChange: (date: Date) => void; // ke parent
}

const daysInMonth = (month: number, year: number) =>
  new Date(year, month + 1, 0).getDate();

const firstDayOfMonth = (month: number, year: number) =>
  new Date(year, month, 1).getDay();

const TanggalKeberangkatanPicker: React.FC<
  TanggalKeberangkatanPickerProps
> = ({ value = null, onChange }) => {

  // 🔑 KONVERSI STRING → DATE SEKALI SAJA
  const parsedValue = value ? new Date(value) : null;

  const [selectedDate, setSelectedDate] = useState<Date | null>(parsedValue);
  const [showCalendar, setShowCalendar] = useState(false);

  const [currentMonth, setCurrentMonth] = useState(
    parsedValue?.getMonth() ?? new Date().getMonth()
  );

  const [currentYear, setCurrentYear] = useState(
    parsedValue?.getFullYear() ?? new Date().getFullYear()
  );

  // 🔄 Sync saat Redux value berubah
  useEffect(() => {
    if (parsedValue) {
      setSelectedDate(parsedValue);
      setCurrentMonth(parsedValue.getMonth());
      setCurrentYear(parsedValue.getFullYear());
    }
  }, [value]); // cukup listen string-nya

  const handleDateClick = (day: number | null) => {
    if (!day) return;

    const newDate = new Date(currentYear, currentMonth, day);
    newDate.setHours(12, 0, 0, 0); // aman timezone

    setSelectedDate(newDate);
    setShowCalendar(false);
    onChange(newDate);
  };

  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString("id-ID")
    : "";

  const months = [
    "Januari","Februari","Maret","April","Mei","Juni",
    "Juli","Agustus","September","Oktober","November","Desember"
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

  return (
    <div className="relative w-full">
      <input
        readOnly
        value={formattedDate || "dd/mm/yyyy"}
        onClick={() => setShowCalendar(!showCalendar)}
        className="w-full cursor-pointer rounded-lg border border-black py-3 px-4"
      />

      {showCalendar && (
        <div className="absolute z-10 mt-2 p-4 bg-white rounded-lg shadow-lg w-full">
          <div className="flex justify-between mb-2">
            <button onClick={() => setCurrentMonth((m) => m - 1)}>‹</button>
            <span className="font-semibold">
              {months[currentMonth]} {currentYear}
            </span>
            <button onClick={() => setCurrentMonth((m) => m + 1)}>›</button>
          </div>

          <div className="grid grid-cols-7 text-center text-xs mb-2">
            {daysOfWeek.map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {getDays().map((day, i) => (
              <div
                key={i}
                onClick={() => handleDateClick(day)}
                className={`p-2 rounded-full cursor-pointer ${
                  day ? "hover:bg-blue-100" : "invisible"
                }`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TanggalKeberangkatanPicker;
