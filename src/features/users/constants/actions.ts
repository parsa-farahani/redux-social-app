import { type User } from "../usersSlice";


export const FETCH_USERS_PENDING = 'users/FETCH_USERS_PENDING';
export const FETCH_USERS_FULFILLED = 'users/FETCH_USERS_FULFILLED';
export const FETCH_USERS_REJECTED = 'users/FETCH_USERS_REJECTED';

export const FETCH_USER_PENDING = 'users/FETCH_USER_PENDING';
export const FETCH_USER_FULFILLED = 'users/FETCH_USER_FULFILLED';
export const FETCH_USER_REJECTED = 'users/FETCH_USER_REJECTED';
export const FETCH_USER_RESET = 'users/FETCH_USER_RESET';

export const ADD_USER_REACTION_FULFILLED = 'users/ADD_USER_REACTION_FULFILLED';
export const ADD_REACTION = 'users/ADD_REACTION';
export const REMOVE_REACTION = 'users/REMOVE_REACTION';


// action-object types
export interface FetchUsersPendingAction {
   type: typeof FETCH_USERS_PENDING;
}

export interface FetchUsersFulfilledAction {
   type: typeof FETCH_USERS_FULFILLED;
   payload: User[];
}

export interface FetchUsersRejectedAction {
   type: typeof FETCH_USERS_REJECTED;
   error: unknown;
}


export interface FetchUserPendingAction {
   type: typeof FETCH_USER_PENDING;
   payload: string;  // userId
}

export interface FetchUserFulfilledAction {
   type: typeof FETCH_USER_FULFILLED;
   payload: User;
}

export interface FetchUserRejectedAction {
   type: typeof FETCH_USER_REJECTED;
   error: unknown;
   payload: string;  // userId
}

export interface FetchUserResetAction {
   type: typeof FETCH_USER_RESET;
   payload: string;  // userId
}


export interface AddUserReactionFulfilledAction {
   type: typeof ADD_USER_REACTION_FULFILLED;
   payload: {
      reactionName: string;
      postId: string;
   };
}

export interface AddUserReactionAction {
   type: typeof ADD_REACTION;
   payload: {
      reactionName: string;
      userId: string;
      postId: string;
   };
}

export interface RemoveUserReactionAction {
   type: typeof REMOVE_REACTION;
   payload: {
      userId: string;
      postId: string;
   };
}
