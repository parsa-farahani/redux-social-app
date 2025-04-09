import Grid from "@mui/material/Grid2";
import PostExcerpt from "../components/post/PostExcerpt";
import MainPageLayout from "../layouts/MainPageLayout";
import PostSkeleton from "../components/loading/skeleton/PostSkeleton";
import React, { useEffect } from "react";
import { fetchPostsPending, selectPostsError, selectPostsIds, selectPostsStatus } from "../features/posts/postsSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import ErrorMsg from "../components/common/error/ErrorMsg";
import { selectAuthUsername } from "../features/auth/authSlice";
import { selectUserReactions } from "../features/users/usersSlice";
import PostsBottomOffset from "../components/pages/Posts/PostsBottomOffset";
import { toast } from "react-toastify";
import { getErrorMessage } from "../utils/errorUtils/errorUtils";
import { Box, Button, Fab, Stack } from "@mui/material";
import { IoMdRefresh } from "react-icons/io";


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


   const isPendingFetchPosts = postsFetchStatus === 'pending';
   const isSuccessFetchPosts = postsFetchStatus === 'succeed';
   const isErrorFetchPosts = postsFetchStatus === 'failed';

   const isAuth = Boolean(authUsername);

   
   useEffect(() => {
      if (postsFetchStatus !== 'idle') return;
      let ignore = false;

      if (!ignore) {
         dispatch(
            fetchPostsPending()
         )
      }

      return () => {
         ignore = true;
      }
   }, [dispatch, postsFetchStatus]);
   
   const refetchPosts = () => {
      if (isPendingFetchPosts) return;
      dispatch(
         fetchPostsPending()
      )
   }

   let postsContent;
   if (isPendingFetchPosts) {
      postsContent = (
         <Grid container spacing={2}>
            {
               ['1', '2', '3', '4'].map((e, i) => (
                  <Grid key={e} size={{ xs: 12, md: 6 }} >
                     <PostSkeleton />
                  </Grid>
               ))
            }
         </Grid>
      );
   } else if (isSuccessFetchPosts) {
      postsContent = (
         <Grid container spacing={2}>
            {
               postsIds.map((postId) => (
                  <Grid key={postId} size={{ xs: 12, md: 6 }}>
                     <MemoizedPostExcerpt
                        postId={postId}
                        type="posts"
                        authUsername={authUsername}
                        authUserReaction={ isAuth ? (authUserReactions[postId] ?? null) : null }
                     />
                  </Grid>
               ))
            }
         </Grid>
      );
   } else if (isErrorFetchPosts) {
      postsContent = (
         <Stack direction="column" spacing={1} >
            <Box >
               <ErrorMsg text={getErrorMessage(postsFetchError, 'Unknown Error')} />
            </Box>
            <Button
               variant="contained"
               onClick={refetchPosts}
               sx={{ width: 'fit-content', bgcolor: 'secondary.dark', borderRadius: '100vw' }}
            >
               Try Again
            </Button>
         </Stack>
      )
   }


   return (
      <MainPageLayout title="All Posts">
         {
            postsContent
         }
         {
            (postsIds?.length > 0) ? (
               <Fab variant="extended" onClick={refetchPosts} disabled={isPendingFetchPosts} sx={{ position: 'fixed', bottom: '3rem', left: '50%', transform: 'translateX(-50%)', bgcolor: 'secondary.light' }} >
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
