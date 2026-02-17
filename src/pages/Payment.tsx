import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { setCurrentPayment, setPaymentStatus } from "../features/payment/paymentSlice";
import { createPayment } from "../api/paymentApi";

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { passengerData, currentBooking, bookingId } = useAppSelector((state) => state.booking);
  const { criteria } = useAppSelector((state) => state.search);

  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<number | null>(1); // Default to BCA
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(599); // 09:59

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  if (!currentBooking || passengerData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 bg-background-light dark:bg-background-dark">
        <h2 className="text-2xl font-bold mb-4 text-[#111318] dark:text-white">No Active Booking Found</h2>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const pricePerSeat = parseFloat(currentBooking.totalPrice);
  const subtotal = passengerData.length * pricePerSeat;
  const serviceFee = 0;
  const tax = 0;
  const discount = 0;
  const totalAmount = subtotal + serviceFee + tax - discount;

  // Map payment method IDs to method names for API
  const paymentMethodMap: Record<number, string> = {
    1: "BCA",
    2: "Mandiri",
    3: "GoPay",
    4: "OVO",
    5: "Visa",
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethodId || !bookingId) {
      if (!bookingId) {
        alert("No booking ID found. Please go back and try again.");
        return;
      }
      return;
    }
    setIsProcessing(true);
    try {
      const response = await createPayment({
        bookingId: bookingId,
        method: paymentMethodMap[selectedPaymentMethodId] || "BCA",
        amount: totalAmount,
      });
      console.log("Payment response:", response);
      const paymentData = response.data?.data || response.data;
      dispatch(setCurrentPayment({
        id: paymentData.id || paymentData._id || String(Date.now()),
        amount: totalAmount,
        method: paymentMethodMap[selectedPaymentMethodId] || "BCA",
        bookingId: bookingId,
        status: "success",
      }));
      dispatch(setPaymentStatus("success"));
      navigate("/success");
    } catch (error: any) {
      console.error("Payment failed:", error);
      dispatch(setPaymentStatus("failed"));
      alert(error.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper to get method ID by name for the UI sections
  // Or we can just use the IDs we set in paymentSlice:
  // 1: BCA, 2: Mandiri, 3: GoPay, 4: OVO, 5: Visa

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-[#111318] dark:text-white min-h-screen flex flex-col">
      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Timer & Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#111318] dark:text-white">Complete Your Payment</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Order ID: <span className="font-mono font-medium text-primary">#882319922</span></p>
          </div>
          {/* Countdown Timer */}
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg border border-red-100 dark:border-red-900/30">
            <span className="material-symbols-outlined text-xl">timer</span>
            <span className="font-bold font-mono">{formatTime(timeLeft)}</span>
            <span className="text-sm font-medium">remaining</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Panel: Payment Methods */}
          <div className="flex-1 space-y-6">
            {/* Payment Selection Container */}
            <div className="bg-white dark:bg-[#1a202c] rounded-xl shadow-sm border border-[#f0f2f4] dark:border-[#2d3748] overflow-hidden">
              <div className="p-6 border-b border-[#f0f2f4] dark:border-[#2d3748]">
                <h3 className="text-lg font-bold">Choose Payment Method</h3>
              </div>
              <div className="p-6 space-y-6">

                {/* Virtual Accounts */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Virtual Account</h4>

                  {/* BCA (ID: 1) */}
                  <label className={`relative flex items-center p-4 border rounded-xl cursor-pointer transition-all ${selectedPaymentMethodId === 1 ? 'border-2 border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-white dark:bg-[#1a202c]'}`}>
                    <input
                      type="radio"
                      name="payment_method"
                      className="sr-only"
                      checked={selectedPaymentMethodId === 1}
                      onChange={() => setSelectedPaymentMethodId(1)}
                    />
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-2 shadow-sm border border-slate-100">
                        <div className="font-bold text-blue-800 italic">BCA</div>
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-[#111318] dark:text-white">BCA Virtual Account</div>
                        <div className="text-sm text-slate-500">Automatic verification</div>
                      </div>
                      {selectedPaymentMethodId === 1 ? (
                        <div className="text-primary">
                          <span className="material-symbols-outlined">check_circle</span>
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600"></div>
                      )}
                    </div>
                  </label>

                  {/* Mandiri (ID: 2) */}
                  <label className={`relative flex items-center p-4 border rounded-xl cursor-pointer transition-all ${selectedPaymentMethodId === 2 ? 'border-2 border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-white dark:bg-[#1a202c]'}`}>
                    <input
                      type="radio"
                      name="payment_method"
                      className="sr-only"
                      checked={selectedPaymentMethodId === 2}
                      onChange={() => setSelectedPaymentMethodId(2)}
                    />
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-2 shadow-sm border border-slate-100">
                        <div className="font-bold text-yellow-600">Mandiri</div>
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-[#111318] dark:text-white">Mandiri Virtual Account</div>
                        <div className="text-sm text-slate-500">Automatic verification</div>
                      </div>
                      {selectedPaymentMethodId === 2 ? (
                        <div className="text-primary">
                          <span className="material-symbols-outlined">check_circle</span>
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600"></div>
                      )}
                    </div>
                  </label>
                </div>

                {/* E-Wallets */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">E-Wallet</h4>

                  {/* GoPay (ID: 3) */}
                  <label className={`relative flex items-center p-4 border rounded-xl cursor-pointer transition-all ${selectedPaymentMethodId === 3 ? 'border-2 border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-white dark:bg-[#1a202c]'}`}>
                    <input
                      type="radio"
                      name="payment_method"
                      className="sr-only"
                      checked={selectedPaymentMethodId === 3}
                      onChange={() => setSelectedPaymentMethodId(3)}
                    />
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-2 shadow-sm border border-slate-100">
                        <span className="material-symbols-outlined text-blue-500">account_balance_wallet</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-[#111318] dark:text-white">GoPay</div>
                        <div className="text-sm text-slate-500">Connect your account</div>
                      </div>
                      {selectedPaymentMethodId === 3 ? (
                        <div className="text-primary">
                          <span className="material-symbols-outlined">check_circle</span>
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600"></div>
                      )}
                    </div>
                  </label>

                  {/* OVO (ID: 4) */}
                  <label className={`relative flex items-center p-4 border rounded-xl cursor-pointer transition-all ${selectedPaymentMethodId === 4 ? 'border-2 border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-white dark:bg-[#1a202c]'}`}>
                    <input
                      type="radio"
                      name="payment_method"
                      className="sr-only"
                      checked={selectedPaymentMethodId === 4}
                      onChange={() => setSelectedPaymentMethodId(4)}
                    />
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-2 shadow-sm border border-slate-100">
                        <span className="material-symbols-outlined text-purple-500">payments</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-[#111318] dark:text-white">OVO</div>
                        <div className="text-sm text-slate-500">Connect your account</div>
                      </div>
                      {selectedPaymentMethodId === 4 ? (
                        <div className="text-primary">
                          <span className="material-symbols-outlined">check_circle</span>
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600"></div>
                      )}
                    </div>
                  </label>
                </div>

                {/* Credit Card */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Credit / Debit Card</h4>

                  {/* Visa / Mastercard (ID: 5) */}
                  <label className={`relative flex items-center p-4 border rounded-xl cursor-pointer transition-all ${selectedPaymentMethodId === 5 ? 'border-2 border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-white dark:bg-[#1a202c]'}`}>
                    <input
                      type="radio"
                      name="payment_method"
                      className="sr-only"
                      checked={selectedPaymentMethodId === 5}
                      onChange={() => setSelectedPaymentMethodId(5)}
                    />
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-2 shadow-sm border border-slate-100">
                        <span className="material-symbols-outlined text-slate-700">credit_card</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-[#111318] dark:text-white">Visa / Mastercard</div>
                        <div className="text-sm text-slate-500">Credit or debit card</div>
                      </div>
                      {selectedPaymentMethodId === 5 ? (
                        <div className="text-primary">
                          <span className="material-symbols-outlined">check_circle</span>
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600"></div>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Booking Summary */}
          <div className="lg:w-[400px] flex-shrink-0 space-y-6">
            <div className="bg-white dark:bg-[#1a202c] rounded-xl shadow-sm border border-[#f0f2f4] dark:border-[#2d3748] sticky top-8">
              <div className="p-6 border-b border-[#f0f2f4] dark:border-[#2d3748]">
                <h3 className="text-lg font-bold">Booking Details</h3>
              </div>
              <div className="p-6 space-y-6">
                {/* Route Visualizer */}
                <div className="relative pl-4 border-l-2 border-dashed border-slate-200 dark:border-slate-700 space-y-8">
                  {/* Origin */}
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 border-primary bg-white"></div>
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-slate-500 uppercase">Origin</span>
                      <h4 className="font-bold text-lg leading-tight">{criteria.origin?.name}</h4>
                      <p className="text-sm text-slate-500">{criteria.origin?.address || "Main Terminal"}</p>
                      <p className="text-xs font-medium text-slate-400">{criteria.date} • {currentBooking.schedule?.departureTime}</p>
                    </div>
                  </div>
                  {/* Destination */}
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-primary"></div>
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-slate-500 uppercase">Destination</span>
                      <h4 className="font-bold text-lg leading-tight">{criteria.destination?.name}</h4>
                      <p className="text-sm text-slate-500">{criteria.destination?.address || "Main Terminal"}</p>
                      <p className="text-xs font-medium text-slate-400">{criteria.date} • {currentBooking.schedule?.arrivalTime}</p>
                    </div>
                  </div>
                </div>

                {/* Bus Info Card */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg flex gap-3 items-start">
                  <div className="h-10 w-10 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center shadow-sm text-primary">
                    <span className="material-symbols-outlined">directions_bus</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-sm">{currentBooking.schedule?.bus?.busNumber || "Bus"}</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{currentBooking.schedule?.bus?.busType || "Standard"} Class • {currentBooking.schedule?.bus?.busNumber || ""}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400">AC</span>
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400">Wifi</span>
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400">Toilet</span>
                    </div>
                  </div>
                </div>

                {/* Seats */}
                <div className="flex justify-between items-center border-t border-[#f0f2f4] dark:border-[#2d3748] pt-4">
                  <span className="text-sm font-medium text-slate-500">Selected Seats</span>
                  <div className="flex gap-2 flex-wrap justify-end">
                    {passengerData.map((p, idx) => (
                      <span key={idx} className="px-3 py-1 bg-primary text-white text-sm font-bold rounded-lg shadow-sm">
                        {p.seatNumber}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 pt-4 border-t border-[#f0f2f4] dark:border-[#2d3748]">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Ticket Price (x{passengerData.length})</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Service Fee</span>
                    <span className="font-medium">{formatCurrency(serviceFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tax</span>
                    <span className="font-medium">{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600">
                    <span className="font-medium">Discount</span>
                    <span className="font-medium">- {formatCurrency(discount)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="bg-primary/5 -mx-6 -mb-6 p-6 mt-4 border-t border-primary/10">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Total Amount</span>
                    <span className="text-2xl font-bold text-primary">{formatCurrency(totalAmount)}</span>
                  </div>
                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <span className="material-symbols-outlined animate-spin">refresh</span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[20px]">lock</span>
                        Pay Securely
                      </>
                    )}
                  </button>
                  <div className="flex items-center justify-center gap-2 mt-3 text-xs text-slate-400">
                    <span className="material-symbols-outlined text-[16px]">verified_user</span>
                    <span>Guaranteed Secure Payment with SSL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Payment;