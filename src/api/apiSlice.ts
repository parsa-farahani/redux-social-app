import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { PostReactions, type Post } from "../features/posts/postsSlice";
import { type User } from "../features/users/usersSlice";
import { type Comment } from "../features/comments/commentsSlice";
import { addUserReactionServer } from "../services/usersServices";


const apiSlice = createApi({
   reducerPath: 'api',
   baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:9393'}),
   tagTypes: ['USER', 'POST', 'COMMENT'],
   endpoints: (builder) => ({
      
      getUsers: builder.query<User[], void>({
         query: () => '/users',
         providesTags: (result = [], error, arg) => [
            { type: 'USER', id: 'LIST' },
            ...result.map(({id}) => ({ type: 'USER' as const, id })),
         ]
      }),
      getUser: builder.query<User, string>({
         query: (userId) => `/users/${userId}`,
         providesTags: (result, error, arg) => [
            { type: 'USER', id: arg },
         ]
      }),
      updateUserReaction: builder.mutation<void, Pick<User, 'id' | 'reactions'>>({
         query: (userPatch) => ({
            url: `/users/${userPatch.id}`,
            method: 'PATCH',
            body: userPatch,
         }),
         async onQueryStarted( { id: userId, reactions }, lifecycleApi ) {

            // + users-list update
            const getUsersPatchResult = lifecycleApi.dispatch(
               
               apiSlice.util.updateQueryData('getUsers', undefined, (draft) => {

                  const existingUser = draft.find(user => user.id === userId);
                  if (existingUser) {
                     existingUser.reactions = { ...reactions };
                  }
               })
            )

            // + single-user update
            const getUserPatchResult = lifecycleApi.dispatch(
               
               apiSlice.util.updateQueryData('getUser', userId, (draft) => {

                  if (draft) {
                     draft.reactions = { ...reactions };
                  }
               })
            )

            try {
               await lifecycleApi.queryFulfilled;
            } catch (error) {
               getUsersPatchResult.undo();
               getUserPatchResult.undo();
            }
         },
         invalidatesTags: (result, error, arg) =>  [
            { type: 'USER', id: arg.id },
         ],
      }),
      getComments: builder.query<Comment[], void>({
         query: () => '/comments',
         providesTags: (result = [], error, arg) => [
            { type: 'COMMENT', id: 'LIST' },
            ...result.map(({id}) => ({ type: 'COMMENT' as const, id })),
         ]
      }),
      getComment: builder.query<Comment, string>({
         query: (commentId) => `/comments/${commentId}`,
         providesTags: (result, error, arg) => [
            { type: 'COMMENT', id: arg },
         ]
      }),
      addComment: builder.mutation<Comment, Comment>({
         query: (comment) => ({
            url: `/comments`,
            method: 'POST',
            body: comment,
         }),
         invalidatesTags: [
            {type: 'COMMENT', id: 'LIST'},
         ]
      }),
   })
});


export const {
   useGetUsersQuery,
   useGetUserQuery,
   useGetCommentsQuery,
   useGetCommentQuery,
   useAddCommentMutation,
   useUpdateUserReactionMutation
} = apiSlice;

export default apiSlice;