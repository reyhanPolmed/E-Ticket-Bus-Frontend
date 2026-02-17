import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// User interface matching the API response
interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: string;
    status?: string;
    emailVerified?: boolean;
    lastLogin?: string;
    profileImage?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
}

// The API login response returns { data: { token, user } }
interface SetCredentialPayload {
    data: {
        token: string;
        user: User;
    };
}

const initialState: AuthState = {
    user: null,
    token: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
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

export const { setCredential, logOut } = authSlice.actions;

export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.token;

export default authSlice.reducer;