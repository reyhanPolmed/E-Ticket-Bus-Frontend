import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  Shield,
  CreditCard,
  Wallet,
  Check,
  Ticket,
  ChevronRight,
  Loader2,
  Bus,
  AlertTriangle
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "../features/hooks";
import {
  setCurrentPayment,
  setPaymentStatus,
} from "../features/payment/paymentSlice";

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  /* =====================
      REDUX STATE (LOGIC TETAP)
  ===================== */
  const { passengerData, currentBooking } = useAppSelector(
    (state) => state.booking
  );
  const { criteria } = useAppSelector((state) => state.search);
  const { methods } = useAppSelector((state) => state.payment);

  /* =====================
      LOCAL UI STATE
  ===================== */
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900);

  /* =====================
      TIMER
  ===================== */
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  /* =====================
      GUARD (NEOBRUTALIST STYLE)
  ===================== */
  if (!currentBooking || passengerData.length === 0) {
    return (
      <div className="min-h-screen bg-[#F0F0F0] flex items-center justify-center p-10">
        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_0_#000] text-center">
            <AlertTriangle className="mx-auto mb-4 w-12 h-12" />
            <h2 className="font-black text-2xl uppercase">Data Booking Tidak Lengkap</h2>
            <button 
                onClick={() => navigate('/')}
                className="mt-4 bg-black text-white px-6 py-2 font-bold uppercase hover:bg-gray-800"
            >
                Kembali ke Beranda
            </button>
        </div>
      </div>
    );
  }

  /* =====================
      CALCULATION
  ===================== */
  const pricePerSeat = currentBooking.totalPrice; // Asumsi totalPrice di booking adalah per kursi, atau sesuaikan logic ini
  const subtotal = passengerData.length * pricePerSeat;

  const selectedMethod = methods.find(
    (m) => m.id === selectedPaymentMethodId
  );

  const finalAmount = subtotal + (selectedMethod?.fee ?? 0);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  /* =====================
      HANDLER
  ===================== */
  const handlePayment = () => {
    if (!selectedMethod) return;

    setIsProcessing(true);

    setTimeout(() => {
      dispatch(
        setCurrentPayment({
          id: Date.now(),
          amount: finalAmount,
          methodId: selectedMethod.id,
        })
      );

      dispatch(setPaymentStatus("success"));
      navigate("/confirmation");
      setIsProcessing(false);
    }, 2000);
  };

  // Helper untuk icon visual (karena data API mungkin tidak ada icon component)
  const renderMethodIcon = (id: number) => {
      // Logic sederhana: ID 1 biasanya bank/kartu, lainnya wallet. Sesuaikan ID dengan data riil.
      return id === 1 ? <CreditCard size={32} /> : <Wallet size={32} />;
  };

  /* =====================
      RENDER (UI NEOBRUTALIST)
  ===================== */
  return (
    <div className="min-h-screen bg-[#F0F0F0] pb-12 font-sans selection:bg-black selection:text-white relative">
      
      {/* Pattern Background */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      {/* --- TOP NAVIGATION / STEPPER --- */}
      <div className="bg-white border-b-4 border-black sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 font-black uppercase hover:underline decoration-4 underline-offset-4"
            >
              <ArrowLeft size={24} strokeWidth={3} />
              Kembali
            </button>
            
            {/* Steps Indicator (Boxy) */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center opacity-50 grayscale">
                <span className="w-8 h-8 border-2 border-black bg-white flex items-center justify-center font-bold mr-2">1</span>
                <span className="font-bold hidden sm:inline">KURSI</span>
              </div>
              <ChevronRight size={20} strokeWidth={3} className="text-black/30" />
              <div className="flex items-center opacity-50 grayscale">
                <span className="w-8 h-8 border-2 border-black bg-white flex items-center justify-center font-bold mr-2">2</span>
                <span className="font-bold hidden sm:inline">DATA</span>
              </div>
              <ChevronRight size={20} strokeWidth={3} />
              <div className="flex items-center text-black">
                <span className="w-8 h-8 border-2 border-black bg-[#A3E635] flex items-center justify-center font-bold mr-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">3</span>
                <span className="font-black underline decoration-4 decoration-[#A3E635] underline-offset-4">BAYAR</span>
              </div>
            </div>

            <div className="w-20 hidden sm:block"></div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* --- HEADER & TIMER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-black uppercase leading-none">
              Checkout
            </h1>
            <p className="text-black font-bold mt-2 bg-white inline-block px-2 border-2 border-black">
              SELESAIKAN PEMBAYARAN ANDA
            </p>
          </div>
          
          {/* Retro Timer */}
          <div className="bg-[#FB7185] border-4 border-black p-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-1">
            <div className="flex items-center gap-3 bg-black px-4 py-2">
                <Clock size={24} className="text-[#FB7185] animate-pulse" />
                <div className="text-right">
                    <p className="text-[10px] text-[#FB7185] font-bold uppercase tracking-wider leading-none mb-1">Sisa Waktu</p>
                    <p className="text-2xl font-mono font-bold text-white leading-none">{formatTime(timeLeft)}</p>
                </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- LEFT COLUMN --- */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Trip Summary Card */}
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="bg-black text-white px-6 py-3 border-b-4 border-black flex justify-between items-center">
                <h3 className="font-bold flex items-center gap-2 uppercase">
                  <Bus size={20} className="text-[#A3E635]" /> 
                  Rute Perjalanan
                </h3>
                {/* Fallback jika busName tidak ada di criteria/booking */}
                <span className="text-xs font-mono font-bold px-2 py-1 bg-[#A3E635] text-black border border-white">
                   EXECUTIVE CLASS
                </span>
              </div>
              
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between gap-8 relative">
                  {/* Dashed Line for Desktop */}
                  <div className="hidden md:block absolute top-1/2 left-0 w-full border-t-4 border-dashed border-black/20 -z-10 transform -translate-y-1/2"></div>

                  <div className="flex-1 bg-white md:pr-4 relative z-10">
                    <p className="text-xs font-bold bg-black text-white inline-block px-2 mb-2">BERANGKAT</p>
                    {/* Menggunakan data dinamis dari Redux */}
                    <p className="font-black text-2xl uppercase">{criteria.origin?.name}</p>
                    <p className="font-mono font-bold text-gray-500">{criteria.date}</p>
                  </div>

                  <div className="flex flex-col items-center justify-center bg-white px-4 border-2 border-black h-min self-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[-2deg]">
                    <p className="font-mono font-bold text-sm">DIRECT</p>
                  </div>

                  <div className="flex-1 bg-white md:pl-4 text-left md:text-right relative z-10">
                    <p className="text-xs font-bold bg-[#FB7185] text-black inline-block px-2 mb-2 border border-black">TUJUAN</p>
                    <p className="font-black text-2xl uppercase">{criteria.destination?.name}</p>
                    <p className="font-mono font-bold text-gray-500">ESTIMASI</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods Selection */}
            <div>
              <h3 className="font-black text-2xl uppercase mb-4 flex items-center gap-2">
                <span className="bg-black text-white w-8 h-8 flex items-center justify-center text-lg">2</span> 
                Pilih Pembayaran
              </h3>
              
              <div className="space-y-4">
                {methods.map((method) => (
                  <label
                    key={method.id}
                    className={`
                      relative flex items-center p-4 md:p-6 border-4 cursor-pointer transition-all duration-200 group
                      ${selectedPaymentMethodId === method.id 
                        ? "bg-[#22D3EE] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]" 
                        : "bg-white border-black hover:bg-gray-50 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      className="hidden"
                      value={method.id}
                      onChange={() => setSelectedPaymentMethodId(method.id)}
                    />
                    
                    {/* Icon Box */}
                    <div className={`
                      w-16 h-16 border-2 border-black flex items-center justify-center mr-6 shrink-0
                      ${selectedPaymentMethodId === method.id ? "bg-white text-black" : "bg-[#F0F0F0] text-gray-400 group-hover:bg-white group-hover:text-black"}
                    `}>
                      {renderMethodIcon(method.id)}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-black text-xl uppercase">{method.name}</span>
                      </div>
                      <p className="font-mono font-bold text-sm mt-1 opacity-70">{method.description}</p>
                    </div>

                    <div className="text-right pl-4">
                      {method.fee === 0 ? (
                        <span className="bg-[#A3E635] border-2 border-black px-2 py-1 text-xs font-bold uppercase">Gratis</span>
                      ) : (
                        <span className="font-mono font-bold">+ {formatCurrency(method.fee)}</span>
                      )}
                    </div>

                    {/* Checkmark Indicator */}
                    {selectedPaymentMethodId === method.id && (
                      <div className="absolute top-0 right-0 -mt-3 -mr-3 bg-black text-white border-2 border-white p-1 shadow-lg">
                        <Check size={20} strokeWidth={4} />
                      </div>
                    )}
                  </label>
                ))}
              </div>

              {/* Security Banner */}
              <div className="mt-6 border-2 border-black bg-[#E0F2FE] p-4 flex items-center gap-4 border-dashed">
                <Shield className="text-black shrink-0" size={24} strokeWidth={2.5} />
                <p className="text-sm font-bold font-mono">
                  ENKRIPSI SSL 256-BIT DIAKTIFKAN. DATA ANDA AMAN 100%.
                </p>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN (SUMMARY) --- */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              
              {/* Summary Card "The Receipt" */}
              <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative">
                {/* Perforation effect top */}
                <div className="absolute -top-2 left-0 w-full h-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIiBmaWxsPSIjRjBGMEYwIj48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSI4IiAvPjwvc3ZnPg==')] bg-repeat-x"></div>

                <div className="bg-black p-4 mt-2 mx-2 text-center">
                  <h3 className="text-white font-black text-xl uppercase tracking-widest flex justify-center items-center gap-2">
                    <Ticket size={24} className="text-[#FEF08A]" />
                    TOTAL BIAYA
                  </h3>
                </div>

                <div className="p-6 font-mono">
                  {/* Passenger List */}
                  <div className="mb-6 space-y-3">
                    <p className="font-bold border-b-2 border-black pb-1 mb-2">ITEM PEMBELIAN</p>
                    {passengerData.map((p, i) => (
                      <div key={i} className="flex justify-between items-start text-sm font-bold">
                        <div>
                          <p>{p.name.toUpperCase()}</p>
                          <p className="text-xs text-gray-500">KURSI {p.seatNumber}</p>
                        </div>
                        <p>{formatCurrency(pricePerSeat)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Calculations */}
                  <div className="space-y-2 text-sm border-t-2 border-dashed border-black pt-4">
                    <div className="flex justify-between font-bold text-gray-600">
                      <span>SUBTOTAL</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    
                    {selectedMethod && (
                      <div className="flex justify-between font-bold text-black animate-in fade-in slide-in-from-top-1">
                        <span>BIAYA ADM</span>
                        <span>
                          {selectedMethod.fee === 0 ? "RP 0" : formatCurrency(selectedMethod.fee)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="border-t-4 border-black mt-4 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-black text-xl uppercase">TOTAL</span>
                      <span className="text-2xl font-black text-black bg-[#A3E635] px-2">
                        {formatCurrency(finalAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Pay Button */}
                  <button
                    onClick={handlePayment}
                    disabled={!selectedPaymentMethodId || isProcessing}
                    className={`
                      w-full mt-6 py-4 font-black text-xl uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all relative overflow-hidden
                      flex items-center justify-center gap-2 group
                      ${!selectedPaymentMethodId || isProcessing
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none border-gray-400"
                        : "bg-[#FEF08A] hover:bg-[#A3E635] text-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"
                      }
                    `}
                  >
                    {isProcessing ? (
                       <>
                        <Loader2 className="animate-spin" size={24} strokeWidth={3} />
                        MEMPROSES...
                       </>
                    ) : (
                      <>
                        BAYAR SEKARANG
                        <ChevronRight size={24} strokeWidth={4} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                  
                  <p className="text-center text-[10px] font-bold mt-4 uppercase text-gray-500">
                    *Syarat & Ketentuan berlaku
                  </p>
                </div>
              </div>

              {/* Promo Code Boxy */}
              <div className="bg-black p-1 shadow-[8px_8px_0px_0px_rgba(163,230,53,1)]">
                <div className="bg-white border-2 border-black p-2 flex gap-2">
                   <input 
                      type="text" 
                      placeholder="KODE PROMO" 
                      className="flex-1 bg-[#F0F0F0] border-2 border-black px-3 py-2 text-sm font-mono font-bold focus:outline-none focus:bg-[#FEF08A] transition-colors placeholder:text-gray-400"
                   />
                   <button className="bg-black text-white font-bold text-sm px-4 border-2 border-black hover:bg-white hover:text-black transition-colors uppercase">
                      CEK
                   </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* --- FULL SCREEN LOADING OVERLAY (Retro) --- */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#FEF08A] border-4 border-black p-8 shadow-[16px_16px_0px_0px_#A3E635] max-w-sm w-full mx-4 text-center animate-in zoom-in-95 duration-200">
             <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-white border-4 border-black grid grid-cols-2 grid-rows-2 animate-spin">
                    <div className="bg-black"></div>
                    <div></div>
                    <div></div>
                    <div className="bg-black"></div>
                </div>
             </div>
            <h3 className="text-2xl font-black uppercase text-black mb-2 glitch-effect">JANGAN KELUAR!</h3>
            <p className="font-mono font-bold text-sm bg-white border-2 border-black p-2 inline-block">
              MENGHUBUNGKAN GATEWAY...
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

export default Payment;