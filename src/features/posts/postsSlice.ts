import { createAsyncThunk, createEntityAdapter, createSlice, type PayloadAction, type EntityState, isRejected, createSelector, current } from "@reduxjs/toolkit";
import { AppDispatch, type AppThunk, type RootState } from "../../app/store";
import { addPostServer, deletePostServer, getPostServer, getPostsServer, updatePostReactionServer, updatePostServer } from '../../services/postsServices'
import { type AppStartListening, startAppListening } from "../../app/listenerMiddleware";
import apiSlice, { useUpdateUserReactionMutation } from "../../api/apiSlice";


export interface PostReactions {
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

interface PostsState extends EntityState<Post, string> {}


const postsAdapter = createEntityAdapter<Post>({
   sortComparer: (a, b) => b.date.localeCompare(a.date),
});


const initialState: PostsState = postsAdapter.getInitialState();


export const apiSliceWithPosts = apiSlice.injectEndpoints({
   endpoints: (builder) => ({
      getPosts: builder.query<PostsState, void>({
         query: () => '/posts',
         transformResponse: (result: Post[], meta, arg) => {
            return postsAdapter.setAll(initialState, result);
         },
         providesTags: (result, error, arg) => (
            (result) ? (
               [
                  ...(Object.values(result?.ids).map((id) => ({ type: 'POST' as const, id }))),
                  { type: 'POST', id: 'LIST' },
               ]
            ) : (
               [
                  { type: 'POST', id: 'LIST' },
               ]
            )
         )
      }),
      getPost: builder.query<Post, string>({
         query: (postId) => `/posts/${postId}`,
         providesTags: (result, error, arg) => [
            { type: 'POST', id: arg },
         ]
      }),
      addPost: builder.mutation<Post, Post>({
         query: (post) => ({
            url: `/posts`,
            method: 'POST',
            body: post,
         }),
         invalidatesTags: [
            {type: 'POST', id: 'LIST'},
         ]
      }),
      editPost: builder.mutation<Post, Post>({
         query: (post) => ({
            url: `/posts/${post.id}`,
            method: 'PUT',
            body: post,
         }),
         invalidatesTags: (result, error, arg) => [
            { type: 'POST', id: arg.id },
         ]
      }),
      deletePost: builder.mutation<void, string>({
         query: (postId) => ({
            url: `/posts/${postId}`,
            method: 'DELETE',
         }),
         invalidatesTags: [
            {type: 'POST', id: 'LIST'},
         ]
      }),
      // + for this endpoint, we must send the 'updated reactions' object inside our 'postPatch' object (so we must write the reaction-update logic inside the call-site(component))
      updatePostReaction: builder.mutation<void, Pick<Post, 'id' | 'reactions'>>({
         query: (postPatch) => ({
            url: `/posts/${postPatch.id}`,
            method: 'PATCH',
            body: postPatch,
         }),
         async onQueryStarted( { id: postId, reactions }, lifecycleApi ) {

            // + posts-list update
            const getPostsPatchResult = lifecycleApi.dispatch(

               apiSliceWithPosts.util.updateQueryData('getPosts', undefined, (draft) => {

                  
                  const existingPost = Object.values(draft.entities).find(post => post.id === postId);
                  if (existingPost) {
                     existingPost.reactions = { ...reactions };
                  }
               })
            )

            // + single-post update
            const getPostPatchResult = lifecycleApi.dispatch(

               apiSliceWithPosts.util.updateQueryData('getPost', postId, (draft) => {

                  if (draft) {
                     draft.reactions = { ...reactions };
                  }
               })
            )

            try {
               await lifecycleApi.queryFulfilled;
            } catch {
               getPostsPatchResult.undo();
               getPostPatchResult.undo();
            }
         },
      }),
   })
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
//    }
// });


// Thunks


// Listeners


// Selectors
const selectPostsResult = apiSliceWithPosts.endpoints.getPosts.select();  // selects 'response data'
                
const selectPostsData = createSelector(
   selectPostsResult,   // response data
   (postsResult) => postsResult.data  // cached-data (entities)
);

export const {
   selectAll: selectAllPosts,
   selectById: selectPostById,
   selectIds: selectPostsIds,
   selectEntities: selectPostsEntities,
   selectTotal: selectPostsTotal,
} = postsAdapter.getSelectors((state: RootState) => selectPostsData(state) ?? initialState);


export const selectUserPostsIds = createSelector(  // args: state, userId
   selectAllPosts,
   (_, userId: string) => userId,
   (allPosts: Post[], userId: string) => allPosts.filter(post => post.userId === userId).map(post => post.id)
);



// Actions

// RTK-Q Hooks
export const {
   useGetPostsQuery,
   useGetPostQuery,
   useAddPostMutation,
   useEditPostMutation,
   useDeletePostMutation,
   useUpdatePostReactionMutation,
} = apiSliceWithPosts;


// export default postsSlice;