import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  User,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  Bus,
  ShieldCheck,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "../features/hooks";
import {
  setPassengerData,
  setBookingStep,
} from "../features/booking/bookingSlice";
import type { Passenger } from "../features/booking/bookingTypes";
import { showToast } from "../features/ui/uiSlice";

const PassengerInfo: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // --- REDUX STATE ---
  const { selectedSeats, currentBooking } = useAppSelector((state) => state.booking);

  // --- LOCAL STATE ---
  // Initialize passengers based on selected seats
  // If no seats selected (e.g. direct access), use a dummy or redirect (handled in useEffect)
  const [passengers, setPassengers] = useState<Passenger[]>(() => {
    if (selectedSeats.length === 0) return [];
    return selectedSeats.map((seat) => ({
      firstName: "",
      lastName: "",
      identityType: "KTP" as const,
      identityNumber: "",
      seatNumber: seat.seatNumber,
      email: "",
      phone: "",
      age: 0,
      gender: "male" as const,
      nationality: "Indonesia",
    }));
  });

  const [useSameContact, setUseSameContact] = useState(false);

  useEffect(() => {
    if (selectedSeats.length === 0) {
      // Redirect to seat selection if no seats selected
      navigate("/seat-selection");
    }
  }, [selectedSeats, navigate]);

  // Handle input changes
  const handleChange = (
    index: number,
    field: keyof Passenger,
    value: string
  ) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  // Sync contact info if "Use same contact" is checked
  useEffect(() => {
    if (useSameContact && passengers.length > 1) {
      const primary = passengers[0];
      const updated = passengers.map((p, index) => {
        if (index === 0) return p;
        return {
          ...p,
          email: primary.email,
          phone: primary.phone,
        };
      });
      // prevent infinite loop by checking if changes are actually needed
      const hasChanges = passengers.some((p, i) => {
        if (i === 0) return false;
        return p.email !== primary.email || p.phone !== primary.phone;
      });

      if (hasChanges) {
        setPassengers(updated);
      }
    }
  }, [useSameContact, passengers]);


  const handleUseSameContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUseSameContact(e.target.checked);
  };


  const handleProceed = () => {
    // Basic validation
    const isValid = passengers.every(
      (p) =>
        p.firstName.trim() &&
        p.lastName.trim() &&
        p.identityNumber.trim() &&
        (p.email?.trim() || p.phone?.trim())
    );

    if (!isValid) {
      dispatch(showToast({ message: "Harap isi semua field yang wajib diisi.", type: "warning" }));
      return;
    }

    dispatch(setPassengerData(passengers));
    dispatch(setBookingStep("payment"));
    navigate("/confirmation");
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Pricing from the actual booking
  const ticketPrice = parseFloat(currentBooking?.totalPrice || "0");
  const tax = 5.0;
  const totalPrice = (ticketPrice * passengers.length) + tax;


  if (selectedSeats.length === 0) return null; // or loading spinner

  return (
    <div className="bg-[#f6f6f8] dark:bg-[#101622] font-sans text-[#111318] min-h-screen flex flex-col">
      {/* Header / Navigation would be in a layout, but preserving structure here if needed or assuming strict component scope */}

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar Section */}
        <div className="mb-10 max-w-3xl">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#111318] dark:text-white tracking-tight">
              Booking Progress
            </h1>
            <span className="text-sm font-medium text-[#616f89] dark:text-gray-400">
              Step 2 of 3
            </span>
          </div>
          <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-[#135bec] w-2/3 rounded-full"></div>
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-[#135bec] font-medium">Select Seat</span>
            <span className="text-[#135bec] font-bold">Passenger Details</span>
            <span className="text-[#616f89] dark:text-gray-500">Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
          {/* Left Column: Forms */}
          <div className="lg:col-span-8 space-y-8">
            {/* Intro Text */}
            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold text-[#111318] dark:text-white tracking-tight">
                Bus Passenger Details
              </h2>
              <p className="text-[#616f89] dark:text-gray-400 text-lg">
                Please fill in the details for your upcoming trip to Manchester.
              </p>
            </div>

            {passengers.map((passenger, index) => (
              <div
                key={index}
                className="bg-white dark:bg-[#1a212e] rounded-xl border border-[#dbdfe6] dark:border-gray-800 shadow-sm overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-[#dbdfe6] dark:border-gray-800 bg-gray-50 dark:bg-[#151b26] flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span
                      className={`p-2 rounded-lg ${index === 0 ? 'bg-[#135bec]/10 text-[#135bec]' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                    >
                      {index === 0 ? <User size={20} /> : <UserPlus size={20} />}
                    </span>
                    <h3 className="font-bold text-lg text-[#111318] dark:text-white">
                      Passenger {index + 1}{" "}
                      <span className="text-[#616f89] font-normal text-base ml-1">
                        (Seat {passenger.seatNumber})
                      </span>
                    </h3>
                  </div>
                  {index === 0 && (
                    <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded border border-green-200 uppercase">
                      Primary
                    </span>
                  )}
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-[#111318] dark:text-gray-300">
                      First Name
                    </span>
                    <input
                      className="w-full rounded-lg border-[#dbdfe6] bg-white dark:bg-gray-800 dark:border-gray-700 text-[#111318] dark:text-white focus:border-[#135bec] focus:ring-4 focus:ring-[#135bec]/10 placeholder:text-gray-400 h-11 px-3 outline-none transition-shadow"
                      placeholder="e.g. James"
                      type="text"
                      value={passenger.firstName}
                      onChange={(e) => handleChange(index, "firstName", e.target.value)}
                    />
                  </label>
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-[#111318] dark:text-gray-300">
                      Last Name
                    </span>
                    <input
                      className="w-full rounded-lg border-[#dbdfe6] bg-white dark:bg-gray-800 dark:border-gray-700 text-[#111318] dark:text-white focus:border-[#135bec] focus:ring-4 focus:ring-[#135bec]/10 placeholder:text-gray-400 h-11 px-3 outline-none transition-shadow"
                      placeholder="e.g. Doe"
                      type="text"
                      value={passenger.lastName}
                      onChange={(e) => handleChange(index, "lastName", e.target.value)}
                    />
                  </label>
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-[#111318] dark:text-gray-300">
                      ID Type
                    </span>
                    <div className="relative">
                      <select
                        className="w-full rounded-lg border-[#dbdfe6] bg-white dark:bg-gray-800 dark:border-gray-700 text-[#111318] dark:text-white focus:border-[#135bec] focus:ring-4 focus:ring-[#135bec]/10 h-11 px-3 pr-10 outline-none appearance-none transition-shadow"
                        value={passenger.identityType}
                        onChange={(e) => handleChange(index, "identityType", e.target.value as any)}
                      >
                        <option value="KTP">KTP</option>
                        <option value="PASSPORT">Passport</option>
                        <option value="SIM">SIM</option>
                      </select>
                      {/* Custom dropdown arrow could go here */}
                    </div>
                  </label>
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-[#111318] dark:text-gray-300">
                      ID Number
                    </span>
                    <input
                      className="w-full rounded-lg border-[#dbdfe6] bg-white dark:bg-gray-800 dark:border-gray-700 text-[#111318] dark:text-white focus:border-[#135bec] focus:ring-4 focus:ring-[#135bec]/10 placeholder:text-gray-400 h-11 px-3 outline-none transition-shadow"
                      placeholder="Enter ID number"
                      type="text"
                      value={passenger.identityNumber}
                      onChange={(e) => handleChange(index, "identityNumber", e.target.value)}
                    />
                  </label>

                  {/* Contact Info - For Primary Passenger or separated logic */}
                  {(index === 0 || !useSameContact) && (
                    <div className="col-span-1 md:col-span-2 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700 mt-2">
                      <p className="text-sm font-semibold text-[#111318] dark:text-gray-300 mb-4">
                        Contact Information
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="block space-y-2">
                          <span className="text-sm font-medium text-[#111318] dark:text-gray-300">
                            Email Address
                          </span>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                              <Mail size={20} />
                            </span>
                            <input
                              className="w-full pl-10 rounded-lg border-[#dbdfe6] bg-white dark:bg-gray-800 dark:border-gray-700 text-[#111318] dark:text-white focus:border-[#135bec] focus:ring-4 focus:ring-[#135bec]/10 placeholder:text-gray-400 h-11 px-3 outline-none transition-shadow"
                              placeholder="name@example.com"
                              type="email"
                              value={passenger.email || ""}
                              onChange={(e) => handleChange(index, "email", e.target.value)}
                            />
                          </div>
                          {index === 0 && <p className="text-xs text-[#616f89]">Your ticket will be sent here.</p>}
                        </label>
                        <label className="block space-y-2">
                          <span className="text-sm font-medium text-[#111318] dark:text-gray-300">
                            Mobile Number
                          </span>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                              <Phone size={20} />
                            </span>
                            <input
                              className="w-full pl-10 rounded-lg border-[#dbdfe6] bg-white dark:bg-gray-800 dark:border-gray-700 text-[#111318] dark:text-white focus:border-[#135bec] focus:ring-4 focus:ring-[#135bec]/10 placeholder:text-gray-400 h-11 px-3 outline-none transition-shadow"
                              placeholder="+1 (555) 000-0000"
                              type="tel"
                              value={passenger.phone || ""}
                              onChange={(e) => handleChange(index, "phone", e.target.value)}
                            />
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  {index > 0 && (
                    <div className="col-span-1 md:col-span-2 mt-2">
                      <label className="flex items-center gap-3 p-3 border border-[#dbdfe6] dark:border-gray-700 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <input
                          type="checkbox"
                          checked={useSameContact}
                          onChange={handleUseSameContactChange}
                          className="rounded text-[#135bec] focus:ring-[#135bec] border-gray-300 dark:border-gray-600 w-5 h-5"
                        />
                        <span className="text-sm font-medium text-[#111318] dark:text-gray-200">Use same contact information for this passenger</span>
                      </label>
                    </div>
                  )}

                </div>
              </div>
            ))}

            {/* Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4">
              <button
                onClick={handleBack}
                className="px-6 py-3 rounded-lg border border-[#dbdfe6] bg-white text-[#111318] font-bold hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 transition-colors flex justify-center items-center gap-2"
              >
                <ArrowLeft size={18} /> Back
              </button>
              <button
                onClick={handleProceed}
                className="flex-1 px-8 py-3 rounded-lg bg-[#135bec] text-white font-bold hover:bg-[#114dc8] shadow-lg shadow-[#135bec]/25 transition-all transform hover:-translate-y-0.5 flex justify-center items-center gap-2"
              >
                Proceed to Payment <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Right Column: Sticky Sidebar */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-24 space-y-6">
              {/* Trip Summary Card */}
              <div className="bg-white dark:bg-[#1a212e] rounded-xl border border-[#dbdfe6] dark:border-gray-800 shadow-lg overflow-hidden">
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-[#135bec] to-[#3b82f6] p-5 text-white">
                  <h3 className="font-bold text-lg mb-1">Trip Summary</h3>
                  <div className="flex items-center gap-2 text-[#eef4ff] text-sm">
                    <Calendar size={16} />
                    <span>Fri, 24 Oct • 08:00 AM</span>
                  </div>
                </div>

                <div className="p-5">
                  {/* Route Visual */}
                  <div className="relative pl-4 border-l-2 border-dashed border-gray-300 dark:border-gray-700 space-y-8 pb-2">
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#135bec]"></div>
                      <p className="text-xs text-[#616f89] font-medium uppercase tracking-wide mb-1">
                        Origin
                      </p>
                      <p className="text-[#111318] dark:text-white font-bold text-base leading-tight">
                        London Victoria
                      </p>
                      <p className="text-xs text-[#616f89] mt-0.5">Coach Station</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 w-3.5 h-3.5 rounded-full bg-[#135bec] border-2 border-[#135bec]"></div>
                      <p className="text-xs text-[#616f89] font-medium uppercase tracking-wide mb-1">
                        Destination
                      </p>
                      <p className="text-[#111318] dark:text-white font-bold text-base leading-tight">
                        Manchester
                      </p>
                      <p className="text-xs text-[#616f89] mt-0.5">
                        Shudehill Interchange
                      </p>
                    </div>
                  </div>

                  <hr className="border-[#dbdfe6] dark:border-gray-800 my-5" />

                  {/* Bus & Seats */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-[#f6f6f8] dark:bg-gray-800/50 p-3 rounded-lg">
                      <div className="w-10 h-10 rounded bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm text-[#135bec]">
                        <Bus size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#111318] dark:text-white">
                          Express 404
                        </p>
                        <p className="text-xs text-[#616f89]">National Express</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#616f89] dark:text-gray-400">
                        Selected Seats
                      </span>
                      <span className="font-bold text-[#111318] dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {passengers.map(p => p.seatNumber).join(", ")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#616f89] dark:text-gray-400">
                        Passengers
                      </span>
                      <span className="font-medium text-[#111318] dark:text-white">
                        {passengers.length} Adults
                      </span>
                    </div>
                  </div>

                  <hr className="border-[#dbdfe6] dark:border-gray-800 my-5" />

                  {/* Price Breakdown */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#616f89] dark:text-gray-400">
                        Ticket Fare (x{passengers.length})
                      </span>
                      <span className="font-medium text-[#111318] dark:text-white">
                        ${(ticketPrice * passengers.length).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#616f89] dark:text-gray-400">
                        Taxes & Fees
                      </span>
                      <span className="font-medium text-[#111318] dark:text-white">
                        ${tax.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-end pt-2 border-t border-[#dbdfe6] dark:border-gray-800">
                    <span className="text-sm font-medium text-[#616f89] dark:text-gray-400">
                      Total Price
                    </span>
                    <span className="text-2xl font-bold text-[#135bec]">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Safety Notice */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex gap-3 border border-blue-100 dark:border-blue-900/30">
                <ShieldCheck className="text-[#135bec] flex-shrink-0" size={24} />
                <div>
                  <p className="text-sm font-bold text-[#111318] dark:text-white">
                    Secure Booking
                  </p>
                  <p className="text-xs text-[#616f89] dark:text-blue-200/70 mt-0.5">
                    Your personal data is encrypted and secure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PassengerInfo;
