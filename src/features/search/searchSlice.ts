import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { SearchState, SearchCriteria, Schedule } from "./searchTypes"
import { logOut } from "../auth/AuthSlice"

// Load state from sessionStorage
const loadSearchState = (): SearchState => {
  try {
    const saved = sessionStorage.getItem("searchState");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Failed to load search state from sessionStorage:", e);
  }
  return {
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
  };
};

const initialState: SearchState = loadSearchState();

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
  extraReducers: (builder) => {
    builder.addCase(logOut, (state) => {
      state.criteria = {
        origin: null,
        destination: null,
        date: null,
        passengers: 1,
      };
      state.results = [];
      state.filters = {};
      state.pagination = {
        page: 1,
        limit: 10,
        total: 0,
      };
      sessionStorage.removeItem("searchState");
    });
  },
});

export const { setCriteria, setResults, setPagination } = searchSlice.actions
export default searchSlice.reducer
