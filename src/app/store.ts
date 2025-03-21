import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { combineSlices, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import settingsSlice from "../features/settings/settingsSlice";
import { counterSlice } from "../features/counter/counterSlice";
import { quotesApiSlice } from "../features/quotes/quotesApiSlice";

const rootReducer = combineSlices(
   settingsSlice,
   counterSlice,
   quotesApiSlice
);

export const makeStore = (preloadedState?: Partial<RootState>) => {
   const store = configureStore({
      reducer: rootReducer,
      // middleware: (getDefaultMiddleware) => {
      //    // return getDefaultMiddleware().concat();
      // },
      preloadedState,
   });

   setupListeners(store.dispatch);

   return store;
};

export const store = makeStore();

//  --------  Types --------
export type AppStore = typeof store;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
   ThunkReturnType,
   RootState,
   unknown,
   Action
>;
