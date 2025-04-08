import { type Action } from "redux";
import { type Post } from "../postsSlice";

export const POSTS_FETCH_PENDING = "posts/POSTS_FETCH_PENDING";
export const POSTS_FETCH_FULFILLED = "posts/POSTS_FETCH_FULFILLED";
export const POSTS_FETCH_REJECTED = "posts/POSTS_FETCH_REJECTED";

export const POST_FETCH_PENDING = "posts/POST_FETCH_PENDING";
export const POST_FETCH_FULFILLED = "posts/POST_FETCH_FULFILLED";
export const POST_FETCH_REJECTED = "posts/POST_FETCH_REJECTED";

export const POST_ADD_PENDING = "posts/POST_ADD_PENDING";
export const POST_ADD_FULFILLED = "posts/POST_ADD_FULFILLED";
export const POST_ADD_REJECTED = "posts/POST_ADD_REJECTED";



// types
export interface FetchPostsPendingAction extends Action {
   type: typeof POSTS_FETCH_PENDING;
}

export interface FetchPostsFulfilledAction extends Action {
   type: typeof POSTS_FETCH_FULFILLED;
   payload: Post[];
}

export interface FetchPostsRejectedAction extends Action {
   type: typeof POSTS_FETCH_REJECTED;
   error: unknown;
}


export interface FetchPostPendingAction extends Action {
   type: typeof POST_FETCH_PENDING;
   payload: string;
}

export interface FetchPostFulfilledAction extends Action {
   type: typeof POST_FETCH_FULFILLED;
   payload: Post;
}

export interface FetchPostRejectedAction  extends Action {
   type: typeof POST_FETCH_REJECTED;
   error: unknown;
   payload: string;
}


export interface AddPostPendingAction extends Action {
   type: typeof POST_ADD_PENDING;
   payload: Post;
}

export interface AddPostFulfilledAction extends Action {
   type: typeof POST_ADD_FULFILLED;
   payload: Post;
}

export interface AddPostRejectedAction  extends Action {
   type: typeof POST_ADD_REJECTED;
   error: unknown;
}
