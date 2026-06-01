import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { verifyPayment } from "../api/paymentApi";
import { getBookingDetails } from "../api/bookingApi";
import { showToast } from "../features/ui/uiSlice";
import { resetBooking } from "../features/booking/bookingSlice";
import {
  Clipboard,
  Check,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ExternalLink,
  ArrowRight,
  Clock,
  HelpCircle,
} from "lucide-react";

declare global {
  interface Window {
    snap: any;
  }
}

interface PaymentState {
  bookingId: string;
  snapToken?: string;
  orderId?: string;
  amount?: number;
  paymentType?: string;
  vaNumber?: string;
  bank?: string;
}

const WaitingPayment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  // --- STATES ---
  const stateData = location.state as PaymentState | null;
  const [bookingId, setBookingId] = useState<string>(stateData?.bookingId || "");
  const [snapToken, setSnapToken] = useState<string>(stateData?.snapToken || "");
  const [orderId, setOrderId] = useState<string>(stateData?.orderId || "");
  const [amount, setAmount] = useState<number>(stateData?.amount || 0);
  const [paymentType, setPaymentType] = useState<string>(stateData?.paymentType || "bank_transfer");
  const [vaNumber, setVaNumber] = useState<string>(stateData?.vaNumber || "");
  const [bank, setBank] = useState<string>(stateData?.bank || "BCA");

  const [bookingData, setBookingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(24 * 60 * 60); // Default 24 hours in seconds
  const [activeAccordion, setActiveAccordion] = useState<string>("mobile");

  const pollingInterval = useRef<NodeJS.Timeout | null>(null);

  // --- REDUX STATE ---
  const { currentBooking } = useAppSelector((state) => state.booking);

  // --- FETCH BOOKING DATA & SYNC STATE ---
  useEffect(() => {
    // Attempt to sync from Redux if location.state is empty
    let activeBookingId = bookingId;
    if (!activeBookingId && currentBooking) {
      activeBookingId = currentBooking.id;
      setBookingId(activeBookingId);
      setOrderId(currentBooking.bookingCode || "");
      setAmount(Number(currentBooking.totalPrice) || 0);
    }

    if (!activeBookingId) {
      dispatch(showToast({ message: "Sesi pemesanan tidak ditemukan.", type: "error" }));
      navigate("/");
      return;
    }

    const loadBookingData = async () => {
      try {
        setIsLoading(true);
        const response = await getBookingDetails(activeBookingId);
        const booking = response.data?.data || response.data;
        setBookingData(booking);

        // Map values if empty
        if (!orderId) setOrderId(booking.bookingCode);
        if (!amount) setAmount(Number(booking.totalPrice));

        // Attempt to guess payment method or retrieve from DB if updated
        if (booking.payments && booking.payments.length > 0) {
          const latestPayment = booking.payments[booking.payments.length - 1];
          setPaymentType(latestPayment.method || "bank_transfer");
          setVaNumber(latestPayment.paymentCode || "");
        }

        // Calculate countdown from booking createdAt (24 hours expiry)
        const bookingTime = booking.createdAt ? new Date(booking.createdAt).getTime() : Date.now();
        const expiryTime = bookingTime + 24 * 60 * 60 * 1000;
        const diffInSeconds = Math.max(0, Math.floor((expiryTime - Date.now()) / 1000));
        setTimeLeft(diffInSeconds);
      } catch (error) {
        console.error("Failed to load booking details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBookingData();
  }, [bookingId, currentBooking, navigate, dispatch]);

  // --- TIMER COUNTDOWN ---
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  // --- AUTO POLLING FOR STATUS ---
  useEffect(() => {
    const checkStatus = async () => {
      const activeOrderId = orderId || currentBooking?.bookingCode || bookingData?.bookingCode;
      if (!activeOrderId) return;

      try {
        const response = await verifyPayment(activeOrderId);
        const booking = response.data?.data?.booking || response.data?.data;
        const status = booking?.paymentStatus || booking?.status;

        if (status === "PAID" || status === "CONFIRMED" || booking?.status === "CONFIRMED") {
          if (pollingInterval.current) clearInterval(pollingInterval.current);
          dispatch(showToast({ message: "Pembayaran terverifikasi! Menuju tiket...", type: "success" }));
          dispatch(resetBooking());
          navigate("/success");
        }
      } catch (error) {
        // Suppress background errors to avoid annoying popups
        console.log("Background polling status verification failed.");
      }
    };

    // Run immediately once order ID is available
    if (orderId || currentBooking?.bookingCode) {
      checkStatus();
      pollingInterval.current = setInterval(checkStatus, 12000); // Poll every 12 seconds
    }

    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, [orderId, currentBooking, bookingData, navigate, dispatch]);

  // --- COPY FUNCTION ---
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    dispatch(showToast({ message: "Kode Virtual Account berhasil disalin!", type: "success" }));
    setTimeout(() => setCopied(false), 3000);
  };

  // --- MANUAL VERIFY BUTTON ---
  const handleManualVerify = async () => {
    const activeOrderId = orderId || currentBooking?.bookingCode || bookingData?.bookingCode;
    if (!activeOrderId) return;

    setIsVerifying(true);
    try {
      const response = await verifyPayment(activeOrderId);
      const booking = response.data?.data?.booking || response.data?.data;
      const status = booking?.paymentStatus || booking?.status;

      if (status === "PAID" || status === "CONFIRMED" || booking?.status === "CONFIRMED") {
        dispatch(showToast({ message: "Pembayaran Terverifikasi! Terima kasih.", type: "success" }));
        dispatch(resetBooking());
        navigate("/success");
      } else {
        dispatch(showToast({ message: "Pembayaran belum terdeteksi. Silakan lakukan pembayaran terlebih dahulu.", type: "warning" }));
      }
    } catch (error: any) {
      console.error("Manual verification failed:", error);
      dispatch(showToast({ message: error.response?.data?.message || "Gagal memverifikasi pembayaran.", type: "error" }));
    } finally {
      setIsVerifying(false);
    }
  };

  // --- RE-INITIATE MIDTRANS SNAP POPUP ---
  const handlePayNow = () => {
    if (!snapToken) {
      dispatch(showToast({ message: "Token Snap tidak tersedia. Silakan hubungi admin.", type: "error" }));
      return;
    }

    if (window.snap) {
      window.snap.pay(snapToken, {
        onSuccess: async function (result: any) {
          console.log("Re-pay success:", result);
          dispatch(resetBooking());
          navigate("/success");
        },
        onPending: function (result: any) {
          console.log("Re-pay pending:", result);
          dispatch(showToast({ message: "Status pembayaran masih tertunda.", type: "info" }));
        },
        onError: function (result: any) {
          console.log("Re-pay error:", result);
          dispatch(showToast({ message: "Pembayaran gagal.", type: "error" }));
        },
        onClose: function () {
          console.log("Re-pay popup closed");
        }
      });
    } else {
      dispatch(showToast({ message: "Sistem Midtrans Snap gagal dimuat.", type: "error" }));
    }
  };

  // --- FORMATTERS ---
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 font-display text-slate-800 dark:text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="font-semibold text-lg text-slate-600 dark:text-slate-300">Memuat detail pembayaran...</p>
        </div>
      </div>
    );
  }

  const calculatedSubtotal = amount - 5000 + 2000;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-display flex flex-col text-slate-900 dark:text-white">
      <main className="flex-grow w-full max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex p-3 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 mb-4 animate-pulse">
            <Clock className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Menunggu Pembayaran</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-md">
            Selesaikan pembayaran Anda sebelum batas waktu habis untuk mengamankan kursi bus Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Payment details & Instructions */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Countdown and VA Info */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
              
              {/* Expiry Clock */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl border border-rose-100 dark:border-rose-900/30">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold text-sm">Batas Waktu Pembayaran</span>
                </div>
                <div className="text-2xl font-bold font-mono tracking-wider">{formatTime(timeLeft)}</div>
              </div>

              {/* Bank & Code Card */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Metode Pembayaran</span>
                  <span className="px-3 py-1 bg-primary/10 text-primary font-bold rounded-lg text-sm uppercase">
                    {paymentType === "bank_transfer" || paymentType === "cstore" ? `${bank} VA` : paymentType}
                  </span>
                </div>

                <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-3">
                  <p className="text-xs text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">
                    Nomor Virtual Account
                  </p>
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-2xl sm:text-3xl font-extrabold font-mono text-primary tracking-wide break-all">
                      {vaNumber || "Lihat di Popup / Email"}
                    </div>
                    {vaNumber && (
                      <button
                        onClick={() => handleCopy(vaNumber)}
                        className={`flex items-center justify-center p-2.5 rounded-lg border transition-all ${
                          copied
                            ? "bg-green-500 border-green-500 text-white"
                            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        {copied ? <Check className="w-5 h-5" /> : <Clipboard className="w-5 h-5" />}
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Jumlah yang Harus Dibayar</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Transfer persis sampai digit terakhir</p>
                  </div>
                  <div className="text-2xl font-extrabold text-primary">{formatCurrency(amount)}</div>
                </div>
              </div>

              {/* Action Buttons inside Card */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleManualVerify}
                  disabled={isVerifying}
                  className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                  <RefreshCw className={`w-5 h-5 ${isVerifying ? "animate-spin" : ""}`} />
                  Cek Status Pembayaran
                </button>
                {snapToken && (
                  <button
                    onClick={handlePayNow}
                    className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 font-bold py-3.5 px-6 rounded-xl transition-all"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Buka Popup Pembayaran
                  </button>
                )}
              </div>
            </div>

            {/* PAYMENT INSTRUCTIONS */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <HelpCircle className="text-primary w-5 h-5" />
                <h3 className="text-lg font-bold">Panduan Pembayaran</h3>
              </div>

              {/* Accordion Headers */}
              <div className="flex border-b border-slate-100 dark:border-slate-800 text-sm font-medium">
                <button
                  onClick={() => setActiveAccordion("mobile")}
                  className={`flex-1 py-3 text-center transition-colors border-b-2 ${
                    activeAccordion === "mobile"
                      ? "border-primary text-primary font-bold"
                      : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white"
                  }`}
                >
                  M-Banking
                </button>
                <button
                  onClick={() => setActiveAccordion("atm")}
                  className={`flex-1 py-3 text-center transition-colors border-b-2 ${
                    activeAccordion === "atm"
                      ? "border-primary text-primary font-bold"
                      : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white"
                  }`}
                >
                  ATM
                </button>
                <button
                  onClick={() => setActiveAccordion("ibanking")}
                  className={`flex-1 py-3 text-center transition-colors border-b-2 ${
                    activeAccordion === "ibanking"
                      ? "border-primary text-primary font-bold"
                      : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white"
                  }`}
                >
                  Internet Banking
                </button>
              </div>

              {/* Accordion Content */}
              <div className="p-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-4">
                {activeAccordion === "mobile" && (
                  <ol className="list-decimal list-inside space-y-3">
                    <li>Buka aplikasi mobile banking Anda dan lakukan login.</li>
                    <li>Pilih menu <span className="font-semibold text-slate-800 dark:text-white">Transfer &gt; Virtual Account</span> (atau sesuai bank Anda).</li>
                    <li>Masukkan nomor Virtual Account: <span className="font-mono font-bold text-slate-800 dark:text-white">{vaNumber || "Kode VA Anda"}</span>.</li>
                    <li>Pastikan nama merchant yang muncul adalah <span className="font-semibold text-slate-800 dark:text-white">BusConnect / Midtrans</span> dan jumlah transfer persis <span className="font-semibold text-slate-800 dark:text-white">{formatCurrency(amount)}</span>.</li>
                    <li>Masukkan PIN transaksi Anda dan selesaikan pembayaran.</li>
                    <li>Halaman ini akan otomatis terupdate begitu pembayaran lunas.</li>
                  </ol>
                )}

                {activeAccordion === "atm" && (
                  <ol className="list-decimal list-inside space-y-3">
                    <li>Masukkan kartu ATM dan PIN Anda di mesin ATM terdekat.</li>
                    <li>Pilih menu <span className="font-semibold text-slate-800 dark:text-white">Transaksi Lainnya &gt; Transfer &gt; Ke Rekening Virtual Account</span>.</li>
                    <li>Masukkan nomor Virtual Account: <span className="font-mono font-bold text-slate-800 dark:text-white">{vaNumber || "Kode VA Anda"}</span>.</li>
                    <li>Periksa layar konfirmasi. Pastikan total tagihan adalah <span className="font-semibold text-slate-800 dark:text-white">{formatCurrency(amount)}</span>.</li>
                    <li>Tekan <span className="font-semibold text-slate-800 dark:text-white">Ya</span> atau <span className="font-semibold text-slate-800 dark:text-white">Setuju</span> untuk memproses transaksi.</li>
                    <li>Simpan struk ATM sebagai bukti pembayaran sah.</li>
                  </ol>
                )}

                {activeAccordion === "ibanking" && (
                  <ol className="list-decimal list-inside space-y-3">
                    <li>Akses portal internet banking Anda di browser dan lakukan login.</li>
                    <li>Arahkan ke bagian menu <span className="font-semibold text-slate-800 dark:text-white">Transfer &gt; Transaksi Virtual Account</span>.</li>
                    <li>Input nomor rekening Virtual Account: <span className="font-mono font-bold text-slate-800 dark:text-white">{vaNumber || "Kode VA Anda"}</span>.</li>
                    <li>Pastikan nilai pembayaran yang tertera adalah <span className="font-semibold text-slate-800 dark:text-white">{formatCurrency(amount)}</span>.</li>
                    <li>Masukkan token otorisasi / SMS OTP Anda.</li>
                    <li>Kirim transaksi dan simpan bukti transfer digital Anda.</li>
                  </ol>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Ticket Summary */}
          <div className="lg:col-span-4 sticky top-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
              <h3 className="text-lg font-bold">Ringkasan Tiket</h3>

              {/* Route Summary */}
              {bookingData?.schedule && (
                <div className="space-y-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Bus</p>
                    <p className="font-bold text-slate-800 dark:text-white mt-0.5">
                      {bookingData.schedule.bus?.busNumber || "Express Voyager"}
                    </p>
                    <p className="text-xs text-slate-500 uppercase mt-0.5">
                      Kategori: {bookingData.schedule.bus?.busType || "Premium"}
                    </p>
                  </div>

                  <div className="relative pl-5 border-l-2 border-primary space-y-3">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Keberangkatan</p>
                      <p className="font-bold text-sm text-slate-800 dark:text-white">
                        {bookingData.schedule.departureTime}
                      </p>
                      <p className="text-xs text-slate-500">
                        {bookingData.schedule.route?.originalTerminal?.city || "Kota Asal"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Kedatangan</p>
                      <p className="font-bold text-sm text-slate-800 dark:text-white">
                        {bookingData.schedule.arrivalTime}
                      </p>
                      <p className="text-xs text-slate-500">
                        {bookingData.schedule.route?.destinationTerminal?.city || "Kota Tujuan"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <hr className="border-slate-100 dark:border-slate-800" />

              {/* Price Details */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Harga Tiket</span>
                  <span>{formatCurrency(calculatedSubtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Biaya Layanan</span>
                  <span>{formatCurrency(5000)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Diskon Platform</span>
                  <span className="text-green-600 dark:text-green-400">-{formatCurrency(2000)}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-dashed border-slate-200 dark:border-slate-700 font-extrabold text-base">
                  <span>Total Bayar</span>
                  <span className="text-primary text-xl">{formatCurrency(amount)}</span>
                </div>
              </div>

              {/* Back to Home Button */}
              <button
                onClick={() => {
                  dispatch(resetBooking());
                  navigate("/");
                }}
                className="w-full mt-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 group text-sm"
              >
                Kembali ke Beranda
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WaitingPayment;
