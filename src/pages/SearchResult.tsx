
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import type { Schedule } from "../features/search/searchTypes";
import {
  setCurrentBooking,
  setBookingStep,
} from "../features/booking/bookingSlice";

const SearchResult: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  /* =====================
      REDUX STATE
  ===================== */
  const { criteria, results } = useAppSelector(
    (state) => state.search
  );

  /* =====================
      HANDLERS
  ===================== */
  const handleSelectSchedule = (schedule: Schedule) => {
    dispatch(
      setCurrentBooking({
        id: schedule.id,
        scheduleId: schedule.id,
        totalPrice: schedule.price,
        schedule: schedule,
      })
    );

    dispatch(setBookingStep("seats"));
    navigate("/seat");
  };

  /* =====================
      HELPERS
  ===================== */
  const getBusName = (schedule: Schedule) => schedule.bus?.busNumber || "Express Lines";
  const getDuration = (schedule: Schedule) => schedule.route?.estimatedDuration || "—";
  const getSeatsAvailable = (schedule: Schedule) => schedule.availableSeats ?? "—";
  const getBusType = (schedule: Schedule) => schedule.bus?.busType || "AC Seater";

  /* =====================
      RENDER (NEW MODERN DESIGN)
  ===================== */
  return (
    <div className="bg-background-light dark:bg-background-dark text-[#111318] dark:text-white font-display flex flex-col">

      {/* Search Summary Bar (Sub-header) */}
      <div className="bg-white dark:bg-[#1a202c] shadow-sm relative z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              {/* Breadcrumbs */}
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <a className="hover:text-primary" href="#" onClick={() => navigate("/")}>Home</a>
                <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                <a className="hover:text-primary" href="#">Bus Tickets</a>
                <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {criteria.origin?.name || "Origin"} to {criteria.destination?.name || "Destination"}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-[#111318] dark:text-white flex items-center gap-2 flex-wrap">
                {criteria.origin?.name || "Origin"} <span className="material-symbols-outlined text-gray-400">arrow_right_alt</span> {criteria.destination?.name || "Destination"}
                <span className="text-base font-normal text-gray-500 ml-2 border-l border-gray-300 pl-3">
                  {criteria.date ? new Date(criteria.date).toLocaleDateString("en-US", { weekday: 'short', day: 'numeric', month: 'short' }) : "Date"}
                </span>
                <span className="text-base font-normal text-gray-500 ml-2 border-l border-gray-300 pl-3">
                  {criteria.passengers} Passenger{criteria.passengers > 1 ? 's' : ''}
                </span>
              </h2>
            </div>
            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold text-sm transition-all shadow-lg shadow-primary/30 w-full md:w-auto"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
              Modify Search
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar Filters */}
          <aside className="w-full lg:w-80 flex-shrink-0 space-y-6 hidden lg:block">
            <div className="bg-white dark:bg-[#1a202c] rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Filters</h3>
                <button className="text-sm font-medium text-primary hover:underline">Reset All</button>
              </div>

              {/* Price Filter */}
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Price Range</h4>
                {/* Range Slider Visualization (Mock) */}
                <div className="relative h-12 pt-2 mb-2">
                  <div className="absolute w-full h-1 bg-gray-200 rounded-full top-4"></div>
                  <div className="absolute h-1 bg-primary rounded-full top-4 left-[10%] right-[30%]"></div>
                  {/* Left Handle */}
                  <div className="absolute left-[10%] top-1.5 -ml-2 w-6 h-6 rounded-full bg-white border-2 border-primary shadow cursor-pointer flex items-center justify-center z-10 hover:scale-110 transition-transform"></div>
                  <div className="absolute left-[10%] top-8 -ml-3 text-xs font-bold text-gray-700 dark:text-gray-300">$25</div>
                  {/* Right Handle */}
                  <div className="absolute right-[30%] top-1.5 -mr-2 w-6 h-6 rounded-full bg-white border-2 border-primary shadow cursor-pointer flex items-center justify-center z-10 hover:scale-110 transition-transform"></div>
                  <div className="absolute right-[30%] top-8 -mr-3 text-xs font-bold text-gray-700 dark:text-gray-300">$180</div>
                </div>
              </div>
              <hr className="border-gray-100 dark:border-gray-700 my-6" />

              {/* Departure Time Filter */}
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Departure Time</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0 transition-all" type="checkbox" />
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 group-hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[20px]">wb_twilight</span>
                      <span className="text-sm">Before 6 AM</span>
                    </div>
                    <span className="ml-auto text-xs text-gray-400"></span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input checked readOnly className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0 transition-all" type="checkbox" />
                    <div className="flex items-center gap-2 text-gray-900 font-medium dark:text-white group-hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[20px] filled">wb_sunny</span>
                      <span className="text-sm">6 AM - 12 PM</span>
                    </div>
                    <span className="ml-auto text-xs text-gray-400"></span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0 transition-all" type="checkbox" />
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 group-hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[20px]">sunny</span>
                      <span className="text-sm">12 PM - 6 PM</span>
                    </div>
                    <span className="ml-auto text-xs text-gray-400"></span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0 transition-all" type="checkbox" />
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 group-hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[20px]">nights_stay</span>
                      <span className="text-sm">After 6 PM</span>
                    </div>
                    <span className="ml-auto text-xs text-gray-400"></span>
                  </label>
                </div>
              </div>
              <hr className="border-gray-100 dark:border-gray-700 my-6" />

              {/* Bus Class Filter */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Bus Class</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0" type="checkbox" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">AC Seater</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0" type="checkbox" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">AC Sleeper</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0" type="checkbox" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Non-AC Seater</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0" type="checkbox" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Volvo Multi-Axle</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Results List */}
          <section className="flex-grow flex flex-col gap-4">

            {/* Sorting Bar */}
            <div className="bg-white dark:bg-[#1a202c] rounded-xl p-2 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="px-3">
                <span className="font-bold text-gray-900 dark:text-white">{results.length} Buses</span>
                <span className="text-gray-500 text-sm ml-1">found</span>
              </div>
              <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 p-1 rounded-lg w-full sm:w-auto overflow-x-auto">
                <button className="px-4 py-1.5 rounded-md text-sm font-semibold bg-white dark:bg-gray-700 shadow-sm text-primary dark:text-white whitespace-nowrap">Recommended</button>
                <button className="px-4 py-1.5 rounded-md text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors whitespace-nowrap">Cheapest</button>
                <button className="px-4 py-1.5 rounded-md text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors whitespace-nowrap">Fastest</button>
                <button className="px-4 py-1.5 rounded-md text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors whitespace-nowrap">Earliest</button>
              </div>
            </div>

            {results.length === 0 ? (
              /* Empty State */
              <div className="bg-white dark:bg-[#1a202c] rounded-xl p-8 text-center shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="size-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-gray-400 text-3xl">search_off</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No buses found</h3>
                <p className="text-gray-500">Try changing your search criteria.</p>
              </div>
            ) : (
              results.map((schedule) => (
                <article key={schedule.id} className="group bg-white dark:bg-[#1a202c] rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md hover:border-primary/30 transition-all duration-300">
                  <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">

                    {/* Operator Info */}
                    <div className="w-full md:w-1/4 flex flex-row md:flex-col gap-3 items-center md:items-start">
                      <div className="size-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary text-2xl">directions_bus_filled</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{getBusName(schedule)}</h3>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-bold flex items-center gap-0.5">
                            4.5 <span className="material-symbols-outlined text-[10px]">star</span>
                          </span>
                          <span>(Rated)</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{getBusType(schedule)}</p>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="flex-grow w-full md:w-2/4 flex items-center justify-between gap-2 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-xl font-bold text-gray-900 dark:text-white">{schedule.departureTime}</span>
                        <span className="text-xs text-gray-500 font-medium">{criteria.origin?.name}</span>
                      </div>
                      <div className="flex-grow flex flex-col items-center px-4">
                        <span className="text-xs text-gray-400 mb-1">{getDuration(schedule)}</span>
                        <div className="w-full h-[2px] bg-gray-200 relative">
                          <div className="absolute left-0 top-1/2 -mt-1 w-2 h-2 rounded-full bg-gray-300"></div>
                          <div className="absolute right-0 top-1/2 -mt-1 w-2 h-2 rounded-full bg-gray-300"></div>
                          {/* Stops indicator */}
                          <div className="absolute left-1/2 top-1/2 -mt-1 w-2 h-2 rounded-full bg-white border border-gray-300 group-hover:border-primary group-hover:bg-primary transition-colors" title="1 Stop"></div>
                        </div>
                        <span className="text-[10px] text-gray-400 mt-1">1 Stop</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-xl font-bold text-gray-900 dark:text-white">{schedule.arrivalTime}</span>
                        <span className="text-xs text-gray-500 font-medium">{criteria.destination?.name}</span>
                      </div>
                    </div>

                    {/* Price & CTA */}
                    <div className="w-full md:w-1/4 flex flex-row md:flex-col items-center justify-between md:items-end gap-2 border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-700 pt-4 md:pt-0 md:pl-6">
                      <div className="text-right">
                        <span className="text-2xl font-bold text-primary">Rp {parseFloat(schedule.price).toLocaleString("id-ID")}</span>
                        <p className="text-xs text-green-600 font-medium">{getSeatsAvailable(schedule)} seats left</p>
                      </div>
                      <button
                        onClick={() => handleSelectSchedule(schedule)}
                        className="w-full md:w-auto px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold text-sm shadow-md shadow-primary/20 transition-all hover:translate-y-[-1px]"
                      >
                        Select Seats
                      </button>
                    </div>
                  </div>

                  {/* Bottom Expandable strip */}
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <span className="material-symbols-outlined text-[14px]">wifi</span> WiFi
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <span className="material-symbols-outlined text-[14px]">electrical_services</span> Power Outlets
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <span className="material-symbols-outlined text-[14px]">water_drop</span> Water Bottle
                      </span>
                    </div>
                    <button className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline">
                      View Details <span className="material-symbols-outlined text-[14px]">expand_more</span>
                    </button>
                  </div>
                </article>
              ))
            )}

            {/* Promotional Banner */}
            <div className="bg-gradient-to-r from-primary to-blue-400 rounded-xl p-4 shadow-lg text-white flex items-center justify-between overflow-hidden relative mt-4">
              <div className="relative z-10">
                <h4 className="font-bold text-lg">Save 15% on Return Trips!</h4>
                <p className="text-xs text-blue-100">Book your return ticket now and get an instant discount.</p>
              </div>
              <button className="relative z-10 bg-white text-primary px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors">
                Add Return Ticket
              </button>
              {/* Abstract Background Pattern */}
              <div className="absolute right-[-20px] bottom-[-40px] opacity-20">
                <span className="material-symbols-outlined text-[120px]">confirmation_number</span>
              </div>
            </div>

          </section>
        </div>
      </main>
    </div>
  );
};

export default SearchResult;
