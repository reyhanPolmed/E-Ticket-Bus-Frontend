import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface SearchState {
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  passengers: number
  isRoundTrip: boolean
}

const initialState: SearchState = {
  origin: "",
  destination: "",
  departureDate: "",
  returnDate: "",
  passengers: 1,
  isRoundTrip: false,
}

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchParams: (state, action: PayloadAction<SearchState>) => {
      return { ...state, ...action.payload }
    },
    clearSearch: () => initialState,
  },
})

export const { setSearchParams, clearSearch } = searchSlice.actions
export default searchSlice.reducer
