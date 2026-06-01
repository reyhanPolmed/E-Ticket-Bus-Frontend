import type React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCriteria, setResults, setRecommendations } from "../features/search/searchSlice";
import { type RootState } from "../features/store";
import { getTerminals } from "../api/terminalApi";
import { searchSchedules } from "../api/scheduleApi";
import { getMyBookings, getBookingDetails } from "../api/bookingApi";
import { showToast } from "../features/ui/uiSlice";
import TerminalDropdown from "../components/TerminalDropdown";
import TanggalKeberangkatanPicker from "../components/KalenderSelection";
import { setCurrentBooking, setBookingId, setPassengerData, setBookingStep, setSelectedSeats, resetBooking } from "../features/booking/bookingSlice";
import { selectCurrentUser } from "../features/auth/AuthSlice";
import type { Booking, Seat, Passenger } from "../features/booking/bookingTypes";

type Terminal = {
  id: string;
  name: string;
  city: string;
};

const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { criteria } = useSelector((state: RootState) => state.search);
  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [loading, setLoading] = useState(false);

  // --- LOGIC: FETCH TERMINALS FROM API ---
  const isAuthenticated = useSelector(selectCurrentUser);

  // --- DRAFT BOOKING STATE ---
  const { selectedSeats: draftSeats, currentBooking: draftBooking, bookingId: draftBookingId, bookingStep: draftStep } = useSelector((state: RootState) => state.booking);
  const isDraftActive = draftSeats && draftSeats.length > 0 && draftBooking && !draftBookingId;

  const handleResumeDraft = () => {
    if (!draftBooking) return;
    dispatch(showToast({ message: "Melanjutkan draf pemesanan...", type: "info" }));
    if (draftStep === "seats") {
      navigate("/seat");
    } else if (draftStep === "passengers") {
      navigate("/passenger-data");
    } else if (draftStep === "payment" || draftStep === "confirmation") {
      navigate("/confirmation");
    } else {
      navigate("/seat");
    }
  };

  const handleDiscardDraft = () => {
    dispatch(resetBooking());
    dispatch(showToast({ message: "Draf pemesanan sebelumnya telah dihapus.", type: "info" }));
  };

  useEffect(() => {
    const fetchTerminals = async () => {
      try {
        const response = await getTerminals();
        const data = response.data?.data || response.data || [];
        const terminalList = Array.isArray(data) ? data : (data?.terminals ?? []);
        setTerminals(terminalList);
        console.log("terminal: ", terminalList);
      } catch (error) {
        console.error("Failed to fetch terminals:", error);
        setTerminals([]);
      }
    };
    fetchTerminals();
  }, []);



  // --- LOGIC: SEARCH VIA API ---
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!criteria.origin || !criteria.destination || !criteria.date) {
      dispatch(showToast({ message: "Silakan isi Asal, Tujuan, dan Tanggal.", type: "warning" }));
      return;
    }
    setLoading(true);
    try {
      const response = await searchSchedules({
        date: criteria.date,
        origin: criteria.origin.name,
        destination: criteria.destination.name,
        passengers: criteria.passengers,
      });
      const schedules = response.data?.data || response.data || [];
      const recs = response.data?.recommendations || [];
      dispatch(setResults(Array.isArray(schedules) ? schedules : []));
      dispatch(setRecommendations(Array.isArray(recs) ? recs : []));
      console.log("result: ", response);
      navigate("/result");
    } catch (error) {
      console.error("Search failed:", error);
      dispatch(showToast({ message: "Pencarian gagal. Silakan coba lagi.", type: "error" }));
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIC: QUICK BOOK / DEV MOCK ROUTE ---
  const handleQuickBook = (originCity: string, destCity: string) => {
    const originTerm = terminals.find(
      (t) =>
        t.city.toLowerCase().includes(originCity.toLowerCase()) ||
        t.name.toLowerCase().includes(originCity.toLowerCase())
    );
    const destTerm = terminals.find(
      (t) =>
        t.city.toLowerCase().includes(destCity.toLowerCase()) ||
        t.name.toLowerCase().includes(destCity.toLowerCase())
    );

    if (originTerm && destTerm) {
      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0];

      dispatch(
        setCriteria({
          origin: originTerm,
          destination: destTerm,
          date: formattedDate,
          passengers: 1,
        })
      );

      dispatch(
        showToast({
          message: `Rute diisi otomatis: ${originTerm.city} ➔ ${destTerm.city} (${formattedDate})`,
          type: "info",
        })
      );

      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      dispatch(
        showToast({
          message: `Terminal untuk kota ${originCity} ke ${destCity} belum terdaftar di database.`,
          type: "warning",
        })
      );
    }
  };

  return (
    <div className="font-display">
      {/* Hero Section */}
      <div className="relative w-full bg-white pb-16">
        <div className="absolute inset-0 h-[500px] w-full bg-cover bg-center" style={{ backgroundImage: 'linear-gradient(rgba(19, 91, 236, 0.8), rgba(16, 22, 34, 0.8)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAlzplBckTWIDh_TN55TQWyr9kl4gpkfLvyiU-0sxyjINclSXijFhxcX7AmnVyByHb19KdmIx6luPUz4_XMLi2Ya-V_UD0pSA-dqlvhuwmN83HfuGvre84Q5lhV9ue2v-GAyoSlRsSmJ_fS5xn_68uDlG0bFBYMhHAuaAHqsrL34DTPWLLN1OZz-aMjlbzAnV0evkM11xI1Wj7s9nUReTDyd8IyqZSjSIBPoYb5XxeTLHaAM5m-b95ZM9a-PJ76rwpLeODcNdz2COTI")' }}></div>
        <div className="relative z-10 flex flex-col items-center pt-24 px-4 sm:px-10">
          <div className="text-center max-w-3xl mb-10">
            <h1 className="text-white text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight mb-4 drop-shadow-md">
              Travel Across the Country with Comfort
            </h1>
            <p className="text-blue-100 text-lg sm:text-xl font-medium drop-shadow-sm">
              Book your bus tickets easily and securely. Over 5,000 routes available.
            </p>
          </div>

          {/* Draft Booking Resume Card */}
          {isDraftActive && (
            <div className="w-full max-w-[1024px] bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 sm:p-5 shadow-lg text-white flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 animate-fade-in relative z-20">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/20 rounded-lg">
                  <span className="material-symbols-outlined text-2xl text-white">pending_actions</span>
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-base">Pemesanan Belum Selesai!</h4>
                  <p className="text-xs text-orange-50 mt-0.5">
                    Kamu memiliki draf pemesanan dari <span className="font-bold">{draftBooking.schedule?.route?.originalTerminal?.city || "Kota Asal"}</span> ke <span className="font-bold">{draftBooking.schedule?.route?.destinationTerminal?.city || "Kota Tujuan"}</span> ({draftSeats.length} Kursi).
                  </p>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={handleResumeDraft}
                  className="flex-1 sm:flex-none px-5 py-2 bg-white text-orange-600 font-bold rounded-lg text-xs hover:bg-orange-50 transition-colors shadow-sm whitespace-nowrap"
                >
                  Lanjutkan Pengisian
                </button>
                <button
                  onClick={handleDiscardDraft}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg text-xs transition-colors whitespace-nowrap border border-white/20"
                >
                  Hapus Draf
                </button>
              </div>
            </div>
          )}

          {/* Search Module */}
          <div className="w-full max-w-[1024px] bg-white rounded-xl shadow-xl p-6 sm:p-8 mt-4 border border-slate-100">
            <form className="flex flex-col lg:flex-row items-end gap-4" onSubmit={handleSearch}>
              {/* Origin Input */}
              <div className="flex-1 w-full relative group">
                <TerminalDropdown
                  Terminals={terminals}
                  label="From"
                  placeholder="Enter origin city"
                  onSelect={(t) => dispatch(setCriteria({ origin: t }))}
                  selectedValue={criteria.origin?.id}
                  icon="trip_origin"
                />
              </div>

              {/* Swap Button */}
              <div className="hidden lg:flex pb-3">
                <button type="button" className="p-2 rounded-full hover:bg-gray-100 text-primary transition-colors transform hover:rotate-180 duration-300">
                  <span className="material-symbols-outlined">swap_horiz</span>
                </button>
              </div>

              {/* Destination Input */}
              <div className="flex-1 w-full relative group">
                <TerminalDropdown
                  Terminals={terminals}
                  label="To"
                  placeholder="Enter destination city"
                  onSelect={(t) => dispatch(setCriteria({ destination: t }))}
                  selectedValue={criteria.destination?.id}
                  icon="location_on"
                />
              </div>

              {/* Date Picker */}
              <div className="w-full lg:w-48 relative group">
                <TanggalKeberangkatanPicker
                  value={criteria.date}
                  onChange={(date) => {
                    const formatted = date.toISOString().split("T")[0];
                    dispatch(setCriteria({ date: formatted }));
                  }}
                />
              </div>

              {/* Search Button */}
              <div className="w-full lg:w-auto">
                <button type="submit" disabled={loading} className="w-full flex justify-center items-center py-3 px-8 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all h-[46px]">
                  {loading ? "Searching..." : "Search Buses"}
                </button>
              </div>
            </form>
          </div>

          {/* Developer Sandbox Helper Panel (Visible only in local development) */}
          {import.meta.env.DEV && terminals.length >= 2 && (
            <div className="w-full max-w-[1024px] mt-6 bg-slate-900 text-white rounded-xl p-5 shadow-lg border border-slate-800 animate-fade-in relative z-20">
              <div className="flex items-center gap-2 mb-3 text-yellow-400">
                <span className="material-symbols-outlined !text-xl animate-pulse">bug_report</span>
                <h4 className="font-bold text-xs uppercase tracking-wider">🛠️ Developer Sandbox Helper</h4>
              </div>
              <p className="text-xs text-slate-300 mb-4">
                Keterbatasan jadwal atau rute di database lokal? Gunakan rute ter-seed di bawah ini untuk langsung mengisi formulir pencarian dengan data terminal asli yang pasti membuahkan hasil:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { from: "Kampung Rambutan", to: "Leuwi Panjang", label: "Jakarta (Rambutan) ➔ Bandung" },
                  { from: "Pulo Gebang", to: "Purabaya", label: "Jakarta (Pulo Gebang) ➔ Surabaya" },
                  { from: "Pulo Gebang", to: "Giwangan", label: "Jakarta (Pulo Gebang) ➔ Yogyakarta" },
                  { from: "Cicaheum", to: "Purabaya", label: "Bandung (Cicaheum) ➔ Surabaya" },
                  { from: "Purabaya", to: "Mengwi", label: "Surabaya ➔ Bali (Denpasar)" }
                ].map((route, oIdx) => (
                  <button
                    key={oIdx}
                    type="button"
                    onClick={() => handleQuickBook(route.from, route.to)}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-950 text-xs font-bold text-slate-200 rounded-lg border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer hover:scale-[1.02]"
                  >
                    <span className="material-symbols-outlined text-[14px]">play_arrow</span>
                    {route.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Why Choose Us Section */}
      <section className="py-16 px-4 bg-background-light">
        <div className="max-w-[1024px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#111318] mb-4">Why Choose BusGo?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We provide the most comfortable and reliable bus travel experience across the country.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6 text-primary">
                <span className="material-symbols-outlined !text-3xl">verified_user</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Safety First</h3>
              <p className="text-gray-500 leading-relaxed">
                Our buses undergo rigorous safety checks and our drivers are professionally trained for your peace of mind.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6 text-primary">
                <span className="material-symbols-outlined !text-3xl">schedule</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">On-Time Guarantee</h3>
              <p className="text-gray-500 leading-relaxed">
                We value your time. Our punctuality record is industry-leading, ensuring you arrive when expected.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6 text-primary">
                <span className="material-symbols-outlined !text-3xl">support_agent</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">24/7 Support</h3>
              <p className="text-gray-500 leading-relaxed">
                Need help? Our dedicated customer support team is available around the clock to assist you with your journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Routes Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-[1024px] mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-end mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-[#111318] mb-2">Popular Routes</h2>
              <p className="text-gray-600">Jelajahi rute terpopuler dengan harga terbaik dan pesan dalam sekali klik.</p>
            </div>
            <a className="text-primary font-semibold flex items-center hover:underline group" href="#" onClick={(e) => { e.preventDefault(); handleQuickBook("Jakarta", "Bandung"); }}>
              Quick Book Jakarta ➔ Bandung
              <span className="material-symbols-outlined ml-1 group-hover:translate-x-1 transition-transform text-sm">arrow_forward</span>
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Route Card 1 */}
            <div className="group rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
              <div className="h-48 overflow-hidden relative">
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm z-10">
                  Rp 120.000
                </div>
                <div className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDSsQy5ChLDtqhe4x3OLsHelkuB-8yYhnf3oLqvWbGc0v-M7CD5TUM84SuXetaQbnTi_1iPBRJzIANDP-R6TFkIvne624voStK5S_JWrGsKfNd6m809vsCJ9dXjLupgs4Yest4OLFOFFSn6ekKvXd71BPXHiGWTpugxDpVUZdVlwX2ssKP8K1jYkx2iu1UYHLEusSUbvYXKhhFta7kLlXxRQC7N0isx4EvQ2QWaTf6A5gvdtyv293gjvLlrJ1pHnAmI-REjIDjfyOV_")' }}></div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-gray-900">Jakarta</h3>
                  <span className="material-symbols-outlined text-gray-300">arrow_forward</span>
                  <h3 className="font-bold text-lg text-gray-900">Bandung</h3>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">schedule</span>
                    3j 00m
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">directions_bus</span>
                    Direct Route
                  </div>
                </div>
                <button
                  onClick={() => handleQuickBook("Jakarta", "Bandung")}
                  className="mt-auto w-full py-2.5 rounded-lg border border-primary text-primary font-bold hover:bg-primary hover:text-white transition-colors cursor-pointer"
                >
                  Book Now
                </button>
              </div>
            </div>

            {/* Route Card 2 */}
            <div className="group rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
              <div className="h-48 overflow-hidden relative">
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm z-10">
                  Rp 120.000
                </div>
                <div className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC5BGnHiPTbdCVvO9HJrKykSBvyWb00Ur2RIPa5-kzMwCvG_E4aLPmPnG2hAT2_4PZr-8WjevhfXiK69ZcHq28mqk0fJhO9WaGuJxfNMuLkai33ebTSd9WPWoXgAnWFLYCdDZLcQuFhN-QAW93riBzNTRccEyPc8NkS39tDV8hhRtkfepf0bxdYWinLeBAv-tkWrLCKBK9fmDXy0ODrFESDuVrv_DfOTNs9T6X48qbB4wQf0f1wyNO6rKhTiraidz5QZ7Co2dhqkMWT")' }}></div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-gray-900">Bandung</h3>
                  <span className="material-symbols-outlined text-gray-300">arrow_forward</span>
                  <h3 className="font-bold text-lg text-gray-900">Jakarta</h3>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">schedule</span>
                    3j 00m
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">directions_bus</span>
                    Direct Route
                  </div>
                </div>
                <button
                  onClick={() => handleQuickBook("Bandung", "Jakarta")}
                  className="mt-auto w-full py-2.5 rounded-lg border border-primary text-primary font-bold hover:bg-primary hover:text-white transition-colors cursor-pointer"
                >
                  Book Now
                </button>
              </div>
            </div>

            {/* Route Card 3 */}
            <div className="group rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
              <div className="h-48 overflow-hidden relative">
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm z-10">
                  Rp 250.000
                </div>
                <div className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCw2DKE9FOIv-r1Hoz53dzPM-zscV2h8a7uPfT5M_3FSm75pBmbZx6QK5AIphow9hioNaEQ0Ud4T_0DFZQrhBQPUvFVctX6bjhb_VVIt-4P_IE36LkqSHOzc6nVE75eFL4BYALsb0OKRxFsljcCKeLHM1i1OKqhnd4RKC0ysjpLm84A0Y92BtM_z1kJr3Vo1dbMyM7hQrbm0HwVCzhx0co_x3IvPtt0Nn_4aDmzgvWVhwFnU7F2Ih6feIvKvsEQktxbUY_nP5B_-hwd")' }}></div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-gray-900">Jakarta</h3>
                  <span className="material-symbols-outlined text-gray-300">arrow_forward</span>
                  <h3 className="font-bold text-lg text-gray-900">Yogyakarta</h3>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">schedule</span>
                    7j 30m
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">directions_bus</span>
                    AC Executive
                  </div>
                </div>
                <button
                  onClick={() => handleQuickBook("Jakarta", "Yogyakarta")}
                  className="mt-auto w-full py-2.5 rounded-lg border border-primary text-primary font-bold hover:bg-primary hover:text-white transition-colors cursor-pointer"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter / CTA Section */}
      <div className="bg-primary/5 py-16 px-4">
        <div className="max-w-[1024px] mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-1/2 p-10 flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Get 20% off your first trip</h3>
            <p className="text-gray-600 mb-6">Join our newsletter to receive exclusive offers, travel tips, and early access to new routes.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Enter your email" className="flex-1 rounded-lg border-gray-200 focus:ring-primary focus:border-primary" />
              <button className="bg-primary text-white font-bold px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors">Subscribe</button>
            </div>
          </div>
          <div className="md:w-1/2 bg-blue-100 min-h-[300px] bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBjayGdXgmPfZvRWkmH0WSMc6qcEfXc8Auxq8bSOwJnX6scGLTo5C0oRc5222aOCsJenLiYAogpc3gMojNAo44ldOqzydlkeaZKaKCBt2PySTY47TRMehiKNdBbSkN2PqNqKEj8Ws5-bZARnoWI8FT_33P4tkvfa2JwpxEsVBdWsEA3-iip87ji_RF-JqvLKTlryumPH62ixvQuYXukempUTIfqm1CUjJr3G254GWTmYL6neZTjVnNeF5HMmVT6AwOTllYiLSs9T7Se")' }}></div>
        </div>
      </div>


    </div>
  );
};

export default HomePage;