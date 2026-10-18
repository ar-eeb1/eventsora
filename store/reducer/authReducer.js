import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    auth: null,
    mode: 'provider'
}
export const authReducer = createSlice({
    name: 'authStore',
    initialState,
    reducers: {
        login: (state, action) => {
            state.auth = action.payload
        },
        logout: (state, action) => {
            state.auth = null
        },
        setMode: (state, action) => {
            state.mode = action.payload
        }
    }
})

export const { login, logout, setMode } = authReducer.actions
export default authReducer.reducer