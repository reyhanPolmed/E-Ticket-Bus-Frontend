import React from "react";
import {
  Check,
  Download,
  Share2,

  Bus,
  User,
  AlertTriangle,
  Home,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../features/hooks";
import { resetBooking } from "../features/booking/bookingSlice";

const BookingConfirmationNeo: React.FC = () => {
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
      <div className="p-10 text-center font-black">
        Data booking tidak ditemukan
      </div>
    );
  }

  /* =====================
     DERIVED DATA (NO UI CHANGE)
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
    time: "08:00 WIB", // dummy visual
    busName: "BUS EXECUTIVE", // dummy label
    busClass: "EXECUTIVE",
    seats: selectedSeats.map((s) => s.seatNumber),
    duration: "3h 30m", // dummy visual
  };

  const passengers = passengerData.map((p) => ({
    name: p.name,
    seat: p.seatNumber,
    id: "ID-" + Math.floor(Math.random() * 1000000000),
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
     RENDER (UI TIDAK DIUBAH)
  ===================== */
  return (
    <div className="min-h-screen bg-[#F0F0F0] py-10 px-4 font-sans text-black selection:bg-black selection:text-white">
      <div className="relative z-10 max-w-3xl mx-auto">

        {/* SUCCESS BANNER */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="bg-[#A3E635] border-4 border-black p-4 shadow mb-4">
            <Check size={48} strokeWidth={3} />
          </div>
          <h1 className="text-4xl font-black uppercase">
            Pembayaran Sukses!
          </h1>
          <p className="font-mono font-bold mt-2 bg-white px-2 py-1 border-2 border-black">
            ORDER ID: {bookingId}
          </p>
        </div>

        {/* MAIN CARD */}
        <div className="bg-white border-4 border-black shadow">
          {/* HEADER */}
          <div className="bg-[#60A5FA] border-b-4 border-black p-6 flex justify-between">
            <div className="flex items-center gap-4">
              <Bus size={32} />
              <div>
                <h2 className="text-2xl font-black uppercase">
                  {schedule.busName}
                </h2>
                <span className="bg-black text-white px-2 py-1 text-xs font-mono font-bold uppercase">
                  {schedule.busClass}
                </span>
              </div>
            </div>
            <div className="font-mono text-xl font-bold bg-white px-4 py-2 border-2 border-black">
              TIKET DIKONFIRMASI
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-6">
            <p className="font-black">
              {schedule.fromCode} → {schedule.toCode}
            </p>
            <p className="font-mono">{schedule.date}</p>

            <div className="mt-6">
              <h3 className="font-black uppercase mb-2 flex items-center gap-2">
                <User /> Daftar Penumpang
              </h3>
              {passengers.map((p, i) => (
                <div
                  key={i}
                  className="flex justify-between border-2 border-black p-2 mb-2"
                >
                  <span>{p.name}</span>
                  <span>{p.seat}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t-2 border-black pt-4">
              <p className="font-black">
                Metode Pembayaran: {payment.method}
              </p>
              <p className="font-black">
                Total: Rp {payment.total.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-6 flex gap-4">
          <button className="flex-1 border-4 border-black p-3 font-black">
            <Download /> PDF
          </button>
          <button className="flex-1 border-4 border-black p-3 font-black">
            <Share2 /> Bagikan
          </button>
          <button
            onClick={handleBackHome}
            className="flex-1 bg-black text-white p-3 font-black"
          >
            <Home /> Beranda
          </button>
        </div>

        {/* WARNING */}
        <div className="mt-8 bg-[#FB923C] border-4 border-black p-6">
          <h3 className="font-black uppercase mb-2 flex items-center gap-2">
            <AlertTriangle /> Perhatian
          </h3>
          <ul className="font-bold list-disc list-inside">
            <li>Datang 30 menit sebelum berangkat</li>
            <li>Bawa identitas asli</li>
            <li>QR Code adalah tiket sah</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default BookingConfirmationNeo;
