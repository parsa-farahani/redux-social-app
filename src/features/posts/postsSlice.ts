import { createAsyncThunk, createEntityAdapter, createSlice, type PayloadAction, type EntityState, isRejected } from "@reduxjs/toolkit";
import { AppDispatch, type AppThunk, type RootState } from "../../app/store";
import { addPostServer, deletePostServer, getPostServer, getPostsServer, updatePostReactionServer, updatePostServer } from '../../services/postsServices'
import { type AppStartListening, startAppListening } from "../../app/listenerMiddleware";
import { addUserReaction, addUserReactionFulfilled, removeUserReactionFulfilled } from "../users/usersSlice";
import createReducer from "../../app/utils/createReducer";
import { AddPostFulfilledAction, AddPostPendingAction, AddPostRejectedAction, FetchPostFulfilledAction, FetchPostPendingAction, FetchPostRejectedAction, type FetchPostsFulfilledAction, type FetchPostsPendingAction, type FetchPostsRejectedAction, POST_ADD_FULFILLED, POST_ADD_PENDING, POST_ADD_REJECTED, POST_FETCH_FULFILLED, POST_FETCH_PENDING, POST_FETCH_REJECTED, POSTS_FETCH_FULFILLED, POSTS_FETCH_PENDING, POSTS_FETCH_REJECTED } from "./constants/actions";
import { createSelector } from "reselect";
import { getErrorMessage } from "../../utils/errorUtils/errorUtils";



interface PostReactions {
   [index: string]: number;
   like: number;
   dislike: number;
}

export interface Post {
   [index: string]: any;
   id: string;
   title: string;
   content: string;
   userId: string;
   date: string;
   reactions: PostReactions;
}

type Status = 'idle' | 'pending' | 'succeed' | 'failed';
interface PostsStatus {
   [index: string]: Status | { [key: string]: Status };
   fetchPosts: Status;
   fetchPost: {
      [id: string]: Status;
   };
   addPost: Status;
   editPost: Status;
   deletePost: Status;
}


type OpError = string | null;
interface PostsError {
   [index: string]: OpError | { [key: string]: OpError };
   fetchPosts: OpError;
   fetchPost: {
      [id: string]: OpError;
   };
   addPost: OpError;
   editPost: OpError;
   deletePost: OpError;
}


interface PostEntity {
   [id: string]: Post;
}

interface PostsState {
   ids: string[];
   entities: PostEntity;
   status: PostsStatus;
   error: PostsError;
}





const postsAdapter = createEntityAdapter()



// Action-Types



const initialState: PostsState = {
   ids: [],
   entities: {},
   status: {
      fetchPosts: 'idle',
      fetchPost: {},
      addPost: 'idle',
      editPost: 'idle',
      deletePost: 'idle',
   },
   error: {
      fetchPosts: null,
      fetchPost: {},
      addPost: null,
      editPost: null,
      deletePost: null,
   },
}


type PostsAction =
   | FetchPostsPendingAction
   | FetchPostsFulfilledAction
   | FetchPostsRejectedAction
   | FetchPostPendingAction
   | FetchPostFulfilledAction
   | FetchPostRejectedAction
   | AddPostPendingAction
   | AddPostFulfilledAction
   | AddPostRejectedAction
;

