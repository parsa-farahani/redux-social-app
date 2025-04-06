import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type RootState } from "../../app/store";


interface AuthState {
   username: string | null;
}


const initialState: AuthState = {
   username: null,
}


// for now, we dont have any 'backend' to handle auth, so I just mimick the process by client-side states
const authSlice = createSlice({
   name: 'auth',
   initialState,
   reducers: {
      login: (state, action: PayloadAction<string>) => {
         state.username = action.payload;
      },
      logout: (state) => {
         state.username = null;
      },
   },
});


// Selectors
export const selectAuthUsername = (state: RootState) => state.auth.username;

// Actions
export const {
   login,
   logout,
} = authSlice.actions;

export default authSlice.reducer;