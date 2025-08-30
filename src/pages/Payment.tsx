"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "../../store/store"
import { useCreateBookingMutation, useCreatePaymentMutation } from "../../api/bookingApi"
import { setBookingId, setPaymentMethod, setCurrentStep } from "../../store/slices/bookingSlice"
import { ArrowLeft, CreditCard, Smartphone, Building, Clock, Shield } from "lucide-react"

const Payment: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { selectedSchedule, selectedSeats, passengers, totalAmount } = useSelector((state: RootState) => state.booking)

  const [createBooking] = useCreateBookingMutation()
  const [createPayment] = useCreatePaymentMutation()

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 minutes in seconds

  const paymentMethods = [
    {
      id: "bank_transfer",
      name: "Transfer Bank",
      icon: <Building size={24} />,
      description: "BCA, Mandiri, BNI, BRI",
      fee: 0,
    },
    {
      id: "e_wallet",
      name: "E-Wallet",
      icon: <Smartphone size={24} />,
      description: "GoPay, OVO, DANA, LinkAja",
      fee: 2500,
    },
    {
      id: "credit_card",
      name: "Kartu Kredit",
      icon: <CreditCard size={24} />,
      description: "Visa, Mastercard, JCB",
      fee: Math.floor(totalAmount * 0.025), // 2.5% fee
    },
  ]

  useEffect(() => {
    if (!selectedSchedule || selectedSeats.length === 0 || passengers.length === 0) {
      navigate("/")
      return
    }

    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          alert("Waktu pembayaran habis. Silakan mulai pemesanan dari awal.")
          navigate("/")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [selectedSchedule, selectedSeats, passengers, navigate])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      alert("Silakan pilih metode pembayaran")
      return
    }

    setIsProcessing(true)

    try {
      // Create booking
      const bookingData = {
        scheduleId: selectedSchedule.id,
        seats: selectedSeats,
        passengers: passengers,
        totalAmount: totalAmount + (paymentMethods.find((p) => p.id === selectedPaymentMethod)?.fee || 0),
      }

      const bookingResult = await createBooking(bookingData).unwrap()
      dispatch(setBookingId(bookingResult.id))

      // Create payment
      const paymentData = {
        bookingId: bookingResult.id,
        method: selectedPaymentMethod,
        amount: totalAmount + (paymentMethods.find((p) => p.id === selectedPaymentMethod)?.fee || 0),
      }

      const paymentResult = await createPayment(paymentData).unwrap()

      dispatch(setPaymentMethod(selectedPaymentMethod))
      dispatch(setCurrentStep(5))

      // Redirect to confirmation page
      navigate("/confirmation", {
        state: {
          bookingId: bookingResult.id,
          paymentId: paymentResult.id,
        },
      })
    } catch (error) {
      console.error("Payment error:", error)
      alert("Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.")
    } finally {
      setIsProcessing(false)
    }
  }

  const selectedMethod = paymentMethods.find((method) => method.id === selectedPaymentMethod)
  const finalAmount = totalAmount + (selectedMethod?.fee || 0)

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
              <span className="font-mono text-lg font-bold">{formatTime(timeLeft)}</span>
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
                {paymentMethods.map((method) => (
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
                ))}
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
                    {selectedSchedule?.Route?.originTerminal?.city} →{" "}
                    {selectedSchedule?.Route?.destinationTerminal?.city}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Tanggal & Waktu</p>
                  <p className="font-medium">
                    {selectedSchedule && new Date(selectedSchedule.departureDate).toLocaleDateString("id-ID")} -{" "}
                    {selectedSchedule?.departureTime}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Kursi</p>
                  <p className="font-medium">{selectedSeats.join(", ")}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Penumpang</p>
                  <div className="space-y-1">
                    {passengers.map((passenger, index) => (
                      <p key={index} className="text-sm font-medium">
                        {passenger.name} - {passenger.seatNumber}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>

                  {selectedMethod && selectedMethod.fee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Biaya Admin</span>
                      <span>{formatCurrency(selectedMethod.fee)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total Pembayaran</span>
                    <span className="text-primary-600">{formatCurrency(finalAmount)}</span>
                  </div>
                </div>
              </div>

              <button
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
              </button>

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

export default Payment
