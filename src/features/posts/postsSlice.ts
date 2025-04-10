import createReducer from "../../app/utils/createReducer";
import {
   ADD_REACTION_PENDING,
   type AddPostFulfilledAction,
   type AddPostIdleAction,
   type AddPostPendingAction,
   type AddPostReactionAction,
   type AddPostReactionPendingAction,
   type AddPostRejectedAction,
   type DeletePostFulfilledAction,
   type DeletePostIdleAction,
   type DeletePostPendingAction,
   type DeletePostRejectedAction,
   type EditPostFulfilledAction,
   type EditPostIdleAction,
   type EditPostPendingAction,
   type EditPostRejectedAction,
   type FetchPostFulfilledAction,
   type FetchPostPendingAction,
   type FetchPostRejectedAction,
   type FetchPostResetAction,
   type FetchPostsFulfilledAction,
   type FetchPostsPendingAction,
   type FetchPostsRejectedAction,
   POST_ADD_FULFILLED,
   POST_ADD_IDLE,
   POST_ADD_PENDING,
   POST_ADD_REJECTED,
   POST_DELETE_FULFILLED,
   POST_DELETE_IDLE,
   POST_DELETE_PENDING,
   POST_DELETE_REJECTED,
   POST_EDIT_FULFILLED,
   POST_EDIT_IDLE,
   POST_EDIT_PENDING,
   POST_EDIT_REJECTED,
   POST_FETCH_FULFILLED,
   POST_FETCH_PENDING,
   POST_FETCH_REJECTED,
   POST_FETCH_RESET,
   POSTS_FETCH_FULFILLED,
   POSTS_FETCH_PENDING,
   POSTS_FETCH_REJECTED,
   REACTION_ADDED,
   REACTION_REMOVED,
   REMOVE_REACTION_PENDING,
   type RemovePostReactionAction,
   type RemovePostReactionPendingAction
} from "./constants/actions";
import { createSelector } from "reselect";
import { getErrorMessage } from "../../utils/errorUtils/errorUtils";
import { type RootState } from "../../app/store";



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


interface PostsEntities {
   [id: string]: Post;
}

export interface PostsState {
   ids: string[];
   entities: PostsEntities;
   status: PostsStatus;
   error: PostsError;
}


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
   | FetchPostResetAction
   | AddPostIdleAction
   | AddPostPendingAction
   | AddPostFulfilledAction
   | AddPostRejectedAction
   | EditPostIdleAction
   | EditPostPendingAction
   | EditPostFulfilledAction
   | EditPostRejectedAction
   | DeletePostIdleAction
   | DeletePostPendingAction
   | DeletePostFulfilledAction
   | DeletePostRejectedAction
   | AddPostReactionAction
   | RemovePostReactionAction
;

