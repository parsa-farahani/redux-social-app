import { type AppThunk, type RootState } from "../../app/store";
import { addUserReactionServer, getUserServer, getUsersServer } from "../../services/usersServices";
import createReducer from "../../app/utils/createReducer";
import {
   FETCH_USER_FULFILLED,
   FETCH_USER_PENDING,
   FETCH_USER_REJECTED,
   FETCH_USERS_FULFILLED,
   FETCH_USERS_PENDING,
   FETCH_USERS_REJECTED,
   FETCH_USER_RESET,
   ADD_REACTION,
   REMOVE_REACTION,
   type FetchUserFulfilledAction,
   type FetchUserPendingAction,
   type FetchUserRejectedAction,
   type FetchUsersFulfilledAction,
   type FetchUsersRejectedAction,
   type FetchUsersPendingAction,
   type FetchUserResetAction,
   type AddUserReactionAction,
   type RemoveUserReactionAction,
   ADD_USER_REACTION_FULFILLED,
   REMOVE_USER_REACTION_FULFILLED
} from "./constants/actions";
import { getErrorMessage } from "../../utils/errorUtils/errorUtils";
import { createSelector } from "reselect";


export interface UserReactions {
   [postId: string]: string;
}

export interface User {
   id: string;
   name: string;
   reactions: UserReactions;
}




type Status = 'idle' | 'pending' | 'succeed' | 'failed';
interface UsersStatus {
   [index: string]: Status | { [key: string]: Status };
   fetchUsers: Status;
   fetchUser: {
      [id: string]: Status;
   }
   addUser: Status;
   editUser: Status;
   deleteUser: Status;
}


type OpError = string | null;
interface UsersError {
   [index: string]: OpError | { [key: string]: OpError };
   fetchUsers: OpError;
   fetchUser: {
      [id: string]: OpError;
   }
   addUser: OpError;
   editUser: OpError;
   deleteUser: OpError;
}


interface UsersEntities {
   [id: string]: User;
}

export interface UsersState {
   ids: string[];
   entities: UsersEntities;
   status: UsersStatus;
   error: UsersError;
}

const initialState: UsersState = {
   ids: [],
   entities: {},
   status: {
      fetchUsers: 'idle',
      fetchUser: {},
      addUser: 'idle',
      editUser: 'idle',
      deleteUser: 'idle',
   },
   error: {
      fetchUsers: null,
      fetchUser: {},
      addUser: null,
      editUser: null,
      deleteUser: null,
   },
}



type UsersActions = 
| FetchUsersPendingAction
| FetchUsersFulfilledAction
| FetchUsersRejectedAction
| FetchUserPendingAction
| FetchUserFulfilledAction
| FetchUserRejectedAction
| FetchUserResetAction
| AddUserReactionAction
| RemoveUserReactionAction


const usersReducer = createReducer<UsersState, UsersActions>(initialState, {
   [FETCH_USERS_PENDING]: (state, action: FetchUsersPendingAction) => {
      state.status.fetchUsers = 'pending';
   },
   [FETCH_USERS_FULFILLED]: (state, action: FetchUsersFulfilledAction) => {
      const users = action.payload;

      const byId = users.reduce((byId, user) => {
         byId[user.id] = user;
         return byId;
      }, {} as UsersEntities)
      state.entities = byId;

      state.ids = Object.keys(byId);
      state.status.fetchUsers = 'succeed';
      state.error.fetchUsers = null;
   },
   [FETCH_USERS_REJECTED]: (state, action: FetchUsersRejectedAction) => {
      const error = action.error as string;  // we handled it as 'string' in our 'thunk'
      state.status.fetchUsers = 'failed';
      state.error.fetchUsers = error;
   },
   [FETCH_USER_PENDING]: (state, action: FetchUserPendingAction) => {
      const userId = action.payload;
      if (userId) {
         state.status.fetchUser[userId] = 'pending';
      }
   },
   [FETCH_USER_FULFILLED]: (state, action: FetchUserFulfilledAction) => {
      const { id: userId } = action.payload;
      if (userId) {
         state.entities[userId] = action.payload
         state.status.fetchUser[userId] = 'succeed';
         state.error.fetchUser[userId] = null;
      }
   },
   [FETCH_USER_REJECTED]: (state, action: FetchUserRejectedAction) => {
      const error = action.error;
      const userId = action.payload;
      if (userId) {
         state.status.fetchUser[userId] = 'failed';
         state.error.fetchUser[userId] = getErrorMessage(error, 'Unknwon Error');
      }
   },
   [FETCH_USER_RESET]: (state, action: FetchUserResetAction) => {
      const userId = action.payload;
      if (userId) {
         state.status.fetchUser[userId] = 'idle';
         state.error.fetchUser[userId] = null;
      }
   },
   [ADD_REACTION]: (state, action: AddUserReactionAction) => {
      const { reactionName, userId, postId } = action.payload;
      const existingUser = state.entities[userId];

      if (existingUser) {
         existingUser.reactions[postId] = reactionName;
      }
   },
   [REMOVE_REACTION]: (state, action: RemoveUserReactionAction) => {
      const { userId, postId } = action.payload;
      const existingUser = state.entities[userId];

      if (existingUser) {
         delete existingUser.reactions[postId];
      }
   },
});


// Action-Creators
export const fetchUsersPending = () => ({
   type: FETCH_USERS_PENDING,
});

