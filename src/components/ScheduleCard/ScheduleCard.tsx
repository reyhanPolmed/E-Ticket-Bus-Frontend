"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setSelectedSchedule, setCurrentStep } from "../../store/slices/bookingSlice"
import { Clock, MapPin, Users, Wifi, Tv, Coffee, Shield } from "lucide-react"

interface ScheduleCardProps {
  schedule: any
  passengers: number
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ schedule, passengers }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleSelectSchedule = () => {
    dispatch(setSelectedSchedule(schedule))
    dispatch(setCurrentStep(2))
    navigate(`/seats/${schedule.id}`)
  }

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getBusFeatures = (busClass: string) => {
    const features = {
      Economy: [
        { icon: <Users size={16} />, label: "AC" },
        { icon: <Tv size={16} />, label: "TV" },
      ],
      Business: [
        { icon: <Users size={16} />, label: "AC" },
        { icon: <Tv size={16} />, label: "TV" },
        { icon: <Wifi size={16} />, label: "WiFi" },
      ],
      Executive: [
        { icon: <Users size={16} />, label: "AC" },
        { icon: <Tv size={16} />, label: "TV" },
        { icon: <Wifi size={16} />, label: "WiFi" },
        { icon: <Coffee size={16} />, label: "Snack" },
      ],
      Luxury: [
        { icon: <Users size={16} />, label: "AC" },
        { icon: <Tv size={16} />, label: "TV" },
        { icon: <Wifi size={16} />, label: "WiFi" },
        { icon: <Coffee size={16} />, label: "Meal" },
        { icon: <Shield size={16} />, label: "Insurance" },
      ],
    }
    return features[busClass as keyof typeof features] || features.Economy
  }

  const getBusClassColor = (busClass: string) => {
    const colors = {
      Economy: "bg-gray-100 text-gray-800",
      Business: "bg-blue-100 text-blue-800",
      Executive: "bg-purple-100 text-purple-800",
      Luxury: "bg-yellow-100 text-yellow-800",
    }
    return colors[busClass as keyof typeof colors] || colors.Economy
  }

  return (
    <div className="card hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center gap-3 mb-3 sm:mb-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{schedule.Bus?.name || "Bus Premium"}</h3>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getBusClassColor(schedule.Bus?.class)}`}
            >
              {schedule.Bus?.class}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary-600">{formatCurrency(schedule.price)}</div>
          <div className="text-sm text-gray-500">per orang</div>
        </div>
      </div>

      {/* Journey Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Departure */}
        <div className="text-center lg:text-left">
          <div className="text-2xl font-bold text-gray-900 mb-1">{formatTime(schedule.departureTime)}</div>
          <div className="flex items-center justify-center lg:justify-start gap-1 text-gray-600">
            <MapPin size={14} />
            <span className="text-sm">{schedule.Route?.originTerminal?.name}</span>
          </div>
        </div>

        {/* Duration */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-gray-500 mb-2">
            <Clock size={16} />
            <span className="text-sm">{schedule.duration || "8h 30m"}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div className="bg-primary-600 h-1 rounded-full w-full"></div>
          </div>
        </div>

        {/* Arrival */}
        <div className="text-center lg:text-right">
          <div className="text-2xl font-bold text-gray-900 mb-1">{formatTime(schedule.arrivalTime)}</div>
          <div className="flex items-center justify-center lg:justify-end gap-1 text-gray-600">
            <MapPin size={14} />
            <span className="text-sm">{schedule.Route?.destinationTerminal?.name}</span>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="flex flex-wrap gap-4 mb-6">
        {getBusFeatures(schedule.Bus?.class).map((feature, index) => (
          <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
            <div className="text-primary-600">{feature.icon}</div>
            <span>{feature.label}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-200">
        <div className="mb-4 sm:mb-0">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              <span className="font-medium text-green-600">{schedule.availableSeats}</span> kursi tersisa
            </span>
            {schedule.availableSeats < 10 && (
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Segera Habis!</span>
            )}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Total ({passengers} penumpang):
            <span className="font-semibold text-gray-900 ml-1">{formatCurrency(schedule.price * passengers)}</span>
          </div>
        </div>

        <button
          onClick={handleSelectSchedule}
          disabled={schedule.availableSeats < passengers}
          className={`btn ${
            schedule.availableSeats < passengers ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "btn-primary"
          } w-full sm:w-auto`}
        >
          {schedule.availableSeats < passengers ? "Kursi Tidak Cukup" : "Pilih Kursi"}
        </button>
      </div>
    </div>
  )
}

export default ScheduleCard
