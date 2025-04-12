import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { combineSlices, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authSlice from "../features/auth/authSlice";
import usersSlice from "../features/users/usersSlice";
import postsSlice from "../features/posts/postsSlice";
import commentsSlice from "../features/comments/commentsSlice";
import settingsSlice from "../features/settings/settingsSlice";
import { listenerMiddleware } from "./listenerMiddleware";

const rootReducer = combineSlices(
   authSlice,
   usersSlice,
   postsSlice,
   commentsSlice,
   settingsSlice,
);

export const makeStore = (preloadedState?: Partial<RootState>) => {
   const store = configureStore({
      reducer: rootReducer,
      middleware: (getDefaultMiddleware) => {
         return getDefaultMiddleware().prepend(listenerMiddleware.middleware);
      },
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
