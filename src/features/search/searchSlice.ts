import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { SearchState, SearchCriteria, Schedule } from "./searchTypes"
import { logOut } from "../auth/AuthSlice"

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
  recommendations: [],
};

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
    setRecommendations: (state, action: PayloadAction<{ date: string; count: number }[]>) => {
      state.recommendations = action.payload
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
      state.recommendations = [];
      sessionStorage.removeItem("searchState");
    });
  },
});

export const { setCriteria, setResults, setPagination, setRecommendations } = searchSlice.actions
export default searchSlice.reducer
