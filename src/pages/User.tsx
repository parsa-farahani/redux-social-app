import { useParams } from "react-router-dom";
import MainPageLayout from "../layouts/MainPageLayout";
import Grid from "@mui/material/Grid2";
import PostExcerpt from "../components/post/PostExcerpt";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
   fetchPostsPending,
   selectPostsError,
   selectPostsStatus,
   selectUserPostsIds,
} from "../features/posts/postsSlice";
import React, { useEffect } from "react";
import {
   fetchUser,
   fetchUserReset,
   selectUserById,
   selectUserReactions,
   selectUsersError,
   selectUsersStatus,
} from "../features/users/usersSlice";
import { selectAuthUsername } from "../features/auth/authSlice";
import PostSkeleton from "../components/loading/skeleton/PostSkeleton";
import ErrorMsg from "../components/common/error/ErrorMsg";
import { Divider } from "@mui/material";
import UserInfoSkeleton from "../components/pages/User/UserInfoSkeleton";
import UserInfo from "../components/pages/User/UserInfo";
import { getErrorMessage } from "../utils/errorUtils/errorUtils";

const MemoizedPostExcerpt = React.memo(PostExcerpt);


const User = () => {

   // rrd
   const { userId } = useParams();

   // redux
   const dispatch = useAppDispatch();
   const userPostsIds =
      useAppSelector((state) => selectUserPostsIds(state, userId!)) ?? [];
   // const userRactions = useAppSelector(state => selectUserReactions(state, userId!));
   const authUsername = useAppSelector(selectAuthUsername);
   const authUserReactions = useAppSelector((state) =>
      selectUserReactions(state, authUsername!),
   );
   
   const { fetchUser: fetchUserStatus } = useAppSelector(selectUsersStatus);
   const userFetchStatus = fetchUserStatus[userId!];
   
   const { fetchUser: fetchUserError } = useAppSelector(selectUsersError);
   const userFetchError = fetchUserError[userId!];
   
   const { fetchPosts: postsFetchStatus } = useAppSelector(selectPostsStatus);
   const { fetchPosts: postsFetchError } = useAppSelector(selectPostsError);

   const user = useAppSelector((state) => selectUserById(state, userId!));
   
   const isAuth = Boolean(authUsername);
   const userPostsTotal = userPostsIds?.length ?? 0;
   

   const isPendingFetchUser = userFetchStatus === 'pending';
   const isSuccessFetchUser = userFetchStatus === 'succeed';
   const isFailedFetchUser = userFetchStatus === 'failed';

   
   // For now i fetch all posts for the user, because i dont have a backend to request user-posts, but it should be fixed when we have a backend to handle it (it is a bug now)
   useEffect(() => {
      if (postsFetchStatus !== "idle") return;
      let ignore = false;

      if (!ignore) {
         dispatch(fetchPostsPending());
      }

      return () => {
         ignore = true;
      };
   }, [dispatch, postsFetchStatus]);


   // Fetching user-data
   useEffect(() => {
      if (userFetchStatus && userFetchStatus !== 'idle') return;
      let ignore = false;

      const fetchUserInEffect = async () => {
         dispatch(
            fetchUser(userId!)
         )
      };

      if (!ignore) {
         fetchUserInEffect();
      }

      return () => {
         ignore = true;
      };
   }, [dispatch, userFetchStatus, userId]);


   // I reset the 'state.user.sattus.fetchPost[userId]' to 'idle', for the next fetches (each time user comes in this page)
   useEffect(() => {

      return () => {
         dispatch(
            fetchUserReset(userId!)
         )
      }
   }, [dispatch, userId])


   // + User content
   let userContent;
   if (isPendingFetchUser) {
      userContent = (
         <UserInfoSkeleton />
      )
   } else if (isSuccessFetchUser) {
      userContent = (
         <UserInfo user={user!} userPostsTotal={userPostsTotal} />
      )
   } else if (isFailedFetchUser) {
      userContent = (
         <ErrorMsg text={getErrorMessage(postsFetchError) ?? "Failed to load the user."} />
      )
   } else {
      userContent = (
         <ErrorMsg text="404 - Not Found the user" />
      )
   }


   // + User-Posts content
   let postsContent;
   if (postsFetchStatus === "pending") {
      postsContent = ["1", "2", "3", "4"].map((e, i) => (
         <Grid key={e} size={{ xs: 12, md: 6 }}>
            <PostSkeleton />
         </Grid>
      ));
   } else if (postsFetchStatus === "succeed") {
      postsContent = userPostsIds.map((postId) => (
         <Grid key={postId} size={{ xs: 12, md: 6 }}>
            <MemoizedPostExcerpt
               key={postId}
               type="user"
               postId={postId}
               authUsername={authUsername}
               authUserReaction={
                  isAuth ? (authUserReactions[postId] ?? null) : null
               }
            />
         </Grid>
      ));
   } else if (postsFetchStatus === "failed") {
      postsContent = <ErrorMsg text={postsFetchError ?? "Unknown Error"} />;
   }

   return (
      <MainPageLayout title="My Posts">
         {
            userContent
         }
         <Divider/>
         <Grid container spacing={2}>
            {postsContent}
         </Grid>
      </MainPageLayout>
   );
};

export default User;
