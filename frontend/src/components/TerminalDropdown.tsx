import { useState, useRef, useEffect } from "react";

interface TerminalDropdownProps {
  Terminals: Terminal[];
  label: string;
  placeholder: string;
  onSelect: (terminal: Terminal) => void;
}
type Terminal = {
  id: number;
  name: string;
  city: string;
};
const TerminalDropdown: React.FC<TerminalDropdownProps> = ({
  Terminals,
  label,
  placeholder,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTerminal, setSelectedTerminal] = useState<Terminal | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
  return (
    <div ref={dropdownRef} className="relative w-full">
      {label && (
        <label className="block text-black text-sm font-bold mb-2">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border-2 border-black rounded-md p-3 text-left flex justify-between items-center"
      >
        <span className={selectedTerminal ? "text-black" : "text-gray-400"}>
          {selectedTerminal ? selectedTerminal.name : placeholder}
        </span>
        <PinIcon />
      </button>

      {isOpen && (
        <ul className="absolute z-10 w-full mt-1 bg-white border-2 border-black rounded-md shadow-lg">
          {Terminals.map((terminal) => (
            <li
              key={terminal.id}
              onClick={() => handleSelectTerminal(terminal)}
              className="p-3 hover:bg-yellow-100 cursor-pointer"
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
