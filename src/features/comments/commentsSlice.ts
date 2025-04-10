import { createAsyncThunk, createEntityAdapter, createSlice, type PayloadAction, type EntityState, isRejected, createSelector } from "@reduxjs/toolkit";
import type { AppThunk, RootState } from "../../app/store";
import { addCommentServer, deleteCommentServer, getCommentsServer, updateCommentServer } from "../../services/commentsServices";
import createReducer from "../../app/utils/createReducer";
import {
   ADD_COMMENT_FULFILLED,
   ADD_COMMENT_PENDING,
   ADD_COMMENT_REJECTED,
   ADD_COMMENT_RESET,
   type AddCommentFulfilledAction,
   type AddCommentPendingAction,
   type AddCommentRejectedAction,
   type AddCommentResetAction,
   FETCH_COMMENTS_FULFILLED,
   FETCH_COMMENTS_PENDING,
   FETCH_COMMENTS_REJECTED,
   FETCH_COMMENTS_RESET,
   type FetchCommentsFulfilledAction,
   type FetchCommentsPendingAction,
   type FetchCommentsRejectedAction,
   type FetchCommentsResetAction
} from "./constants/actions";
import { getErrorMessage } from "../../utils/errorUtils/errorUtils";


export interface Comment {
   id: string;
   content: string;
   userId: string;
   postId: string;
   date: string;
}


const commentsAdapter = createEntityAdapter<Comment>({
   sortComparer: (a, b) => b.date.localeCompare(a.date),
});


type Status = 'idle' | 'pending' | 'succeed' | 'failed';
interface CommentsStatus {
   [index: string]: Status;
   fetchComments: Status;
   addComment: Status;
   editComment: Status;
   deleteComment: Status;
}


type OpError = string | null;
interface CommentsError {
   [index: string]: OpError;
   fetchComments: OpError;
   addComment: OpError;
   editComment: OpError;
   deleteComment: OpError;
}

export interface CommentsEntities {
   [id: string]: Comment;
}
export interface CommentsState {
   ids: string[];
   entities: CommentsEntities;
   status: CommentsStatus;
   error: CommentsError;
}


const initialState: CommentsState = {
   ids: [],
   entities: {},
   status: {
      fetchComments: 'idle',
      addComment: 'idle',
      editComment: 'idle',
      deleteComment: 'idle',
   },
   error: {
      fetchComments: null,
      addComment: null,
      editComment: null,
      deleteComment: null,
   }
}


export type CommentsActions = 
| FetchCommentsPendingAction
| FetchCommentsFulfilledAction
| FetchCommentsRejectedAction
| FetchCommentsResetAction
| AddCommentPendingAction
| AddCommentFulfilledAction
| AddCommentRejectedAction
| AddCommentResetAction


const commentsReducer = createReducer<CommentsState, CommentsActions>(initialState, {
   [FETCH_COMMENTS_PENDING]: (state) => {
      state.status.fetchComments = 'pending';
   },
   [FETCH_COMMENTS_FULFILLED]: (state, action: FetchCommentsFulfilledAction) => {
      const comments = action.payload;

      const byId = comments.reduce((byId, comment) => {
         if (comment.id) {
            byId[comment.id] = comment;
         }
         return byId;
      }, {} as CommentsEntities);

      state.entities = byId;
      state.ids = Object.keys(byId);

      state.status.fetchComments = 'succeed';
      state.error.fetchComments = null;
   },
   [FETCH_COMMENTS_REJECTED]: (state, action: FetchCommentsRejectedAction) => {
      const errorMsg = action.error as string;  // we handled it as string in thunk
      state.status.fetchComments = 'failed';
      state.error.fetchComments = errorMsg;
   },
   [FETCH_COMMENTS_RESET]: (state) => {
      state.ids = [];
      state.entities = {};
      state.status.fetchComments = 'idle';
      state.error.fetchComments = null;
   },
   [ADD_COMMENT_PENDING]: (state) => {
      state.status.addComment = 'pending';
   },
   [ADD_COMMENT_FULFILLED]: (state, action: AddCommentFulfilledAction) => {
      const comment = action.payload;

      if (comment.id) {
         state.entities[comment.id] = comment;
         
         if (!state.ids.includes(comment.id)) {
            state.ids.push(comment.id);
         }
      }

      state.status.addComment = 'succeed';
      state.error.addComment = null;
   },
   [ADD_COMMENT_REJECTED]: (state, action: AddCommentRejectedAction) => {
      const errorMsg = action.error as string;
      state.status.addComment = 'failed';
      state.error.addComment = errorMsg;
   },
   [ADD_COMMENT_RESET]: (state) => {
      state.status.addComment = 'idle';
      state.error.addComment = null;
   },
});


// Action-Creators
export const fetchCommentsPending = () => ({
   type: FETCH_COMMENTS_PENDING,
})

export const fetchCommentsFulfilled = (comments: Comment[]) => ({
   type: FETCH_COMMENTS_FULFILLED,
   payload: comments,
})

export const fetchCommentsRejected = (error: string) => ({
   type: FETCH_COMMENTS_REJECTED,
   error: error,
})

export const fetchCommentsReset = () => ({
   type: FETCH_COMMENTS_RESET,
})

export const addCommentPending = () => ({
   type: ADD_COMMENT_PENDING,
})

export const addCommentFulfilled = (comment: Comment) => ({
   type: ADD_COMMENT_FULFILLED,
   payload: comment,
})

export const addCommentRejected = (error: string) => ({
   type: ADD_COMMENT_REJECTED,
   error: error,
})

export const addCommentReset = () => ({
   type: ADD_COMMENT_RESET,
})



// Thunks
export const fetchComments = (): AppThunk => {
   return async (dispatch) => {

      dispatch(
         fetchCommentsPending()
      )

      try {
         const response = await getCommentsServer();
         dispatch(
            fetchCommentsFulfilled(response.data)
         )
      } catch (error) {
         let errorMessage = getErrorMessage(error, 'Unknwon Error');
         dispatch(
            fetchCommentsRejected(errorMessage)
         )
      }
   }
}

export const addComment = (comment: Comment): AppThunk => {
   return async (dispatch) => {

      dispatch(
         addCommentPending()
      )

      try {
         const response = await addCommentServer(comment);
         dispatch(
            addCommentFulfilled(response.data)
         )
      } catch (error) {
         console.error(error);
         let errorMessage = getErrorMessage(error, 'Failed to add post - Unknwon Error');
         dispatch(
            addCommentRejected(errorMessage)
         )
      }
   }
}



// Selectors
export const selectCommentsEntities = (state: RootState) => state.comments.entities;
export const selectCommentsIds = (state: RootState) => state.comments.ids;
export const selectAllComments = createSelector(
   (state: RootState) => state.comments.entities,
   (commentsEntities) => Object.values(commentsEntities ?? {})
);

export const selectPostCommentsByPostId = createSelector(  // args: state, postId
   selectAllComments,
   (_, postId: string) => postId,
   (comments: Comment[], postId: string) => comments.filter(comment => comment.postId === postId) ?? []
)

export const selectCommentsStatus = (state: RootState) => state.comments.status;
export const selectCommentsError = (state: RootState) => state.comments.error;


export default commentsReducer;