const postsReducer = createReducer<PostsState, PostsAction>(initialState, {
   [POSTS_FETCH_PENDING]: (state) => {
      state.status.fetchPosts = 'pending';
   },
   [POSTS_FETCH_FULFILLED]: (state, action: FetchPostsFulfilledAction) => {
      const byId = action.payload.reduce((byId, post) => {
         byId[post.id] = post;
         return byId;
      }, {} as PostEntity)
      state.entities = byId;
      state.ids = Object.keys(byId);
      state.error.fetchPosts = null;
      state.status.fetchPosts = 'succeed';
   },
   [POSTS_FETCH_REJECTED]: (state, action: FetchPostsRejectedAction) => {
      const { error } = action;

      let errorMessage = getErrorMessage(error, 'Failed to Fetch posts');
      state.error.fetchPosts = errorMessage;
      state.status.fetchPosts = 'failed';
   },
   [POST_FETCH_PENDING]: (state, action: FetchPostPendingAction) => {
      const postId = action.payload;
      state.status.fetchPost[postId] = 'pending';
   },
   [POST_FETCH_FULFILLED]: (state, action: FetchPostFulfilledAction) => {
      const post = action.payload;
      state.entities[post.id] = post;

      if (!state.ids.includes(post.id)) {
         state.ids.push(post.id);
      }

      state.status.fetchPost[post.id] = 'succeed';
      state.error.fetchPost[post.id] = null;
   },
   [POST_FETCH_REJECTED]: (state, action: FetchPostRejectedAction) => {
      const postId = action.payload;
      const error = action.error;
      state.status.fetchPost[postId] = 'failed';

      let errorMessage = getErrorMessage(error, 'Failed to Fetch post');
      state.error.fetchPost[postId] = errorMessage;
   },
   [POST_ADD_PENDING]: (state, action: AddPostPendingAction) => {
      state.status.addPost = 'pending';
   },
   [POST_ADD_FULFILLED]: (state, action: AddPostFulfilledAction) => {
      const post = action.payload;
      state.entities[post.id] = post;
      state.ids.push(post.id);
      state.status.addPost = 'succeed';
      state.error.addPost = null;
   },
   [POST_ADD_REJECTED]: (state, action: AddPostRejectedAction) => {
      const error = action.error;
      state.status.addPost = 'failed';

      let errorMessage = getErrorMessage(error, 'Failed to Add post');
      state.error.addPost = errorMessage;
   },
});


export const fetchPostsPending = (): FetchPostsPendingAction => ({
   type: POSTS_FETCH_PENDING,
})

export const fetchPostPending = (postId: string): FetchPostPendingAction => ({
   type: POST_FETCH_PENDING,
   payload: postId,
});

export const addPostPending = (post: Post): AddPostPendingAction => ({
   type: POST_ADD_PENDING,
   payload: post,
});



// const postsSlice = createSlice({
//    name: 'posts',
//    initialState,
//    reducers: {
//       addReaction: (state, action: PayloadAction<{postId: string; reactionName: string}>) => {
//          const { postId, reactionName } = action.payload;
//          const existingPost = state.entities[postId];
       
//          if (isFinite(existingPost.reactions[reactionName])) {
//             existingPost.reactions[reactionName] += 1;
//          }
//       },
//       removeReaction: (state, action: PayloadAction<{postId: string; reactionName: string}>) => {
//          const { postId, reactionName } = action.payload;
//          const existingPost = state.entities[postId];
//          if (isFinite(existingPost.reactions[reactionName])) {
//             existingPost.reactions[reactionName] -= 1;
//          }
//       }
//    },
//    extraReducers: (builder) => {
//       builder
//       .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
//          postsAdapter.upsertMany(state, action.payload);
//          state.status.fetchPosts = 'succeed';
//       })
//       .addCase(fetchPost.fulfilled, (state, action: PayloadAction<Post>) => {
//          postsAdapter.setOne(state, action.payload);
//       })
//       .addCase(addPost.fulfilled, (state, action: PayloadAction<Post>) => {
//          postsAdapter.addOne(state, action.payload);
//          state.status.addPost = 'succeed';
//       })
//       .addCase(editPost.fulfilled, (state, action: PayloadAction<Post>) => {
//          const { id, title, content } = action.payload;
//          postsAdapter.updateOne(state, {
//             id,
//             changes: {
//                title,
//                content,
//             }
//          });
//          state.status.editPost = 'succeed';
//       })
//       .addCase(deletePost.fulfilled, (state, action: PayloadAction<string>) => {
//          const postId = action.payload;
//          postsAdapter.removeOne(state, postId);
//          state.status.deletePost = 'succeed';
//       })
//       .addMatcher(
//          (action) => {
//             return (
//                ['fetchPosts', 'editPost', 'addPost', 'deletePost'].includes(action.type.slice(0, action.type.indexOf('/'))) &&
//                action.type.slice(action.type.indexOf('/') + 1) === 'pending'
//             )
//          },
//          (state, action) => {
//             const op = action.type.slice(0, action.type.indexOf('/'));
//             state.status[op] = 'pending';
//          } 
//       )
//       .addMatcher(
//          isRejected(fetchPosts, editPost, addPost, deletePost),
//          (state, action) => {
//            const op = action.type.split('/')[0];
//            state.status[op] = 'failed';
//            state.error[op] = (
//              action.payload as { message: string } || 
//              action.error as { message: string } || 
//              { message: 'Unknown Error' }
//            ).message;
//          }
//       )
//    }
// });


