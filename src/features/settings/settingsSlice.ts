import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { createAppSlice } from "../../app/createAppSlice";


interface SettingsState {
   isDarkMode: boolean;
   isColoredAvatars: boolean;
}


const initialState: SettingsState = {
   isDarkMode: true,
   isColoredAvatars: false,
}


const settingsSlice = createAppSlice({
   name: 'settings',
   initialState,
   reducers: (create) => ({
      setDarkMode: create.reducer((state) => {
         state.isDarkMode = true;
      }),
      setLightMode: create.reducer((state) => {
         state.isDarkMode = false;
      }),
      toggleDarkMode: create.reducer((state) => {
         state.isDarkMode = !state.isDarkMode;
      }),
      coloredAvatars: create.reducer((state) => {
         state.isColoredAvatars = true;
      }),
      notColoredAvatars: create.reducer((state) => {
         state.isColoredAvatars = false;
      })
   })
});


// selectors
export const selectIsDarkMode = (state: RootState) => state.settings.isDarkMode;
export const selectIsColoredAvatars = (state: RootState) => state.settings.isColoredAvatars;


export const {
   setDarkMode,
   setLightMode,
   toggleDarkMode,
   coloredAvatars,
   notColoredAvatars,
} = settingsSlice.actions;



export default settingsSlice;