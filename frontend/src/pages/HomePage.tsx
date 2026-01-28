import type React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Bus, ArrowRight } from "lucide-react"; // Icon visual

import TerminalDropdown from "../components/TerminalDropdown";
import TanggalKeberangkatanPicker from "../components/KalenderSelection";

import { setCriteria, setResults } from "../features/search/searchSlice";
import { type RootState } from "../features/store";

type Terminal = {
  id: number;
  name: string;
  city: string;
};

const HomePage: React.FC = () => {
  // =====================
  // 1. LOGIC & STATE (Diambil dari Code Pertama)
  // =====================
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [loading, setLoading] = useState(false);

  const { criteria } = useSelector((state: RootState) => state.search);

  const handleSearchSchedules = (e: React.FormEvent) => {
    e.preventDefault();

    if (!criteria.origin || !criteria.destination || !criteria.date) {
      alert("Lengkapi terminal asal, tujuan, dan tanggal keberangkatan");
      return;
    }

    setLoading(true);

    /** 🔹 DUMMY SCHEDULE LOGIC */
    // Simulasi delay sedikit agar loading state terlihat
    setTimeout(() => {
        dispatch(
          setResults([
            {
              id: 1,
              departureTime: "08:00",
              arrivalTime: "12:00",
              price: 150000,
            },
            {
              id: 2,
              departureTime: "10:00",
              arrivalTime: "14:00",
              price: 175000,
            },
            {
              id: 3,
              departureTime: "13:00",
              arrivalTime: "17:00",
              price: 200000,
            },
          ])
        );
    
        setLoading(false);
        navigate("/result");
    }, 500); // Delay 0.5 detik untuk efek UX
  };

  useEffect(() => {
    setTerminals([
      { id: 1, name: "Terminal Pulo Gebang", city: "Jakarta" },
      { id: 2, name: "Terminal Leuwipanjang", city: "Bandung" },
      { id: 3, name: "Terminal Bungurasih", city: "Surabaya" },
    ]);
  }, []);

  // =====================
  // 2. VISUAL / JSX (Diambil dari Code Neobrutalis)
  // =====================
  return (
    <main className="min-h-screen bg-[#E0F2FE] p-4 md:p-8 font-sans selection:bg-black selection:text-white relative overflow-hidden">
      
      {/* Background Decor (Grid Dots) */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
          <div className="relative">
            {/* Badge Dekoratif */}
            <div className="absolute -top-8 -left-6 bg-[#A3E635] border-4 border-black px-4 py-1 rotate-[-5deg] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-20">
               <p className="font-black font-mono text-sm uppercase">#1 Booking Platform</p>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-black uppercase leading-[0.9] tracking-tighter drop-shadow-sm">
              Cari <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 underline decoration-black decoration-8 underline-offset-4">Jadwal</span>
            </h1>
          </div>
          
          <div className="bg-white border-4 border-black p-4 rotate-3 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hidden md:block">
            <Bus size={64} strokeWidth={2.5} className="text-black" />
          </div>
        </div>

        {/* --- MAIN FORM CARD --- */}
        <div className="bg-[#FEF08A] border-4 border-black p-6 md:p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative">
          
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 bg-black text-white px-4 py-2 border-l-4 border-b-4 border-black font-mono font-bold">
            START YOUR JOURNEY
          </div>

          <p className="text-xl font-bold text-black mb-8 max-w-2xl border-l-4 border-black pl-4">
            Temukan dan pesan tiket bus Anda dengan mudah. Isi detail di bawah untuk memulai petualangan.
          </p>

          <form className="space-y-8">
            
            {/* Grid Container dengan Z-Index tinggi agar dropdown tidak tertutup */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-50">
              
              {/* === ORIGIN INPUT === */}
              <div className="space-y-2 group relative z-50">
                <label className="flex items-center gap-2 font-black uppercase text-lg">
                   <div className="bg-black text-white p-1"><MapPin size={16} /></div>
                   Terminal Asal
                </label>
                <div className="bg-white border-4 border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                  <TerminalDropdown
                    Terminals={terminals}
                    placeholder="Pilih Terminal Asal"
                    label="" // Label dikosongkan karena sudah ada custom label di atas
                    onSelect={(terminal) => dispatch(setCriteria({ origin: terminal }))}
                  />
                </div>
              </div>

              {/* === DESTINATION INPUT === */}
              <div className="space-y-2 group relative z-40">
                <label className="flex items-center gap-2 font-black uppercase text-lg">
                   <div className="bg-black text-white p-1"><MapPin size={16} /></div>
                   Terminal Tujuan
                </label>
                <div className="bg-white border-4 border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                  <TerminalDropdown
                    Terminals={terminals}
                    placeholder="Pilih Terminal Tujuan"
                    label=""
                    onSelect={(terminal) => dispatch(setCriteria({ destination: terminal }))}
                  />
                </div>
              </div>
            </div>

            {/* === DATE INPUT === */}
            <div className="space-y-2 group relative z-10">
                <label className="flex items-center gap-2 font-black uppercase text-lg">
                   <div className="bg-black text-white p-1"><Calendar size={16} /></div>
                   Tanggal Keberangkatan
                </label>
                <div className="bg-white border-4 border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                  <TanggalKeberangkatanPicker
                    value={criteria.date}
                    onChange={(date) => dispatch(setCriteria({ date: date.toISOString().split("T")[0] }))}
                  />
                </div>
            </div>

            {/* === SUBMIT BUTTON === */}
            <div className="pt-4 relative z-0">
              <button
                type="submit"
                onClick={handleSearchSchedules}
                disabled={loading}
                className="w-full relative bg-[#FB7185] text-black border-4 border-black py-4 px-8 text-2xl font-black uppercase tracking-wider shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] active:shadow-none active:translate-x-[8px] active:translate-y-[8px] transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>MENCARI...</>
                ) : (
                  <>
                    CARI JADWAL <ArrowRight strokeWidth={4} />
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </main>
  );
};

export default HomePage;