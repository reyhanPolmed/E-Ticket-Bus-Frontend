import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Shield } from "lucide-react"

const Payments : React.FC = () => {
    const navigate = useNavigate()
    return (
            <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/passenger-info")}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Pembayaran</h1>
            <p className="text-gray-600">Pilih metode pembayaran dan selesaikan transaksi</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-red-600">
              <Clock size={20} />
              {/* <span className="font-mono text-lg font-bold">{formatTime(timeLeft)}</span> */}
            </div>
            <p className="text-sm text-gray-500">Waktu tersisa</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <div className="card mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pilih Metode Pembayaran</h3>

              <div className="space-y-3">
                {/* {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    className={`
                      p-4 border-2 rounded-lg cursor-pointer transition-all
                      ${
                        selectedPaymentMethod === method.id
                          ? "border-primary-500 bg-primary-50"
                          : "border-gray-200 hover:border-gray-300"
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`
                          p-2 rounded-lg
                          ${
                            selectedPaymentMethod === method.id
                              ? "bg-primary-100 text-primary-600"
                              : "bg-gray-100 text-gray-600"
                          }
                        `}
                        >
                          {method.icon}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{method.name}</h4>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {method.fee > 0 ? (
                          <p className="text-sm text-gray-600">Biaya: {formatCurrency(method.fee)}</p>
                        ) : (
                          <p className="text-sm text-green-600">Gratis</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))} */}
              </div>
            </div>

            {/* Security Notice */}
            <div className="card bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <Shield className="text-blue-600 mt-1" size={20} />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Transaksi Aman</h4>
                  <p className="text-sm text-blue-700">
                    Pembayaran Anda dilindungi dengan enkripsi SSL 256-bit dan sistem keamanan berlapis. Data kartu
                    kredit tidak disimpan di server kami.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Pembayaran</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Rute</p>
                  <p className="font-medium">
                    {/* {selectedSchedule?.Route?.originTerminal?.city} →{" "}
                    {selectedSchedule?.Route?.destinationTerminal?.city} */}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Tanggal & Waktu</p>
                  <p className="font-medium">
                    {/* {selectedSchedule && new Date(selectedSchedule.departureDate).toLocaleDateString("id-ID")} -{" "}
                    {selectedSchedule?.departureTime} */}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Kursi</p>
                  {/* <p className="font-medium">{selectedSeats.join(", ")}</p> */}
                </div>

                <div>
                  <p className="text-sm text-gray-600">Penumpang</p>
                  <div className="space-y-1">
                    {/* {passengers.map((passenger, index) => (
                      <p key={index} className="text-sm font-medium">
                        {passenger.name} - {passenger.seatNumber}
                      </p>
                    ))} */}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    {/* <span>{formatCurrency(totalAmount)}</span> */}
                  </div>

                  {/* {selectedMethod && selectedMethod.fee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Biaya Admin</span>
                      <span>{formatCurrency(selectedMethod.fee)}</span>
                    </div>
                  )} */}

                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total Pembayaran</span>
                    {/* <span className="text-primary-600">{formatCurrency(finalAmount)}</span> */}
                  </div>
                </div>
              </div>

              {/* <button
                onClick={handlePayment}
                disabled={!selectedPaymentMethod || isProcessing}
                className={`w-full btn ${
                  selectedPaymentMethod && !isProcessing
                    ? "btn-primary"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Memproses...
                  </div>
                ) : (
                  `Bayar ${formatCurrency(finalAmount)}`
                )}
              </button> */}

              <p className="text-xs text-gray-500 text-center mt-3">
                Dengan melanjutkan, Anda menyetujui syarat dan ketentuan yang berlaku
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
}

export default Payments