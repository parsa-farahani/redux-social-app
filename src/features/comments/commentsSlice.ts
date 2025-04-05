import { createAsyncThunk, createEntityAdapter, createSlice, type PayloadAction, type EntityState, isRejected, createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { addCommentServer, deleteCommentServer, getCommentsServer, updateCommentServer } from "../../services/commentsServices";


export interface Comment {
   id: string;
   content: string;
   userId: string;
   postId: string;
   date: string;
}

// const commentsAdapter = createEntityAdapter<Comment>({
//    sortComparer: (a, b) => b.date.localeCompare(a.date),
// })



// const initialState: CommentsState = commentsAdapter.getInitialState()




// Selectors



// Actions


// export default commentsSlice;