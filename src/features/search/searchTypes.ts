export interface Terminal {
  id: number
  name: string
}

export interface Schedule {
  id: number
  departureTime: string
  arrivalTime: string
  price: number
}

export interface FilterState {
  minPrice?: number
  maxPrice?: number
}

export interface PaginationState {
  page: number
  limit: number
  total: number
}

export interface SearchCriteria {
  origin: Terminal | null
  destination: Terminal | null
  date: string | null
  passengers: number
}

export interface SearchState {
  criteria: SearchCriteria
  results: Schedule[]
  filters: FilterState
  pagination: PaginationState
}
