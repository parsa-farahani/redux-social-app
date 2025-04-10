// import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { type RootState } from "../../app/store";
import createReducer from "../../app/utils/createReducer";


export interface AuthState {
   username: string | null;
}


const initialState: AuthState = {
   username: null,
}


// Action-Types
const LOGIN = 'auth/LOGIN';
const LOGOUT = 'auth/LOGOUT';

interface LoginAction {
   type: typeof LOGIN;
   payload: string;
}

interface LogoutAction {
   type: typeof LOGOUT;
}


type AuthActions = LoginAction |LogoutAction;
// for now, we dont have any 'backend' to handle auth, so I just mimick the process by client-side states
const authReducer = createReducer<AuthState, AuthActions>(initialState,
   {
      [LOGIN]: (state, action: { type: typeof LOGIN, payload: string }) => {
         state.username = action.payload;
      },
      [LOGOUT]: (state) => {
         state.username = null;
      },
   }
);


// Action-Creators
export const login = (username: string) => ({
   type: LOGIN,
   payload: username,
});

export const logout = () => ({
   type: LOGOUT,
});


// Selectors
export const selectAuthUsername = (state: RootState) => state.auth.username;



export default authReducer;