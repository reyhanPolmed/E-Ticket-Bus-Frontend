export interface OperatingHours {
  open: string;
  close: string;
}

export interface Terminal {
  id: string;
  name: string;
  city: string;
  code?: string;
  province?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  facilities?: string[];
  status?: string;
  operatingHours?: OperatingHours;
}

export interface SeatConfiguration {
  total: number;
  columns: number;
  rows: number;
}

export interface Bus {
  id: string;
  busNumber: string;
  busType: string;
  totalSeats: number;
  facilities?: string[];
  status?: string;
  seatConfiguration?: SeatConfiguration;
}

export interface Route {
  id: string;
  originalTerminal: Terminal;
  destinationTerminal: Terminal;
  distance?: number;
  estimatedDuration?: string;
  status?: string;
}

export interface Schedule {
  id: string;
  scheduleCode: string;
  route: Route;
  bus: Bus;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  price: string;
  availableSeats: number;
  totalSeats: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FilterState {
  minPrice?: number;
  maxPrice?: number;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

export interface SearchCriteria {
  origin: Terminal | null;
  destination: Terminal | null;
  date: string | null;
  passengers: number;
}

export interface SearchState {
  criteria: SearchCriteria;
  results: Schedule[];
  filters: FilterState;
  pagination: PaginationState;
}
