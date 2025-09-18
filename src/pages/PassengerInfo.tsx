import React from "react";
// import { ArrowLeft, User, Phone, Mail, CreditCard } from "lucide-react"

const PassengerInfo: React.FC = () => {
  return (
    <main className="flex-1 px-4 sm:px-6 lg:px-20 xl:px-40 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-black mb-6">Booking Details</h1>
        <div className="bg-white border-2 neobrutalism-border rounded-lg p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-10">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 h-48 md:h-auto rounded-lg overflow-hidden border-2 neobrutalism-border">
              <div className="w-full h-full bg-center bg-no-repeat bg-cover"></div>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <h2 className="text-2xl font-bold text-black mb-2">
                Flight to New York
              </h2>
              <p className="text-black/70 mb-1">
                Departure: 2024-07-15, 10:00 AM
              </p>
              <p className="text-black/70">Arrival: 2024-07-15, 02:00 PM</p>
            </div>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-black mb-6">
          Passenger Information
        </h2>
        <div className="flex gap-4 mb-8">
          <button className="flex-1 sm:flex-none items-center justify-center rounded-lg h-12 px-6 bg-primary text-black text-base font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-yellow-400 transition-all border-2 neobrutalism-border">
            Add Passenger
          </button>
          <button className="flex-1 sm:flex-none items-center justify-center rounded-lg h-12 px-6 bg-transparent text-black text-base font-bold hover:bg-gray-100 transition-all border-2 neobrutalism-border">
            Remove Passenger
          </button>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-black pb-2">
                Passenger 1 Name
              </label>
              <input
                className="form-input flex w-full rounded-lg text-black bg-transparent focus:outline-none focus:ring-2 focus:ring-primary border-2 neobrutalism-border h-14 placeholder:text-black/50 p-4 text-base font-normal"
                id="passenger1-name"
                placeholder="Enter name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black pb-2">
                Passenger 1 Age
              </label>
              <input
                className="form-input flex w-full rounded-lg text-black bg-transparent focus:outline-none focus:ring-2 focus:ring-primary border-2 neobrutalism-border h-14 placeholder:text-black/50 p-4 text-base font-normal"
                id="passenger1-age"
                placeholder="Enter age"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-black pb-2">
                Passenger 2 Name
              </label>
              <input
                className="form-input flex w-full rounded-lg text-black bg-transparent focus:outline-none focus:ring-2 focus:ring-primary border-2 neobrutalism-border h-14 placeholder:text-black/50 p-4 text-base font-normal"
                id="passenger2-name"
                placeholder="Enter name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black pb-2">
                Passenger 2 Age
              </label>
              <input
                className="form-input flex w-full rounded-lg text-black bg-transparent focus:outline-none focus:ring-2 focus:ring-primary border-2 neobrutalism-border h-14 placeholder:text-black/50 p-4 text-base font-normal"
                id="passenger2-age"
                placeholder="Enter age"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-10">
          <button className="w-full sm:w-auto flex items-center justify-center rounded-lg h-14 px-8 bg-primary text-black text-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-yellow-400 transition-all border-2 neobrutalism-border">
            Confirm Booking
          </button>
        </div>
      </div>
    </main>
  );
};

export default PassengerInfo;
