import React from "react";
import { CheckCircle, Download, Share, Calendar, MapPin, CreditCard, Phone } from "lucide-react"
const BookingConfirmation : React.FC = () => {
    return (
            <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pembayaran Berhasil!</h1>
          <p className="text-gray-600">
            Terima kasih telah mempercayai layanan kami. E-ticket Anda telah dikirim ke email.
          </p>
        </div>

        {/* Booking Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* E-Ticket */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">E-Ticket</h2>
              <div className="flex gap-2">
                <button
                  className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                  title="Download Ticket"
                >
                  <Download size={20} />
                </button>
                <button
                  className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                  title="Share Ticket"
                >
                  <Share size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-primary-50 rounded-lg p-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Booking ID</p>
                  <p className="text-2xl font-bold text-primary-600 font-mono"></p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Dari</p>
                  {/* <p className="font-semibold">{selectedSchedule?.Route?.originTerminal?.city}</p> */}
                  {/* <p className="text-sm text-gray-500">{selectedSchedule?.Route?.originTerminal?.name}</p> */}
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Ke</p>
                  {/* <p className="font-semibold">{selectedSchedule?.Route?.destinationTerminal?.city}</p> */}
                  {/* <p className="text-sm text-gray-500">{selectedSchedule?.Route?.destinationTerminal?.name}</p> */}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tanggal</p>
                  <p className="font-semibold">
                    {/* {selectedSchedule && new Date(selectedSchedule.departureDate).toLocaleDateString("id-ID")} */}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Waktu</p>
                  {/* <p className="font-semibold">{selectedSchedule?.departureTime}</p> */}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Bus</p>
                {/* <p className="font-semibold">{selectedSchedule?.Bus?.name}</p> */}
                <span
                //   className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                //     selectedSchedule?.Bus?.class === "Economy"
                //       ? "bg-gray-100 text-gray-800"
                //       : selectedSchedule?.Bus?.class === "Business"
                //         ? "bg-blue-100 text-blue-800"
                //         : selectedSchedule?.Bus?.class === "Executive"
                //           ? "bg-purple-100 text-purple-800"
                //           : "bg-yellow-100 text-yellow-800"
                //   }`}
                >
                  {/* {selectedSchedule?.Bus?.class} */}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Kursi</p>
                {/* <p className="font-semibold">{selectedSeats.join(", ")}</p> */}
              </div>
            </div>
          </div>

          {/* Passenger Details */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Detail Penumpang</h2>

            <div className="space-y-4">
              {/* {passengers.map((passenger, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <Users size={16} className="text-primary-600" />
                    </div>
                    <div>
                      <p className="font-semibold">{passenger.name}</p>
                      <p className="text-sm text-gray-600">Kursi {passenger.seatNumber}</p>
                    </div>
                  </div>
                  <div className="ml-11 space-y-1">
                    <p className="text-sm text-gray-600">
                      <CreditCard size={14} className="inline mr-1" />
                      {passenger.idNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      <Phone size={14} className="inline mr-1" />
                      {passenger.phone}
                    </p>
                    {passenger.email && <p className="text-sm text-gray-600">📧 {passenger.email}</p>}
                  </div>
                </div>
              ))} */}
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Ringkasan Pembayaran</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  {/* <span>{formatCurrency(totalAmount)}</span> */}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Metode Pembayaran</span>
                  {/* <span className="capitalize">{paymentMethod?.replace("_", " ")}</span> */}
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total Dibayar</span>
                  {/* <span className="text-primary-600">{formatCurrency(totalAmount)}</span> */}
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-center">
                <CheckCircle size={24} className="text-green-600 mx-auto mb-2" />
                <p className="font-semibold text-green-800">Pembayaran Berhasil</p>
                {/* <p className="text-sm text-green-600">Payment ID: {paymentId}</p> */}
              </div>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="card mb-8 bg-yellow-50 border-yellow-200">
          <h3 className="text-lg font-semibold text-yellow-800 mb-4">Informasi Penting</h3>
          <ul className="space-y-2 text-sm text-yellow-700">
            <li className="flex items-start gap-2">
              <Calendar size={16} className="mt-0.5 flex-shrink-0" />
              <span>Harap tiba di terminal 30 menit sebelum keberangkatan</span>
            </li>
            <li className="flex items-start gap-2">
              <CreditCard size={16} className="mt-0.5 flex-shrink-0" />
              <span>Bawa identitas asli yang sesuai dengan data pemesanan</span>
            </li>
            <li className="flex items-start gap-2">
              <Phone size={16} className="mt-0.5 flex-shrink-0" />
              <span>Simpan e-ticket ini dan tunjukkan saat check-in</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 flex-shrink-0" />
              <span>Periksa lokasi terminal keberangkatan dengan teliti</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button  className="btn btn-outline">
            <Download size={20} />
            Download E-Ticket
          </button>
          <button  className="btn btn-primary">
            Pesan Tiket Lagi
          </button>
        </div>

        {/* Contact Support */}
        <div className="text-center mt-8 pt-8 border-t border-gray-200">
          <p className="text-gray-600 mb-2">Butuh bantuan?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+622112345678" className="text-primary-600 hover:underline">
              📞 +62 21 1234 5678
            </a>
            <a href="mailto:support@busticket.com" className="text-primary-600 hover:underline">
              📧 support@busticket.com
            </a>
          </div>
        </div>
      </div>
    </div>
    )
}

export default BookingConfirmation