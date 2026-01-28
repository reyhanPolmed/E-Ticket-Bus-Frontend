import React from "react";
import {
  Check,
  Download,
  Share2,
  Calendar,
  CreditCard,
  Bus,
  QrCode,
  User,
  ArrowRight,
  AlertTriangle,
  Home
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../features/hooks";
import { resetBooking } from "../features/booking/bookingSlice";

const BookingConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  /* =====================
      REDUX STATE
  ===================== */
  const { criteria } = useAppSelector((state) => state.search);
  const { currentBooking, selectedSeats, passengerData } = useAppSelector(
    (state) => state.booking
  );
  const { currentPayment, methods } = useAppSelector(
    (state) => state.payment
  );

  /* =====================
      GUARD
  ===================== */
  if (!currentBooking || !currentPayment) {
    return (
      <div className="min-h-screen bg-[#F0F0F0] flex items-center justify-center p-10 font-sans">
        <div className="bg-white border-4 border-black p-8 text-center shadow-[8px_8px_0_0_#000]">
          <h2 className="text-2xl font-black uppercase mb-2">Data Tidak Ditemukan</h2>
          <p className="font-mono text-sm mb-6">Maaf, data booking Anda tidak tersedia.</p>
          <button 
            onClick={() => navigate("/")}
            className="bg-black text-white px-6 py-2 font-black uppercase hover:bg-gray-800 transition-colors"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  /* =====================
      DERIVED DATA (LOGIC KEPT)
  ===================== */
  const bookingId = `BK-${currentPayment.id}`;

  const paymentMethod = methods.find(
    (m) => m.id === currentPayment.methodId
  );

  const schedule = {
    from: criteria.origin?.name ?? "-",
    fromCode: criteria.origin?.name?.slice(0, 3).toUpperCase() ?? "---",
    fromTerminal: criteria.origin?.name ?? "-",
    to: criteria.destination?.name ?? "-",
    toCode: criteria.destination?.name?.slice(0, 3).toUpperCase() ?? "---",
    toTerminal: criteria.destination?.name ?? "-",
    date: criteria.date ?? "-",
    time: "08:00 WIB", // dummy visual kept as per original logic
    busName: "BUS EXECUTIVE", // dummy label kept as per original logic
    busClass: "EXECUTIVE",
    seats: selectedSeats.map((s) => s.seatNumber),
    duration: "3h 30m", // dummy visual kept as per original logic
  };

  const passengers = passengerData.map((p) => ({
    name: p.name,
    seat: p.seatNumber,
    id: "ID-" + Math.floor(Math.random() * 1000000000), // dummy ID generation kept
  }));

  const payment = {
    method: paymentMethod?.name ?? "-",
    total: currentPayment.amount,
    status: "PAID",
  };

  /* =====================
      HANDLERS
  ===================== */
  const handleBackHome = () => {
    dispatch(resetBooking());
    navigate("/");
  };

  /* =====================
      RENDER (NEOBRUTALIST STYLE APPLIED)
  ===================== */
  return (
    <div className="min-h-screen bg-[#F0F0F0] py-10 px-4 font-sans text-black selection:bg-black selection:text-white">
      {/* Background Pattern */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        
        {/* --- SUCCESS BANNER --- */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="bg-[#A3E635] border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-4 rotate-[-2deg]">
            <Check size={48} strokeWidth={3} className="text-black" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight italic">
            Pembayaran Sukses!
          </h1>
          <p className="font-mono font-bold mt-2 bg-white px-2 py-1 border-2 border-black">
            ORDER ID: {bookingId}
          </p>
        </div>

        {/* --- MAIN TICKET CARD --- */}
        <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          
          {/* Header Bar */}
          <div className="bg-[#60A5FA] border-b-4 border-black p-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white border-2 border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Bus size={32} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase">{schedule.busName}</h2>
                <span className="bg-black text-white px-2 py-1 text-xs font-mono font-bold uppercase">
                  {schedule.busClass}
                </span>
              </div>
            </div>
            <div className="font-mono text-xl font-bold bg-white px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform md:rotate-2">
              TIKET DIKONFIRMASI
            </div>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Left Content */}
            <div className="flex-1 p-6 md:p-8">
              
              {/* Route Block */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 bg-[#FEF08A] p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-center md:text-left">
                  <p className="text-4xl font-black">{schedule.fromCode}</p>
                  <p className="font-bold text-sm uppercase mt-1">{schedule.fromTerminal}</p>
                  <div className="mt-2 inline-block bg-black text-[#A3E635] px-2 py-1 font-mono font-bold">
                    {schedule.time}
                  </div>
                </div>

                <div className="flex flex-col items-center">
                   <p className="font-mono font-bold text-xs mb-1">{schedule.duration}</p>
                   <ArrowRight size={32} strokeWidth={3} />
                </div>

                <div className="text-center md:text-right">
                  <p className="text-4xl font-black">{schedule.toCode}</p>
                  <p className="font-bold text-sm uppercase mt-1">{schedule.toTerminal}</p>
                  <div className="mt-2 inline-block bg-white border-2 border-black px-2 py-1 font-mono font-bold text-xs">
                    Est. Tiba 11:30
                  </div>
                </div>
              </div>

              {/* Detail Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                 <div className="border-2 border-black p-3">
                    <div className="flex items-center gap-2 mb-1">
                        <Calendar size={18} strokeWidth={2.5} />
                        <span className="font-black uppercase text-xs">Tanggal</span>
                    </div>
                    <p className="font-mono font-bold text-lg">{schedule.date}</p>
                 </div>
                 <div className="border-2 border-black p-3">
                    <div className="flex items-center gap-2 mb-1">
                        <CreditCard size={18} strokeWidth={2.5} />
                        <span className="font-black uppercase text-xs">Total</span>
                    </div>
                    <p className="font-mono font-bold text-lg">Rp {payment.total.toLocaleString("id-ID")}</p>
                 </div>
              </div>

              {/* Passengers */}
              <div>
                <h3 className="font-black text-xl mb-4 uppercase flex items-center gap-2">
                    <User strokeWidth={3} /> Daftar Penumpang
                </h3>
                <div className="space-y-3">
                    {passengers.map((p, i) => (
                        <div key={i} className="flex justify-between items-center bg-white border-2 border-black p-3 hover:bg-[#FB7185] hover:text-white transition-colors cursor-default group">
                            <div>
                                <p className="font-bold uppercase group-hover:text-white">{p.name}</p>
                                <p className="font-mono text-xs text-gray-600 group-hover:text-black">{p.id}</p>
                            </div>
                            <div className="bg-black text-white px-3 py-1 font-mono font-bold group-hover:bg-white group-hover:text-black border border-transparent group-hover:border-black">
                                {p.seat}
                            </div>
                        </div>
                    ))}
                </div>
              </div>

            </div>

            {/* Right Sidebar (QR & Actions) */}
            <div className="lg:w-1/3 border-t-4 lg:border-t-0 lg:border-l-4 border-black bg-[#F472B6] p-6 flex flex-col justify-between">
                
                <div className="bg-white border-4 border-black p-4 mb-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mx-auto rotate-1">
                    <QrCode size={120} className="w-full h-auto" />
                    <p className="text-center font-mono font-bold text-xs mt-2 uppercase">Scan saat Boarding</p>
                </div>

                <div className="space-y-4">
                    <button className="w-full bg-white border-2 border-black p-3 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2">
                        <Download size={20} strokeWidth={3} />
                        Simpan PDF
                    </button>
                    <button className="w-full bg-[#A3E635] border-2 border-black p-3 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2">
                        <Share2 size={20} strokeWidth={3} />
                        Bagikan
                    </button>
                    <button 
                        onClick={handleBackHome}
                        className="w-full bg-black text-white border-2 border-white hover:border-black hover:bg-white hover:text-black p-3 font-black uppercase transition-colors flex items-center justify-center gap-2"
                    >
                        <Home size={20} strokeWidth={3} />
                        Beranda
                    </button>
                </div>

            </div>
          </div>
        </div>

        {/* --- WARNING BOX --- */}
        <div className="mt-8 bg-[#FB923C] border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="font-black text-xl uppercase mb-3 flex items-center gap-2">
                <AlertTriangle strokeWidth={3} /> Perhatian!
            </h3>
            <ul className="list-disc list-inside font-bold space-y-1">
                <li>Datang 30 menit sebelum keberangkatan.</li>
                <li>Bawa identitas asli (KTP/SIM).</li>
                <li>QR Code di atas adalah tiket sah Anda.</li>
            </ul>
        </div>

      </div>
    </div>
  );
};

export default BookingConfirmation;