"use client"

import type React from "react"
import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "../../store/store"
import { useGetBusSeatsQuery } from "../../api/busApi"
import { addSelectedSeat, removeSelectedSeat, setCurrentStep, setTotalAmount } from "../../store/slices/bookingSlice"
import { ArrowLeft, User, UserX } from "lucide-react"

const SeatSelection: React.FC = () => {
  const { scheduleId } = useParams<{ scheduleId: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { selectedSchedule, selectedSeats } = useSelector((state: RootState) => state.booking)
  const { passengers } = useSelector((state: RootState) => state.search)

  const {
    data: seats,
    isLoading,
    error,
  } = useGetBusSeatsQuery(
    { busId: selectedSchedule?.busId || "", scheduleId: scheduleId || "" },
    { skip: !selectedSchedule?.busId || !scheduleId },
  )

  useEffect(() => {
    if (!selectedSchedule) {
      navigate("/")
    }
  }, [selectedSchedule, navigate])

  useEffect(() => {
    if (selectedSchedule && selectedSeats.length > 0) {
      const total = selectedSchedule.price * selectedSeats.length
      dispatch(setTotalAmount(total))
    }
  }, [selectedSeats, selectedSchedule, dispatch])

  const handleSeatClick = (seatNumber: string, isOccupied: boolean) => {
    if (isOccupied) return

    if (selectedSeats.includes(seatNumber)) {
      dispatch(removeSelectedSeat(seatNumber))
    } else {
      if (selectedSeats.length < passengers) {
        dispatch(addSelectedSeat(seatNumber))
      } else {
        alert(`Anda hanya dapat memilih ${passengers} kursi`)
      }
    }
  }

  const handleContinue = () => {
    if (selectedSeats.length !== passengers) {
      alert(`Silakan pilih ${passengers} kursi`)
      return
    }
    dispatch(setCurrentStep(3))
    navigate("/passenger-info")
  }

  const getSeatIcon = (seat: any) => {
    if (seat.isOccupied) {
      return <UserX size={20} className="text-red-500" />
    } else if (selectedSeats.includes(seat.number)) {
      return <User size={20} className="text-white" />
    } else {
      return <User size={20} className="text-gray-400" />
    }
  }

  const getSeatClass = (seat: any) => {
    if (seat.isOccupied) {
      return "bg-red-100 border-red-300 cursor-not-allowed"
    } else if (selectedSeats.includes(seat.number)) {
      return "bg-primary-600 border-primary-600 text-white"
    } else {
      return "bg-white border-gray-300 hover:border-primary-400 hover:bg-primary-50 cursor-pointer"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat denah kursi...</p>
        </div>
      </div>
    )
  }

  if (error || !selectedSchedule) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Terjadi kesalahan saat memuat denah kursi</p>
          <button onClick={() => navigate("/search")} className="btn btn-primary">
            Kembali ke Pencarian
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/search")}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Pilih Kursi</h1>
            <p className="text-gray-600">
              {selectedSchedule.Bus?.name} - {selectedSchedule.Bus?.class}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seat Map */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Denah Kursi</h3>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 mb-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-white border-2 border-gray-300 rounded flex items-center justify-center">
                      <User size={12} className="text-gray-400" />
                    </div>
                    <span>Tersedia</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary-600 border-2 border-primary-600 rounded flex items-center justify-center">
                      <User size={12} className="text-white" />
                    </div>
                    <span>Dipilih</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-red-100 border-2 border-red-300 rounded flex items-center justify-center">
                      <UserX size={12} className="text-red-500" />
                    </div>
                    <span>Terisi</span>
                  </div>
                </div>

                {/* Driver Section */}
                <div className="mb-6">
                  <div className="bg-gray-100 rounded-lg p-4 text-center">
                    <div className="w-12 h-8 bg-gray-800 rounded mx-auto mb-2"></div>
                    <span className="text-sm text-gray-600">Supir</span>
                  </div>
                </div>

                {/* Seat Grid */}
                <div className="space-y-4">
                  {seats && seats.length > 0 ? (
                    <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
                      {seats.map((seat: any) => (
                        <div
                          key={seat.number}
                          onClick={() => handleSeatClick(seat.number, seat.isOccupied)}
                          className={`
                            w-12 h-12 border-2 rounded-lg flex items-center justify-center transition-all
                            ${getSeatClass(seat)}
                          `}
                        >
                          {getSeatIcon(seat)}
                          <span className="sr-only">Kursi {seat.number}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
                      {/* Generate default seat layout if no data */}
                      {Array.from({ length: 40 }, (_, i) => {
                        const seatNumber = `${Math.floor(i / 4) + 1}${String.fromCharCode(65 + (i % 4))}`
                        const isOccupied = Math.random() > 0.7 // Random occupied seats for demo
                        return (
                          <div
                            key={seatNumber}
                            onClick={() => handleSeatClick(seatNumber, isOccupied)}
                            className={`
                              w-12 h-12 border-2 rounded-lg flex items-center justify-center transition-all
                              ${
                                isOccupied
                                  ? "bg-red-100 border-red-300 cursor-not-allowed"
                                  : selectedSeats.includes(seatNumber)
                                    ? "bg-primary-600 border-primary-600 text-white"
                                    : "bg-white border-gray-300 hover:border-primary-400 hover:bg-primary-50 cursor-pointer"
                              }
                            `}
                          >
                            {isOccupied ? (
                              <UserX size={16} className="text-red-500" />
                            ) : selectedSeats.includes(seatNumber) ? (
                              <User size={16} className="text-white" />
                            ) : (
                              <User size={16} className="text-gray-400" />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Pemesanan</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Rute</p>
                  <p className="font-medium">
                    {selectedSchedule.Route?.originTerminal?.city} → {selectedSchedule.Route?.destinationTerminal?.city}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Tanggal & Waktu</p>
                  <p className="font-medium">
                    {new Date(selectedSchedule.departureDate).toLocaleDateString("id-ID")} -{" "}
                    {selectedSchedule.departureTime}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Bus</p>
                  <p className="font-medium">{selectedSchedule.Bus?.name}</p>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                      selectedSchedule.Bus?.class === "Economy"
                        ? "bg-gray-100 text-gray-800"
                        : selectedSchedule.Bus?.class === "Business"
                          ? "bg-blue-100 text-blue-800"
                          : selectedSchedule.Bus?.class === "Executive"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {selectedSchedule.Bus?.class}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Kursi Dipilih</p>
                  <p className="font-medium">{selectedSeats.length > 0 ? selectedSeats.join(", ") : "Belum dipilih"}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Penumpang</p>
                  <p className="font-medium">{passengers} orang</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Harga per kursi</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(selectedSchedule.price)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Jumlah kursi</span>
                  <span className="font-medium">{selectedSeats.length}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary-600">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(selectedSchedule.price * selectedSeats.length)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleContinue}
                disabled={selectedSeats.length !== passengers}
                className={`w-full btn ${
                  selectedSeats.length === passengers ? "btn-primary" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {selectedSeats.length === passengers
                  ? "Lanjutkan"
                  : `Pilih ${passengers - selectedSeats.length} kursi lagi`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SeatSelection
