import Grid from "@mui/material/Grid2";
import PostExcerpt from "../components/post/PostExcerpt";
import MainPageLayout from "../layouts/MainPageLayout";
import PostSkeleton from "../components/loading/skeleton/PostSkeleton";
import React from "react";
import { selectPostsIds, useGetPostsQuery } from "../features/posts/postsSlice";
import { useAppSelector } from "../app/hooks";
import ErrorMsg from "../components/common/error/ErrorMsg";
import { selectAuthUsername } from "../features/auth/authSlice";
import PostsBottomOffset from "../components/pages/Posts/PostsBottomOffset";
import { Fab } from "@mui/material";
import { IoMdRefresh } from "react-icons/io";
import classNames from "classnames";
import { useGetUserQuery } from "../api/apiSlice";
import { skipToken } from "@reduxjs/toolkit/query";

const MemoizedPostExcerpt = React.memo(PostExcerpt);


const Posts = () => {


   // redux
   const authUsername = useAppSelector(selectAuthUsername);  // stirng | null
   const {
      data: authUser,
   } = useGetUserQuery(authUsername ?? skipToken, {
      skip: !authUsername,
   });


   const postsIds = useAppSelector(selectPostsIds) ?? [];


   const {
      // data: posts,
      isLoading: isLoadingFetchPosts,  // 1st fetch
      isFetching: isFetchingFetchPosts,
      isSuccess: isSuccessFetchPosts,
      isError: isErrorFetchPosts,
      error: postsFetchError,
      refetch: refetchPosts,
   } = useGetPostsQuery();


   // const isAuth = Boolean(authUsername);

   
   let refetchingPostsGridClassName = classNames({
      deemed: !isLoadingFetchPosts && isFetchingFetchPosts,
   })

   let postsContent;
   if (isLoadingFetchPosts) {
      postsContent = ['1', '2', '3', '4'].map((e, i) => (
         <Grid key={e} size={{ xs: 12, md: 6 }} >
            <PostSkeleton />
         </Grid>
      ));
   } else if (isSuccessFetchPosts) {
      postsContent = postsIds.map((postId) => (
         <Grid key={postId} size={{ xs: 12, md: 6 }}>
            <MemoizedPostExcerpt
               postId={postId}
               type="posts"
               authUser={authUser}
               // authUsername={authUsername}
               // authUserReaction={ isAuth ? (authUserReactions[postId] ?? null) : null }
            />
         </Grid>
      ));
   } else if (isErrorFetchPosts) {
      postsContent = (
         <ErrorMsg text={postsFetchError.toString() ?? 'Unknown Error'} />
      )
   }


   return (
      <MainPageLayout title="All Posts">
         <Grid container spacing={2} className={refetchingPostsGridClassName}>
            {
               postsContent
            }
         </Grid>
         {
            (!isLoadingFetchPosts && isSuccessFetchPosts) ? (
               <Fab variant="extended" onClick={refetchPosts} disabled={isFetchingFetchPosts} sx={{ position: 'fixed', bottom: '3rem', left: '50%', transform: 'translateX(-50%)', bgcolor: 'secondary.light' }} >
                  <IoMdRefresh style={{ marginRight: '.5rem', fontSize: '1rem' }} />
                  Refresh Posts
               </Fab>
            ): null
         }
         <PostsBottomOffset />
      </MainPageLayout>
   );
};

export default Posts;
