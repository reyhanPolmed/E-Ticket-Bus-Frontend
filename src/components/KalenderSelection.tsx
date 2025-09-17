import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setDepartureDate } from '../features/search/searchSlice';
// Fungsi bantuan untuk mendapatkan jumlah hari dalam sebulan
const daysInMonth = (month: number, year: number): number => new Date(year, month + 1, 0).getDate();

// Fungsi bantuan untuk mendapatkan hari pertama dalam sebulan (0 = Minggu)
const firstDayOfMonth = (month: number, year: number): number => new Date(year, month, 1).getDay();

const TanggalKeberangkatanPicker = () => {
  const dispatch = useDispatch()
  // State untuk menyimpan tanggal yang dipilih, visibilitas kalender, dan bulan/tahun saat ini
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());

  // Fungsi untuk menghasilkan array hari dalam sebulan, termasuk sel kosong
  const getDays = (): (number | null)[] => {
    const totalDays = daysInMonth(currentMonth, currentYear);
    const firstDay = firstDayOfMonth(currentMonth, currentYear);
    const daysArray: (number | null)[] = [];

    // Tambahkan sel kosong untuk hari-hari sebelum hari pertama
    for (let i = 0; i < firstDay; i++) {
      daysArray.push(null);
    }

    // Tambahkan hari-hari dalam sebulan
    for (let i = 1; i <= totalDays; i++) {
      daysArray.push(i);
    }

    return daysArray;
  };

  // Handler klik saat pengguna memilih tanggal
const handleDateClick = (day: number | null) => {
    if (day) {
        // Buat objek Date tanpa terpengaruh zona waktu lokal
        const newDate = new Date(currentYear, currentMonth, day);

        // Set waktu ke tengah hari (misalnya, pukul 12 siang)
        // Ini memastikan tanggal tidak bergeser saat dikonversi ke ISOString
        newDate.setHours(12, 0, 0, 0);

        setSelectedDate(newDate);
        setShowCalendar(false);

        // Ambil string ISO dan potong di bagian 'T'
        const newDateString = newDate.toISOString().split('T')[0];

        // Dispatch action dengan string tanggal yang sudah benar
        dispatch(setDepartureDate(newDateString));
    }
};

  // Format tanggal yang dipilih untuk ditampilkan di input
  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : '';

  // Dapatkan tanggal hari ini
  const today = new Date();
  
  // Periksa apakah sebuah hari adalah hari ini
  const isToday = (day: number | null): boolean => {
    if (day === null) return false;
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  // Periksa apakah sebuah hari adalah tanggal yang dipilih
  const isSelected = (day: number | null): boolean => {
    if (!selectedDate || day === null) return false;
    return (
      day === selectedDate.getDate() &&
      currentMonth === selectedDate.getMonth() &&
      currentYear === selectedDate.getFullYear()
    );
  };

  // Array nama bulan
  const months: string[] = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Array nama hari
  const daysOfWeek: string[] = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  // Handler untuk navigasi ke bulan berikutnya
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Handler untuk navigasi ke bulan sebelumnya
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  return (
    <div className="relative font-sans w-full mx-auto ">
      <div className="mb-2 text-sm font-semibold text-gray-700">Tanggal Keberangkatan</div>
      <div className="relative">
        <input
          type="text"
          readOnly
          value={formattedDate || 'dd/mm/yyyy'}
          onClick={() => setShowCalendar(!showCalendar)}
          className="w-full cursor-pointer rounded-lg border border-black py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          placeholder="Pilih Tanggal Keberangkatan"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 15h14M8 19h8M5 19a2 2 0 01-2-2v-4a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2H5z" />
          </svg>
        </div>
      </div>

      {showCalendar && (
        <div className="absolute z-10 mt-2 p-4 bg-white rounded-lg shadow-xl w-full border border-gray-200 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <button onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-gray-200 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-600">
                <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0L21 8.94V12a1 1 0 001 1h.5a.5.5 0 000-1H22a.5.5 0 01-.5-.5V8.06l-4.22-4.22a.75.75 0 00-1.06 0L7.72 11.47a.75.75 0 010 1.06zM7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0L21 8.94V12a1 1 0 001 1h.5a.5.5 0 000-1H22a.5.5 0 01-.5-.5V8.06l-4.22-4.22a.75.75 0 00-1.06 0L7.72 11.47a.75.75 0 010 1.06zM7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0L21 8.94V12a1 1 0 001 1h.5a.5.5 0 000-1H22a.5.5 0 01-.5-.5V8.06l-4.22-4.22a.75.75 0 00-1.06 0L7.72 11.47a.75.75 0 010 1.06z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="text-sm font-semibold text-gray-800">
              {months[currentMonth]} {currentYear}
            </div>
            <button onClick={handleNextMonth} className="p-1 rounded-full hover:bg-gray-200 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-600">
                <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-2">
            {daysOfWeek.map((day, index) => (
              <div key={index}>{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {getDays().map((day, index) => (
              <div
                key={index}
                onClick={() => handleDateClick(day)}
                className={`
                  p-2 rounded-full cursor-pointer transition-all duration-200
                  ${day ? 'hover:bg-blue-100' : ''}
                  ${isSelected(day) ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
                  ${isToday(day) && !isSelected(day) ? 'bg-gray-200' : ''}
                  ${!day ? 'invisible' : ''}
                `}
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
