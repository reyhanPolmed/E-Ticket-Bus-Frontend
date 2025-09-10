import React, { useState, useEffect, useRef } from 'react';

// --- Komponen Ikon Pin ---
// Menggunakan SVG inline agar tidak perlu file eksternal

interface Terminal {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  province: string;
  latitude: string;
  longitude: string;
  status: 'active' | 'inactive'; // Menggunakan union type untuk status yang lebih spesifik
  
  // Atribut ini adalah string yang berisi JSON, perlu di-parse
  facilities: string; // Setelah di-parse akan menjadi: string[]
  
  // Atribut ini juga string yang berisi JSON
  operatingHours: string; // Setelah di-parse akan menjadi: OperatingHours
  
  // Atribut tanggal dalam format ISO string
  createdAt: string;
  updatedAt: string;
};

const PinIcon = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="hotpink" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
);

interface TerminalDropdownProps {
  Terminals: Terminal[];
  label: string;
  placeholder: string;
}

// --- Komponen Utama Dropdown ---
const TerminalDropdown: React.FC<TerminalDropdownProps> = ({Terminals, label, placeholder}) => {
    // State untuk mengontrol status buka/tutup dropdown
    const [isOpen, setIsOpen] = useState(false);
    
    // State untuk menyimpan terminal yang dipilih
    const [selectedTerminal, setSelectedTerminal] = useState<Terminal | null>(null);

    // Ref untuk mendeteksi klik di luar komponen
    const dropdownRef = useRef<HTMLDivElement>(null);

    // --- Simulasi Fetch Data ---
    // Gunakan useEffect untuk mengisi data terminal sekali saat komponen dimuat

    // --- Logika untuk Menutup Dropdown saat Klik di Luar ---
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        // Tambahkan event listener saat komponen dimuat
        document.addEventListener('mousedown', handleClickOutside);

        // Hapus event listener saat komponen akan di-unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    // --- Fungsi untuk Menangani Pemilihan Opsi ---
    const handleSelectTerminal = (terminal: Terminal) => {
        setSelectedTerminal(terminal); // Set terminal yang dipilih
        setIsOpen(false); // Tutup dropdown
    };

    return (
        // Container utama dengan background kuning seperti pada gambar              
        <div ref={dropdownRef} className="relative w-full">
            {/* Menggunakan prop 'label' yang dinamis */}
            <label className="block text-black text-sm font-bold mb-2">
                {label}
            </label>

            {/* Tombol utama dropdown */}
            <button
                type="button" 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-white border-2 border-black rounded-md p-3 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
                <span className={selectedTerminal ? 'text-black' : 'text-gray-400'}>
                    {/* Menggunakan prop 'placeholder' yang dinamis */}
                    {selectedTerminal ? selectedTerminal.name : placeholder}
                </span>
                <PinIcon />
            </button>

            {/* Daftar Opsi Dropdown */}
            {isOpen && (
                <ul className="absolute z-10 w-full mt-1 bg-white border-2 border-black rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {Terminals.map((terminal) => (
                        <li
                            key={terminal.id}
                            onClick={() => handleSelectTerminal(terminal)}
                            className="p-3 hover:bg-yellow-100 cursor-pointer text-gray-800"
                        >
                            {terminal.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TerminalDropdown;
