import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Plus, Trash2, Plane, Calendar, ArrowRight } from "lucide-react";

import { useAppDispatch, useAppSelector } from "../features/hooks";
import {
  setPassengerData,
  setBookingStep,
} from "../features/booking/bookingSlice";

import type { Passenger } from "../features/booking/bookingTypes";

const PassengerInfo: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // --- REDUX STATE ---
  const { selectedSeats } = useAppSelector((state) => state.booking);

  // --- LOCAL STATE ---
  // Menginisialisasi state berdasarkan kursi yang dipilih dari Redux
  const [passengers, setPassengers] = useState<Passenger[]>(
    selectedSeats.map((seat) => ({
      name: "",
      age: 0,
      seatNumber: seat.seatNumber,
    }))
  );

  // --- HANDLERS ---
  const handleChange = (
    index: number,
    field: keyof Passenger,
    value: string
  ) => {
    const updated = [...passengers];
    // Pastikan konversi tipe data sesuai (age harus number)
    updated[index] = {
      ...updated[index],
      [field]: field === "age" ? Number(value) : value,
    };
    setPassengers(updated);
  };

  const addPassenger = () => {
    setPassengers([
      ...passengers,
      { name: "", age: 0, seatNumber: "X" }, // Default seat placeholder
    ]);
  };

  const removePassenger = () => {
    if (passengers.length > 1) {
      setPassengers(passengers.slice(0, -1));
    }
  };

  const handleConfirm = () => {
    // Validasi sederhana
    const isValid = passengers.every(
      (p) => p.name.trim() && p.age > 0
    );

    if (!isValid) {
      alert("Harap lengkapi semua data penumpang (Nama & Umur > 0)!");
      return;
    }

    // Dispatch ke Redux
    dispatch(setPassengerData(passengers));
    dispatch(setBookingStep("payment"));
    navigate("/payment");
  };

  // --- RENDER (NEOBRUTALIST STYLE) ---
  return (
    <main className="min-h-screen bg-[#F0F0F0] py-10 px-4 font-sans selection:bg-black selection:text-white">
      {/* Background Pattern */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        
        {/* Header Title */}
        <div className="mb-8 border-b-4 border-black pb-4 inline-block">
            <h1 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tighter">
            Data Penumpang
            </h1>
            <p className="font-mono font-bold mt-1 text-gray-600">Isi data sesuai KTP/Identitas.</p>
        </div>

        {/* --- BOOKING INFO CARD --- */}
        <div className="bg-[#60A5FA] border-4 border-black p-0 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-10 overflow-hidden">
          <div className="bg-black text-white p-3 font-mono font-bold flex items-center gap-2">
            <Plane size={20} />
            INFO PENERBANGAN
          </div>
          
          <div className="p-6 flex flex-col md:flex-row gap-6 items-center">
             {/* Thumbnail / Route Icon */}
            <div className="w-24 h-24 bg-white border-4 border-black flex items-center justify-center shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Plane size={40} className="text-black rotate-[-45deg]" strokeWidth={2.5} />
            </div>

            <div className="flex-1 w-full">
              <div className="flex items-center gap-2 mb-2">
                {/* Fallback Static Data for UI Demo */}
                <h2 className="text-2xl font-black text-white uppercase drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  Jakarta
                </h2>
                <ArrowRight strokeWidth={4} className="text-black" />
                <h2 className="text-2xl font-black text-white uppercase drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  New York
                </h2>
              </div>
              
              <div className="flex flex-wrap gap-3 mt-3">
                 <div className="bg-white border-2 border-black px-3 py-1 font-mono font-bold text-sm flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Calendar size={14} /> 15 JUL 2024
                 </div>
                 <div className="bg-[#FEF08A] border-2 border-black px-3 py-1 font-mono font-bold text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    10:00 AM
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- PASSENGER FORM SECTION --- */}
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-black uppercase flex items-center gap-2">
                <User strokeWidth={3} /> Detail {passengers.length} Penumpang
            </h2>
        </div>

        {/* Dynamic Form List */}
        <div className="space-y-8">
          {passengers.map((passenger, index) => (
            <div
              key={index}
              className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative"
            >
              {/* Badge Number */}
              <div className="absolute -top-4 -left-4 bg-[#A3E635] border-4 border-black w-12 h-12 flex items-center justify-center font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[-10deg]">
                #{index + 1}
              </div>

              {/* Seat Indicator */}
              <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 font-mono font-bold text-sm rotate-2">
                 KURSI: {passenger.seatNumber}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <div className="md:col-span-2 space-y-2">
                  <label className="block font-bold text-black uppercase text-sm">
                    Nama Lengkap
                  </label>
                  <input
                    value={passenger.name}
                    onChange={(e) => handleChange(index, "name", e.target.value)}
                    placeholder="CONTOH: BUDI SANTOSO"
                    className="w-full h-12 px-4 border-4 border-black bg-[#F3F4F6] focus:bg-white focus:outline-none focus:ring-0 focus:border-[#F472B6] transition-colors font-mono font-bold placeholder:text-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-bold text-black uppercase text-sm">
                    Umur
                  </label>
                  <input
                    value={passenger.age || ""}
                    type="number"
                    onChange={(e) => handleChange(index, "age", e.target.value)}
                    placeholder="25"
                    className="w-full h-12 px-4 border-4 border-black bg-[#F3F4F6] focus:bg-white focus:outline-none focus:ring-0 focus:border-[#F472B6] transition-colors font-mono font-bold placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- ACTION BUTTONS (ADD / REMOVE) --- */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <button
            onClick={addPassenger}
            className="group flex items-center justify-center gap-2 h-14 bg-[#FEF08A] border-4 border-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all"
          >
            <Plus strokeWidth={3} className="group-hover:rotate-90 transition-transform" /> 
            <span className="hidden sm:inline">Tambah Penumpang</span>
            <span className="sm:hidden">Tambah</span>
          </button>
          
          <button
            onClick={removePassenger}
            disabled={passengers.length <= 1}
            className={`
                flex items-center justify-center gap-2 h-14 border-4 border-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all
                ${passengers.length <= 1 
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none border-gray-400" 
                    : "bg-[#FB7185] text-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"
                }
            `}
          >
            <Trash2 strokeWidth={3} />
            <span className="hidden sm:inline">Hapus Penumpang</span>
            <span className="sm:hidden">Hapus</span>
          </button>
        </div>

        {/* --- CONFIRM BUTTON --- */}
        <div className="mt-12 mb-20 border-t-4 border-dashed border-black pt-8">
          <button
            onClick={handleConfirm}
            className="w-full h-16 bg-black text-white text-xl font-black uppercase border-4 border-transparent hover:bg-white hover:text-black hover:border-black shadow-[8px_8px_0px_0px_#A3E635] hover:shadow-[8px_8px_0px_0px_#000] hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
          >
            Lanjut Pembayaran <ArrowRight strokeWidth={3} />
          </button>
          <p className="text-center font-mono font-bold text-xs mt-4 text-gray-500">
             *PASTIKAN DATA SUDAH BENAR SEBELUM MELANJUTKAN
          </p>
        </div>

      </div>
    </main>
  );
};

export default PassengerInfo;