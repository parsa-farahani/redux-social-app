import type { RootState } from "../../app/store";
import createReducer from "../../app/utils/createReducer";


export interface SettingsState {
   isDarkMode: boolean;
   isColoredAvatars: boolean;
}


const initialState: SettingsState = {
   isDarkMode: true,
   isColoredAvatars: false,
}



// Action-Types
const SET_DARK_MODE = 'settings/SET_DARK_MODE';
const SET_LIGHT_MODE = 'settings/SET_LIGHT_MODE';
const TOGGLE_DARK_MODE = 'settings/TOGGLE_DARK_MODE';
const COLORED_AVATARS = 'settings/COLORED_AVATARS';
const NOT_COLORED_AVATARS = 'settings/NOT_COLORED_AVATARS';



const settingsReducer = createReducer(initialState,
   {
      [SET_DARK_MODE]: (state) => {
         state.isDarkMode = true;
      },
      [SET_LIGHT_MODE]: (state) => {
         state.isDarkMode = false;
      },
      [TOGGLE_DARK_MODE]: (state) => {
         state.isDarkMode = !state.isDarkMode;
      },
      [COLORED_AVATARS]: (state) => {
         state.isColoredAvatars = true;
      },
      [NOT_COLORED_AVATARS]: (state) => {
         state.isColoredAvatars = false;
      },
   }
);



// Action-Creators
export const setDarkMode = () => ({
   type: SET_DARK_MODE,
})

export const setLightMode = () => ({
   type: SET_LIGHT_MODE,
})

export const toggleDarkMode = () => ({
   type: TOGGLE_DARK_MODE,
})

export const coloredAvatars = () => ({
   type: COLORED_AVATARS,
})

export const notColoredAvatars = () => ({
   type: NOT_COLORED_AVATARS,
})



// selectors
export const selectIsDarkMode = (state: RootState) => state.settings.isDarkMode;
export const selectIsColoredAvatars = (state: RootState) => state.settings.isColoredAvatars;



export default settingsReducer;