const postsReducer = createReducer<PostsState, PostsAction>(initialState, {
   [POSTS_FETCH_PENDING]: (state) => {
      state.status.fetchPosts = 'pending';
   },
   [POSTS_FETCH_FULFILLED]: (state, action: FetchPostsFulfilledAction) => {
      const byId = action.payload.reduce((byId, post) => {
         byId[post.id] = post;
         return byId;
      }, {} as PostsEntities)
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
   [POST_FETCH_RESET]: (state, action: FetchPostResetAction) => {
      const postId = action.payload;
      if (postId) {
         state.status.fetchPost[postId] = 'idle';
         state.error.fetchPost[postId] = null;
      }
   },
   [POST_ADD_IDLE]: (state, action: AddPostIdleAction) => {
      state.status.addPost = 'idle';
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
   [POST_EDIT_IDLE]: (state, action: EditPostIdleAction) => {
      state.status.editPost = 'idle';
   },
   [POST_EDIT_PENDING]: (state, action: EditPostPendingAction) => {
      state.status.editPost = 'pending';
   },
   [POST_EDIT_FULFILLED]: (state, action: EditPostFulfilledAction) => {
      const { id, title, content } = action.payload;
      const existingPost = state.entities[id];
      existingPost.title = title;
      existingPost.content = content;
      state.status.editPost = 'succeed';
      state.error.editPost = null;
   },
   [POST_EDIT_REJECTED]: (state, action: EditPostRejectedAction) => {
      const error = action.error;
      state.status.editPost = 'failed';

      let errorMessage = getErrorMessage(error, 'Failed to Edit post');
      state.error.editPost = errorMessage;
   },
   [POST_DELETE_IDLE]: (state, action: DeletePostIdleAction) => {
      state.status.deletePost = 'idle';
   },
   [POST_DELETE_PENDING]: (state, action: DeletePostPendingAction) => {
      state.status.deletePost = 'pending';
   },
   [POST_DELETE_FULFILLED]: (state, action: DeletePostFulfilledAction) => {
      const postId = action.payload;
      delete state.entities[postId];
      state.ids = state.ids.filter(id => id !== postId);
      state.status.deletePost = 'succeed';
      state.error.deletePost = null;
   },
   [POST_DELETE_REJECTED]: (state, action: DeletePostRejectedAction) => {
      const error = action.error;
      state.status.deletePost = 'failed';

      let errorMessage = getErrorMessage(error, 'Failed to Delete post');
      state.error.deletePost = errorMessage;
   },
   [REACTION_ADDED]: (state, action: AddPostReactionAction) => {
      const { postId, reactionName } = action.payload;
      const post = state.entities[postId];
      if (post) {
         post.reactions[reactionName] += 1;
      }
   },
   [REACTION_REMOVED]: (state, action: RemovePostReactionAction) => {
      const { postId, reactionName } = action.payload;
      const post = state.entities[postId];
      if (post) {
         post.reactions[reactionName] -= 1;
      }
   },
});


export const fetchPostsPending = (): FetchPostsPendingAction => ({
   type: POSTS_FETCH_PENDING,
})

export const fetchPostPending = (postId: string): FetchPostPendingAction => ({
   type: POST_FETCH_PENDING,
   payload: postId,
});

export const fetchPostReset = (postId: string): FetchPostResetAction => ({
   type: POST_FETCH_RESET,
   payload: postId,
});

export const addPostPending = (post: Post): AddPostPendingAction => ({
   type: POST_ADD_PENDING,
   payload: post,
});

export const addPostReset = (): AddPostIdleAction => ({
   type: POST_ADD_IDLE,
});

export const editPostPending = (post: Post): EditPostPendingAction => ({
   type: POST_EDIT_PENDING,
   payload: post,
});

export const editPostReset = (): EditPostIdleAction => ({
   type: POST_EDIT_IDLE,
});

export const deletePostPending = (postId: string): DeletePostPendingAction => ({
   type: POST_DELETE_PENDING,
   payload: postId,
});

export const deletePostReset = (): DeletePostIdleAction => ({
   type: POST_DELETE_IDLE,
});


export const addPostReactionPending = (postPatch: {postId: string, reactionName: string}): AddPostReactionPendingAction => ({
   type: ADD_REACTION_PENDING,
   payload: postPatch,
})

export const removePostReactionPending = (postPatch: {postId: string, reactionName: string}): RemovePostReactionPendingAction => ({
   type: REMOVE_REACTION_PENDING,
   payload: postPatch,
})




// Selectors
export const selectPostsEntities = (state: RootState) => state.posts.entities;
export const selectPostsIds = (state: RootState) => state.posts.ids;
export const selectAllPosts = createSelector(
   (state: RootState) => state.posts.entities,
   (postsEntities) => Object.values(postsEntities ?? {})
)

export const selectPostById = createSelector(  // args: state, postId
   selectPostsEntities,
   (state: RootState, postId: string) => postId,
   (postsEntities, postId) => {
      const post = postsEntities[postId];
      if (!post) {
         return undefined;
      }
      return post;
   }
);

export const selectUserPosts = createSelector(  // args: state, userId
   selectAllPosts,
   (state: RootState, userId: string) => userId,
   (posts, userId) => {
      return posts.filter(post => post?.userId === userId)
   }
);

export const selectUserPostsIds = createSelector(  // args: state, userId
   selectAllPosts,
   (state: RootState, userId: string) => userId,
   (posts, userId) => posts
      .filter(post => post?.userId === userId)
      .map(post => post.id)
)




export const selectPostsStatus = (state: RootState) => state.posts.status;
export const selectPostsError = (state: RootState) => state.posts.error;




export default postsReducer;