export const fetchUsersFulfilled = (users: User[]) => ({
   type: FETCH_USERS_FULFILLED,
   payload: users,
});

export const fetchUsersRejected = (errorMsg: string) => ({
   type: FETCH_USERS_REJECTED,
   error: errorMsg,
});

export const fetchUserPending = (userId: string) => ({
   type: FETCH_USER_PENDING,
   payload: userId,
});

export const fetchUserFulfilled = (user: User) => ({
   type: FETCH_USER_FULFILLED,
   payload: user,
});

export const fetchUserRejected = (errorMsg: string, userId: string) => ({
   type: FETCH_USER_REJECTED,
   error: errorMsg,
   payload: userId,
});

export const fetchUserReset = (userId: string) => ({
   type: FETCH_USER_RESET,
   payload: userId,
});


export const addUserReactionFulfilled = ({ reactionName, postId }: { reactionName: string; postId: string; }) => ({
   type: ADD_USER_REACTION_FULFILLED,
   payload: {
      reactionName,
      postId,
   },
});

export const removeUserReactionFulfilled = ({ reactionName, postId }: { reactionName: string; postId: string; }) => ({
   type: REMOVE_USER_REACTION_FULFILLED,
   payload: {
      reactionName,
      postId,
   },
});

export const userReactionAdded = ({ reactionName, userId, postId }: { reactionName: string; postId: string; userId: string }) => ({
   type: ADD_REACTION,
   payload: {
      reactionName,
      userId,
      postId,
   },
});

export const userReactionRemoved = ({ userId, postId }: { postId: string; userId: string }) => ({
   type: REMOVE_REACTION,
   payload: {
      userId,
      postId,
   },
});



// Thunks
export const fetchUsers = (): AppThunk => {
   return async (dispatch, getState) => {

      dispatch(
         fetchUsersPending()
      )

      try {
         const response = await getUsersServer();
         dispatch(
            fetchUsersFulfilled(response.data)
         )
      } catch (error) {
         let errorMessage = getErrorMessage(error, 'Unknwon Error');
         dispatch(
            fetchUsersRejected(errorMessage)
         )
      }
   }
}

export const fetchUser = (userId: string): AppThunk => {
   return async (dispatch, getState) => {
      
      dispatch(
         fetchUserPending(userId)
      )

      try {
         const response = await getUserServer(userId);
         dispatch(
            fetchUserFulfilled(response.data)
         )
      } catch (error) {
         let errorMessage = getErrorMessage(error, 'Unknwon Error');
         dispatch(
            fetchUserRejected(errorMessage, userId)
         )
      }
   }
}


// + User-Reaction
export const addUserReaction = ({ userId, postId, reactionName }: { userId: string; postId: string; reactionName: string }): AppThunk => {
   return async (dispatch, getState) => {

      const user = selectUserById(getState(), userId);

      if (!user) return;

      dispatch(
         userReactionAdded(
            {
               userId,
               postId,
               reactionName,
            }
         )
      )
      
      try {
         
         await addUserReactionServer({
            id: userId,
            reactions: {
               ...user.reactions,
               [postId]: reactionName,
            }
         })
         
         dispatch(
            addUserReactionFulfilled({ postId, reactionName })
         )
      } catch (error) {
         dispatch(
            userReactionRemoved(
               {
                  userId,
                  postId,
               }
            )
         )
         throw(error);
      }
   }
}


export const removeUserReaction = ({ userId, postId, reactionName }: { userId: string; postId: string; reactionName: string }): AppThunk => {
   return async (dispatch, getState) => {

      const user = selectUserById(getState(), userId);

      if (!user) return;


      const newUserReactions = {...user.reactions};
      delete newUserReactions[postId];

      
      dispatch(
         userReactionRemoved(
            {
               userId,
               postId,
            }
         )
      )
      
      try {
         
         await addUserReactionServer({
            id: userId,
            reactions: newUserReactions
         })
         dispatch(
            removeUserReactionFulfilled({ postId, reactionName })
         )
      } catch (error) {
         dispatch(
            userReactionAdded(
               {
                  userId,
                  postId,
                  reactionName,
               }
            )
         )
         throw(error);
      }
   }
}






// Selectors
export const selectUsersEntities = (state: RootState) => state.users.entities;
export const selectUsersIds = (state: RootState) => state.users.ids;
export const selectAllUsers = createSelector(
   (state: RootState) => state.users.entities,
   (usersEntities) => Object.values(usersEntities ?? {})
);

export const selectUserById = createSelector(  // args: state, postId
   selectUsersEntities,
   (state: RootState, userId: string) => userId,
   (UsersEntities, userId) => {
      const user = UsersEntities[userId];
      if (!user) {
         return undefined;
      }
      return user;
   }
);

export const selectUserReactions = createSelector(  // args: state, userId
   selectUsersEntities,
   (state: RootState, userId: string) => userId,
   (usersEntities, userId) => {
      return usersEntities[userId]?.reactions ?? {}
   }
);

export const selectUserReactionByPostId = createSelector(  // args: state, userId, postId
   selectUserReactions,
   (state: RootState, userId: string, postId: string) => postId,
   (userReactions, postId) => {
      return userReactions[postId] ?? null
   }
);


export const selectUsersStatus = (state: RootState) => state.users.status;
export const selectUsersError = (state: RootState) => state.users.error;


export default usersReducer;