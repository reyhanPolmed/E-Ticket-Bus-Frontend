import React from "react";
import { X, Disc, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../features/hooks";
import {
  setSelectedSeats,
  setBookingStep,
} from "../features/booking/bookingSlice";

const SeatSelection: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // --- REDUX STATE ---
  const { currentBooking, selectedSeats } = useAppSelector(
    (state) => state.booking
  );

  // --- STATIC SEAT LAYOUT (Simulated Data) ---
  // In a real app, this might come from currentBooking.seats or API
  const allSeats = [
    { id: '1A', status: 'available' }, { id: '1B', status: 'available' },
    { id: '1C', status: 'occupied' },  { id: '1D', status: 'occupied' },
    { id: '2A', status: 'available' }, { id: '2B', status: 'available' },
    { id: '2C', status: 'available' }, { id: '2D', status: 'available' },
    { id: '3A', status: 'occupied' },  { id: '3B', status: 'available' },
    { id: '3C', status: 'available' }, { id: '3D', status: 'available' },
    { id: '4A', status: 'available' }, { id: '4B', status: 'available' },
    { id: '4C', status: 'available' }, { id: '4D', status: 'available' },
    { id: '5A', status: 'available' }, { id: '5B', status: 'available' },
    { id: '5C', status: 'occupied' },  { id: '5D', status: 'occupied' },
    { id: '6A', status: 'available' }, { id: '6B', status: 'available' },
    { id: '6C', status: 'available' }, { id: '6D', status: 'available' },
  ];

  // --- GUARD ---
  if (!currentBooking) {
    return (
      <div className="min-h-screen bg-[#E0F2FE] flex items-center justify-center p-10 font-sans">
        <div className="bg-white border-4 border-black p-8 text-center shadow-[8px_8px_0_0_#000]">
           <p className="font-black uppercase text-xl">Tidak ada booking aktif</p>
           <button 
             onClick={() => navigate('/')}
             className="mt-4 bg-black text-white px-4 py-2 font-bold uppercase"
           >
             Kembali
           </button>
        </div>
      </div>
    );
  }

  // --- HANDLERS ---
  const handleSeatClick = (seatId: string) => {
    const isSelected = selectedSeats.find((s) => s.seatNumber === seatId);
    let updatedSeats;

    if (isSelected) {
      updatedSeats = selectedSeats.filter((s) => s.seatNumber !== seatId);
    } else {
      updatedSeats = [...selectedSeats, { seatNumber: seatId, isAvailable: true }];
    }

    dispatch(setSelectedSeats(updatedSeats));
  };

  const handleConfirmSeats = () => {
    if (selectedSeats.length === 0) {
        alert("Pilih setidaknya satu kursi!");
        return;
    }
    dispatch(setBookingStep("passengers"));
    navigate("/passenger-data");
  };

  // --- HELPERS ---
  const getSeatStatus = (seat: { id: string, status: string }) => {
      // Prioritas 1: Jika occupied dari data statis/API, maka occupied
      if (seat.status === 'occupied') return 'occupied';
      // Prioritas 2: Jika ada di Redux state selectedSeats, maka selected
      if (selectedSeats.some(s => s.seatNumber === seat.id)) return 'selected';
      // Default: available
      return 'available';
  };

  const getSeatStyle = (status: string) => {
    const base = "relative w-14 h-14 md:w-16 md:h-16 flex items-center justify-center font-mono font-bold text-lg border-4 border-black transition-all duration-150 rounded-md";
    
    switch (status) {
      case 'available':
        return `${base} bg-white text-black shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000] cursor-pointer`;
      case 'selected':
        return `${base} bg-[#FB7185] text-black shadow-none translate-x-[4px] translate-y-[4px] cursor-pointer`;
      case 'occupied':
        return `${base} bg-gray-300 text-gray-500 cursor-not-allowed opacity-60 border-gray-500`;
      default:
        return base;
    }
  };

  // Layout Logic
  const leftSeats = allSeats.filter(s => s.id.includes('A') || s.id.includes('B'));
  const rightSeats = allSeats.filter(s => s.id.includes('C') || s.id.includes('D'));

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-[#E0F2FE] p-8 font-sans selection:bg-black selection:text-white relative overflow-hidden flex flex-col items-center">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-10">
            <h1 className="text-5xl font-black uppercase text-black mb-2 drop-shadow-sm">
                Pilih Kursi
            </h1>
            <p className="font-mono font-bold bg-[#FEF08A] inline-block px-2 py-1 border-2 border-black shadow-[4px_4px_0_0_#000]">
                {/* Fallback to dummy route name if booking data doesn't provide it */}
                BUS EXECUTIVE • JKT - YGY 
            </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
            
            {/* --- LEGEND & INFO --- */}
            <div className="w-full lg:w-1/3 space-y-6">
                
                {/* Legend Box */}
                <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_#000]">
                    <h3 className="font-black uppercase text-xl mb-4 border-b-4 border-black pb-2">Keterangan</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white border-4 border-black shadow-[2px_2px_0_0_#000]"></div>
                            <span className="font-mono font-bold">TERSEDIA</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-[#FB7185] border-4 border-black"></div>
                            <span className="font-mono font-bold">DIPILIH</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-300 border-4 border-gray-500 flex items-center justify-center text-gray-500">
                                <X size={24} strokeWidth={3}/>
                            </div>
                            <span className="font-mono font-bold text-gray-500">TERISI</span>
                        </div>
                    </div>
                </div>

                {/* Selected Summary */}
                <div className="bg-[#A3E635] border-4 border-black p-6 shadow-[8px_8px_0_0_#000]">
                    <h3 className="font-black uppercase text-xl mb-2">Kursi Anda</h3>
                    {selectedSeats.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {selectedSeats.map(seat => (
                                <span key={seat.seatNumber} className="bg-black text-white px-3 py-1 font-mono font-bold text-lg">
                                    {seat.seatNumber}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="font-mono text-sm italic opacity-70 mt-2">Belum ada kursi dipilih.</p>
                    )}
                    <div className="mt-4 pt-4 border-t-4 border-black">
                        <div className="flex justify-between font-mono font-bold text-lg">
                            <span>TOTAL</span>
                            <span>{selectedSeats.length} x</span>
                        </div>
                    </div>
                </div>

                {/* Confirm Button (Desktop layout) */}
                <button
                    onClick={handleConfirmSeats}
                    disabled={selectedSeats.length === 0}
                    className="hidden lg:flex w-full bg-black text-white border-4 border-transparent hover:bg-white hover:text-black hover:border-black font-black text-xl uppercase py-4 shadow-[8px_8px_0_0_#A3E635] hover:shadow-[4px_4px_0_0_#000] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed items-center justify-center gap-2"
                >
                    Konfirmasi <ArrowRight strokeWidth={4} />
                </button>
            </div>

            {/* --- BUS LAYOUT --- */}
            <div className="w-full lg:w-2/3">
                {/* Bus Chassis Container */}
                <div className="bg-white border-4 border-black p-4 md:p-8 shadow-[12px_12px_0_0_#000] relative rounded-t-[3rem] rounded-b-lg">
                    
                    {/* Driver Area */}
                    <div className="flex justify-end mb-8 border-b-4 border-dashed border-black/20 pb-4">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-gray-200 border-4 border-black rounded-full flex items-center justify-center mb-1">
                                <Disc size={40} strokeWidth={3} className="animate-spin-slow text-black" />
                            </div>
                            <span className="font-mono font-bold text-xs bg-black text-white px-1">SUPIR</span>
                        </div>
                    </div>

                    <div className="flex justify-between gap-4 md:gap-8">
                        {/* Left Column (AB) */}
                        <div className="grid grid-cols-2 gap-3 md:gap-4">
                            {leftSeats.map((seat) => {
                                const status = getSeatStatus(seat);
                                return (
                                    <div
                                        key={seat.id}
                                        className={getSeatStyle(status)}
                                        onClick={() => status !== 'occupied' && handleSeatClick(seat.id)}
                                    >
                                        {status === 'occupied' ? <X size={28} strokeWidth={4} /> : seat.id}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Aisle / Lorong */}
                        <div className="flex-1 flex items-center justify-center">
                            <div className="h-full w-full flex flex-col items-center justify-center gap-8 opacity-20">
                                <span className="font-black text-4xl md:text-6xl tracking-[1em] [writing-mode:vertical-rl] text-center">
                                    LORONG
                                </span>
                            </div>
                        </div>

                        {/* Right Column (CD) */}
                        <div className="grid grid-cols-2 gap-3 md:gap-4">
                            {rightSeats.map((seat) => {
                                const status = getSeatStatus(seat);
                                return (
                                    <div
                                        key={seat.id}
                                        className={getSeatStyle(status)}
                                        onClick={() => status !== 'occupied' && handleSeatClick(seat.id)}
                                    >
                                        {status === 'occupied' ? <X size={28} strokeWidth={4} /> : seat.id}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Back of Bus */}
                    <div className="mt-8 pt-4 border-t-4 border-dashed border-black/20 text-center">
                        <span className="font-black text-gray-300 text-4xl uppercase">Belakang</span>
                    </div>

                </div>

                {/* Confirm Button (Mobile layout) */}
                <button
                    onClick={handleConfirmSeats}
                    disabled={selectedSeats.length === 0}
                    className="lg:hidden w-full mt-8 bg-black text-white border-4 border-transparent hover:bg-white hover:text-black hover:border-black font-black text-xl uppercase py-4 shadow-[8px_8px_0_0_#A3E635] hover:shadow-[4px_4px_0_0_#000] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    Konfirmasi <ArrowRight strokeWidth={4} />
                </button>

            </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;