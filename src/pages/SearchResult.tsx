import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
const SearchResult: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex items-center gap-4 mb-4 lg:mb-0">
            <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Hasil Pencarian
              </h1>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              {/* <SlidersHorizontal size={16} /> */}
              <span className="hidden sm:inline">Filter</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              {/* <Filter size={16} /> */}
              <span className="hidden sm:inline">Urutkan</span>
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block">
            <div className="card sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Filter
              </h3>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Harga</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Di bawah Rp 100.000
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Rp 100.000 - Rp 200.000
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Di atas Rp 200.000
                    </span>
                  </label>
                </div>
              </div>

              {/* Bus Class */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Kelas Bus</h4>
                <div className="space-y-2">
                  {["Economy", "Business", "Executive", "Luxury"].map(
                    (busClass) => (
                      <label key={busClass} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          {busClass}
                        </span>
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Departure Time */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">
                  Waktu Keberangkatan
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Pagi (06:00 - 12:00)
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Siang (12:00 - 18:00)
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Malam (18:00 - 24:00)
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule List */}
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🚌</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Tidak ada jadwal bus ditemukan
            </h3>
            <p className="text-gray-600 mb-6">
              Coba ubah tanggal atau rute perjalanan Anda
            </p>
            <button onClick={() => navigate("/")} className="btn btn-primary">
              Cari Lagi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
