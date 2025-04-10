import { type Action } from "redux";
import { type Post } from "../postsSlice";

// action.type
export const POSTS_FETCH_PENDING = "posts/POSTS_FETCH_PENDING";
export const POSTS_FETCH_FULFILLED = "posts/POSTS_FETCH_FULFILLED";
export const POSTS_FETCH_REJECTED = "posts/POSTS_FETCH_REJECTED";

export const POST_FETCH_PENDING = "posts/POST_FETCH_PENDING";
export const POST_FETCH_FULFILLED = "posts/POST_FETCH_FULFILLED";
export const POST_FETCH_REJECTED = "posts/POST_FETCH_REJECTED";
export const POST_FETCH_RESET = "posts/POST_FETCH_RESET";

export const POST_ADD_IDLE = "posts/POST_ADD_IDLE";
export const POST_ADD_PENDING = "posts/POST_ADD_PENDING";
export const POST_ADD_FULFILLED = "posts/POST_ADD_FULFILLED";
export const POST_ADD_REJECTED = "posts/POST_ADD_REJECTED";

export const POST_EDIT_IDLE = "posts/POST_EDIT_IDLE";
export const POST_EDIT_PENDING = "posts/POST_EDIT_PENDING";
export const POST_EDIT_FULFILLED = "posts/POST_EDIT_FULFILLED";
export const POST_EDIT_REJECTED = "posts/POST_EDIT_REJECTED";

export const POST_DELETE_IDLE = "posts/POST_DELETE_IDLE";
export const POST_DELETE_PENDING = "posts/POST_DELETE_PENDING";
export const POST_DELETE_FULFILLED = "posts/POST_DELETE_FULFILLED";
export const POST_DELETE_REJECTED = "posts/POST_DELETE_REJECTED";


export const ADD_REACTION_PENDING = "posts/ADD_REACTION_PENDING";
export const REMOVE_REACTION_PENDING = "posts/REMOVE_REACTION_PENDING";
export const REACTION_ADDED = "posts/REACTION_ADDED";
export const REACTION_REMOVED = "posts/REACTION_REMOVED";




// action-object types
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

export interface FetchPostResetAction  extends Action {
   type: typeof POST_FETCH_RESET;
   payload: string;   // postId
}


export interface AddPostIdleAction extends Action {
   type: typeof POST_ADD_IDLE;
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


export interface EditPostIdleAction extends Action {
   type: typeof POST_EDIT_IDLE;
}

export interface EditPostPendingAction extends Action {
   type: typeof POST_EDIT_PENDING;
   payload: Post;
}

export interface EditPostFulfilledAction extends Action {
   type: typeof POST_EDIT_FULFILLED;
   payload: Post;
}

export interface EditPostRejectedAction extends Action {
   type: typeof POST_EDIT_REJECTED;
   error: unknown;
}



export interface DeletePostIdleAction extends Action {
   type: typeof POST_DELETE_IDLE;
}

export interface DeletePostPendingAction extends Action {
   type: typeof POST_DELETE_PENDING;
   payload: string;  // postId
}

export interface DeletePostFulfilledAction extends Action {
   type: typeof POST_DELETE_FULFILLED;
   payload: string;  // postId
}

export interface DeletePostRejectedAction extends Action {
   type: typeof POST_DELETE_REJECTED;
   error: unknown;
}



export interface AddPostReactionPendingAction extends Action {
   type: typeof ADD_REACTION_PENDING;
   payload: {
      reactionName: string;
      postId: string;
   };
}

export interface RemovePostReactionPendingAction extends Action {
   type: typeof REMOVE_REACTION_PENDING;
   payload: {
      reactionName: string;
      postId: string;
   };
}

export interface AddPostReactionAction extends Action {
   type: typeof REACTION_ADDED;
   payload: {
      reactionName: string;
      postId: string;
   };
}

export interface RemovePostReactionAction extends Action {
   type: typeof REACTION_REMOVED;
   payload: {
      reactionName: string;
      postId: string;
   };
}
