"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setSearchParams } from "../../store/slices/searchSlice"
import { useGetTerminalsQuery } from "../../api/busApi"
import { MapPin, Calendar, Users, ArrowRight, Shield, Clock, CreditCard, Smartphone } from "lucide-react"

const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { data: terminals, isLoading } = useGetTerminalsQuery()

  const [searchForm, setSearchForm] = useState({
    origin: "",
    destination: "",
    departureDate: "",
    passengers: 1,
    isRoundTrip: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setSearchForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchForm.origin || !searchForm.destination || !searchForm.departureDate) {
      alert("Mohon lengkapi semua field pencarian")
      return
    }

    dispatch(setSearchParams(searchForm))
    navigate("/search")
  }

  const swapLocations = () => {
    setSearchForm((prev) => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
    }))
  }

  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-6xl font-bold mb-4">Pesan Tiket Bus Online</h1>
            <p className="text-xl lg:text-2xl text-primary-100 max-w-3xl mx-auto">Mudah, Cepat, dan Terpercaya</p>
          </div>

          {/* Search Form */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-6 lg:p-8">
              <form onSubmit={handleSearch} className="space-y-6">
                {/* Origin & Destination */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <MapPin size={16} className="text-primary-600" />
                      Dari
                    </label>
                    <select
                      name="origin"
                      value={searchForm.origin}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    >
                      <option value="">Pilih kota asal</option>
                      {terminals?.map((terminal) => (
                        <option key={terminal.id} value={terminal.id}>
                          {terminal.name} - {terminal.city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={swapLocations}
                      className="p-3 rounded-full bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
                    >
                      <ArrowRight size={20} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <MapPin size={16} className="text-primary-600" />
                      Ke
                    </label>
                    <select
                      name="destination"
                      value={searchForm.destination}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    >
                      <option value="">Pilih kota tujuan</option>
                      {terminals?.map((terminal) => (
                        <option key={terminal.id} value={terminal.id}>
                          {terminal.name} - {terminal.city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date & Passengers */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Calendar size={16} className="text-primary-600" />
                      Tanggal Keberangkatan
                    </label>
                    <input
                      type="date"
                      name="departureDate"
                      value={searchForm.departureDate}
                      onChange={handleInputChange}
                      className="form-input"
                      min={today}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Users size={16} className="text-primary-600" />
                      Penumpang
                    </label>
                    <select
                      name="passengers"
                      value={searchForm.passengers}
                      onChange={handleInputChange}
                      className="form-input"
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          {num} Orang
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button type="submit" className="w-full btn btn-primary text-lg py-4" disabled={isLoading}>
                  {isLoading ? "Loading..." : "Cari Bus"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Mengapa Pilih BusTicket?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Platform terpercaya dengan layanan terbaik untuk perjalanan Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aman & Terpercaya</h3>
              <p className="text-gray-600">
                Transaksi aman dengan sistem keamanan berlapis dan operator bus terpercaya
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                <Clock className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Booking 24/7</h3>
              <p className="text-gray-600">Pesan tiket kapan saja dan dimana saja, layanan tersedia 24 jam sehari</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                <CreditCard className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Pembayaran Mudah</h3>
              <p className="text-gray-600">Berbagai metode pembayaran: Transfer bank, e-wallet, dan kartu kredit</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                <Smartphone className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">E-Ticket</h3>
              <p className="text-gray-600">
                Tiket elektronik praktis, tidak perlu print, cukup tunjukkan di smartphone
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Routes */}
      <div className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Rute Populer</h2>
            <p className="text-xl text-gray-600">Destinasi favorit dengan jadwal bus terlengkap</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { from: "Jakarta", to: "Bandung", price: "Mulai Rp 50.000", duration: "3 jam" },
              { from: "Jakarta", to: "Surabaya", price: "Mulai Rp 200.000", duration: "12 jam" },
              { from: "Jakarta", to: "Yogyakarta", price: "Mulai Rp 150.000", duration: "8 jam" },
              { from: "Bandung", to: "Surabaya", price: "Mulai Rp 180.000", duration: "10 jam" },
              { from: "Jakarta", to: "Semarang", price: "Mulai Rp 120.000", duration: "6 jam" },
              { from: "Surabaya", to: "Malang", price: "Mulai Rp 40.000", duration: "2 jam" },
            ].map((route, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {route.from} → {route.to}
                    </h3>
                    <p className="text-gray-600">{route.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary-600">{route.price}</p>
                  </div>
                </div>
                <button className="w-full btn btn-outline">Lihat Jadwal</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
