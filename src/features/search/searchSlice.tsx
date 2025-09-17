import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  origin: string;
  destination: string;
  departureDate: string;
  passengers: number;
}

const initialState: SearchState = {
  origin: "",
  destination: "",
  departureDate: "",
  passengers: 1,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setOrigin: (state, action: PayloadAction<string>) => {
      state.origin = action.payload;
    },
    setDestination: (state, action: PayloadAction<string>) => {
      state.destination = action.payload;
    },
    setDepartureDate: (state, action: PayloadAction<string>) => {
      state.departureDate = action.payload
    }
  },
});

export const { setOrigin, setDestination, setDepartureDate } = searchSlice.actions;
export default searchSlice.reducer;