// Thunks
export const fetchPosts = createAsyncThunk('fetchPosts', async () => {
   const response = await getPostsServer();
   return response.data;
});

export const fetchPost = createAsyncThunk('fetchPost', async (postId: string) => {
   const response = await getPostServer(postId);
   return response.data;
});

export const addPost = createAsyncThunk('addPost', async (post: Post) => {
   const response = await addPostServer(post);
   return response.data;
});

export const editPost = createAsyncThunk('editPost', async (post: Post) => {
   const response = await updatePostServer(post, post.id);
   return response.data;
});

export const deletePost = createAsyncThunk('deletePost', async (postId: string) => {
   await deletePostServer(postId);
   return postId;
});


export const addPostReaction = ({postId, reactionName}: { postId: string; reactionName: string }): AppThunk => {
   return async (dispatch, getState) => {

      const post = selectPostById(getState(), postId);
      if (!isFinite(post.reactions[reactionName])) return;
      const prevPostReactionTotal = post.reactions[reactionName];


      dispatch(
         addReaction({ postId: postId, reactionName })
      )


      try {
         await updatePostReactionServer(
            {
               id: postId,
               reactions: {
                  ...post.reactions,
                  [reactionName]: prevPostReactionTotal + 1,
               }
            },
            postId
         )
      } catch (error) {
         dispatch(
            removeReaction({ postId: postId, reactionName })
         );
         throw(error);  // the error is 're-throwed' to 'UI', and it is handled there...
      }

   }
}


export const removePostReaction = ({postId, reactionName}: { postId: string; reactionName: string }): AppThunk => {
   return async (dispatch, getState) => {

      const post = selectPostById(getState(), postId);
      if (!isFinite(post.reactions[reactionName])) return;
      const prevPostReactionTotal = post.reactions[reactionName];
      if (prevPostReactionTotal <= 0) return;   // We dont want 'negative' reaction-value!


      dispatch(
         removeReaction({ postId: postId, reactionName })
      )


      try {
         await updatePostReactionServer(
            {
               id: postId,
               reactions: {
                  ...post.reactions,
                  [reactionName]: prevPostReactionTotal - 1,
               }
            },
            postId
         )
      } catch (error) {
         dispatch(
            addReaction({ postId: postId, reactionName })
         );
         throw(error);  // the error is 're-throwed' to 'UI', and it is handled there...
      }

   }
}


// Listeners
export const addReactionListener = (startAppListening: AppStartListening) => {

   startAppListening(
      {
         actionCreator: addUserReactionFulfilled,
         effect: (action, { dispatch }) => {
            const { userId, postId, reactionName } = action.payload;
            dispatch(
               addPostReaction({
                  postId,
                  reactionName,
               })
            )
         }
      }
   )
}

export const removeReactionListener = (startAppListening: AppStartListening) => {

   startAppListening(
      {
         actionCreator: removeUserReactionFulfilled,
         effect: (action, { dispatch }) => {
            const { userId, postId, reactionName } = action.payload;
            dispatch(
               removePostReaction({
                  postId,
                  reactionName,
               })
            )
         }
      }
   )
}


// Selectors
export const selectPostsEntities = (state: RootState) => state.posts.entities;
export const selectPostsIds = (state: RootState) => state.posts.ids;
export const selectAllPosts = (state: RootState) => {
   return Object.values(state.posts.entities);
};

export const selectPostById = createSelector(  // args: state, postId
   selectPostsEntities,
   (state: RootState, postId: string) => postId,
   (postsEntities, postId) => postsEntities[postId]
);

export const selectUserPosts = createSelector(  // args: state, userId
   (state: RootState) => Object.values(state.posts.entities),
   (state: RootState, userId: string) => userId,
   (posts, userId) => {
      return posts.filter(post => post.userId === userId)
   }
);

export const selectUserPostsIds = (state: RootState, userId: string) => {  // args: state, userId
   const userPosts = selectUserPosts(state, userId);
   return userPosts.map(post => post.id)
};



export const selectPostsStatus = (state: RootState) => state.posts.status;
export const selectPostsError = (state: RootState) => state.posts.error;




export default postsReducer;