import React from "react";
// import { ArrowLeft, User, UserX } from "lucide-react"
// import { useNavigate } from "react-router-dom";
import { useState } from "react";

const SeatSelection: React.FC = () => {
const initialSeats = [
    { id: '1A', status: 'available' },
    { id: '1B', status: 'available' },
    { id: '1C', status: 'occupied' },
    { id: '1D', status: 'occupied' },
    { id: '2A', status: 'available' },
    { id: '2B', status: 'available' },
    { id: '2C', status: 'available' },
    { id: '2D', status: 'available' },
    { id: '3A', status: 'occupied' },
    { id: '3B', status: 'available' },
    { id: '3C', status: 'available' },
    { id: '3D', status: 'available' },
    { id: '4A', status: 'available' },
    { id: '4B', status: 'available' },
    { id: '4C', status: 'available' },
    { id: '4D', status: 'available' },
    { id: '5A', status: 'available' },
    { id: '5B', status: 'available' },
    { id: '5C', status: 'occupied' },
    { id: '5D', status: 'occupied' },
    { id: '6A', status: 'available' },
    { id: '6B', status: 'available' },
    { id: '6C', status: 'available' },
    { id: '6D', status: 'available' },
  ];

  const [seats, setSeats] = useState(initialSeats);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleSeatClick = (seatId) => {
    setSeats(
      seats.map((seat) => {
        if (seat.id === seatId) {
          if (seat.status === 'available') {
            setSelectedSeats([...selectedSeats, seatId]);
            return { ...seat, status: 'selected' };
          } else if (seat.status === 'selected') {
            setSelectedSeats(selectedSeats.filter((id) => id !== seatId));
            return { ...seat, status: 'available' };
          }
        }
        return seat;
      })
    );
  };

  const confirmSeats = () => {
    if (selectedSeats.length > 0) {
      alert(`Anda telah memilih kursi: ${selectedSeats.join(', ')}`);
      // You can add logic here to process the confirmed seats,
      // for example, send them to a server.
      // After processing, you might want to reset the state.
      setSelectedSeats([]);
      setSeats(initialSeats);
    } else {
      alert('Pilih setidaknya satu kursi!');
    }
  };

  const getSeatClass = (status) => {
    switch (status) {
      case 'available':
        return 'bg-white hover:bg-yellow-200 cursor-pointer';
      case 'selected':
        return 'bg-yellow-400 border-yellow-400 border-b-black border-r-black cursor-pointer';
      case 'occupied':
        return 'bg-black text-white cursor-not-allowed';
      default:
        return '';
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-200 p-8">
      <div className="w-full max-w-2xl bg-white border-4 border-black p-8 shadow-[12px_12px_0_0_#000000] rounded-sm">
        <h1 className="text-4xl font-mono font-bold text-center mb-2">Select Your Seats</h1>
        <p className="font-mono text-center text-neutral-600 mb-8">
          Choose your preferred seats for the journey.
        </p>

        {/* Legend */}
        <div className="flex justify-center items-center gap-6 mb-12 font-mono text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border-2 border-black"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 border-2 border-black"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-black border-2 border-black"></div>
            <span>Occupied</span>
          </div>
        </div>

        {/* Seat layout */}
        <div className="flex justify-center mb-8">
          <div className="grid grid-cols-2 gap-x-12 gap-y-4 pr-12">
            {seats.slice(0, 12).map((seat) => (
              <div
                key={seat.id}
                className={`relative w-16 h-10 border-2 border-black drop-shadow-[4px_4px_0_0_#000000] text-sm flex justify-center items-center font-mono ${getSeatClass(seat.status)}`}
                onClick={() => handleSeatClick(seat.id)}
              >
                {seat.id}
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center justify-center gap-4 mx-6">
            {/* Wavy lines */}
            <div className="w-6 h-6 border-l-2 border-r-2 border-black rounded-full rotate-90 scale-x-150"></div>
            <div className="w-6 h-6 border-l-2 border-r-2 border-black rounded-full rotate-90 scale-x-150"></div>
            <div className="w-6 h-6 border-l-2 border-r-2 border-black rounded-full rotate-90 scale-x-150"></div>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-4">
            {seats.slice(12).map((seat) => (
              <div
                key={seat.id}
                className={`relative w-16 h-10 border-2 border-black drop-shadow-[4px_4px_0_0_#000000] text-sm flex justify-center items-center font-mono ${getSeatClass(seat.status)}`}
                onClick={() => handleSeatClick(seat.id)}
              >
                {seat.id}
              </div>
            ))}
          </div>
        </div>

        {/* Confirm button */}
        <button
          className="w-full bg-yellow-400 border-4 border-black font-mono text-black font-bold py-4 mt-8 drop-shadow-[8px_8px_0_0_#000000] hover:translate-x-1 hover:translate-y-1 hover:drop-shadow-[4px_4px_0_0_#000000] transition-all duration-100"
          onClick={confirmSeats}
        >
          Confirm Seats
        </button>
      </div>
    </div>
  );
}

export default SeatSelection;
