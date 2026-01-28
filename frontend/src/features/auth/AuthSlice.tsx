import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Define the types for your state
interface User {
    id: string; 
    username: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
}

// Define the type for the payload of the setCredential action
interface SetCredentialPayload {
    data: {
        token: string;
        user: User;
    };
}

// Set the initial state with the defined type
const initialState: AuthState = {
    user: null,
    token: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState, // The type is inferred from here
    reducers: {
        setCredential: (state, action: PayloadAction<SetCredentialPayload>) => {
            const { data } = action.payload;
            state.token = data.token;
            state.user = data.user;
        },
        logOut: (state) => {
            state.token = null;
            state.user = null;
        }
    }
});

// The selector needs to know the type of the entire state
// We'll create a RootState type in the next step
export const { setCredential, logOut } = authSlice.actions;

// Selector function with proper typing
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.token;

export default authSlice.reducer;