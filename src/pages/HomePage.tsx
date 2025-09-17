import type React from "react";
import { getTerminals } from "../api/terminalApi";
import { useEffect, useState } from "react";
import TerminalDropdown from "../components/TerminalDropdown";
import TanggalKeberangkatanPicker from "../components/KalenderSelection";
import { useDispatch, useSelector } from "react-redux";
import { setOrigin, setDestination } from "../features/search/searchSlice";
import { searchSchedules } from "../api/scheduleApi";
import { type RootState } from "../features/store";
const HomePage: React.FC = () => {
  const dispatch = useDispatch()
  const [Terminals, setTerminal] = useState([]);

  const handleSelectOrigin = (terminal: string) => {
    dispatch(setOrigin(terminal))
  }

  const {departureDate, origin, destination} = useSelector((state: RootState) => state.search)

  const handleSelectDestination = (terminal: string) => {
    dispatch(setDestination(terminal))
  }

  const handleSearchSchedules = async(e: { preventDefault: () => void; }) => {
    e.preventDefault()
    const response = await searchSchedules({date: departureDate, origin, destination});
    const responseBody = await response.json();
    const schedules = responseBody.data;
    console.log(schedules)
  }

  async function fetchTerminals() {
    const response = await getTerminals();
    const responseBody = await response.json();
    const terminals = responseBody.data.terminals;
    console.log(responseBody);
    console.log(terminals);

    if (responseBody.success === true) {
      setTerminal(terminals);
    } else {
      alert("error");
    }
  }

  useEffect(() => {
    fetchTerminals().then(() => console.log("terminal fetched"));
  }, []);

  return (
    <main className="container mx-auto mt-6 p-8">
      <div className="bg-yellow-400 p-8 neobrutalism-border shadow-neobrutalism">
        <h1 className="text-5xl bebas-neue mb-4 text-black text-center">
          CARI JADWAL PERJALANAN ANDA
        </h1>
        <p className="text-lg text-black text-center mb-10">
          Temukan dan pesan tiket Anda dengan mudah, isi detail perjalanan Anda
          di bawah ini.
        </p>

        <form className="space-y-6">
          {/* <!-- Kolom Terminal Asal & Tujuan --> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TerminalDropdown
              Terminals={Terminals}
              label="Terminal Asal"
              placeholder="Pilih Terminal Asal"
              onSelect={handleSelectOrigin}
            />
            <TerminalDropdown
              Terminals={Terminals}
              label="Terminal Tujuan"
              placeholder="Pilih Terminal Tujuan"
              onSelect={handleSelectDestination}
            />
          </div>

          {/* <!-- Kolom Tanggal Keberangkatan --> */}
          <div>
            {/* <label className="block text-sm font-bold mb-2">
              Tanggal Keberangkatan
            </label>
            <div className="relative">
              <input
                type="date"
                id="tanggal_berangkat"
                className="w-full px-4 py-3 bg-white neobrutalism-border focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                📅
              </span>
            </div> */}
            <TanggalKeberangkatanPicker />
          </div>

          {/* <!-- Tombol Cari Jadwal --> */}
          <button
            type="submit"
            onClick={handleSearchSchedules}
            className="w-full bebas-neue text-2xl bg-indigo-600 text-white py-4 neobrutalism-border shadow-neobrutalism-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200"
          >
            CARI JADWAL
          </button>
        </form>
      </div>
    </main>
  );
};

export default HomePage;
