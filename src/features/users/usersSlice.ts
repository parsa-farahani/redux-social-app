import { createAsyncThunk, createEntityAdapter, createSlice, isRejected, type PayloadAction, type EntityState, createSelector, createAction } from "@reduxjs/toolkit";
import { type AppThunk, type RootState } from "../../app/store";
import { addUserReactionServer, getUserServer, getUsersServer } from "../../services/usersServices";


export interface UserReactions {
   [postId: string]: string;
}

export interface User {
   id: string;
   name: string;
   reactions: UserReactions;
}


// const usersAdapter = createEntityAdapter<User>();



// Thunks


// Selectors

// Actions


// export default usersSlice;