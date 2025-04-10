import { type Comment } from "../commentsSlice";

// action.type
export const FETCH_COMMENTS_PENDING = 'comments/FETCH_COMMENTS_PENDING';
export const FETCH_COMMENTS_FULFILLED = 'comments/FETCH_COMMENTS_FULFILLED';
export const FETCH_COMMENTS_REJECTED = 'comments/FETCH_COMMENTS_REJECTED';
export const FETCH_COMMENTS_RESET = 'comments/FETCH_COMMENTS_RESET';

export const ADD_COMMENT_PENDING = 'comments/ADD_COMMENT_PENDING';
export const ADD_COMMENT_FULFILLED = 'comments/ADD_COMMENT_FULFILLED';
export const ADD_COMMENT_REJECTED = 'comments/ADD_COMMENT_REJECTED';
export const ADD_COMMENT_RESET = 'comments/ADD_COMMENT_RESET';


// action-object types
// + fetch
export interface FetchCommentsPendingAction {
   type: typeof FETCH_COMMENTS_PENDING;
}

export interface FetchCommentsFulfilledAction {
   type: typeof FETCH_COMMENTS_FULFILLED;
   payload: Comment[];
}

export interface FetchCommentsRejectedAction {
   type: typeof FETCH_COMMENTS_REJECTED;
   error: unknown;
}

export interface FetchCommentsResetAction {
   type: typeof FETCH_COMMENTS_RESET;
}


// + add
export interface AddCommentPendingAction {
   type: typeof ADD_COMMENT_PENDING;
   payload: Comment;
}

export interface AddCommentFulfilledAction {
   type: typeof ADD_COMMENT_FULFILLED;
   payload: Comment;
}

export interface AddCommentRejectedAction {
   type: typeof ADD_COMMENT_REJECTED;
   error: unknown;
   payload: string;  // commentId
}

export interface AddCommentResetAction {
   type: typeof ADD_COMMENT_RESET;
   payload: string;  // commentId
}