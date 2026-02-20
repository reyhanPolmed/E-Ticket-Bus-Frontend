import React, { useState } from "react";
import {
  Check,
  MapPin,
  Bus,
  Users,
  Edit2,
  Contact,
  Mail,
  Phone,
  Tag,
  ArrowRight,
  Lock,
  Headphones,
  Timer
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../features/hooks";
import { setBookingStep, setBookingId } from "../features/booking/bookingSlice";
import { createBooking } from "../api/bookingApi";
import { showToast } from "../features/ui/uiSlice";

const BookingConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { criteria } = useAppSelector((state) => state.search);
  const { selectedSeats, passengerData, currentBooking } = useAppSelector((state) => state.booking);

  // Price Calculation
  const basePricePerSeat = parseFloat(currentBooking?.totalPrice || "40000");
  const baseFare = basePricePerSeat * selectedSeats.length;
  const tax = 5000;
  const platformDiscount = 2000;
  const totalAmount = baseFare + tax - platformDiscount;

  const [_isCreating, setIsCreating] = useState(false);

  const handleProceedToPayment = async () => {
    if (!currentBooking) return;
    setIsCreating(true);
    try {
      const response = await createBooking({
        scheduleId: currentBooking.scheduleId,
        contactEmail: passengerData[0]?.email || "",
        contactPhone: passengerData[0]?.phone || "",
        passengers: passengerData.map((p) => ({
          firstName: p.firstName,
          lastName: p.lastName,
          identityNumber: p.identityNumber,
          identityType: p.identityType,
          age: p.age || 25,
          phone: p.phone,
          seatNumber: p.seatNumber,
          gender: p.gender || "male",
          nationality: p.nationality || "Indonesia",
        })),
      });
      const bookingData = response.data?.data || response.data;
      dispatch(setBookingId(bookingData.id || bookingData._id));
      dispatch(setBookingStep("payment"));
      navigate("/payment");
    } catch (error: any) {
      console.error("Failed to create booking:", error);
      dispatch(showToast({ message: error.response?.data?.message || "Gagal membuat booking. Silakan coba lagi.", type: "error" }));
    } finally {
      setIsCreating(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // If no booking data, redirect home
  if (selectedSeats.length === 0) {
    navigate("/");
    return null;
  }

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col text-[#111318]">
      {/* Top Navigation - Assuming Layout handles this, but snippet includes it. 
          If using Layout, we might not need this header, but sticking to snippet for accuracy within the page content if requested. 
          Actually, App.tsx wraps this in Layout, so we should probably skip the header if Layout provides it. 
          However, the user request explicitly provided the HTML including header. 
          I will assume Layout is present and this goes into <main>. 
          But wait, the snippet has a specific header style. 
          I'll implement the main content and let Layout handle the outer shell if possible, 
          OR I can override Layout for this page if needed. 
          For now, I'll put the snippet's content inside the Main ComponentWrapper.
      */}

      {/* Main Content Container */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 py-8 md:px-8">
        {/* Progress Stepper */}
        <div className="mb-10 max-w-3xl mx-auto">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
            {/* Step 1: Completed */}
            <div className="flex flex-col items-center gap-2 bg-background-light px-2">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
                <Check className="text-lg" size={18} />
              </div>
              <span className="text-xs font-medium text-gray-500">Selection</span>
            </div>
            {/* Step 2: Active */}
            <div className="flex flex-col items-center gap-2 bg-background-light px-2">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold border-4 border-white shadow-sm">
                2
              </div>
              <span className="text-xs font-bold text-primary">Summary</span>
            </div>
            {/* Step 3: Pending */}
            <div className="flex flex-col items-center gap-2 bg-background-light px-2">
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center font-bold">
                3
              </div>
              <span className="text-xs font-medium text-gray-500">Payment</span>
            </div>
          </div>
        </div>

        {/* Success Banner */}
        <div className="mb-8 bg-green-50 border border-green-100 rounded-xl p-4 flex items-start sm:items-center gap-4 shadow-sm">
          <div className="bg-green-100 p-2 rounded-full text-green-600 shrink-0">
            <Timer size={24} />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4">
            <div>
              <h3 className="font-bold text-green-900 text-lg">Seats Reserved</h3>
              <p className="text-green-700 text-sm">
                Your seats <span className="font-bold">{selectedSeats.map(s => s.seatNumber).join(", ")}</span> are reserved for <span className="font-bold">09:45</span> minutes. Please complete payment.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* LEFT COLUMN: Itinerary & Details */}
          <div className="flex-1 w-full space-y-6">
            <h1 className="text-3xl font-extrabold text-[#111318] tracking-tight">Review your Booking</h1>

            {/* Journey Card */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-[#111318] mb-1">
                      {criteria.origin?.name || "Origin"} to {criteria.destination?.name || "Destination"}
                    </h2>
                    <p className="text-gray-500 text-sm font-medium">Express Line Bus • AC Sleeper (2+1)</p>
                  </div>
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {criteria.date ? new Date(criteria.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "Date"}
                  </div>
                </div>

                {/* Timeline Visual */}
                <div className="flex flex-col md:flex-row gap-6 md:gap-0 mt-6 relative">
                  {/* Desktop Connector Line */}
                  <div className="hidden md:block absolute top-[26px] left-[15%] right-[15%] h-[2px] bg-gray-200 -z-0">
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-gray-400 text-xs font-medium">
                      5h 30m duration
                    </div>
                  </div>

                  {/* Departure */}
                  <div className="flex-1 flex md:flex-col items-center md:items-start gap-4 md:gap-2 z-10">
                    <div className="bg-white border-2 border-gray-200 rounded-full w-14 h-14 flex items-center justify-center shrink-0">
                      <Bus className="text-gray-600" size={24} />
                    </div>
                    <div className="md:text-center md:w-full">
                      <p className="text-xl font-bold text-[#111318]">08:00 AM</p>
                      <p className="text-sm text-gray-500 font-medium">
                        {criteria.origin?.name || "Terminal A"}
                      </p>
                    </div>
                  </div>

                  {/* Arrival */}
                  <div className="flex-1 flex md:flex-col items-center md:items-end gap-4 md:gap-2 z-10">
                    <div className="bg-white border-2 border-primary rounded-full w-14 h-14 flex items-center justify-center shrink-0 md:order-last md:mt-2">
                      <MapPin className="text-primary" size={24} />
                    </div>
                    <div className="md:text-right md:w-full md:order-first">
                      <p className="text-xl font-bold text-[#111318]">01:30 PM</p>
                      <p className="text-sm text-gray-500 font-medium">
                        {criteria.destination?.name || "Terminal B"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Boarding Point & Dropping Point</span>
                <button className="text-primary text-sm font-bold hover:underline">View on Map</button>
              </div>
            </div>

            {/* Passenger Details */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Users className="text-primary" size={20} />
                  Passenger Details
                </h3>
                <button
                  onClick={() => navigate("/passenger-data")}
                  className="text-primary text-sm font-bold hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Edit2 size={16} /> Edit
                </button>
              </div>
              <div className="space-y-4">
                {passengerData.map((passenger, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${index % 2 === 0 ? 'bg-blue-100 text-primary' : 'bg-purple-100 text-purple-600'}`}>
                        {passenger.firstName.charAt(0)}{passenger.lastName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-[#111318]">
                          {passenger.firstName} {passenger.lastName}
                          <span className="text-sm font-normal text-gray-500 ml-1">({passenger.identityType})</span>
                        </p>
                        {index === 0 && <p className="text-xs text-gray-500">Primary Passenger</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase font-bold">Seat</p>
                      <p className="text-xl font-bold text-primary">{passenger.seatNumber}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Contact className="text-primary" size={20} />
                  Contact Information
                </h3>
                <button
                  onClick={() => navigate("/passenger-data")}
                  className="text-primary text-sm font-bold hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Edit2 size={16} /> Edit
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-4">Your ticket will be sent to these details</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                  <Mail className="text-gray-400" size={20} />
                  <span className="font-medium">{passengerData[0]?.email || "N/A"}</span>
                </div>
                <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                  <Phone className="text-gray-400" size={20} />
                  <span className="font-medium">{passengerData[0]?.phone || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Summary */}
          <div className="w-full lg:w-[380px] shrink-0">
            <div className="sticky top-24 bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden">
              <div className="bg-primary/5 p-4 border-b border-primary/10">
                <h3 className="text-lg font-bold text-[#111318]">Fare Breakdown</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Base Fare ({selectedSeats.length} Seats)</span>
                  <span className="font-bold text-[#111318]">{formatCurrency(baseFare)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Tax & Fees</span>
                  <span className="font-bold text-[#111318]">{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-green-600">
                  <span className="flex items-center gap-1"><Tag size={16} /> Platform Discount</span>
                  <span className="font-bold">-{formatCurrency(platformDiscount)}</span>
                </div>
                <hr className="border-gray-100 my-2" />
                {/* Coupon Input */}
                <div className="flex gap-2">
                  <input
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-gray-400"
                    placeholder="Enter Coupon Code"
                    type="text"
                  />
                  <button className="text-primary font-bold text-sm px-3 hover:bg-primary/5 rounded-lg transition-colors">Apply</button>
                </div>
                <hr className="border-gray-100 my-2" />
                <div className="flex justify-between items-end">
                  <span className="text-lg font-bold text-[#111318]">Total Amount</span>
                  <span className="text-2xl font-extrabold text-primary">{formatCurrency(totalAmount)}</span>
                </div>
              </div>
              <div className="p-6 pt-0 bg-white">
                <button
                  onClick={handleProceedToPayment}
                  className="w-full bg-primary hover:bg-blue-700 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-blue-200 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  Proceed to Payment
                  <ArrowRight size={20} />
                </button>
                <div className="mt-4 flex items-center justify-center gap-4 text-gray-400">
                  <div className="flex items-center gap-1" title="Secure Payment">
                    <Lock size={18} />
                    <span className="text-xs font-medium">Secure Payment</span>
                  </div>
                  <div className="h-3 w-px bg-gray-300"></div>
                  <div className="flex items-center gap-1" title="24/7 Support">
                    <Headphones size={18} />
                    <span className="text-xs font-medium">24/7 Support</span>
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

export default BookingConfirmation;