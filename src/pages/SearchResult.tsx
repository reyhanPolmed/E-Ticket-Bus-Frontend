import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import type { Schedule } from "../features/search/searchTypes";
import {
  MapPin,
  AlertCircle,
} from "lucide-react";

import {
  setCurrentBooking,
  setBookingStep,
} from "../features/booking/bookingSlice";

const SearchResult: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { criteria, results } = useAppSelector(
    (state) => state.search
  );

  const handleSelectSchedule = (schedule: Schedule) => {
    dispatch(
      setCurrentBooking({
        id: schedule.id,
        scheduleId: schedule.id,
        totalPrice: schedule.price,
      })
    );

    dispatch(setBookingStep("seats"));
    navigate("/seat");
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        <h2 className="text-4xl font-black uppercase">
          {criteria.origin?.name} → {criteria.destination?.name}
        </h2>

        {results.length === 0 ? (
          <div className="bg-white border-4 border-black p-8 text-center">
            <AlertCircle size={48} className="mx-auto mb-4" />
            <p className="font-bold">Tidak ada jadwal ditemukan</p>
          </div>
        ) : (
          results.map((schedule) => (
            <div
              key={schedule.id}
              className="bg-white border-4 border-black p-6 shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-black">
                    {schedule.departureTime} - {schedule.arrivalTime}
                  </p>
                  <p className="text-gray-500 flex items-center gap-1">
                    <MapPin size={14} />
                    {criteria.origin?.name} → {criteria.destination?.name}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xl font-black">
                    Rp {schedule.price.toLocaleString("id-ID")}
                  </p>
                  <button
                    onClick={() => handleSelectSchedule(schedule)}
                    className="mt-2 bg-black text-white px-4 py-2 font-bold"
                  >
                    Pilih
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default SearchResult;
