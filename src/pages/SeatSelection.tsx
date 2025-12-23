import React, { useState } from "react";
import { X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../features/hooks";
import {
  setSelectedSeats,
  setBookingStep,
} from "../features/booking/bookingSlice";

const SeatSelection: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { currentBooking, selectedSeats } = useAppSelector(
    (state) => state.booking
  );

  const initialSeats = [
    { id: "1A", status: "available" },
    { id: "1B", status: "available" },
    { id: "1C", status: "occupied" },
    { id: "1D", status: "occupied" },
  ];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [seats, setSeats] = useState(initialSeats);

  if (!currentBooking) {
    return (
      <div className="p-10 text-center">
        <p className="font-bold">Tidak ada booking aktif</p>
      </div>
    );
  }

  const handleSeatClick = (seatId: string) => {
    const isSelected = selectedSeats.find((s) => s.seatNumber === seatId);

    let updatedSeats;

    if (isSelected) {
      updatedSeats = selectedSeats.filter((s) => s.seatNumber !== seatId);
    } else {
      updatedSeats = [...selectedSeats, { seatNumber: seatId, isAvailable: true }];
    }

    dispatch(setSelectedSeats(updatedSeats));
  };

  const handleConfirmSeats = () => {
    if (selectedSeats.length === 0) return;

    dispatch(setBookingStep("passengers"));
    navigate("/passenger-data");
  };

  return (
    <div className="min-h-screen p-8 bg-[#E0F2FE]">
      <h1 className="text-4xl font-black uppercase mb-6">
        Pilih Kursi
      </h1>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {seats.map((seat) => {
          const isOccupied = seat.status === "occupied";
          const isSelected = selectedSeats.some(
            (s) => s.seatNumber === seat.id
          );

          return (
            <div
              key={seat.id}
              onClick={() => !isOccupied && handleSeatClick(seat.id)}
              className={`p-4 border-4 text-center font-bold cursor-pointer
                ${
                  isOccupied
                    ? "bg-gray-300 text-gray-500"
                    : isSelected
                    ? "bg-[#FB7185]"
                    : "bg-white"
                }`}
            >
              {isOccupied ? <X /> : seat.id}
            </div>
          );
        })}
      </div>

      <button
        onClick={handleConfirmSeats}
        disabled={selectedSeats.length === 0}
        className="bg-black text-white px-6 py-3 font-bold flex items-center gap-2"
      >
        Lanjut <ArrowRight />
      </button>
    </div>
  );
};

export default SeatSelection;
