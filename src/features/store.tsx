import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from '../features/user/AuthSlice' 

export const store = configureStore({
    reducer: {
        auth: AuthReducer
    },
    devTools: true
})