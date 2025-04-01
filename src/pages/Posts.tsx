import { Box, CssBaseline, Divider, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import PostExcerpt from "../components/post/PostExcerpt";
import MainPageLayout from "../layouts/MainPageLayout";
import Spinner from "../components/loading/spinner/Spinner";
import PostSkeleton from "../components/loading/skeleton/PostSkeleton";
import React, { useEffect } from "react";
import { fetchPosts, selectAllPosts, selectPostsError, selectPostsIds, selectPostsStatus } from "../features/posts/postsSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import ErrorMsg from "../components/common/error/ErrorMsg";
import { selectAuthUsername } from "../features/auth/authSlice";
import { selectUserById, selectUserReactions } from "../features/users/usersSlice";
import { HeaderOffset } from "../components/header/Header.styles";


const MemoizedPostExcerpt = React.memo(PostExcerpt);


const Posts = () => {

   // redux
   const dispatch = useAppDispatch();
   const authUsername = useAppSelector(selectAuthUsername);
   // const authUser = useAppSelector(state => selectUserById(state, authUsername!));
   
   const authUserReactions = useAppSelector(state => selectUserReactions(state, authUsername!));


   const postsIds = useAppSelector(selectPostsIds) ?? [];
   const { fetchPosts: postsFetchStatus } = useAppSelector(selectPostsStatus);
   const { fetchPosts: postsFetchError } = useAppSelector(selectPostsError);


   const isAuth = Boolean(authUsername);


   useEffect(() => {
      if (postsFetchStatus !== 'idle') return;
      let ignore = false;

      if (!ignore) {
         dispatch(
            fetchPosts()
         )
      }

      return () => {
         ignore = true;
      }
   }, [dispatch, postsFetchStatus]);
   

   let postsContent;
   if (postsFetchStatus === 'pending') {
      postsContent = ['1', '2', '3', '4'].map((e, i) => (
         <Grid key={e} size={{ xs: 12, md: 6 }} >
            <PostSkeleton />
         </Grid>
      ));
   } else if (postsFetchStatus === 'succeed') {
      postsContent = postsIds.map((postId) => (
         <Grid key={postId} size={{ xs: 12, md: 6 }}>
            <MemoizedPostExcerpt
               postId={postId}
               type="posts"
               authUsername={authUsername}
               // authUser={authUser}
               authUserReaction={ isAuth ? (authUserReactions[postId] ?? null) : null }
            />
         </Grid>
      ));
   } else if (postsFetchStatus === 'failed') {
      postsContent = (
         <ErrorMsg text={postsFetchError ?? 'Unknown Error'} />
      )
   }


   return (
      <MainPageLayout title="All Posts">
         <Grid container spacing={2}>
            {
               postsContent
            }
         </Grid>
         <HeaderOffset />
         <HeaderOffset />
      </MainPageLayout>
   );
};

export default Posts;
