    import { createSlice } from "@reduxjs/toolkit";

    const authSlice = createSlice({
        name: 'auth',
        initialState: {
            user: null,
            token: null
        },
        reducers: {
            setCredential: (state, action) => {
                const {data} = action.payload
                state.token = data.token
                state.user = data.user
            },
            logOut: (state) => {
                state.token = null
                state.user = null
            }
        }
    })

    export const { setCredential, logOut } = authSlice.actions
    export default authSlice.reducer