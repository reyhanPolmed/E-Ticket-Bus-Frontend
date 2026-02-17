import type React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCriteria, setResults } from "../features/search/searchSlice";
import { type RootState } from "../features/store";
import TerminalDropdown from "../components/TerminalDropdown";
import { getTerminals } from "../api/terminalApi";
import { searchSchedules } from "../api/scheduleApi";

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
      alert("Please fill in Origin, Destination, and Date.");
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
      dispatch(setResults(Array.isArray(schedules) ? schedules : []));
      console.log("result: ", response);
      navigate("/result");
    } catch (error) {
      console.error("Search failed:", error);
      alert("Search failed. Please try again.");
    } finally {
      setLoading(false);
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

          {/* Search Module */}
          <div className="w-full max-w-[1024px] bg-white rounded-xl shadow-xl p-6 sm:p-8 mt-4 border border-slate-100">
            <form className="flex flex-col lg:flex-row items-end gap-4" onSubmit={handleSearch}>
              {/* Origin Input */}
              <div className="flex-1 w-full relative group">
                <label className="block text-sm font-bold text-gray-700 mb-2 pl-1">From</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <span className="material-symbols-outlined text-gray-400">trip_origin</span>
                  </div>
                  {/* Using Custom Dropdown logic but styled invisibly to match */}
                  <TerminalDropdown
                    Terminals={terminals}
                    label=""
                    placeholder="Enter origin city"
                    onSelect={(t) => dispatch(setCriteria({ origin: t }))}
                  // We might need to adjust TerminalDropdown to accept a 'customInputClass' prop or stick with standard styling. 
                  // For now, I'll rely on TerminalDropdown's internal style but it might clash. 
                  // To perfectly match, I should have refactored TerminalDropdown. 
                  // I will wrap it in a div that overrides styles if needed, but TerminalDropdown has hardcoded styles. 
                  // HACK: I will recreate a simple select here for perfect visual match if TerminalDropdown is too rigid.
                  // But I need the ID. Let's use a standard select with the class from the design.
                  />
                  {/* Override TerminalDropdown for this specific UI to ensure it matches the design exactly. 
                                        Since TerminalDropdown has specific 'neobrutalist' styles (border-black, etc), 
                                        I'll manually render a select here for the 'BusGo' theme. */}
                  <select
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-all appearance-none"
                    value={criteria.origin?.id || ""}
                    onChange={(e) => {
                      const t = terminals.find(term => term.id === e.target.value);
                      if (t) dispatch(setCriteria({ origin: t }));
                    }}
                  >
                    <option value="" disabled>Enter origin city</option>
                    {terminals.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Swap Button */}
              <div className="hidden lg:flex pb-3">
                <button type="button" className="p-2 rounded-full hover:bg-gray-100 text-primary transition-colors transform hover:rotate-180 duration-300">
                  <span className="material-symbols-outlined">swap_horiz</span>
                </button>
              </div>

              {/* Destination Input */}
              <div className="flex-1 w-full relative group">
                <label className="block text-sm font-bold text-gray-700 mb-2 pl-1">To</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <span className="material-symbols-outlined text-gray-400">location_on</span>
                  </div>
                  <select
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-all appearance-none"
                    value={criteria.destination?.id || ""}
                    onChange={(e) => {
                      const t = terminals.find(term => term.id === e.target.value);
                      if (t) dispatch(setCriteria({ destination: t }));
                    }}
                  >
                    <option value="" disabled>Enter destination city</option>
                    {terminals.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date Picker */}
              <div className="w-full lg:w-48 relative group">
                <label className="block text-sm font-bold text-gray-700 mb-2 pl-1">Departure</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <span className="material-symbols-outlined text-gray-400">calendar_month</span>
                  </div>
                  <input
                    type="date"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg leading-5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-all"
                    value={criteria.date || ""}
                    onChange={(e) => dispatch(setCriteria({ date: e.target.value }))}
                  />
                </div>
              </div>

              {/* Search Button */}
              <div className="w-full lg:w-auto">
                <button type="submit" disabled={loading} className="w-full flex justify-center items-center py-3 px-8 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all h-[46px]">
                  {loading ? "Searching..." : "Search Buses"}
                </button>
              </div>
            </form>
          </div>
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
              <p className="text-gray-600">Explore our most traveled destinations at unbeatable prices.</p>
            </div>
            <a className="text-primary font-semibold flex items-center hover:underline group" href="#">
              View all routes
              <span className="material-symbols-outlined ml-1 group-hover:translate-x-1 transition-transform text-sm">arrow_forward</span>
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Route Card 1 */}
            <div className="group rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
              <div className="h-48 overflow-hidden relative">
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm z-10">
                  From $25
                </div>
                <div className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDSsQy5ChLDtqhe4x3OLsHelkuB-8yYhnf3oLqvWbGc0v-M7CD5TUM84SuXetaQbnTi_1iPBRJzIANDP-R6TFkIvne624voStK5S_JWrGsKfNd6m809vsCJ9dXjLupgs4Yest4OLFOFFSn6ekKvXd71BPXHiGWTpugxDpVUZdVlwX2ssKP8K1jYkx2iu1UYHLEusSUbvYXKhhFta7kLlXxRQC7N0isx4EvQ2QWaTf6A5gvdtyv293gjvLlrJ1pHnAmI-REjIDjfyOV_")' }}></div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-gray-900">New York</h3>
                  <span className="material-symbols-outlined text-gray-300">arrow_forward</span>
                  <h3 className="font-bold text-lg text-gray-900">Boston</h3>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">schedule</span>
                    4h 30m
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">directions_bus</span>
                    Direct
                  </div>
                </div>
                <button className="mt-auto w-full py-2.5 rounded-lg border border-primary text-primary font-bold hover:bg-primary hover:text-white transition-colors">
                  Book Now
                </button>
              </div>
            </div>

            {/* Route Card 2 */}
            <div className="group rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
              <div className="h-48 overflow-hidden relative">
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm z-10">
                  From $30
                </div>
                <div className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC5BGnHiPTbdCVvO9HJrKykSBvyWb00Ur2RIPa5-kzMwCvG_E4aLPmPnG2hAT2_4PZr-8WjevhfXiK69ZcHq28mqk0fJhO9WaGuJxfNMuLkai33ebTSd9WPWoXgAnWFLYCdDZLcQuFhN-QAW93riBzNTRccEyPc8NkS39tDV8hhRtkfepf0bxdYWinLeBAv-tkWrLCKBK9fmDXy0ODrFESDuVrv_DfOTNs9T6X48qbB4wQf0f1wyNO6rKhTiraidz5QZ7Co2dhqkMWT")' }}></div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-gray-900">Los Angeles</h3>
                  <span className="material-symbols-outlined text-gray-300">arrow_forward</span>
                  <h3 className="font-bold text-lg text-gray-900">Las Vegas</h3>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">schedule</span>
                    5h 15m
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">directions_bus</span>
                    Direct
                  </div>
                </div>
                <button className="mt-auto w-full py-2.5 rounded-lg border border-primary text-primary font-bold hover:bg-primary hover:text-white transition-colors">
                  Book Now
                </button>
              </div>
            </div>

            {/* Route Card 3 */}
            <div className="group rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
              <div className="h-48 overflow-hidden relative">
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm z-10">
                  From $20
                </div>
                <div className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCw2DKE9FOIv-r1Hoz53dzPM-zscV2h8a7uPfT5M_3FSm75pBmbZx6QK5AIphow9hioNaEQ0Ud4T_0DFZQrhBQPUvFVctX6bjhb_VVIt-4P_IE36LkqSHOzc6nVE75eFL4BYALsb0OKRxFsljcCKeLHM1i1OKqhnd4RKC0ysjpLm84A0Y92BtM_z1kJr3Vo1dbMyM7hQrbm0HwVCzhx0co_x3IvPtt0Nn_4aDmzgvWVhwFnU7F2Ih6feIvKvsEQktxbUY_nP5B_-hwd")' }}></div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-gray-900">Chicago</h3>
                  <span className="material-symbols-outlined text-gray-300">arrow_forward</span>
                  <h3 className="font-bold text-lg text-gray-900">Detroit</h3>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">schedule</span>
                    4h 45m
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">directions_bus</span>
                    1 Stop
                  </div>
                </div>
                <button className="mt-auto w-full py-2.5 rounded-lg border border-primary text-primary font-bold hover:bg-primary hover:text-white transition-colors">
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