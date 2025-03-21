import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { createAppSlice } from "../../app/createAppSlice";


interface SettingsState {
   isDarkMode: boolean;
}


const initialState: SettingsState = {
   isDarkMode: true,
}


const settingsSlice = createAppSlice({
   name: 'settings',
   initialState,
   reducers: (create) => ({
      toggleDarkMode: create.reducer((state) => {
         state.isDarkMode = !state.isDarkMode;
      })
   })
});


// selectors
export const selectIsDarkMode = (state: RootState) => state.settings.isDarkMode;


export const {
   toggleDarkMode,
} = settingsSlice.actions;



export default settingsSlice;