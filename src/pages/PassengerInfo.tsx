import React from "react";
import { ArrowLeft, User, Phone, Mail, CreditCard } from "lucide-react"

const PassengerInfo : React.FC = () => {    return (
            <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            // onClick={() => navigate(`/seats/${selectedSchedule?.id}`)}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Data Penumpang</h1>
            <p className="text-gray-600">Lengkapi data penumpang untuk melanjutkan pemesanan</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Passenger Forms */}
          <div className="lg:col-span-2 space-y-6">
              <div className="card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <User size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Penumpang 3</h3>
                    <p className="text-sm text-gray-600">Kursi 2</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap *</label>
                    <input
                      type="text"
                      placeholder="Masukkan nama lengkap sesuai identitas"
                    />
                  </div>

                  {/* ID Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <CreditCard size={16} className="inline mr-1" />
                      Nomor Identitas (KTP/SIM) *
                    </label>
                    <input
                      type="text"
                      placeholder="16 digit nomor identitas"
                      maxLength={16}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone size={16} className="inline mr-1" />
                      Nomor Telepon *
                    </label>
                    <input
                      type="tel"
                      placeholder="08xxxxxxxxxx"
                    />
                  </div>

                  {/* Email */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail size={16} className="inline mr-1" />
                      Email (Opsional)
                    </label>
                    <input
                      type="email"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
              </div>

            {/* Terms and Conditions */}
            <div className="card">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  Saya menyetujui{" "}
                  <a href="#" className="text-primary-600 hover:underline">
                    syarat dan ketentuan
                  </a>{" "}
                  serta{" "}
                  <a href="#" className="text-primary-600 hover:underline">
                    kebijakan privasi
                  </a>{" "}
                  yang berlaku. Data yang saya berikan adalah benar dan dapat dipertanggungjawabkan.
                </label>
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
                  {/* <p className="font-medium">
                    {selectedSchedule?.Route?.originTerminal?.city} →{" "}
                    {selectedSchedule?.Route?.destinationTerminal?.city}
                  </p> */}
                </div>

                <div>
                  <p className="text-sm text-gray-600">Tanggal & Waktu</p>
                  <p className="font-medium">
                    {/* {selectedSchedule && new Date(selectedSchedule.departureDate).toLocaleDateString("id-ID")} -{" "}
                    {selectedSchedule?.departureTime} */}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Bus</p>
                  {/* <p className="font-medium">{selectedSchedule?.Bus?.name}</p> */}
                  {/* <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                      selectedSchedule?.Bus?.class === "Economy"
                        ? "bg-gray-100 text-gray-800"
                        : selectedSchedule?.Bus?.class === "Business"
                          ? "bg-blue-100 text-blue-800"
                          : selectedSchedule?.Bus?.class === "Executive"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {selectedSchedule?.Bus?.class}
                  </span> */}
                </div>

                <div>
                  <p className="text-sm text-gray-600">Kursi</p>
                  {/* <p className="font-medium">{selectedSeats.join(", ")}</p> */}
                </div>

                <div>
                  <p className="text-sm text-gray-600">Penumpang</p>
                  {/* <div className="space-y-1">
                    {passengers.map((passenger, index) => (
                      <p key={index} className="text-sm">
                        {passenger.name || `Penumpang ${index + 1}`} - Kursi {passenger.seatNumber}
                      </p>
                    ))}
                  </div> */}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Harga per kursi</span>
                  {/* <span className="font-medium">{selectedSchedule && formatCurrency(selectedSchedule.price)}</span> */}
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Jumlah kursi</span>
                  {/* <span className="font-medium">{selectedSeats.length}</span> */}
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary-600">
                    {/* {selectedSchedule && formatCurrency(selectedSchedule.price * selectedSeats.length)} */}
                  </span>
                </div>
              </div>

              <button className="w-full btn btn-primary">
                Lanjut ke Pembayaran
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
}

export default PassengerInfo