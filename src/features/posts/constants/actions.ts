import { type Action } from "redux";
import { type Post } from "../postsSlice";

export const POSTS_FETCH_PENDING = "posts/POSTS_FETCH_PENDING";
export const POSTS_FETCH_FULFILLED = "posts/POSTS_FETCH_FULFILLED";
export const POSTS_FETCH_REJECTED = "posts/POSTS_FETCH_REJECTED";


// types
export interface FetchPostsPendingAction extends Action {
   type: typeof POSTS_FETCH_PENDING;
}

export interface FetchPostsFulfilledAction {
   type: typeof POSTS_FETCH_FULFILLED;
   payload: Post[];
}

export interface FetchPostsRejectedAction {
   type: typeof POSTS_FETCH_REJECTED;
   error: unknown;
}
