import React from "react";
// import { ArrowLeft } from "lucide-react";
// import { useNavigate } from "react-router-dom";
const SearchResult: React.FC = () => {
  // const navigate = useNavigate();
  return (
    <div className="m-10">
      <h2 className="text-4xl font-bold text-black mb-8">
        Available Buses: New York to Boston
      </h2>
      <div className="space-y-6 ">
        <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 p-6 bg-white border-4 border-black rounded-lg neobrutalism-border shadow-neobrutalism-sm">
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 items-center text-center md:text-left">
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">
                Departure
              </p>
              <p className="text-2xl font-bold text-black">08:00 AM</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">
                Arrival
              </p>
              <p className="text-2xl font-bold text-black">12:00 PM</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">
                Origin
              </p>
              <p className="text-xl font-bold text-black">New York</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">
                Destination
              </p>
              <p className="text-xl font-bold text-black">Boston</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-end border-t-2 md:border-t-0 md:border-l-2 border-black pt-4 md:pt-0 md:pl-6 mt-4 md:mt-0">
            <button className="w-full md:w-auto flex items-center justify-center gap-2 rounded-md h-12 px-8 bg-yellow-400 text-black text-lg font-bold border-2 border-black neobrutalism-border shadow-neobrutalism-sm hover:bg-yellow-500 transition-colors">
              Book Now
            </button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 p-6 bg-white border-4 border-black rounded-lg brutalist-shadow neobrutalism-border shadow-neobrutalism-sm">
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 items-center text-center md:text-left">
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">
                Departure
              </p>
              <p className="text-2xl font-bold text-black">09:30 AM</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">
                Arrival
              </p>
              <p className="text-2xl font-bold text-black">01:30 PM</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">
                Origin
              </p>
              <p className="text-xl font-bold text-black">New York</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">
                Destination
              </p>
              <p className="text-xl font-bold text-black">Philadelphia</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-end border-t-2 md:border-t-0 md:border-l-2 border-black pt-4 md:pt-0 md:pl-6 mt-4 md:mt-0">
            <button className="w-full md:w-auto flex items-center justify-center gap-2 rounded-md h-12 px-8 bg-yellow-400 text-black text-lg font-bold border-2 border-black neobrutalism-border shadow-neobrutalism-sm hover:bg-yellow-500 transition-colors">
              Book Now
            </button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 p-6 bg-white border-4 border-black rounded-lg brutalist-shadow neobrutalism-border shadow-neobrutalism-sm">
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 items-center text-center md:text-left">
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">
                Departure
              </p>
              <p className="text-2xl font-bold text-black">11:00 AM</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">
                Arrival
              </p>
              <p className="text-2xl font-bold text-black">03:00 PM</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">
                Origin
              </p>
              <p className="text-xl font-bold text-black">New York</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">
                Destination
              </p>
              <p className="text-xl font-bold text-black">Washington D.C.</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-end border-t-2 md:border-t-0 md:border-l-2 border-black pt-4 md:pt-0 md:pl-6 mt-4 md:mt-0">
            <button className="w-full md:w-auto flex items-center justify-center gap-2 rounded-md h-12 px-8 bg-yellow-400 text-black text-lg font-bold border-2 border-black neobrutalism-border shadow-neobrutalism-sm hover:bg-yellow-500 transition-colors">
              Book Now
            </button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 p-6 bg-white border-4 border-black rounded-lg brutalist-shadow neobrutalism-border shadow-neobrutalism-sm">
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 items-center text-center md:text-left">
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">
                Departure
              </p>
              <p className="text-2xl font-bold text-black">01:00 PM</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">
                Arrival
              </p>
              <p className="text-2xl font-bold text-black">05:00 PM</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">
                Origin
              </p>
              <p className="text-xl font-bold text-black">New York</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">
                Destination
              </p>
              <p className="text-xl font-bold text-black">Baltimore</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-end border-t-2 md:border-t-0 md:border-l-2 border-black pt-4 md:pt-0 md:pl-6 mt-4 md:mt-0">
            <button className="w-full md:w-auto flex items-center justify-center gap-2 rounded-md h-12 px-8 bg-yellow-400 text-black text-lg font-bold border-2 border-black neobrutalism-border shadow-neobrutalism-sm hover:bg-yellow-500 transition-colors">
              Book Now
            </button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 p-6 bg-white border-4 border-black rounded-lg brutalist-shadow neobrutalism-border shadow-neobrutalism-sm">
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 items-center text-center md:text-left">
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">
                Departure
              </p>
              <p className="text-2xl font-bold text-black">02:30 PM</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">
                Arrival
              </p>
              <p className="text-2xl font-bold text-black">06:30 PM</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">
                Origin
              </p>
              <p className="text-xl font-bold text-black">New York</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">
                Destination
              </p>
              <p className="text-xl font-bold text-black">Albany</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-end border-t-2 md:border-t-0 md:border-l-2 border-black pt-4 md:pt-0 md:pl-6 mt-4 md:mt-0">
            <button className="w-full md:w-auto flex items-center justify-center gap-2 rounded-md h-12 px-8 bg-yellow-400 text-black text-lg font-bold border-2 border-black neobrutalism-border shadow-neobrutalism-sm hover:bg-yellow-500 transition-colors">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
