import React from "react";
import {
    CheckCircle,
    ArrowRight,
    Calendar,
    Clock,
    Users,
    Armchair,
    Bus,
    Download,
    Home,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../features/hooks";
import { resetBooking } from "../features/booking/bookingSlice";

const BookingSuccess: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    /* =====================
        REDUX STATE
    ===================== */
    const { criteria } = useAppSelector((state) => state.search);
    const { currentBooking, selectedSeats, passengerData } = useAppSelector(
        (state) => state.booking
    );
    const { currentPayment } = useAppSelector(
        (state) => state.payment
    );

    // MOCK DATA FOR DEVELOPMENT (Uncomment to test without Redux state)
    // const currentBooking = { id: "123" };
    // const currentPayment = { id: "PAY-123", methodId: "bca", amount: 150000 };
    // const criteria = { 
    //     origin: { name: "Jakarta", city: "Jakarta" }, 
    //     destination: { name: "Bandung", city: "Bandung" },
    //     date: "2023-10-24"
    // };
    // const selectedSeats = [{ seatNumber: "4A" }, { seatNumber: "4B" }];
    // const passengerData = [
    //     { firstName: "John", lastName: "Doe", seatNumber: "4A" },
    //     { firstName: "Jane", lastName: "Doe", seatNumber: "4B" }
    // ];
    // const methods = [{ id: "bca", name: "BCA Virtual Account" }];

    /* =====================
        GUARD
    ===================== */
    if (!currentBooking || !currentPayment) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-10 font-sans">
                <div className="bg-white rounded-2xl p-8 text-center shadow-xl max-w-md w-full">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-6">
                        <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Data Tidak Ditemukan</h2>
                    <p className="text-gray-500 text-sm mb-6">Maaf, data booking Anda tidak tersedia. Silakan lakukan pemesanan ulang.</p>
                    <button
                        onClick={() => navigate("/")}
                        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                    >
                        Kembali ke Beranda
                    </button>
                </div>
            </div>
        );
    }

    /* =====================
        DERIVED DATA
    ===================== */
    const bookingId = `BUS-${currentPayment?.id || '88293'}`;



    const schedule = {
        from: criteria.origin?.name ?? "-",
        fromCity: criteria.origin?.city ?? "Origin",
        to: criteria.destination?.name ?? "-",
        toCity: criteria.destination?.city ?? "Destination",
        date: criteria.date ? new Date(criteria.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "-",
        time: currentBooking.schedule?.departureTime || "-",
        busName: currentBooking.schedule?.bus?.busNumber || "Express Lines",
        busClass: currentBooking.schedule?.bus?.busType || "Premium",
        seats: selectedSeats.map((s) => s.seatNumber).join(", "),
        duration: currentBooking.schedule?.route?.estimatedDuration || "-",
        passengerCount: `${passengerData.length} ${passengerData.length > 1 ? 'Adults' : 'Adult'}`,
        totalPrice: currentPayment.amount.toLocaleString("id-ID", { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }),
        rawPrice: currentPayment.amount
    };

    /* =====================
        HANDLERS
    ===================== */
    const handleBackHome = () => {
        dispatch(resetBooking());
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-white flex flex-col">
            {/* Cutout Styles */}
            <style>{`
                .ticket-cutout-l {
                    position: absolute;
                    left: -12px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                }
                .ticket-cutout-r {
                    position: absolute;
                    right: -12px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                }
            `}</style>

            {/* Main Content */}
            <main className="flex-grow flex flex-col items-center justify-start py-12 px-4 sm:px-6 lg:px-8">
                {/* Success Header */}
                <div className="w-full max-w-3xl text-center mb-10 animate-fade-in-up">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 text-blue-600 mb-6 ring-8 ring-blue-50 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-900/10">
                        <CheckCircle size={48} strokeWidth={3} />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">Payment Successful!</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-lg max-w-lg mx-auto">
                        Your booking has been confirmed. A copy of your E-ticket has been sent to your email.
                    </p>
                </div>

                {/* Ticket Container */}
                <div className="w-full max-w-[800px] relative filter drop-shadow-xl">
                    {/* Main Ticket Body */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-sm border border-gray-100 dark:border-gray-700">

                        {/* Left Section: Journey Details */}
                        <div className="flex-grow p-6 md:p-8 relative border-b md:border-b-0 md:border-r border-dashed border-gray-200 dark:border-gray-600">

                            {/* Ticket Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">E-Ticket</p>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        {schedule.fromCity} <ArrowRight className="text-gray-400" size={24} /> {schedule.toCity}
                                    </h2>
                                </div>
                                <div className="text-right">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                        Confirmed
                                    </span>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-6">
                                <div className="col-span-2 sm:col-span-1">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-1">Date</p>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="text-blue-600" size={20} />
                                        <p className="text-base font-bold text-gray-900 dark:text-white">{schedule.date}</p>
                                    </div>
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-1">Time</p>
                                    <div className="flex items-center gap-2">
                                        <Clock className="text-blue-600" size={20} />
                                        <p className="text-base font-bold text-gray-900 dark:text-white">{schedule.time}</p>
                                    </div>
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-1">Passenger(s)</p>
                                    <div className="flex items-center gap-2">
                                        <Users className="text-blue-600" size={20} />
                                        <p className="text-base font-bold text-gray-900 dark:text-white">{schedule.passengerCount}</p>
                                    </div>
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-1">Seat No(s)</p>
                                    <div className="flex items-center gap-2">
                                        <Armchair className="text-blue-600" size={20} />
                                        <p className="text-base font-bold text-gray-900 dark:text-white">{schedule.seats}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700">
                                <div className="p-2 bg-white dark:bg-gray-800 rounded-md shadow-sm">
                                    <Bus className="text-blue-600" size={24} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Operator</span>
                                    <span className="text-sm font-bold text-gray-900 dark:text-white">{schedule.busName}</span>
                                </div>
                                <div className="flex flex-col ml-auto text-right">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Class</span>
                                    <span className="text-sm font-bold text-gray-900 dark:text-white">{schedule.busClass}</span>
                                </div>
                            </div>

                            {/* Cutout Circles (Visual Ticket Metaphor) */}
                            <div className="ticket-cutout-r bg-gray-50 dark:bg-gray-900 hidden md:block z-10"></div>
                        </div>

                        {/* Right Section: QR & ID */}
                        <div className="w-full md:w-72 bg-gray-50 dark:bg-gray-900/50 p-6 md:p-8 flex flex-col items-center justify-center relative">
                            {/* Cutout Circle Left (Visual Ticket Metaphor) */}
                            <div className="ticket-cutout-l bg-gray-50 dark:bg-gray-900 hidden md:block z-10"></div>

                            <div className="bg-white p-3 rounded-xl shadow-sm mb-4">
                                {/* QR Code Placeholder/Generator */}
                                <div className="w-32 h-32 bg-gray-800 rounded-lg flex items-center justify-center text-white overflow-hidden"
                                    style={{ backgroundImage: "url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + bookingId + "')", backgroundSize: 'cover' }}>
                                </div>
                            </div>

                            <div className="text-center">
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-1">Booking ID</p>
                                <p className="text-lg font-mono font-bold tracking-widest text-gray-900 dark:text-white">#{bookingId}</p>
                            </div>

                            <div className="mt-6 w-full pt-6 border-t border-dashed border-gray-200 dark:border-gray-600">
                                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                                    <span>Total Paid</span>
                                    <span className="text-base font-bold text-gray-900 dark:text-white">Rp {schedule.rawPrice.toLocaleString("id-ID")}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                        <button className="flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 min-w-[200px]">
                            <Download size={20} />
                            <span>Download E-Ticket</span>
                        </button>
                        <button
                            onClick={handleBackHome}
                            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-white dark:bg-transparent border-2 border-gray-200 dark:border-gray-700 hover:border-blue-600 dark:hover:border-blue-500 text-gray-900 dark:text-white font-bold rounded-lg transition-all min-w-[200px] hover:text-blue-600 dark:hover:text-blue-500"
                        >
                            <Home size={20} />
                            <span>Back to Home</span>
                        </button>
                    </div>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Need help? <a className="text-blue-600 hover:underline font-medium cursor-pointer">Contact Support</a>
                    </p>
                </div>
            </main>
        </div>
    );
};

export default BookingSuccess;
