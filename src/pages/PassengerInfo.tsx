"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "../../store/store"
import { setPassengers, setCurrentStep } from "../../store/slices/bookingSlice"
import { ArrowLeft, User, Phone, Mail, CreditCard } from "lucide-react"

interface PassengerForm {
  name: string
  idNumber: string
  phone: string
  email: string
  seatNumber: string
}

const PassengerInfo: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    selectedSchedule,
    selectedSeats,
    passengers: existingPassengers,
  } = useSelector((state: RootState) => state.booking)

  const [passengers, setPassengersState] = useState<PassengerForm[]>([])
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    if (!selectedSchedule || selectedSeats.length === 0) {
      navigate("/")
      return
    }

    // Initialize passenger forms
    const initialPassengers = selectedSeats.map((seatNumber, index) => ({
      name: existingPassengers[index]?.name || "",
      idNumber: existingPassengers[index]?.idNumber || "",
      phone: existingPassengers[index]?.phone || "",
      email: existingPassengers[index]?.email || "",
      seatNumber,
    }))

    setPassengersState(initialPassengers)
  }, [selectedSchedule, selectedSeats, existingPassengers, navigate])

  const handleInputChange = (index: number, field: keyof PassengerForm, value: string) => {
    setPassengersState((prev) =>
      prev.map((passenger, i) => (i === index ? { ...passenger, [field]: value } : passenger)),
    )

    // Clear error when user starts typing
    const errorKey = `${index}-${field}`
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[errorKey]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    passengers.forEach((passenger, index) => {
      if (!passenger.name.trim()) {
        newErrors[`${index}-name`] = "Nama wajib diisi"
      }

      if (!passenger.idNumber.trim()) {
        newErrors[`${index}-idNumber`] = "Nomor identitas wajib diisi"
      } else if (passenger.idNumber.length < 16) {
        newErrors[`${index}-idNumber`] = "Nomor identitas harus 16 digit"
      }

      if (!passenger.phone.trim()) {
        newErrors[`${index}-phone`] = "Nomor telepon wajib diisi"
      } else if (!/^(\+62|62|0)[0-9]{9,13}$/.test(passenger.phone)) {
        newErrors[`${index}-phone`] = "Format nomor telepon tidak valid"
      }

      if (passenger.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(passenger.email)) {
        newErrors[`${index}-email`] = "Format email tidak valid"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinue = () => {
    if (!validateForm()) {
      return
    }

    dispatch(setPassengers(passengers))
    dispatch(setCurrentStep(4))
    navigate("/payment")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(`/seats/${selectedSchedule?.id}`)}
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
            {passengers.map((passenger, index) => (
              <div key={index} className="card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <User size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Penumpang {index + 1}</h3>
                    <p className="text-sm text-gray-600">Kursi {passenger.seatNumber}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap *</label>
                    <input
                      type="text"
                      value={passenger.name}
                      onChange={(e) => handleInputChange(index, "name", e.target.value)}
                      className={`form-input ${errors[`${index}-name`] ? "border-red-500" : ""}`}
                      placeholder="Masukkan nama lengkap sesuai identitas"
                    />
                    {errors[`${index}-name`] && <p className="text-red-500 text-sm mt-1">{errors[`${index}-name`]}</p>}
                  </div>

                  {/* ID Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <CreditCard size={16} className="inline mr-1" />
                      Nomor Identitas (KTP/SIM) *
                    </label>
                    <input
                      type="text"
                      value={passenger.idNumber}
                      onChange={(e) => handleInputChange(index, "idNumber", e.target.value)}
                      className={`form-input ${errors[`${index}-idNumber`] ? "border-red-500" : ""}`}
                      placeholder="16 digit nomor identitas"
                      maxLength={16}
                    />
                    {errors[`${index}-idNumber`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`${index}-idNumber`]}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone size={16} className="inline mr-1" />
                      Nomor Telepon *
                    </label>
                    <input
                      type="tel"
                      value={passenger.phone}
                      onChange={(e) => handleInputChange(index, "phone", e.target.value)}
                      className={`form-input ${errors[`${index}-phone`] ? "border-red-500" : ""}`}
                      placeholder="08xxxxxxxxxx"
                    />
                    {errors[`${index}-phone`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`${index}-phone`]}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail size={16} className="inline mr-1" />
                      Email (Opsional)
                    </label>
                    <input
                      type="email"
                      value={passenger.email}
                      onChange={(e) => handleInputChange(index, "email", e.target.value)}
                      className={`form-input ${errors[`${index}-email`] ? "border-red-500" : ""}`}
                      placeholder="email@example.com"
                    />
                    {errors[`${index}-email`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`${index}-email`]}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

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
                  <p className="text-sm text-gray-600">Bus</p>
                  <p className="font-medium">{selectedSchedule?.Bus?.name}</p>
                  <span
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
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Kursi</p>
                  <p className="font-medium">{selectedSeats.join(", ")}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Penumpang</p>
                  <div className="space-y-1">
                    {passengers.map((passenger, index) => (
                      <p key={index} className="text-sm">
                        {passenger.name || `Penumpang ${index + 1}`} - Kursi {passenger.seatNumber}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Harga per kursi</span>
                  <span className="font-medium">{selectedSchedule && formatCurrency(selectedSchedule.price)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Jumlah kursi</span>
                  <span className="font-medium">{selectedSeats.length}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary-600">
                    {selectedSchedule && formatCurrency(selectedSchedule.price * selectedSeats.length)}
                  </span>
                </div>
              </div>

              <button onClick={handleContinue} className="w-full btn btn-primary">
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
