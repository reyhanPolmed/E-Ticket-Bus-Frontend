import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyBookings, getBookingDetails, cancelBooking } from "../api/bookingApi";
import { createPayment } from "../api/paymentApi";
import { useAppDispatch } from "../features/hooks";
import { showToast } from "../features/ui/uiSlice";
import { setCurrentBooking, setBookingId, setPassengerData, setSelectedSeats, setBookingStep } from "../features/booking/bookingSlice";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  TrendingUp,
  CreditCard,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronRight,
  Bus,
  Search,
  RefreshCw,
} from "lucide-react";
import type { Booking, Seat, Passenger } from "../features/booking/bookingTypes";

const BookingHistory: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // --- STATES ---
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING" | "PAID" | "CANCELLED">("ALL");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCanceling, setIsCanceling] = useState<string | null>(null);

  const handleCancelBookingClick = async (bookingId: string) => {
    const confirmCancel = window.confirm("Apakah Anda yakin ingin membatalkan pemesanan ini? Kursi yang telah dipesan akan dilepas kembali.");
    if (!confirmCancel) return;

    setIsCanceling(bookingId);
    try {
      await cancelBooking(bookingId);
      dispatch(showToast({ message: "Pemesanan berhasil dibatalkan.", type: "success" }));
      await loadHistory();
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      dispatch(showToast({ message: "Gagal membatalkan pemesanan.", type: "error" }));
    } finally {
      setIsCanceling(null);
    }
  };

  // --- FETCH BOOKING HISTORY ---
  const loadHistory = async () => {
    try {
      setIsLoading(true);
      const response = await getMyBookings();
      const fetchedBookings = response.data?.data?.bookings || response.data?.bookings || [];
      setBookings(fetchedBookings);
      setFilteredBookings(fetchedBookings);
    } catch (error) {
      console.error("Failed to load booking history:", error);
      dispatch(showToast({ message: "Gagal memuat riwayat pemesanan.", type: "error" }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // --- FILTER LOGIC ---
  useEffect(() => {
    if (activeTab === "ALL") {
      setFilteredBookings(bookings);
    } else if (activeTab === "PENDING") {
      setFilteredBookings(bookings.filter((b) => b.status === "PENDING" || b.paymentStatus === "PENDING"));
    } else if (activeTab === "PAID") {
      setFilteredBookings(bookings.filter((b) => b.status === "CONFIRMED" || b.paymentStatus === "PAID"));
    } else if (activeTab === "CANCELLED") {
      setFilteredBookings(bookings.filter((b) => b.status === "CANCELLED" || b.paymentStatus === "FAILED"));
    }
  }, [activeTab, bookings]);

  // --- RESUME/PAY BOOKING ---
  const handlePayOrResume = async (booking: Booking) => {
    try {
      dispatch(showToast({ message: "Memuat sesi pembayaran...", type: "info" }));
      
      // Fetch full details
      const response = await getBookingDetails(booking.id);
      const fullBooking = response.data?.data || response.data;

      // Map Passengers
      const passengers: Passenger[] = (fullBooking.bookingDetails || []).map((detail: any) => ({
        firstName: detail.passengerName || "",
        lastName: detail.passengerName || "",
        identityType: (detail.passengerIdType as "KTP" | "PASSPORT" | "SIM") || "KTP",
        identityNumber: detail.passengerIdNumber,
        seatNumber: detail.seatNumber,
        age: 25,
        phone: detail.passengerPhone,
        email: detail.passengerEmail,
        gender: "male",
        nationality: "Indonesia",
      }));

      // Map Seats
      const seats: Seat[] = (fullBooking.bookingDetails || []).map((detail: any) => ({
        seatNumber: detail.seatNumber,
        row: 0,
        position: 0,
        isAvailable: false,
        price: detail.price,
        seatType: "Standard",
      }));

      // Sync Redux
      dispatch(setBookingId(fullBooking.id));
      dispatch(setCurrentBooking(fullBooking));
      dispatch(setPassengerData(passengers));
      dispatch(setSelectedSeats(seats));
      dispatch(setBookingStep("payment"));

      // Generate a fresh Snap token by initiating payment on the backend to avoid duplicate transaction errors
      let token = "";
      try {
        const paymentRes = await createPayment({
          bookingId: fullBooking.id,
          method: "BCA",
          amount: Number(fullBooking.totalPrice),
        });
        token = paymentRes.data?.token || paymentRes.data?.data?.token;
      } catch (err) {
        console.error("Failed to pre-initiate payment on resume:", err);
      }

      // Route directly to /waiting-payment
      navigate("/waiting-payment", {
        state: {
          bookingId: fullBooking.id,
          snapToken: token,
          orderId: fullBooking.bookingCode,
          amount: Number(fullBooking.totalPrice),
          paymentType: "bank_transfer",
          vaNumber: "", // Will be displayed in popup
          bank: "BCA",
        }
      });
    } catch (error) {
      console.error("Failed to resume booking:", error);
      dispatch(showToast({ message: "Gagal memuat sesi pemesanan.", type: "error" }));
    }
  };

  // --- HELPERS ---
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-display text-slate-800 dark:text-white flex flex-col">
      <main className="flex-grow w-full max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Title Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Riwayat Pemesanan</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Kelola pesanan tiket bus Anda, selesaikan pembayaran tertunda, atau lihat tiket elektronik Anda.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 text-sm font-medium mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab("ALL")}
            className={`py-3 px-6 text-center transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "ALL"
                ? "border-primary text-primary font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white"
            }`}
          >
            Semua Pesanan
          </button>
          <button
            onClick={() => setActiveTab("PENDING")}
            className={`py-3 px-6 text-center transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "PENDING"
                ? "border-amber-500 text-amber-600 dark:text-amber-400 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white"
            }`}
          >
            Menunggu Pembayaran
            {bookings.filter((b) => b.status === "PENDING").length > 0 && (
              <span className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-xs font-extrabold font-mono">
                {bookings.filter((b) => b.status === "PENDING").length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("PAID")}
            className={`py-3 px-6 text-center transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "PAID"
                ? "border-green-500 text-green-600 dark:text-green-400 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white"
            }`}
          >
            Sukses (E-Tiket)
          </button>
          <button
            onClick={() => setActiveTab("CANCELLED")}
            className={`py-3 px-6 text-center transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "CANCELLED"
                ? "border-rose-500 text-rose-600 dark:text-rose-400 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white"
            }`}
          >
            Dibatalkan
          </button>
        </div>

        {/* LOADING STATE */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="font-semibold text-slate-500">Memuat riwayat tiket...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          
          /* EMPTY STATE */
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-100 dark:border-slate-800 shadow-sm max-w-md mx-auto mt-8 space-y-6">
            <div className="inline-flex p-4 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
              <Search className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Belum Ada Riwayat Tiket</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Tiket bus yang Anda pesan akan ditampilkan di sini. Mulai rencanakan perjalanan Anda sekarang!
              </p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-primary/20"
            >
              Cari Jadwal Bus
            </button>
          </div>
        ) : (
          
          /* BOOKING LIST */
          <div className="space-y-6">
            {filteredBookings.map((booking) => {
              const isPending = booking.status === "PENDING";
              const isPaid = booking.status === "CONFIRMED";
              const isCancelled = booking.status === "CANCELLED";

              return (
                <div
                  key={booking.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden hover:border-slate-200 dark:hover:border-slate-700 transition-all flex flex-col md:flex-row"
                >
                  {/* Left Column: Route & Class */}
                  <div className="p-6 flex-grow space-y-4">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{booking.schedule ? formatDate(booking.schedule.departureDate) : "-"}</span>
                        <span>•</span>
                        <span className="font-mono">#{booking.bookingCode}</span>
                      </div>
                      
                      {/* Status Badges */}
                      {isPending && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/20">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Menunggu Pembayaran
                        </span>
                      )}
                      {isPaid && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900/20">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Lunas (E-Tiket)
                        </span>
                      )}
                      {isCancelled && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/20">
                          <XCircle className="w-3.5 h-3.5" />
                          Dibatalkan
                        </span>
                      )}
                    </div>

                    {/* Timeline Details */}
                    {booking.schedule && (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 py-2">
                        {/* Boarding Point */}
                        <div className="space-y-1">
                          <p className="text-2xl font-extrabold tracking-tight">
                            {booking.schedule.departureTime}
                          </p>
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                            {booking.schedule.route?.originalTerminal?.city || "Origin"}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">
                            {booking.schedule.route?.originalTerminal?.name}
                          </p>
                        </div>

                        {/* Arrow/Duration Divider */}
                        <div className="flex-grow hidden sm:flex flex-col items-center px-4 max-w-[120px]">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {booking.schedule.bus?.busType || "Bus"}
                          </span>
                          <div className="w-full h-0.5 bg-slate-200 dark:bg-slate-800 relative my-1">
                            <div className="absolute right-0 top-1/2 -mt-1 w-2 h-2 rounded-full bg-slate-300"></div>
                          </div>
                          <span className="text-[10px] text-slate-400">1x Stop</span>
                        </div>

                        {/* Dropping Point */}
                        <div className="space-y-1 sm:text-right">
                          <p className="text-2xl font-extrabold tracking-tight">
                            {booking.schedule.arrivalTime}
                          </p>
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                            {booking.schedule.route?.destinationTerminal?.city || "Destination"}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">
                            {booking.schedule.route?.destinationTerminal?.name}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Passenger details summary */}
                    <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl flex items-center justify-between flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Bus className="w-4 h-4 text-slate-400" />
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {booking.schedule?.bus?.busNumber || "Express Voyager"}
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">|</span>
                        <span className="text-slate-500 font-medium">
                          {booking.totalPassengers} Penumpang
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {(booking.bookingDetails || []).map((detail: any, idx: number) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
                          >
                            Kursi {detail.seatNumber}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Pricing & Action CTA */}
                  <div className="p-6 md:w-64 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 flex flex-col justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="space-y-1">
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Pembayaran</p>
                      <p className="text-2xl font-extrabold text-primary">
                        {formatCurrency(Number(booking.totalPrice))}
                      </p>
                    </div>

                    {isPending ? (
                      <div className="space-y-2 w-full">
                        <button
                          onClick={() => handlePayOrResume(booking)}
                          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 text-sm font-semibold"
                        >
                          <CreditCard className="w-4 h-4" />
                          Bayar Sekarang
                        </button>
                        <button
                          onClick={() => handleCancelBookingClick(booking.id)}
                          disabled={isCanceling === booking.id}
                          className="w-full bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-400 font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs border border-rose-200 dark:border-rose-900/30 disabled:opacity-50"
                        >
                          {isCanceling === booking.id ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              Membatalkan...
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              Batalkan Pemesanan
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          dispatch(showToast({ message: "E-Tiket siap diunduh di dashboard utama Anda.", type: "success" }));
                        }}
                        disabled={isCancelled}
                        className="w-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Detail Tiket
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default BookingHistory;
