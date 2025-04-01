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


const usersAdapter = createEntityAdapter<User>();


type Status = 'idle' | 'pending' | 'succeed' | 'failed';
interface UsersStatus {
   [index: string]: Status;
   fetchUsers: Status;
   addUser: Status;
   editUser: Status;
   deleteUser: Status;
}


type OpError = string | null;
interface UsersError {
   [index: string]: OpError;
   fetchUsers: OpError;
   addUser: OpError;
   editUser: OpError;
   deleteUser: OpError;
}

interface UsersState extends EntityState<User, string> {
   status: UsersStatus;
   error: UsersError;
}

const initialState: UsersState = usersAdapter.getInitialState({
   status: {
      fetchUsers: 'idle',
      addUser: 'idle',
      editUser: 'idle',
      deleteUser: 'idle',
   },
   error: {
      fetchUsers: null,
      addUser: null,
      editUser: null,
      deleteUser: null,
   },
});


const usersSlice = createSlice({
   name: 'users',
   initialState,
   reducers: {
      userReactionAdded: (state, action: PayloadAction<{userId: string, postId: string; reactionName: string}>) => {
         const { userId, postId, reactionName } = action.payload;
         const existingUser = state.entities[userId];
         existingUser.reactions[postId] = reactionName;
      },
      userReactionRemoved: (state, action: PayloadAction<{userId: string, postId: string;}>) => {
         const { userId, postId } = action.payload;
         const existingUser = state.entities[userId];
         delete existingUser.reactions[postId];
      },
   },
   extraReducers: (builder) => {
      builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
         usersAdapter.upsertMany(state, action.payload);
         state.status['fetchUsers'] = 'succeed';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
         usersAdapter.setOne(state, action.payload);
      })
      .addMatcher(
         (action) => {
            return (
               ['fetchUsers', 'editUser', 'addUser', 'deleteUser'].includes(action.type.slice(0, action.type.indexOf('/'))) &&
               action.type.slice(action.type.indexOf('/') + 1) === 'pending'
            )
         },
         (state, action) => {
            const op = action.type.slice(0, action.type.indexOf('/'));
            state.status[op] = 'pending';
         } 
      )
      .addMatcher(
         isRejected(fetchUsers, fetchUser),
         (state, action) => {
           const op = action.type.split('/')[0];
           state.status[op] = 'failed';
           state.error[op] = (
             action.payload as { message: string } || 
             action.error as { message: string } || 
             { message: 'Unknown Error' }
           ).message;
         }
      )
   }
})


// Thunks
export const fetchUsers = createAsyncThunk('fetchUsers', async () => {
   const response = await getUsersServer();
   return response.data;
});

export const fetchUser = createAsyncThunk('fetchUser', async (userId: string) => {
   const response = await getUserServer(userId);
   return response.data;
});


// + User-Reaction
export const addUserReactionFulfilled = createAction<{
   userId: string;
   postId: string;
   reactionName: string;
}>('addUserReaction/fulfilled');

export const removeUserReactionFulfilled = createAction<{
   userId: string;
   postId: string;
   reactionName: string;
}>('removeUserReaction/fulfilled');


export const addUserReaction = ({ userId, postId, reactionName }: { userId: string; postId: string; reactionName: string }): AppThunk => {
   return async (dispatch, getState) => {

      const user = selectUserById(getState(), userId);

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
            addUserReactionFulfilled({ userId, postId, reactionName })
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
            removeUserReactionFulfilled({ userId, postId, reactionName })
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
export const {
   selectAll: selectAllUsers,
   selectById: selectUserById,
   selectIds: selectUsersIds,
   selectEntities: selectUsersEntities,
   selectTotal: SelectUsersTotal
} = usersAdapter.getSelectors((state: RootState) => state.users);

export const selectUsersStatus = (state: RootState) => state.users.status;
export const selectUsersError = (state: RootState) => state.users.error;

export const selectUserReactions = createSelector(  // args: state, userId
   (state: RootState, userId: string) => selectUserById(state, userId),
   (user) => user?.reactions ?? {}
)

export const selectUserReactionByPostId = createSelector(  // args: state, userId , postId
   (state: RootState, userId: string, _) => selectUserReactions(state, userId),
   (state: RootState, userId: string, postId: string) => postId,
   (reactions, postId) => reactions[postId]
)

// export const selectUserReactions = (state: RootState, userId: string) => {
//    const user = selectUserById(state, userId);
//    if (!user) return {};
//    return user.reactions;
// } 




// Actions
export const {
   userReactionAdded,
   userReactionRemoved,
} = usersSlice.actions;

export default usersSlice;