import type React from "react";

const HomePage: React.FC = () => {
  return (
    <div className="flex justify-center items-center m-14">
      <div className="max-w-4xl w-full p-8 bg-white rounded-3xl shadow-2xl transition-all duration-300 transform scale-95 md:scale-100 glass-card">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-gray-800">
          Cari Jadwal Perjalanan Anda
        </h1>
        <p className="text-center text-gray-600 mb-8 max-w-lg mx-auto">
          Temukan dan pesan tiket Anda dengan mudah. Isi detail perjalanan Anda
          di bawah ini untuk melihat jadwal yang tersedia.
        </p>
        <form id="search-form" className="space-y-6">
          {/* <!-- Terminal Asal dan Tujuan --> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Terminal Awal
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="origin"
                  name="origin"
                  placeholder="Pilih Terminal Asal"
                  className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                />
                {/* <!-- Swap Icon --> */}
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Terminal Tujuan
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="destination"
                  name="destination"
                  placeholder="Pilih Terminal Tujuan"
                  className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Tanggal Keberangkatan --> */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Keberangkatan
            </label>
            <input
              type="date"
              id="date"
              name="date"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            />
          </div>

          {/* <!-- Tombol Cari --> */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-gradient-purple text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Cari Jadwal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HomePage;
