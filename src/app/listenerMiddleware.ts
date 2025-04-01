import { createListenerMiddleware, addListener } from '@reduxjs/toolkit';
import type { RootState, AppDispatch } from './store.ts'
import { addReactionListener, removeReactionListener } from '../features/posts/postsSlice.js';

export const listenerMiddleware = createListenerMiddleware();

export const startAppListening = listenerMiddleware.startListening.withTypes<RootState, AppDispatch>();


export type AppStartListening = typeof startAppListening;

export const addAppListener = addListener.withTypes<RootState, AppDispatch>();

export type AppAddListener = typeof addAppListener;


// Listeners
addReactionListener( startAppListening );
removeReactionListener( startAppListening );