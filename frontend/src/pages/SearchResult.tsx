import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import type { Schedule } from "../features/search/searchTypes";
import {
  ArrowRight,
  Bus,
  MapPin,
  Filter,
  ArrowDownUp,
  AlertCircle
} from "lucide-react";

import {
  setCurrentBooking,
  setBookingStep,
} from "../features/booking/bookingSlice";

const SearchResult: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  /* =====================
      REDUX STATE
  ===================== */
  const { criteria, results } = useAppSelector(
    (state) => state.search
  );

  /* =====================
      HANDLERS
  ===================== */
  const handleSelectSchedule = (schedule: Schedule) => {
    dispatch(
      setCurrentBooking({
        id: schedule.id,
        scheduleId: schedule.id,
        totalPrice: schedule.price,
      })
    );

    dispatch(setBookingStep("seats"));
    navigate("/seat");
  };

  /* =====================
      HELPERS FOR DUMMY VISUALS
      (Since original Schedule type might lack these specific UI fields)
  ===================== */
  const getBusName = (schedule: any) => schedule.busName || "BUS PARTNER"; 
  const getDuration = (schedule: any) => schedule.duration || "4h 0m";
  const getSeatsAvailable = (schedule: any) => schedule.seatsAvailable || Math.floor(Math.random() * 20) + 1;

  /* =====================
      RENDER (NEOBRUTALIST STYLE)
  ===================== */
  return (
    <div className="min-h-screen bg-[#F0F0F0] p-4 md:p-8 font-sans selection:bg-black selection:text-white relative">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        
        {/* --- PAGE HEADER --- */}
        <div className="mb-8">
            <div className="inline-block bg-[#A3E635] border-4 border-black px-4 py-1 mb-2 shadow-[4px_4px_0_0_#000] rotate-[-2deg]">
                <p className="font-mono font-bold text-sm uppercase">
                    {results.length} Hasil Ditemukan
                </p>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-black uppercase leading-tight">
                Jadwal Bus <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 flex flex-wrap items-center gap-2">
                    {criteria.origin?.name || "Asal"} 
                    <ArrowRight className="inline mx-2 text-black" size={40} strokeWidth={4} /> 
                    {criteria.destination?.name || "Tujuan"}
                </span>
            </h2>
        </div>

        {/* --- FILTER BAR (Decorative) --- */}
        <div className="flex flex-wrap gap-4 mb-8 bg-white border-4 border-black p-4 shadow-[8px_8px_0_0_#000]">
            <div className="flex items-center gap-2 font-black uppercase text-lg mr-4">
                <Filter size={24} /> Filter:
            </div>
            <button className="bg-[#FEF08A] px-4 py-2 border-2 border-black font-bold uppercase hover:bg-black hover:text-[#FEF08A] transition-colors shadow-[2px_2px_0_0_#000]">
                Termurah
            </button>
            <button className="bg-white px-4 py-2 border-2 border-black font-bold uppercase hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0_0_#000]">
                Tercepat
            </button>
            <button className="bg-white px-4 py-2 border-2 border-black font-bold uppercase hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0_0_#000] flex items-center gap-2">
                Waktu <ArrowDownUp size={16}/>
            </button>
        </div>

        {/* --- RESULTS LIST --- */}
        <div className="space-y-6">
          {results.length === 0 ? (
            // Empty State
            <div className="bg-white border-4 border-black p-8 text-center shadow-[8px_8px_0_0_#000]">
               <AlertCircle size={48} className="mx-auto mb-4" />
               <p className="font-black uppercase text-xl">Tidak ada jadwal ditemukan</p>
               <p className="font-mono text-sm mt-2">Coba ubah tanggal atau rute pencarian Anda.</p>
            </div>
          ) : (
            results.map((schedule) => (
              <div 
                  key={schedule.id}
                  className="bg-white border-4 border-black shadow-[8px_8px_0_0_#000] hover:shadow-[12px_12px_0_0_#000] hover:-translate-y-1 transition-all duration-200 group relative overflow-hidden"
              >
                {/* Card Header (Bus Name) */}
                <div className="bg-black text-white p-3 flex justify-between items-center border-b-4 border-black">
                  <div className="flex items-center gap-2">
                      <Bus className="text-[#A3E635]" size={24} />
                      <span className="font-black text-xl uppercase tracking-wider">
                          {getBusName(schedule)}
                      </span>
                  </div>
                  <span className="font-mono font-bold text-xs bg-[#FB7185] text-black px-2 py-1 border border-white">
                      {getSeatsAvailable(schedule)} KURSI SISA
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  
                  {/* Time & Route (Col 1-8) */}
                  <div className="md:col-span-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                      
                      {/* Departure */}
                      <div className="flex-1">
                          <p className="text-4xl font-black text-black">{schedule.departureTime}</p>
                          <p className="font-bold uppercase text-gray-500 flex items-center justify-center md:justify-start gap-1 mt-1 text-sm">
                              <MapPin size={16} /> {criteria.origin?.name}
                          </p>
                      </div>

                      {/* Duration Graphic */}
                      <div className="flex flex-col items-center px-4 w-full md:w-auto">
                          <p className="font-mono font-bold text-xs bg-[#E5E7EB] px-2 py-1 mb-1 border-2 border-black">
                              {getDuration(schedule)}
                          </p>
                          <div className="flex items-center w-full md:w-32">
                              <div className="h-1 w-full bg-black"></div>
                              <ArrowRight size={24} className="text-black -ml-2" strokeWidth={3} />
                          </div>
                      </div>

                      {/* Arrival */}
                      <div className="flex-1">
                          <p className="text-4xl font-black text-black">{schedule.arrivalTime}</p>
                          <p className="font-bold uppercase text-gray-500 flex items-center justify-center md:justify-start gap-1 mt-1 text-sm">
                              <MapPin size={16} /> {criteria.destination?.name}
                          </p>
                      </div>
                  </div>

                  {/* Price & Action (Col 9-12) */}
                  <div className="md:col-span-4 flex flex-col items-center md:items-end justify-center border-t-4 md:border-t-0 md:border-l-4 border-dashed border-gray-300 md:pl-6 pt-4 md:pt-0">
                      <p className="font-mono text-sm font-bold text-gray-500 uppercase mb-1">Per Orang</p>
                      <p className="text-3xl font-black text-black mb-4 bg-[#A3E635] px-2 shadow-[4px_4px_0_0_#000]">
                          Rp {schedule.price.toLocaleString("id-ID")}
                      </p>
                      
                      <button 
                        onClick={() => handleSelectSchedule(schedule)}
                        className="w-full flex items-center justify-center gap-2 h-14 bg-[#FEF08A] text-black text-lg font-black uppercase border-4 border-black shadow-[4px_4px_0_0_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] active:bg-black active:text-white transition-all"
                      >
                          Pilih
                      </button>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default SearchResult;