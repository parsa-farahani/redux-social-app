import { createAsyncThunk, createEntityAdapter, createSlice, type PayloadAction, type EntityState, isRejected, createSelector } from "@reduxjs/toolkit";
import { AppDispatch, type AppThunk, type RootState } from "../../app/store";
import { addPostServer, deletePostServer, getPostServer, getPostsServer, updatePostReactionServer, updatePostServer } from '../../services/postsServices'
import { type AppStartListening, startAppListening } from "../../app/listenerMiddleware";
import { addUserReaction, addUserReactionFulfilled, removeUserReactionFulfilled } from "../users/usersSlice";

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
   [index: string]: Status;
   fetchPosts: Status;
   addPost: Status;
   editPost: Status;
   deletePost: Status;
}


type OpError = string | null;
interface PostsError {
   [index: string]: OpError;
   fetchPosts: OpError;
   addPost: OpError;
   editPost: OpError;
   deletePost: OpError;
}
interface PostsState extends EntityState<Post, string> {
   status: PostsStatus;
   error: PostsError;
}


const postsAdapter = createEntityAdapter<Post>({
   sortComparer: (a, b) => b.date.localeCompare(a.date),
});


const initialState: PostsState = postsAdapter.getInitialState({
   status: {
      fetchPosts: 'idle',
      addPost: 'idle',
      editPost: 'idle',
      deletePost: 'idle',
   },
   error: {
      fetchPosts: null,
      addPost: null,
      editPost: null,
      deletePost: null,
   },
})


const postsSlice = createSlice({
   name: 'posts',
   initialState,
   reducers: {
      addReaction: (state, action: PayloadAction<{postId: string; reactionName: string}>) => {
         const { postId, reactionName } = action.payload;
         const existingPost = state.entities[postId];
       
         if (isFinite(existingPost.reactions[reactionName])) {
            existingPost.reactions[reactionName] += 1;
         }
      },
      removeReaction: (state, action: PayloadAction<{postId: string; reactionName: string}>) => {
         const { postId, reactionName } = action.payload;
         const existingPost = state.entities[postId];
         if (isFinite(existingPost.reactions[reactionName])) {
            existingPost.reactions[reactionName] -= 1;
         }
      }
   },
   extraReducers: (builder) => {
      builder
      .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
         postsAdapter.upsertMany(state, action.payload);
         state.status.fetchPosts = 'succeed';
      })
      .addCase(fetchPost.fulfilled, (state, action: PayloadAction<Post>) => {
         postsAdapter.setOne(state, action.payload);
      })
      .addCase(addPost.fulfilled, (state, action: PayloadAction<Post>) => {
         postsAdapter.addOne(state, action.payload);
         state.status.addPost = 'succeed';
      })
      .addCase(editPost.fulfilled, (state, action: PayloadAction<Post>) => {
         const { id, title, content } = action.payload;
         postsAdapter.updateOne(state, {
            id,
            changes: {
               title,
               content,
            }
         });
         state.status.editPost = 'succeed';
      })
      .addCase(deletePost.fulfilled, (state, action: PayloadAction<string>) => {
         const postId = action.payload;
         postsAdapter.removeOne(state, postId);
         state.status.deletePost = 'succeed';
      })
      .addMatcher(
         (action) => {
            return (
               action.type.slice(action.type.lastIndexOf('/') + 1) === 'pending' &&
               action.type.slice(0, action.type.indexOf('/')) === 'posts' &&
               ['fetchPosts', 'fetchPost', 'editPost', 'addPost', 'deletePost'].includes(action.type.slice('posts/'.length, action.type.lastIndexOf('/')))
            )
         },
         (state, action) => {
            const op = action.type.slice('posts/'.length, action.type.lastIndexOf('/'));
            state.status[op] = 'pending';
         } 
      )
      .addMatcher(
         isRejected(fetchPosts, editPost, addPost, deletePost),
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
});


// Thunks
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
   const response = await getPostsServer();
   return response.data;
});

export const fetchPost = createAsyncThunk('posts/fetchPost', async (postId: string) => {
   const response = await getPostServer(postId);
   return response.data;
});

export const addPost = createAsyncThunk('posts/addPost', async (post: Post) => {
   const response = await addPostServer(post);
   return response.data;
});

export const editPost = createAsyncThunk('posts/editPost', async (post: Post) => {
   const response = await updatePostServer(post, post.id);
   return response.data;
});

export const deletePost = createAsyncThunk('posts/deletePost', async (postId: string) => {
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

export const {
   selectAll: selectAllPosts,
   selectById: selectPostById,
   selectIds: selectPostsIds,
   selectEntities: selectPostsEntities,
   selectTotal: selectPostsTotal,
} = postsAdapter.getSelectors((state: RootState) => state.posts);


export const selectUserPosts = createSelector(  // args: state, userId
   selectAllPosts,
   (_, userId: string) => userId,
   (allPosts: Post[], userId: string) => allPosts.filter(post => post.userId === userId).map(post => post.id)
);

export const selectPostsStatus = (state: RootState) => state.posts.status;
export const selectPostsError = (state: RootState) => state.posts.error;

// Actions
export const {
   removeReaction,
   addReaction,
} = postsSlice.actions;


export default postsSlice;