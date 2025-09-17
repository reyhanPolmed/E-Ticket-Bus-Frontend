import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from '../features/user/AuthSlice' 
import SearchReducer from '../features/search/searchSlice'
export const store = configureStore({
    reducer: {
        auth: AuthReducer,
        search: SearchReducer
    },
    devTools: true
})

export type RootState = ReturnType<typeof store.getState>; 