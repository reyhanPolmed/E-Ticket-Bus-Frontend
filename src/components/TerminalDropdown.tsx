import type React from "react";
import { useState, useRef, useEffect } from "react";

interface TerminalDropdownProps {
  Terminals: Terminal[];
  label: string;
  placeholder: string;
  onSelect: (terminal: Terminal) => void;
  icon?: string;
  selectedValue?: string;
}

type Terminal = {
  id: string;
  name: string;
  city: string;
};

const TerminalDropdown: React.FC<TerminalDropdownProps> = ({
  Terminals,
  label,
  placeholder,
  onSelect,
  icon = "location_on",
  selectedValue
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTerminal, setSelectedTerminal] = useState<Terminal | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync selectedValue prop if provided
  useEffect(() => {
    if (selectedValue) {
      const found = Terminals.find(t => t.id === selectedValue);
      if (found) setSelectedTerminal(found);
    } else {
      setSelectedTerminal(null);
    }
  }, [selectedValue, Terminals]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectTerminal = (terminal: Terminal) => {
    onSelect(terminal);
    setSelectedTerminal(terminal);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      {label && (
        <label className="block text-sm font-bold text-gray-700 mb-2 pl-1">
          {label}
        </label>
      )}

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
          <span className="material-symbols-outlined text-gray-400 text-[20px]">{icon}</span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-white dark:bg-[#1a202c] border border-gray-200 dark:border-gray-800 rounded-lg pl-10 pr-10 py-3 text-left flex justify-between items-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 shadow-sm"
        >
          <span className={selectedTerminal ? "text-gray-900 dark:text-white" : "text-gray-400 font-normal"}>
            {selectedTerminal ? `${selectedTerminal.name} (${selectedTerminal.city})` : placeholder}
          </span>
          <span className={`material-symbols-outlined text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
            expand_more
          </span>
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1.5 bg-white dark:bg-[#1a202c] border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl max-h-60 overflow-y-auto py-1">
          {Terminals.length === 0 ? (
            <div className="p-3 text-sm text-gray-400 text-center italic">No terminals available</div>
          ) : (
            Terminals.map((terminal) => (
              <button
                key={terminal.id}
                type="button"
                onClick={() => handleSelectTerminal(terminal)}
                className="w-full text-left p-3 hover:bg-primary/5 dark:hover:bg-gray-800 flex items-center gap-3 cursor-pointer transition-colors duration-150 border-b border-gray-50 last:border-0 dark:border-gray-800"
              >
                <span className="material-symbols-outlined text-slate-400 text-[18px]">
                  directions_bus
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{terminal.name}</span>
                  <span className="text-xs text-slate-500">{terminal.city}</span>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default TerminalDropdown;
