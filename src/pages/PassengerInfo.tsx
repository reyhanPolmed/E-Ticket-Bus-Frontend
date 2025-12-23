import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, ArrowRight } from "lucide-react";

import { useAppDispatch, useAppSelector } from "../features/hooks";
import {
  setPassengerData,
  setBookingStep,
} from "../features/booking/bookingSlice";

import type { Passenger } from "../features/booking/bookingTypes";

const PassengerInfo: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { selectedSeats } = useAppSelector((state) => state.booking);

  const [passengers, setPassengers] = useState<Passenger[]>(
    selectedSeats.map((seat) => ({
      name: "",
      age: 0,
      seatNumber: seat.seatNumber,
    }))
  );

  const handleChange = (
    index: number,
    field: keyof Passenger,
    value: string
  ) => {
    const updated = [...passengers];
    updated[index] = {
      ...updated[index],
      [field]: field === "age" ? Number(value) : value,
    };
    setPassengers(updated);
  };

  const addPassenger = () => {
    setPassengers([
      ...passengers,
      { name: "", age: 0, seatNumber: "3" },
    ]);
  };

  const removePassenger = () => {
    if (passengers.length > 1) {
      setPassengers(passengers.slice(0, -1));
    }
  };

  const handleConfirm = () => {
    const isValid = passengers.every(
      (p) => p.name.trim() && p.age > 0
    );

    if (!isValid) {
      alert("Lengkapi data semua penumpang!");
      return;
    }

    dispatch(setPassengerData(passengers));
    dispatch(setBookingStep("payment"));
    navigate("/payment");
  };

  return (
    <main className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-4xl font-black uppercase mb-6">
        Data Penumpang
      </h1>

      <div className="space-y-6">
        {passengers.map((p, i) => (
          <div
            key={i}
            className="bg-white border-4 border-black p-6"
          >
            <h2 className="font-black mb-4">Penumpang {i + 1}</h2>

            <input
              className="w-full border-2 border-black p-2 mb-3"
              placeholder="Nama Lengkap"
              value={p.name}
              onChange={(e) =>
                handleChange(i, "name", e.target.value)
              }
            />

            <input
              className="w-full border-2 border-black p-2"
              type="number"
              placeholder="Umur"
              value={p.age || ""}
              onChange={(e) =>
                handleChange(i, "age", e.target.value)
              }
            />
          </div>
        ))}
      </div>

      <div className="flex gap-4 mt-8">
        <button
          onClick={addPassenger}
          className="flex-1 bg-yellow-300 border-4 border-black p-3 font-black"
        >
          <Plus /> Tambah
        </button>

        <button
          onClick={removePassenger}
          className="flex-1 bg-red-400 border-4 border-black p-3 font-black"
        >
          <Trash2 /> Hapus
        </button>
      </div>

      <button
        onClick={handleConfirm}
        className="w-full mt-8 bg-black text-white p-4 font-black flex justify-center gap-2"
      >
        Lanjut Pembayaran <ArrowRight />
      </button>
    </main>
  );
};

export default PassengerInfo;
