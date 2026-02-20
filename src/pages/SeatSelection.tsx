import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import {
    setSelectedSeats,
    setBookingStep,
} from "../features/booking/bookingSlice";
import { getBusSeats } from "../api/seatApi";
import { showToast } from "../features/ui/uiSlice";

const SeatSelection: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // --- LOCAL STATE ---
    const [currentDeck, setCurrentDeck] = useState<'lower' | 'upper'>('lower');
    // Store full seat details to pass to Redux
    const [allSeats, setAllSeats] = useState<{
        id: string;
        status: string;
        price: number;
        row: number;
        position: number;
        seatType: string;
    }[]>([]);
    const [_loadingSeats, setLoadingSeats] = useState(true);

    // --- REDUX STATE ---
    const { currentBooking, selectedSeats } = useAppSelector(
        (state) => state.booking
    );

    // --- FETCH SEATS FROM API ---
    useEffect(() => {
        const fetchSeats = async () => {
            if (!currentBooking?.scheduleId) return;
            setLoadingSeats(true);
            try {
                // Typed response automatically handled by axios generic
                const response = await getBusSeats(currentBooking.scheduleId);

                // Access data.data.seats based on new structure
                const seatData = response.data.data.seats;

                const mapped = seatData.map((s) => ({
                    id: s.seatNumber,
                    status: s.isAvailable ? 'available' : 'occupied',
                    price: parseFloat(s.price),
                    row: s.row,
                    position: s.position,
                    seatType: s.seatType
                }));
                setAllSeats(mapped);
            } catch (error) {
                console.error("Failed to fetch seats:", error);
                setAllSeats([]);
            } finally {
                setLoadingSeats(false);
            }
        };
        fetchSeats();
    }, [currentBooking?.scheduleId]);

    // Split seats into decks (first half lower, second half upper)
    const midpoint = Math.ceil(allSeats.length / 2);
    const lowerDeckSeats = allSeats.slice(0, midpoint);
    const upperDeckSeats = allSeats.slice(midpoint);
    const displayedSeats = currentDeck === 'lower' ? lowerDeckSeats : upperDeckSeats;

    // --- HELPERS ---
    const getSeatStatus = (seat: { id: string, status: string }) => {
        // 1. Check if occupied (static/API)
        if (seat.status === 'occupied') return 'occupied';

        // 2. Check if selected (Redux)
        if (selectedSeats.some(s => s.seatNumber === seat.id)) return 'selected';

        // 3. Default available
        return 'available';
    };

    const handleSeatClick = (seatId: string) => {
        const isSelected = selectedSeats.find((s) => s.seatNumber === seatId);
        let updatedSeats;

        if (isSelected) {
            updatedSeats = selectedSeats.filter((s) => s.seatNumber !== seatId);
        } else {
            const seatInfo = allSeats.find(s => s.id === seatId);
            if (!seatInfo) return;

            const newSeat = {
                seatNumber: seatId,
                isAvailable: true,
                price: seatInfo.price.toString(),
                seatType: seatInfo.seatType,
                row: seatInfo.row,
                position: seatInfo.position
            };
            updatedSeats = [...selectedSeats, newSeat];
        }

        dispatch(setSelectedSeats(updatedSeats));
    };

    const handleConfirmSeats = () => {
        if (selectedSeats.length === 0) {
            dispatch(showToast({ message: "Silakan pilih minimal satu kursi.", type: "warning" }));
            return;
        }
        dispatch(setBookingStep("passengers"));
        navigate("/passenger-data");
    };

    const calculateTotal = () => {
        const tax = 12.50; // Flat tax for demo
        const discount = 5.00; // Flat discount for demo

        const subtotal = selectedSeats.reduce((acc, seat) => {
            return acc + parseFloat(seat.price || "0");
        }, 0);

        return Math.max(0, subtotal + tax - discount);
    };

    // Organize seats into rows for rendering
    const rows = [];
    const seatsPerRow = 4;
    for (let i = 0; i < displayedSeats.length; i += seatsPerRow) {
        rows.push(displayedSeats.slice(i, i + seatsPerRow));
    }

    // --- GUARD ---
    if (!currentBooking) {
        // Redirect or show empty state if accessed directly without booking
        // For dev ease, we might render anyway, but let's keep it safe
        return (
            <div className="min-h-screen bg-background-light flex items-center justify-center p-10 font-display">
                <div className="bg-white rounded-xl p-8 text-center shadow-lg border border-slate-200">
                    <p className="font-bold text-slate-800 text-xl mb-4">No active booking session found.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-primary hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition-colors"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col">

            {/* Main Content */}
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb & Header */}
                <div className="mb-8">
                    <div className="flex items-center text-sm text-slate-500 mb-4">
                        <a href="#" onClick={() => navigate('/')} className="hover:text-primary">Home</a>
                        <span className="mx-2">/</span>
                        <a href="#" className="hover:text-primary">Search Results</a>
                        <span className="mx-2">/</span>
                        <span className="text-slate-900 dark:text-white font-medium">Seat Selection</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Select Your Seats</h1>
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                <span className="material-symbols-outlined text-lg">calendar_today</span>
                                <span>Mon, 12 Oct • 09:00 AM</span>
                                <span className="mx-2">•</span>
                                <span className="material-symbols-outlined text-lg">route</span>
                                <span>New York to Washington DC</span>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                <span className="material-symbols-outlined text-sm">directions_bus</span>
                                Express Voyager (AC Seater)
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* Left Column: Seat Map */}
                    <div className="flex-1 w-full lg:w-2/3">

                        {/* Legend */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 mb-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Seat Legend</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-400">
                                        <span className="material-symbols-outlined text-xl">chair</span>
                                    </div>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Available</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-primary text-white flex items-center justify-center shadow-md shadow-primary/30">
                                        <span className="material-symbols-outlined text-xl">check</span>
                                    </div>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Selected</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 flex items-center justify-center cursor-not-allowed">
                                        <span className="material-symbols-outlined text-xl">block</span>
                                    </div>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Occupied</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded border-2 border-pink-400 flex items-center justify-center text-pink-400">
                                        <span className="material-symbols-outlined text-xl">person</span>
                                    </div>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Ladies</span>
                                </div>
                            </div>
                        </div>

                        {/* Bus Layout Container */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 md:p-10 shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden transition-all duration-300">

                            {/* Deck Switcher & Driver Info */}
                            <div className="flex justify-between items-center mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentDeck('lower')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentDeck === 'lower'
                                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                                            : 'bg-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                            }`}
                                    >
                                        Lower Deck
                                    </button>
                                    <button
                                        onClick={() => setCurrentDeck('upper')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentDeck === 'upper'
                                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                                            : 'bg-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                            }`}
                                    >
                                        Upper Deck
                                    </button>
                                </div>
                                <div className="text-slate-400 flex items-center gap-1 text-sm">
                                    <span className="material-symbols-outlined text-lg">steering_wheel_heat</span>
                                    Driver
                                </div>
                            </div>

                            {/* Bus Structure */}
                            <div className="mx-auto max-w-[420px] bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-slate-200 dark:border-slate-700 p-8 relative min-h-[500px]">

                                {/* Driver Seat Indicator */}
                                <div className="absolute right-8 top-8 opacity-50">
                                    <span className="material-symbols-outlined text-3xl text-slate-400">airline_seat_recline_extra</span>
                                </div>

                                {/* Seat Grid */}
                                <div className="mt-12 flex flex-col gap-4">
                                    {rows.map((rowSeats, rowIndex) => (
                                        <div key={rowIndex} className="flex justify-between items-center">
                                            {/* Left Side (First 2 seats) */}
                                            <div className="flex gap-3">
                                                {rowSeats.slice(0, 2).map((seat) => {
                                                    const status = getSeatStatus(seat);
                                                    return (
                                                        <label key={seat.id} className="cursor-pointer group relative">
                                                            <input
                                                                type="checkbox"
                                                                className="sr-only"
                                                                checked={status === 'selected'}
                                                                disabled={status === 'occupied'}
                                                                onChange={() => handleSeatClick(seat.id)}
                                                            />
                                                            <div
                                                                className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center transition-all duration-200
                                                                ${status === 'available' ? 'border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-primary' : ''}
                                                                ${status === 'selected' ? 'bg-primary border-primary text-white shadow-md shadow-primary/30' : ''}
                                                                ${status === 'occupied' ? 'bg-slate-200 dark:bg-slate-700 cursor-not-allowed' : ''}
                                                            `}
                                                            >
                                                                <span className={`material-symbols-outlined text-2xl ${status === 'available' ? 'text-slate-400' :
                                                                    status === 'selected' ? 'text-white' :
                                                                        'text-slate-400'
                                                                    } ${status === 'occupied' ? 'rotate-0' : ''}`}>
                                                                    {status === 'selected' ? 'check' : status === 'occupied' ? 'block' : 'chair'}
                                                                </span>
                                                            </div>
                                                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                                {seat.id}
                                                            </span>
                                                        </label>
                                                    );
                                                })}
                                            </div>

                                            {/* Aisle */}
                                            <div className="w-8 md:w-12"></div>

                                            {/* Right Side (Last 2 seats) */}
                                            <div className="flex gap-3">
                                                {rowSeats.slice(2, 4).map((seat) => {
                                                    const status = getSeatStatus(seat);
                                                    return (
                                                        <label key={seat.id} className="cursor-pointer group relative">
                                                            <input
                                                                type="checkbox"
                                                                className="sr-only"
                                                                checked={status === 'selected'}
                                                                disabled={status === 'occupied'}
                                                                onChange={() => handleSeatClick(seat.id)}
                                                            />
                                                            <div
                                                                className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center transition-all duration-200
                                                                ${status === 'available' ? 'border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-primary' : ''}
                                                                ${status === 'selected' ? 'bg-primary border-primary text-white shadow-md shadow-primary/30' : ''}
                                                                ${status === 'occupied' ? 'bg-slate-200 dark:bg-slate-700 cursor-not-allowed' : ''}
                                                            `}
                                                            >
                                                                <span className={`material-symbols-outlined text-2xl ${status === 'available' ? 'text-slate-400' :
                                                                    status === 'selected' ? 'text-white' :
                                                                        'text-slate-400'
                                                                    } ${status === 'occupied' ? 'rotate-0' : ''}`}>
                                                                    {status === 'selected' ? 'check' : status === 'occupied' ? 'block' : 'chair'}
                                                                </span>
                                                            </div>
                                                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                                {seat.id}
                                                            </span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Right Column: Booking Summary */}
                    <div className="w-full lg:w-1/3 sticky top-6">
                        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col h-full">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Booking Summary</h2>

                            {/* Header Image */}
                            <div className="relative w-full h-32 rounded-lg overflow-hidden mb-6 group">
                                <img
                                    alt="Scenic view of a modern bus"
                                    className="w-full h-full object-cover"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiE5X7t0Cwe2zXVtSpG1xUK9qvg637PBV50MNB7iuGrX52X3gwkmos0x3p-85Ibx5L1mAJvBVZIoNBrkOiiMBfk09fyaOmA0N3ySGVlpPawhRmdEXn8309cSZs6Et4V57hvzKcNTzrUMGWswKXC2sEV51UMPMeTnXh7myEjL6lAomzg0AMaSGVe9nEot5VAoz0AOGC-U0h7sf9XhiADjJxhYCZI3KZPz4ITbgb3WNZ5hvC65E2OTdSVR8YaVI9IXZbYHk6rL3xnXj4"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                    <p className="text-white font-medium text-sm">Express Voyager #802</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Route Detail */}
                                <div className="flex flex-col gap-4 relative">
                                    <div className="absolute left-[11px] top-8 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
                                    <div className="flex gap-4 items-start">
                                        <div className="mt-1 relative z-10">
                                            <div className="w-6 h-6 rounded-full border-4 border-white dark:border-slate-900 bg-primary shadow-sm"></div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Boarding - 09:00 AM</p>
                                            <p className="text-slate-900 dark:text-white font-semibold">New York, NY</p>
                                            <p className="text-slate-500 text-sm">Port Authority Bus Terminal</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-start">
                                        <div className="mt-1 relative z-10">
                                            <div className="w-6 h-6 rounded-full border-4 border-white dark:border-slate-900 bg-slate-400 dark:bg-slate-600 shadow-sm"></div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Dropping - 01:30 PM</p>
                                            <p className="text-slate-900 dark:text-white font-semibold">Washington, DC</p>
                                            <p className="text-slate-500 text-sm">Union Station</p>
                                        </div>
                                    </div>
                                </div>

                                <hr className="border-slate-100 dark:border-slate-800" />

                                {/* Selected Seats */}
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <p className="text-slate-500 font-medium">Selected Seats</p>
                                        <span className="text-primary text-sm font-bold">{selectedSeats.length} Seats</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedSeats.length > 0 ? (
                                            selectedSeats.map(seat => (
                                                <span key={seat.seatNumber} className="inline-flex items-center px-3 py-1 rounded-md bg-primary text-white text-sm font-bold shadow-sm animate-fade-in">
                                                    {seat.seatNumber}
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleSeatClick(seat.seatNumber); }}
                                                        className="ml-2 hover:text-red-200"
                                                    >
                                                        <span className="material-symbols-outlined text-xs">close</span>
                                                    </button>
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-sm text-slate-400 italic">No seats selected</span>
                                        )}
                                    </div>
                                </div>

                                <hr className="border-slate-100 dark:border-slate-800" />

                                {/* Price Breakdown */}
                                <div className="space-y-3">
                                    <div className="flex justify-between text-slate-600 dark:text-slate-400 text-sm">
                                        <span>Seat Fare (x{selectedSeats.length})</span>
                                        <span>${selectedSeats.reduce((acc, s) => acc + parseFloat(s.price), 0).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600 dark:text-slate-400 text-sm">
                                        <span>Tax & Fees</span>
                                        <span>$12.50</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600 dark:text-slate-400 text-sm">
                                        <span>Discount</span>
                                        <span className="text-green-600 dark:text-green-400">-$5.00</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 mt-2 border-t border-dashed border-slate-200 dark:border-slate-700">
                                        <span className="font-bold text-slate-900 dark:text-white text-lg">Total</span>
                                        <span className="font-extrabold text-primary text-2xl">${calculateTotal().toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <button
                                    onClick={handleConfirmSeats}
                                    disabled={selectedSeats.length === 0}
                                    className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-primary/25 mt-4 group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Proceed to Passenger Info
                                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto py-8">
                <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
                    © 2024 BusConnect Inc. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default SeatSelection;