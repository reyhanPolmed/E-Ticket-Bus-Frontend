import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { SearchState, SearchCriteria, Schedule } from "./searchTypes"

const initialState: SearchState = {
  criteria: {
    origin: null,
    destination: null,
    date: null,
    passengers: 1,
  },
  results: [],
  filters: {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
}

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setCriteria: (state, action: PayloadAction<Partial<SearchCriteria>>) => {
      state.criteria = { ...state.criteria, ...action.payload }
    },
    setResults: (state, action: PayloadAction<Schedule[]>) => {
      state.results = action.payload
    },
    setPagination: (state, action: PayloadAction<Partial<SearchState["pagination"]>>) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
  },
})

export const { setCriteria, setResults, setPagination } = searchSlice.actions
export default searchSlice.reducer
